document.addEventListener("DOMContentLoaded", () => {
  const jobTitleEl = document.querySelector("#job-title");
  const jobTitleInput = document.querySelector("#job-title-input");
  const jobIdInput = document.querySelector("#job-id-input");
  const applicationForm = document.querySelector(".application-card form");
  const hasCdlSelect = document.querySelector("#has-cdl");
  const cdlClassSelect = document.querySelector("#cdl-class");

  // Only run on the application page
  if (!jobTitleEl || !jobTitleInput || !jobIdInput) {
    return;
  }

  // CDL behavior
  if (hasCdlSelect && cdlClassSelect) {
    hasCdlSelect.addEventListener("change", handleCdlChange);

    cdlClassSelect.addEventListener("mousedown", (event) => {
      if (cdlClassSelect.classList.contains("is-locked")) {
        event.preventDefault();
      }
    });

    cdlClassSelect.addEventListener("keydown", (event) => {
      if (cdlClassSelect.classList.contains("is-locked")) {
        event.preventDefault();
      }
    });
  }

  const selectedJobId = localStorage.getItem("selectedJobId");

  if (!selectedJobId) {
    console.error("No selected job ID found in localStorage.");
    renderMissingJob();
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
      const selectedJob = data.jobs.find((job) => job.id === selectedJobId);

      if (!selectedJob) {
        console.error("No job found with ID:", selectedJobId);
        renderMissingJob();
        return;
      }

      populateApplication(selectedJob);
    })
    .catch((error) => {
      console.error("Unable to load selected job:", error);
      renderMissingJob();
    });

  function handleCdlChange() {
    const hasCdl = hasCdlSelect.value === "Yes";

    if (!hasCdl) {
      cdlClassSelect.value = "N/A";
      cdlClassSelect.setAttribute("aria-disabled", "true");
      cdlClassSelect.classList.add("is-locked");

      return;
    }

    if (cdlClassSelect.value === "N/A") {
      cdlClassSelect.value = "";
    }

    cdlClassSelect.removeAttribute("aria-disabled");
    cdlClassSelect.classList.remove("is-locked");
  }

  function populateApplication(job) {
    const displayTitle = job.shortTitle || job.title;

    jobTitleEl.textContent = displayTitle;
    jobTitleInput.value = displayTitle;
    jobIdInput.value = job.id;

    document.title = `${displayTitle} Application | Goode Companies of Florida`;
  }

  function renderMissingJob() {
    jobTitleEl.textContent = "Position Not Selected";
    jobTitleInput.value = "";
    jobIdInput.value = "";

    if (!applicationForm) {
      return;
    }

    applicationForm.innerHTML = `
      <div class="application-missing-job text-center">

        <i
          class="bi bi-briefcase"
          aria-hidden="true"
        ></i>

        <h2>Select a Position First</h2>

        <p>
          Choose one of our open positions before
          starting your application.
        </p>

        <a
          href="careers.html"
          class="btn btn-primary"
        >
          View Open Positions
        </a>

      </div>
    `;
  }
});
