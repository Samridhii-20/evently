document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.status === 201) {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html"; // Redirect to login page
    } else {
        alert("Registration failed: " + data.msg);
    }
});