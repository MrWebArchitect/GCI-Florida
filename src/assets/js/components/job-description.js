document.addEventListener("DOMContentLoaded", () => {
  const jobDescriptionEl = document.querySelector("#job-description");

  // Only run on the job description page
  if (!jobDescriptionEl) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const selectedJobId = params.get("job");

  if (!selectedJobId) {
    console.error("No job ID found in URL.");
    renderJobNotFound();
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
        renderJobNotFound();
        return;
      }

      renderJob(selectedJob);
    })
    .catch((error) => {
      console.error("Unable to load job description:", error);
      renderJobError();
    });

  function renderList(items, iconClass = "bi-check-lg") {
    if (!Array.isArray(items) || items.length === 0) {
      return "";
    }

    return items
      .map(
        (item) => `
          <li class="job-detail-list-item">
            <span class="job-detail-list-icon" aria-hidden="true">
              <i class="bi ${iconClass}"></i>
            </span>

            <span>${item}</span>
          </li>
        `,
      )
      .join("");
  }

  function renderJob(job) {
    jobDescriptionEl.innerHTML = `
      <!-- Job Header -->
      <section class="job-detail-hero">
        <div class="container">

          <a
            href="careers.html"
            class="job-detail-back-link"
          >
            <i class="bi bi-arrow-left"></i>
            Back to Open Positions
          </a>

          <div class="row align-items-end g-4">

            <div class="col-lg-8">

              ${
                job.department
                  ? `
                    <div class="job-detail-eyebrow">
                      <span class="subtitle-xs">
                        ${job.department}
                      </span>
                    </div>
                  `
                  : ""
              }

              <h1 class="job-detail-title">
                ${job.title}
              </h1>

              <div class="job-detail-meta">

                ${
                  job.location
                    ? `
                      <div class="job-detail-meta-item">
                        <i
                          class="bi bi-geo-alt-fill"
                          aria-hidden="true"
                        ></i>

                        <span>${job.location}</span>
                      </div>
                    `
                    : ""
                }

                ${
                  job.employmentType
                    ? `
                      <div class="job-detail-meta-item">
                        <i
                          class="bi bi-briefcase-fill"
                          aria-hidden="true"
                        ></i>

                        <span>${job.employmentType}</span>
                      </div>
                    `
                    : ""
                }

                ${
                  job.department
                    ? `
                      <div class="job-detail-meta-item">
                        <i
                          class="bi bi-building"
                          aria-hidden="true"
                        ></i>

                        <span>${job.department}</span>
                      </div>
                    `
                    : ""
                }

              </div>

            </div>

            <div class="col-lg-4 d-none d-lg-flex justify-content-lg-end">

              <a
                href="apply.html?job=${encodeURIComponent(job.id)}"
                class="btn btn-danger job-detail-hero-apply"
              >
                Apply Now
                <i class="bi bi-arrow-right"></i>
              </a>

            </div>

          </div>

        </div>
      </section>


      <!-- Job Content -->
      <section class="job-detail-body">
        <div class="container">

          <div class="row g-4 g-xl-5">

            <!-- Main Content -->
            <div class="col-lg-8">

              <!-- Mobile Apply -->
              <div class="d-lg-none mb-4">

                <a
                  href="apply.html?job=${encodeURIComponent(job.id)}"
                  class="btn btn-danger w-100 job-detail-mobile-apply"
                >
                  Apply for ${job.shortTitle || job.title}
                  <i class="bi bi-arrow-right"></i>
                </a>

              </div>


              <!-- Overview -->
              <section class="job-detail-section">

                <div class="job-detail-section-heading">

                  <span class="job-detail-section-number">
                    01
                  </span>

                  <div>
                    <span class="subtitle-xs text-secondary">
                      The Opportunity
                    </span>

                    <h2>Job Overview</h2>
                  </div>

                </div>

                <p class="job-detail-description">
                  ${job.description || ""}
                </p>

              </section>


              <!-- Responsibilities -->
              ${
                Array.isArray(job.responsibilities) &&
                job.responsibilities.length > 0
                  ? `
                    <section class="job-detail-section">

                      <div class="job-detail-section-heading">

                        <span class="job-detail-section-number">
                          02
                        </span>

                        <div>
                          <span class="subtitle-xs text-secondary">
                            What You'll Do
                          </span>

                          <h2>Responsibilities</h2>
                        </div>

                      </div>

                      <ul class="job-detail-list">
                        ${renderList(job.responsibilities)}
                      </ul>

                    </section>
                  `
                  : ""
              }


              <!-- Qualifications -->
              ${
                Array.isArray(job.qualifications) &&
                job.qualifications.length > 0
                  ? `
                    <section class="job-detail-section">

                      <div class="job-detail-section-heading">

                        <span class="job-detail-section-number">
                          03
                        </span>

                        <div>
                          <span class="subtitle-xs text-secondary">
                            What You'll Bring
                          </span>

                          <h2>Qualifications</h2>
                        </div>

                      </div>

                      <ul class="job-detail-list">
                        ${renderList(job.qualifications)}
                      </ul>

                    </section>
                  `
                  : ""
              }


              <!-- Working Conditions -->
              ${
                Array.isArray(job.workingConditions) &&
                job.workingConditions.length > 0
                  ? `
                    <section class="job-detail-section">

                      <div class="job-detail-section-heading">

                        <span class="job-detail-section-number">
                          04
                        </span>

                        <div>
                          <span class="subtitle-xs text-secondary">
                            What to Expect
                          </span>

                          <h2>Working Conditions</h2>
                        </div>

                      </div>

                      <ul class="job-detail-list">
                        ${renderList(
                          job.workingConditions,
                          "bi-arrow-right-short",
                        )}
                      </ul>

                    </section>
                  `
                  : ""
              }


              <!-- Compensation & Benefits -->
              ${
                Array.isArray(job.compensationBenefits) &&
                job.compensationBenefits.length > 0
                  ? `
                    <section
                      class="job-detail-section job-detail-benefits"
                    >

                      <div class="job-detail-section-heading">

                        <span class="job-detail-section-number">
                          05
                        </span>

                        <div>
                          <span class="subtitle-xs text-secondary">
                            What We Offer
                          </span>

                          <h2>
                            Compensation & Benefits
                          </h2>
                        </div>

                      </div>

                      <ul class="job-detail-list">
                        ${renderList(
                          job.compensationBenefits,
                          "bi-check-circle-fill",
                        )}
                      </ul>

                    </section>
                  `
                  : ""
              }

            </div>


            <!-- Sidebar -->
            <div class="col-lg-4">

              <aside class="job-detail-sidebar">

                <div class="job-detail-apply-card">

                  <div class="job-detail-apply-icon">
                    <i
                      class="bi bi-people-fill"
                      aria-hidden="true"
                    ></i>
                  </div>

                  <span class="subtitle-xs text-secondary">
                    Join the Goode Team
                  </span>

                  <h2>
                    Ready to Get Started?
                  </h2>

                  <p>
                    Take the next step toward building your career
                    with Goode Companies of Florida.
                  </p>

                  <a
                    href="apply.html?job=${encodeURIComponent(job.id)}"
                    class="btn btn-danger w-100 job-detail-apply-button"
                  >
                    Apply Now
                    <i class="bi bi-arrow-right"></i>
                  </a>

                  <div class="job-detail-apply-meta">

                    ${
                      job.location
                        ? `
                          <div>
                            <i
                              class="bi bi-geo-alt-fill"
                              aria-hidden="true"
                            ></i>

                            <span>
                              <small>Location</small>
                              <strong>${job.location}</strong>
                            </span>
                          </div>
                        `
                        : ""
                    }

                    ${
                      job.employmentType
                        ? `
                          <div>
                            <i
                              class="bi bi-clock-fill"
                              aria-hidden="true"
                            ></i>

                            <span>
                              <small>Employment</small>
                              <strong>${job.employmentType}</strong>
                            </span>
                          </div>
                        `
                        : ""
                    }

                    ${
                      job.department
                        ? `
                          <div>
                            <i
                              class="bi bi-building-fill"
                              aria-hidden="true"
                            ></i>

                            <span>
                              <small>Department</small>
                              <strong>${job.department}</strong>
                            </span>
                          </div>
                        `
                        : ""
                    }

                    ${
                      job.reportsTo
                        ? `
                          <div>
                            <i
                              class="bi bi-person-badge-fill"
                              aria-hidden="true"
                            ></i>

                            <span>
                              <small>Reports To</small>
                              <strong>${job.reportsTo}</strong>
                            </span>
                          </div>
                        `
                        : ""
                    }

                  </div>

                </div>

              </aside>

            </div>

          </div>

        </div>
      </section>


      <!-- Bottom CTA -->
      <section class="job-detail-cta">

        <div class="container">

          <div class="row align-items-center g-4">

            <div class="col-lg-8">

              <span class="subtitle-xs">
                Goode Companies of Florida
              </span>

              <h2>
                Build Your Career With Us.
              </h2>

              <p>
                Join a team committed to people, safety, service,
                and the communities we serve.
              </p>

            </div>

            <div class="col-lg-4 text-lg-end">

              <a
                href="apply.html?job=${encodeURIComponent(job.id)}"
                class="btn btn-light job-detail-bottom-apply"
              >
                Apply for ${job.shortTitle || job.title}
                <i class="bi bi-arrow-right"></i>
              </a>

            </div>

          </div>

        </div>

      </section>
    `;
  }

  function renderJobNotFound() {
    jobDescriptionEl.innerHTML = `
      <section class="job-detail-state">

        <div class="container text-center">

          <i
            class="bi bi-briefcase"
            aria-hidden="true"
          ></i>

          <h1>Position Not Found</h1>

          <p>
            Please select one of our currently available positions.
          </p>

          <a
            href="careers.html"
            class="btn btn-primary"
          >
            View Open Positions
          </a>

        </div>

      </section>
    `;
  }

  function renderJobError() {
    jobDescriptionEl.innerHTML = `
      <section class="job-detail-state">

        <div class="container text-center">

          <i
            class="bi bi-exclamation-circle"
            aria-hidden="true"
          ></i>

          <h1>Unable to Load Position</h1>

          <p>
            We couldn't load this position. Please return to
            our Careers page and try again.
          </p>

          <a
            href="careers.html"
            class="btn btn-primary"
          >
            Return to Careers
          </a>

        </div>

      </section>
    `;
  }
});
