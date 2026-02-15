document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.userType !== "freelancer") {
        window.location.href = "login.html";
        return;
    }

    loadProfile();

    window.saveProfile = function () {

        const profile = {
            userId: currentUser.id,
            education: document.getElementById("education").value,
            experience: document.getElementById("experience").value,
            skills: document.getElementById("skills").value,
            techStack: document.getElementById("techStack").value
        };

        let profiles = JSON.parse(localStorage.getItem("profiles")) || [];

        const existingIndex = profiles.findIndex(p => p.userId === currentUser.id);

        if (existingIndex >= 0) {
            profiles[existingIndex] = profile;
        } else {
            profiles.push(profile);
        }

        localStorage.setItem("profiles", JSON.stringify(profiles));

        loadProfile();
    };

    function loadProfile() {

        let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
        const profile = profiles.find(p => p.userId === currentUser.id);

        if (!profile) return;

        document.getElementById("profileView").innerHTML = `
            <p><strong>Education:</strong> ${profile.education}</p>
            <p><strong>Experience:</strong> ${profile.experience}</p>
            <p><strong>Skills:</strong> ${profile.skills}</p>
            <p><strong>Tech Stack:</strong> ${profile.techStack}</p>
        `;
    }

    window.logout = function () {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    };

    window.toggleTheme = function () {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", document.body.classList.contains("dark"));
    };

    if (localStorage.getItem("theme") === "true") {
        document.body.classList.add("dark");
    }

});
