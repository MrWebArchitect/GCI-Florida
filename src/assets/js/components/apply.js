document.addEventListener("DOMContentLoaded", () => {
  const jobTitleEl = document.querySelector("#job-title");
  const jobTitleInput = document.querySelector("#job-title-input");
  const jobIdInput = document.querySelector("#job-id-input");

  const hasCdlSelect = document.querySelector("#has-cdl");
  const cdlClassSelect = document.querySelector("#cdl-class");

  // Only run on application page
  if (!jobTitleEl || !jobTitleInput || !jobIdInput) {
    return;
  }

  // Keep browser/page title generic
  document.title = "Apply in 60 Seconds | Goode Companies of Florida";

  // -----------------------------------------------
  // CDL behavior
  // -----------------------------------------------

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

  // -----------------------------------------------
  // Get specific job from URL
  // -----------------------------------------------

  const params = new URLSearchParams(window.location.search);

  const selectedJobId = params.get("job");

  // -----------------------------------------------
  // Load careers
  // -----------------------------------------------

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
      if (!Array.isArray(data.jobs)) {
        throw new Error("No jobs found in careers.json.");
      }

      populateJobOptions(data.jobs);

      // Specific job application
      if (selectedJobId) {
        const selectedJob = data.jobs.find((job) => job.id === selectedJobId);

        if (selectedJob) {
          selectJob(selectedJob);
          return;
        }

        console.warn("Job ID from URL was not found:", selectedJobId);
      }

      // General application
      renderGeneralApplication();
    })
    .catch((error) => {
      console.error("Unable to load positions:", error);

      renderGeneralApplication();
    });

  // -----------------------------------------------
  // User changes position
  // -----------------------------------------------

  jobTitleInput.addEventListener("change", () => {
    const selectedOption = jobTitleInput.options[jobTitleInput.selectedIndex];

    const selectedTitle = selectedOption.value;

    const selectedId = selectedOption.dataset.jobId || "";

    jobIdInput.value = selectedId;

    if (selectedTitle) {
      jobTitleEl.textContent = selectedTitle;
    }
  });

  // -----------------------------------------------
  // Populate dropdown
  // -----------------------------------------------

  function populateJobOptions(jobs) {
    jobs.forEach((job) => {
      const displayTitle = job.shortTitle || job.title;

      const option = document.createElement("option");

      option.value = displayTitle;
      option.textContent = displayTitle;
      option.dataset.jobId = job.id;

      jobTitleInput.appendChild(option);
    });
  }

  // -----------------------------------------------
  // Specific job
  // -----------------------------------------------

  function selectJob(job) {
    const displayTitle = job.shortTitle || job.title;

    jobTitleInput.value = displayTitle;

    jobIdInput.value = job.id;

    jobTitleEl.textContent = displayTitle;
  }

  // -----------------------------------------------
  // General application
  // -----------------------------------------------

  function renderGeneralApplication() {
    jobTitleInput.value = "";
    jobIdInput.value = "";

    jobTitleEl.textContent = "a position that interests you";
  }

  // -----------------------------------------------
  // CDL behavior
  // -----------------------------------------------

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
});
