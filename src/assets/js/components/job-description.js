document.addEventListener("DOMContentLoaded", () => {
  const jobDescriptionEl = document.querySelector("#job-description");

  // Only run on the job description page
  if (!jobDescriptionEl) {
    return;
  }

  const selectedJobTitle = localStorage.getItem("selectedJobTitle");

  if (!selectedJobTitle) {
    console.error("No selected job title found in localStorage.");
    return;
  }

  fetch("./data/careers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to load careers.json: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    })
    .then((data) => {
      const selectedJob = data.jobs.find(
        (job) => job.title === selectedJobTitle,
      );

      if (!selectedJob) {
        console.error("No job found with title:", selectedJobTitle);
        return;
      }

      jobDescriptionEl.innerHTML = `
        <header class="pt-5 col-12 col-lg-7 col-xl-6 mx-auto">
          <h6 class="fw-bold">${selectedJob.title}</h6>

          <div class="d-flex justify-content-between">
            <div class="location">
              <i class="bi bi-geo-alt"></i>${selectedJob.location}
            </div>

            <div>
              <a
                href="apply.html"
                class="btn btn-danger float-right"
              >
                Apply Now
              </a>
            </div>
          </div>
        </header>

        <div class="col-12 col-lg-7 col-xl-6 mx-auto mb-5">
          <h6>Job Description</h6>
          <p>${selectedJob.description}</p>
        </div>

        <div class="col-12 col-lg-7 col-xl-6 mx-auto">
          <h6>Minimum Qualifications</h6>

          <ul>
            ${
              Array.isArray(selectedJob.qualifications)
                ? selectedJob.qualifications
                    .map((qualification) => `<li>${qualification}</li>`)
                    .join("")
                : ""
            }
          </ul>
        </div>

        <div class="col-12 col-lg-7 col-xl-6 mx-auto">
          <h6>Responsibilities</h6>

          <ul>
            ${
              Array.isArray(selectedJob.responsibilities)
                ? selectedJob.responsibilities
                    .map((responsibility) => `<li>${responsibility}</li>`)
                    .join("")
                : ""
            }
          </ul>
        </div>
      `;
    })
    .catch((error) => {
      console.error("Unable to load job description:", error);
    });
});
