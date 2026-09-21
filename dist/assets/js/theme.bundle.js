/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/js/components/aos.js":
/*!*****************************************!*\
  !*** ./src/assets/js/components/aos.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");


(function(){
    const options = {
        duration: 700,
        easing: 'ease-out-quad',
        once: true,
        startEvent: 'load',
        disable: 'mobile'
    };

    aos__WEBPACK_IMPORTED_MODULE_0__.init(options);
})();


/***/ }),

/***/ "./src/assets/js/components/apply.js":
/*!*******************************************!*\
  !*** ./src/assets/js/components/apply.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
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


/***/ }),

/***/ "./src/assets/js/components/contact-form.js":
/*!**************************************************!*\
  !*** ./src/assets/js/components/contact-form.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const form = document.querySelector("#contact-form");

if (form) {
  const formWrapper = document.querySelector("#form-wrapper");
  const successAlert = document.querySelector("#form-alert");
  const errorAlert = document.querySelector("#form-error");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Check form validity first
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Hide existing alerts
    if (successAlert) {
      successAlert.classList.add("d-none");
    }

    if (errorAlert) {
      errorAlert.classList.add("d-none");
    }

    // Gather form values
    const name = document.getElementById("name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const company = document.getElementById("company")?.value || "";
    const telephone = document.getElementById("telephone")?.value || "";
    const message = document.getElementById("message")?.value || "";

    // Prepare Formspree request
    const xhr = new XMLHttpRequest();
    const url = "https://formspree.io/f/xqagrgro";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // Hide form once the request finishes
        if (formWrapper) {
          formWrapper.classList.add("d-none");
        }

        if (xhr.status === 200 || xhr.status === 201) {
          // Show success message
          if (successAlert) {
            successAlert.classList.remove("d-none");
            successAlert.classList.add("show");
          }

          // Reset form for future use
          form.reset();
          form.classList.remove("was-validated");

          // Redirect to homepage after delay
          setTimeout(() => {
            window.location.href = "/";
          }, 4000);
        } else {
          // Show error message
          if (errorAlert) {
            errorAlert.classList.remove("d-none");
            errorAlert.classList.add("show");
          }
        }
      }
    };

    const data = JSON.stringify({
      name,
      email,
      company,
      telephone,
      message,
    });

    xhr.send(data);
  });
}


/***/ }),

/***/ "./src/assets/js/components/form-validation.js":
/*!*****************************************************!*\
  !*** ./src/assets/js/components/form-validation.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


(function(){
    const forms = document.querySelectorAll(".needs-validation");

    Array.prototype.slice.call( forms ).forEach(function( form )
    {
        form.addEventListener( "submit", function( event )
        {
            if(!form.checkValidity())
            {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated")
        }, false);
    });

})();



/***/ }),

/***/ "./src/assets/js/components/job-description.js":
/*!*****************************************************!*\
  !*** ./src/assets/js/components/job-description.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
document.addEventListener("DOMContentLoaded", () => {
  const jobDescriptionEl = document.querySelector("#job-description");

  // Only run on the job description page
  if (!jobDescriptionEl) {
    return;
  }

  const selectedJobId = localStorage.getItem("selectedJobId");

  if (!selectedJobId) {
    console.error("No selected job ID found in localStorage.");
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
                href="apply.html"
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
                  href="apply.html"
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
                    href="apply.html"
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
                href="apply.html"
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


/***/ }),

/***/ "./src/assets/js/components/navbar.js":
/*!********************************************!*\
  !*** ./src/assets/js/components/navbar.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
(function() {
    const megaMenuToggles = document.querySelectorAll('.nav-item.dropdown') || [];

    function showMenu(event){
        const dropdown = event.target.querySelector('.dropdown-menu');
        const menuToggle = event.target.querySelector('.dropdown-toggle');

        if(dropdown && menuToggle){
            dropdown.classList.add('show');
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.classList.add('show');
        }
    }

    function hideMenu(event){
        const dropdown = event.target.querySelector('.dropdown-menu');
        const menuToggle = event.target.querySelector('.dropdown-toggle');

        if(dropdown && menuToggle){
            dropdown.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('show');
        }
    }

    megaMenuToggles.forEach((toggle) =>{
        toggle.addEventListener('mouseenter', (event) =>{
            showMenu(event);
        }); 
        toggle.addEventListener('mouseleave', (event) => {
            hideMenu(event);
        });
    }); 
})();

/***/ }),

/***/ "./src/assets/js/components/swiper.js":
/*!********************************************!*\
  !*** ./src/assets/js/components/swiper.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/swiper.esm.js");
//Import Swiper 


//Use Swiper
swiper__WEBPACK_IMPORTED_MODULE_0__["default"].use([swiper__WEBPACK_IMPORTED_MODULE_0__.Navigation, swiper__WEBPACK_IMPORTED_MODULE_0__.Pagination]);

// Initialize Swiper
(function () {
    const swipers = document.querySelectorAll('[data-swiper]');

    //Run forEach loop to load multiple swipers if needed
    swipers.forEach((swiper) => {
       
       let options = swiper.dataset.swiper ? JSON.parse(swiper.dataset.swiper) : {};
        new swiper__WEBPACK_IMPORTED_MODULE_0__["default"](swiper, options);
    });
})();

/***/ }),

/***/ "./src/assets/js/misc.js":
/*!*******************************!*\
  !*** ./src/assets/js/misc.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
(function () {
    //Add a body class once page has loaded
    //Used to add CSS transition elements
    //Avoids content shifting during page load

    window.addEventListener('load', function () {
        document.body.classList.add('page-loaded');

        // Auto-update copyright year
        var yearElement = this.document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    });
})();

/***/ }),

/***/ "./src/assets/js/theme.js":
/*!********************************!*\
  !*** ./src/assets/js/theme.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");
/* harmony import */ var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc.js */ "./src/assets/js/misc.js");
/* harmony import */ var _components_aos_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/aos.js */ "./src/assets/js/components/aos.js");
/* harmony import */ var _components_job_description_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/job-description.js */ "./src/assets/js/components/job-description.js");
/* harmony import */ var _components_form_validation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/form-validation.js */ "./src/assets/js/components/form-validation.js");
/* harmony import */ var _components_contact_form_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/contact-form.js */ "./src/assets/js/components/contact-form.js");
/* harmony import */ var _components_apply_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/apply.js */ "./src/assets/js/components/apply.js");
/* harmony import */ var _components_swiper_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/swiper.js */ "./src/assets/js/components/swiper.js");
/* harmony import */ var _components_navbar_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/navbar.js */ "./src/assets/js/components/navbar.js");
//Bootstrap


//Components 








//import './components/multer'


/***/ }),

/***/ "./src/assets/scss/theme.scss":
/*!************************************!*\
  !*** ./src/assets/scss/theme.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"theme": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgci_florida"] = self["webpackChunkgci_florida"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/assets/js/theme.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/assets/scss/theme.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=theme.bundle.js.map