document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.userType !== "recruiter") {
        window.location.href = "login.html";
        return;
    }

    const jobList = document.getElementById("jobList");

    window.postJob = function () {

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const pay = document.getElementById("pay").value.trim();

        if (!title || !description || !pay) {
            alert("Please fill all fields");
            return;
        }

        const job = {
            id: Date.now(),
            recruiterId: currentUser.id,
            title,
            description,
            payPerHour: pay
        };

        let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
        jobs.push(job);
        localStorage.setItem("jobs", JSON.stringify(jobs));

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("pay").value = "";

        displayJobs();
    };

    function displayJobs() {

        let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        let users = JSON.parse(localStorage.getItem("users")) || [];

        jobList.innerHTML = "";

        jobs.filter(j => j.recruiterId === currentUser.id)
            .forEach(job => {

                const jobApps = applications.filter(a => a.jobId === job.id);

                jobList.innerHTML += `
                    <div class="card">
                        <h3>${job.title}</h3>
                        <p>${job.description}</p>
                        <p><strong>Pay:</strong> ₹${job.payPerHour}/hr</p>
                        <p><strong>Total Applications:</strong> ${jobApps.length}</p>
                    </div>
                `;

                jobApps.forEach(app => {

                    const freelancer = users.find(u => u.id === app.freelancerId);

                    jobList.innerHTML += `
                        <div class="card sub-card">
                            <p><strong>${freelancer.username}</strong></p>
                            <p>Status: <span class="${app.status}">${app.status}</span></p>
                            ${
                                app.status === "applied"
                                ? `
                                <button onclick="updateStatus(${app.id}, 'accepted')">Accept</button>
                                <button onclick="updateStatus(${app.id}, 'rejected')">Reject</button>
                                `
                                : ""
                            }
                        </div>
                    `;
                });

        });
    }

    window.updateStatus = function (id, status) {

        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        const app = applications.find(a => a.id === id);

        if (app) {
            app.status = status;
        }

        localStorage.setItem("applications", JSON.stringify(applications));
        displayJobs();
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

    displayJobs();
});
