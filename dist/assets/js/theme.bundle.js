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


/***/ }),

/***/ "./src/assets/js/components/contact-form.js":
/*!**************************************************!*\
  !*** ./src/assets/js/components/contact-form.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const form = document.querySelector("#contact-form");
const formWrapper = document.querySelector("#form-wrapper");
const successAlert = document.querySelector("#form-alert");
const errorAlert = document.querySelector("#form-error");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // ✅ Check form validity first
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return; //Stop here if invalid
  }

  //Hide existing alert
  successAlert.classList.add("d-none");
  errorAlert.classList.add("d-none");

  // Gather form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const telephone = document.getElementById("telephone").value;
  const message = document.getElementById("message").value;

  //Prepare Formspree request
  const xhr = new XMLHttpRequest();
  const url = "https://formspree.io/f/xqagrgro";  //Formspree endpoint
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // Hide form wrapper onece the request finishes
      formWrapper.classList.add("d-none");

      if (xhr.status === 200 || xhr.status === 201) {
        // Show cussess message
        successAlert.classList.remove("d-none");
        successAlert.classList.add("show");

        //Reset form for future use
        form.reset();
        form.classList.remove("was-validated");

        //Redirect to homepage after delay
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      } else {
        //Show error message
        errorAlert.classList.remove("d-none");
        errorAlert.classList.add("show");
      }
    }
  };
  const data = JSON.stringify({
    name,
    email,
    company,
    telephone,
    message
  });

  xhr.send(data);
});



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