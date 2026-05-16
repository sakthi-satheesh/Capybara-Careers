document.getElementById("sendReset").addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const message = document.getElementById("message");

    if (!email) {
        message.textContent = "Please enter your email.";
        message.style.color = "red";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await res.text();

        message.textContent = data;
        message.style.color = "green";

    } catch (err) {
        console.error(err);
        message.textContent = "Error sending reset email.";
        message.style.color = "red";
    }
});
