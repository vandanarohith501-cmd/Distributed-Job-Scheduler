function registerUser() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = {
        id: Date.now(),
        userType: document.getElementById("userType").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");
    window.location.href = "login.html";
}

function loginUser() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid Credentials");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.userType === "recruiter") {
        window.location.href = "recruiter-dashboard.html";
    } else {
        window.location.href = "freelancer-dashboard.html";
    }
}
