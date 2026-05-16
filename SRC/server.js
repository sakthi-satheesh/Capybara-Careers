require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ===============================
// MYSQL CONNECTION
// ===============================
const db = mysql.createConnection({
    host: "capybara-group",
    user: "capybara",
    password: "capybara1",
    database: "capybara_forgot"
});

db.connect(err => {
    if (err) {
        console.error("DB connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// ===============================
// NODEMAILER SETUP (GMAIL EXAMPLE)
// ===============================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ===============================
// SIGN IN ROUTE
// ===============================
app.post("/signin", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {

            if (err) return res.status(500).json({ message: "Database error" });

            if (results.length === 0) {
                return res.status(401).json({ message: "User not found" });
            }

            const user = results[0];

            const match = await bcrypt.compare(password, user.password_hash);

            if (!match) {
                return res.status(401).json({ message: "Incorrect password" });
            }

            res.json({ message: "Login successful" });
        }
    );
});

// ===============================
// FORGOT PASSWORD ROUTE
// ===============================
app.post("/forgot-password", (req, res) => {

    const { email } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {

            if (err) return res.status(500).send("Database error");

            if (results.length === 0) {
                return res.status(404).send("Email not found");
            }

            const user = results[0];

            // generate secure token
            const token = crypto.randomBytes(32).toString("hex");

            const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

            // store reset token
            db.query(
                `INSERT INTO password_resets (user_id, reset_token, expires_at, used)
                 VALUES (?, ?, ?, FALSE)`,
                [user.id, token, expires],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).send("Token save failed");
                    }

                    const resetLink =
                        `http://localhost:3000/reset-password.html?token=${token}`;

                    transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "Password Reset Request",
                        text: `Click to reset your password: ${resetLink}`
                    });

                    res.send("Password reset email sent");
                }
            );
        }
    );
});

// ===============================
// RESET PASSWORD ROUTE
// ===============================
app.post("/reset-password", async (req, res) => {

    const { token, password } = req.body;

    db.query(
        `SELECT * FROM password_resets
         WHERE reset_token = ?
         AND used = FALSE
         AND expires_at > NOW()`,
        [token],
        async (err, results) => {

            if (err) return res.status(500).send("Database error");

            if (results.length === 0) {
                return res.status(400).send("Invalid or expired token");
            }

            const reset = results[0];

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "UPDATE users SET password_hash = ? WHERE id = ?",
                [hashedPassword, reset.user_id],
                (err) => {

                    if (err) {
                        return res.status(500).send("Password update failed");
                    }

                    db.query(
                        "UPDATE password_resets SET used = TRUE WHERE id = ?",
                        [reset.id]
                    );

                    res.send("Password updated successfully");
                }
            );
        }
    );
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
