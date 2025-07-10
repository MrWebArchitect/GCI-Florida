
      document.addEventListener("DOMContentLoaded", () => {
        const selectedJobTitle = localStorage.getItem("selectedJobTitle");
        if (selectedJobTitle) {
          fetch("src/data/careers.json")
            .then((response) => response.json())
            .then((data) => {
              const selectedJob = data.jobs.find((job) => job.title === selectedJobTitle);
              if (selectedJob) {
                const jobDescriptionEl = document.querySelector("#job-description");
                jobDescriptionEl.innerHTML = `
                <header class="pt-5 col-12 col-lg-7 col-xl-6 mx-auto">
                  <h6 class="fw-bold">${selectedJob.title}</h6>
                  <div class="d-flex justify-content-between">
                    <div class="location"><i class="bi bi-geo-alt"></i>${selectedJob.location}</div>
                    <div>
                    <a href="apply.html" class="btn btn-danger float-right">Apply Now</a>
                    </div>
                  <div>
                  </header>
                  <div class="col-12 col-lg-7 col-xl-6 mx-auto mb-5">
                  <h6>Job Description</h6>
                  <p>${selectedJob.description}</p>
                  </div>

                  <div class="col-12 col-lg-7 col-xl-6 mx-auto">
                  <h6>Minimum Qualifications</h6>
                  <ul>
                    ${selectedJob.qualifications.map((qualification) => `<li>${qualification}</li>`).join("")}
                  </ul>
                  </div>
                  
                  <div class="col-12 col-lg-7 col-xl-6 mx-auto">
                  <h6>Responsibilities</h6>
                  <ul>
                    ${Array.isArray(selectedJob.responsibilities) ? selectedJob.responsibilities.map((responsibility) => `<li>${responsibility}</li>`).join("") : ""}
                  </ul>
                  </div>
                  
                  
                  
                  
                `;
              } else {
                console.error("No job found with title:",selectedJob);
              }
            })
            .catch((error) => console.log(error));
        } else {
          console.error("No selected job title found in localStorage.");
        }
      });