document.getElementById("registerForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    var email = document.getElementById("register-email").value;
    var password = document.getElementById("register-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!passwordPattern.test(password)) {
        alert("Password must meet the required criteria!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    localStorage.setItem("firstName", firstName);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    alert("Account successfully created! Welcome, " + firstName + " " + lastName + ". You can now log in.");

    clearForm();

    setTimeout(function() {
        window.location.href = "index.html";
    }, 2000);
});

document.getElementById("loginForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var registeredEmail = localStorage.getItem("email");
    var registeredPassword = localStorage.getItem("password");

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    if (email !== registeredEmail || password !== registeredPassword) {
        alert("Invalid email or password. Please try again.");
        return;
    }

    alert("Logged in successfully!");

    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "dashboard.html";
});

document.getElementById("logout")?.addEventListener("click", function() {
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "index.html";
});

function clearForm() {
    document.getElementById("first-name").value = '';
    document.getElementById("last-name").value = '';
    document.getElementById("register-email").value = '';
    document.getElementById("register-password").value = '';
    document.getElementById("confirm-password").value = '';
}

if (window.location.pathname.includes("dashboard.html")) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "index.html";
    } else {
        document.getElementById("user-name").innerText = localStorage.getItem("firstName") || "User";
    }
}
