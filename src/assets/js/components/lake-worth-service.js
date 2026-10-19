// Import once from src/assets/js/theme.js:
// import './components/lake-worth-service';
document.addEventListener("DOMContentLoaded", async () => {
  const root = document.querySelector("#gcf-service-lookup");
  if (!root) return;
  const input = root.querySelector("#gcf-address");
  const suggestions = root.querySelector("#gcf-suggestions");
  const matchesList = root.querySelector("#gcf-address-matches");
  const result = root.querySelector("#gcf-result");
  const status = root.querySelector("#gcf-status");
  const locate = root.querySelector("#gcf-locate");
  const form = root.querySelector("#gcf-address-form");
  let records = [],
    conflictKeys = new Set(),
    selected = null;
  const normalize = (value) =>
    String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const key = (item) => `${normalize(item.address)}|${normalize(item.city)}`;
  const escapeHTML = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const setStatus = (message) => {
    status.textContent = message;
  };
  const clearResult = () => {
    result.hidden = true;
    result.innerHTML = "";
  };
  const hideSuggestions = () => {
    suggestions.hidden = true;
    matchesList.innerHTML = "";
  };
  const showSearchOptions = () => {
    suggestions.hidden = false;
  };
  const matching = (text) => {
    const q = normalize(text);
    if (!q) return [];
    const terms = q.split(" ");
    return records
      .filter((r) => terms.every((t) => r.search.includes(t)))
      .sort(
        (a, b) =>
          Number(b.search.startsWith(q)) - Number(a.search.startsWith(q)) ||
          a.address.localeCompare(b.address),
      )
      .slice(0, 10);
  };
  function getServiceIcon(service) {
    const icons = {
      Trash: "bi-trash3-fill",
      Recycling: "bi-recycle",
      Vegetation: "bi-tree-fill",
      Bulk: "bi-box-seam-fill",
    };
    return `<i class="bi ${icons[service] || "bi-question-circle"}" aria-hidden="true"></i>`;
  }
  const serviceMarkup = (services) =>
    services
      .map(
        (service) =>
          `<span class="gcf-service-item">${getServiceIcon(service)}<span>${escapeHTML(service)}</span></span>`,
      )
      .join("");
  function showSchedule(record) {
    selected = record;
    input.value = `${record.address}, ${record.city}`;
    hideSuggestions();
    const labels = {
      "monday-trash": ["Monday", "Thursday"],
      "tuesday-trash": ["Tuesday", "Friday"],
      "wednesday-trash": ["Wednesday", "Saturday"],
    };
    const days = labels[record.schedule];
    if (!days) {
      setStatus("Schedule unavailable. Please call 561-444-3442.");
      return;
    }
    setStatus("");
    result.innerHTML = `<h3 class="gcf-result-title">Your Collection Schedule</h3>
      <p class="gcf-confirmed-address">${escapeHTML(record.address)}, ${escapeHTML(record.city)}</p>
      <div class="gcf-schedule-grid">
        <article class="gcf-schedule-card"><h4>${days[0]}</h4><div class="gcf-service-items">${serviceMarkup(["Trash"])}</div></article>
        <article class="gcf-schedule-card"><h4>${days[1]}</h4><div class="gcf-service-items">${serviceMarkup(["Recycling", "Vegetation", "Bulk"])}</div></article>
      </div>`;
    result.hidden = false;
  }
  function chooseText(text) {
    const query = normalize(text)
      .replace(/,?\s*(LAKE WORTH|WEST PALM BEACH|LANTANA)(\s+FL)?$/, "")
      .trim();
    const exact = records.filter(
      (r) =>
        normalize(r.address) === query ||
        normalize(`${r.address} ${r.city}`) === normalize(text),
    );
    if (exact.length === 1) {
      showSchedule(exact[0]);
      return true;
    }
    if (exact.length > 1) {
      clearResult();
      setStatus(
        "Multiple matching addresses found. Select the correct address from the suggestions.",
      );
      return false;
    }
    const conflicts = [...conflictKeys].some((k) => k.split("|")[0] === query);
    clearResult();
    setStatus(
      conflicts
        ? "This address has conflicting schedule records. Please call 561-444-3442 to confirm."
        : "Address not found. Check the house number and street, or call 561-444-3442.",
    );
    return false;
  }
  function renderSuggestions() {
    selected = null;
    clearResult();
    const matches = matching(input.value);
    matchesList.innerHTML = "";
    matches.forEach((r) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${r.address}, ${r.city}`;
      button.addEventListener("click", () => showSchedule(r));
      li.append(button);
      matchesList.append(li);
    });
    showSearchOptions();
  }
  try {
    const response = await fetch("/data/lake-worth-service.json", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    records = data.addresses.map((r) => ({
      ...r,
      search: normalize(`${r.address} ${r.city}`),
    }));
    conflictKeys = new Set(
      (data.conflictingAddresses || []).map((r) =>
        normalize(`${r.address} ${r.city}`),
      ),
    );
    setStatus("Start typing your house number and street name.");
  } catch (error) {
    console.error("GCF address lookup failed:", error);
    setStatus(
      "Address lookup is temporarily unavailable. Please call 561-444-3442.",
    );
    input.disabled = true;
    locate.disabled = true;
    return;
  }
  input.addEventListener("input", () => {
    setStatus("");
    renderSuggestions();
  });
  input.addEventListener("focus", () => {
    if (input.value.trim()) renderSuggestions();
    else showSearchOptions();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideSuggestions();
    if (event.key === "ArrowDown" && !suggestions.hidden) {
      event.preventDefault();
      suggestions.querySelector("button:not(:disabled)")?.focus();
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (selected && input.value === `${selected.address}, ${selected.city}`)
      showSchedule(selected);
    else chooseText(input.value);
  });
  document.addEventListener("click", (event) => {
    if (!form.contains(event.target)) hideSuggestions();
  });
  locate.addEventListener("click", () => {
    hideSuggestions();
    if (!navigator.geolocation) {
      setStatus(
        "Location services are not supported by this browser. Please type your address.",
      );
      return;
    }
    setStatus("Requesting your location…");
    locate.disabled = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setStatus("Finding the street address for your location…");
          // Nominatim: occasional user-initiated reverse lookups only. For high traffic,
          // replace with a contracted geocoding provider or your own server-side endpoint.
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${encodeURIComponent(position.coords.latitude)}&lon=${encodeURIComponent(position.coords.longitude)}`;
          const response = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!response.ok) throw new Error("Reverse geocoding unavailable");
          const data = await response.json();
          const a = data.address || {};
          const house = a.house_number;
          const street = a.road || a.residential || a.pedestrian || a.street;
          if (!house || !street) {
            setStatus(
              "Your location did not resolve to a house number. Please type your full address.",
            );
            return;
          }
          const found = `${house} ${street}`;
          input.value = found;
          // No proximity-based schedule guessing. A user must confirm the address.
          const matches = matching(found);
          if (
            matches.length === 1 &&
            normalize(matches[0].address) === normalize(found)
          ) {
            showSchedule(matches[0]);
            setStatus(
              "Location-derived address shown. Please verify that this is your service address.",
            );
          } else {
            renderSuggestions();
            setStatus(
              "Please confirm your service address from the suggestions, or type it manually.",
            );
          }
        } catch (error) {
          console.error(error);
          setStatus(
            "Could not look up your address from your location. Please enter it manually.",
          );
        } finally {
          locate.disabled = false;
        }
      },
      () => {
        locate.disabled = false;
        setStatus(
          "Location access was denied or unavailable. Please enter your address manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  });
});
