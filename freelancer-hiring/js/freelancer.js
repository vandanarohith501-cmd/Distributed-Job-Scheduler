document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.userType !== "freelancer") {
        window.location.href = "login.html";
        return;
    }

    function loadJobs() {

        let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
        let applications = JSON.parse(localStorage.getItem("applications")) || [];

        const searchValue = document.getElementById("searchInput").value.toLowerCase();
        const myApps = applications.filter(a => a.freelancerId === currentUser.id);

        document.getElementById("appliedCount").innerText = myApps.length;

        const jobsContainer = document.getElementById("jobsContainer");
        const myApplications = document.getElementById("myApplications");

        jobsContainer.innerHTML = "";
        myApplications.innerHTML = "";

        jobs.filter(job =>
            job.title.toLowerCase().includes(searchValue) ||
            job.description.toLowerCase().includes(searchValue)
        ).forEach(job => {

            const alreadyApplied = myApps.some(a => a.jobId === job.id);

            jobsContainer.innerHTML += `
                <div class="card">
                    <h3>${job.title}</h3>
                    <p>${job.description}</p>
                    <p><strong>Pay:</strong> ₹${job.payPerHour}/hr</p>
                    ${
                        alreadyApplied
                        ? "<strong>Already Applied</strong>"
                        : `<button onclick="apply(${job.id})">Apply</button>`
                    }
                </div>
            `;
        });

        myApps.forEach(app => {

            const job = jobs.find(j => j.id === app.jobId);

            myApplications.innerHTML += `
                <div class="card">
                    <h3>${job.title}</h3>
                    <p>Status: <span class="${app.status}">${app.status}</span></p>
                </div>
            `;
        });
    }

    window.apply = function (jobId) {

        let applications = JSON.parse(localStorage.getItem("applications")) || [];

        applications.push({
            id: Date.now(),
            jobId,
            freelancerId: currentUser.id,
            status: "applied"
        });

        localStorage.setItem("applications", JSON.stringify(applications));
        loadJobs();
    };

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

    document.getElementById("searchInput")
        .addEventListener("input", loadJobs);

    loadJobs();
});
