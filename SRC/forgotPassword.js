document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("sendCode");
    const submitButton = document.getElementById("submitButton");
    let generatedCode = "";

    //send the code to email
    sendButton.addEventListener("click", () => {
        const emailInput = document.getElementById("email").value.trim();

        if (!emailInput) {
            alert("Please enter your email address.");
            return;
        }

        //generate a 6-digit random number
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

        //send template parameters to EmailJS
        const templateParams = {
            to_email: emailInput, otp: generatedCode
        };

        emailjs.send("service_p7hof9s", "template_v3wiu4e", templateParams)
            .then(() => {
                alert("A 6-digit verification code has been sent to your email.");
            })
            .catch((error) => {
                alert("Failed to send email. Error: " + JSON.stringify(error));
            });
    });

    //validates the code that was sent matches
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        const userInputCode = document.getElementById("code").value.trim();

        if (!generatedCode) {
            alert("Please provide 6 digit code!");
            return;
        }

        if (userInputCode === generatedCode) {
            alert("Code verified successfully!");
            window.location.href = "changePassword.html";
        } else {
            alert("Invalid code. Please try again.");
        }
    });
});