require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// MYSQL CONNECTION
// ================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {

    if (err) {
        console.log("Database connection failed:");
        console.log(err);
        return;
    }

    console.log("Connected to MySQL database");
});

// ================================
// NODEMAILER
// ================================
const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ================================
// SIGN IN
// ================================
app.post("/signin", (req, res) => {

    const { email, password } = req.body;

    db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email],

        async (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password_hash
                );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            res.json({
                message: "Login successful"
            });
        }
    );
});

// ================================
// FORGOT PASSWORD
// ================================
app.post("/forgot-password", (req, res) => {

    const { email } = req.body;

    db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email],

        async (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            // don't reveal whether account exists
            if (results.length === 0) {

                return res.json({
                    message:
                        "If an account exists, a reset email was sent."
                });
            }

            const user = results[0];

            // generate secure token
            const resetToken =
                crypto.randomBytes(32).toString("hex");

            // expire in 1 hour
            const expiresAt =
                new Date(Date.now() + 3600000);

            // store token
            db.query(
                `INSERT INTO password_resets
                (user_id, reset_token, expires_at, used)
                VALUES (?, ?, ?, FALSE)`,

                [
                    user.id,
                    resetToken,
                    expiresAt
                ],

                async (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message:
                                "Failed to create reset token"
                        });
                    }

                    // reset link
                    const resetLink =
                        `http://localhost:${PORT}/reset-password?token=${resetToken}`;

                    // email options
                    const mailOptions = {
                        from: process.env.EMAIL_USER,

                        to: email,

                        subject: "Password Reset",

                        html: `
                            <h2>Password Reset</h2>

                            <p>
                                Click the link below
                                to reset your password:
                            </p>

                            <a href="${resetLink}">
                                Reset Password
                            </a>

                            <p>
                                This link expires in 1 hour.
                            </p>
                        `
                    };

                    try {

                        await transporter.sendMail(mailOptions);

                        res.json({
                            message:
                                "Password reset email sent"
                        });
                    }
                    catch (error) {

                        console.log(error);

                        res.status(500).json({
                            message:
                                "Failed to send email"
                        });
                    }
                }
            );
        }
    );
});

// ================================
// RESET PASSWORD PAGE
// ================================
app.get("/reset-password", (req, res) => {

    const token = req.query.token;

    res.send(`
        <!DOCTYPE html>
        <html>

        <head>
            <title>Reset Password</title>
        </head>

        <body>

            <h2>Reset Password</h2>

            <form action="/reset-password" method="POST">

                <input
                    type="hidden"
                    name="token"
                    value="${token}"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    required
                />

                <button type="submit">
                    Reset Password
                </button>

            </form>

        </body>
        </html>
    `);
});

// ================================
// UPDATE PASSWORD
// ================================
app.post("/reset-password", async (req, res) => {

    const { token, password } = req.body;

    db.query(
        `SELECT * FROM password_resets
         WHERE reset_token = ?
         AND used = FALSE
         AND expires_at > NOW()`,

        [token],

        async (err, results) => {

            if (err) {
                console.log(err);

                return res.send(
                    "Database error"
                );
            }

            if (results.length === 0) {
                return res.send(
                    "Invalid or expired token"
                );
            }

            const reset = results[0];

            const hashedPassword =
                await bcrypt.hash(password, 10);

            db.query(
                `UPDATE users
                 SET password_hash = ?
                 WHERE id = ?`,

                [
                    hashedPassword,
                    reset.user_id
                ],

                (err) => {

                    if (err) {
                        console.log(err);

                        return res.send(
                            "Password update failed"
                        );
                    }

                    // invalidate token
                    db.query(
                        `UPDATE password_resets
                         SET used = TRUE
                         WHERE id = ?`,

                        [reset.id]
                    );

                    res.send(
                        "Password updated successfully"
                    );
                }
            );
        }
    );
});

// ================================
// SERVER START
// ================================
const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});