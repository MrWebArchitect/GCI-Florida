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
