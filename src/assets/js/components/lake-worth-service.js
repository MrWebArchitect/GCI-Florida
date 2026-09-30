function initLakeWorthService() {
  const input = document.querySelector("#lake-worth-street");
  const suggestions = document.querySelector("#lake-worth-suggestions");
  const result = document.querySelector("#lake-worth-result");
  const noResults = document.querySelector("#lake-worth-no-results");

  // Only initialize on pages containing the Lake Worth service widget
  if (!input || !suggestions || !result || !noResults) {
    return;
  }

  let streets = [];

  // Load Lake Worth collection schedule data
  fetch("./data/lake-worth-service.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Unable to load Lake Worth service data: ${response.status}`,
        );
      }

      return response.json();
    })
    .then((data) => {
      streets = data.schedules.flatMap((schedule) =>
        schedule.streets.map((street) => ({
          name: street,
          schedule,
        })),
      );
    })
    .catch((error) => {
      console.error("Lake Worth data error:", error);
    });

  // Search streets as the resident types
  input.addEventListener("input", () => {
    const query = normalize(input.value);

    clearResult();

    if (query.length < 2) {
      closeSuggestions();
      noResults.hidden = true;
      return;
    }

    const matches = streets
      .filter(({ name }) => normalize(name).includes(query))
      .slice(0, 8);

    renderSuggestions(matches, query);
  });

  // Normalize search values for consistent matching
  function normalize(value) {
    return value.toUpperCase().trim().replace(/\s+/g, " ");
  }

  // Display matching street suggestions
  function renderSuggestions(matches, query) {
    suggestions.innerHTML = "";

    if (!matches.length) {
      closeSuggestions();
      noResults.hidden = false;
      return;
    }

    noResults.hidden = true;

    matches.forEach(({ name, schedule }) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "lake-worth-suggestion";
      button.setAttribute("role", "option");

      const normalizedName = normalize(name);
      const matchIndex = normalizedName.indexOf(query);

      if (matchIndex !== -1) {
        const before = name.slice(0, matchIndex);
        const match = name.slice(matchIndex, matchIndex + query.length);
        const after = name.slice(matchIndex + query.length);

        button.append(document.createTextNode(before));

        const strong = document.createElement("strong");
        strong.textContent = match;
        button.append(strong);

        button.append(document.createTextNode(after));
      } else {
        button.textContent = name;
      }

      button.addEventListener("click", () => {
        input.value = name;

        closeSuggestions();
        renderSchedule(name, schedule);
      });

      suggestions.appendChild(button);
    });

    suggestions.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  // Render the selected street's collection schedule
  function renderSchedule(street, schedule) {
    result.innerHTML = `
      <div class="lake-worth-result-heading">
        <span class="lake-worth-result-check">
          <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
          ${street}
        </span>

        <h3>Your Corrected Collection Schedule</h3>
      </div>

      <div class="lake-worth-days">
        ${createDayCard("Monday", schedule.monday)}
        ${createDayCard("Thursday", schedule.thursday)}
      </div>

      <button
        type="button"
        class="lake-worth-search-again"
      >
        Search another street
      </button>
    `;

    result.hidden = false;

    const searchAgain = result.querySelector(".lake-worth-search-again");

    searchAgain.addEventListener("click", () => {
      input.value = "";
      result.hidden = true;
      input.focus();
    });
  }

  // Create an individual collection-day card
  function createDayCard(day, services) {
    return `
      <div class="lake-worth-day-card">
        <div class="lake-worth-day-title">
          ${day}
        </div>

        <div class="lake-worth-services">
          ${services
            .map(
              (service) => `
                <span class="lake-worth-service-item">
                  ${getServiceIcon(service)}
                  <span>${service}</span>
                </span>
              `,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // Match each service with its Bootstrap icon
  function getServiceIcon(service) {
    const icons = {
      Trash: "bi-trash3-fill",
      Recycling: "bi-recycle",
      Vegetation: "bi-tree-fill",
      Bulk: "bi-box-seam-fill",
    };

    return `
      <i
        class="bi ${icons[service] || "bi-check-circle-fill"}"
        aria-hidden="true"
      ></i>
    `;
  }

  function clearResult() {
    result.hidden = true;
  }

  function closeSuggestions() {
    suggestions.hidden = true;
    suggestions.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
  }
}

// Initialize after the DOM is available
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLakeWorthService);
} else {
  initLakeWorthService();
}
