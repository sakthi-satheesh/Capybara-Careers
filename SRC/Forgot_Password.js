document.getElementById("sendReset").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const status = document.getElementById("statusMessage");

    if (!email) {
        status.textContent = "Please enter your email.";
        status.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const message = await response.text();

        status.textContent = message;
        status.style.color = "green";

    } catch (error) {
        console.error(error);
        status.textContent = "Error sending reset link.";
        status.style.color = "red";
    }
});