const form = document.querySelector("#contact-form");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const telephone = document.getElementById("telephone").value;
  const message = document.getElementById("message").value;
  
    const xhr = new XMLHttpRequest();
    const url = "https://formspree.io/f/xgebprbg";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          alert("Thank you for your message!");
          form.reset();
        } else {
          alert("Sorry, there was a problem sending your message. Please try again later.");
        }
      }
    };
    const data = JSON.stringify({ name: name, email: email, company: company, telephone: telephone, message: message });
    xhr.send(data);
  });
  
