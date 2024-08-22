document.addEventListener('DOMContentLoaded', function() {
  // Fetch CSRF token setup remains unchanged
  fetch('c_assets/php/csrf_token.php')
  .then(response => response.json())
  .then(data => {
      const csrfTokenInput = document.querySelector("input[name='csrf_token']");
      if(csrfTokenInput) {
          csrfTokenInput.value = data.csrf_token;
      }
  })
  .catch(error => console.error('Error fetching CSRF token:', error));

  const form = document.querySelector("form");
  const modalElement = document.getElementById('messageModal');
  const modal = new bootstrap.Modal(modalElement, {
    keyboard: false,
    backdrop: 'static'
  });

  const modalTitle = document.getElementById('messageModalLabel');
  const modalBody = document.getElementById('messageModalBody');
  const btnClose = modalElement.querySelector('.btn-close');

  modalTitle.classList.add("text-center");
  modalBody.classList.add("text-center");

  let animateTitle; // Variable to store the animation interval

  function startTitleAnimation() {
    let dotCount = 0;
    modalTitle.textContent = "Sending";
    animateTitle = setInterval(() => {
      modalTitle.textContent = `Sending${".".repeat(dotCount + 1)}`; // Update text
      dotCount = (dotCount + 1) % 5; // Cycle dotCount between 0 and 2
    }, 500); // Adjust the interval time as needed
  }

  function stopTitleAnimation() {
    clearInterval(animateTitle); // Stop the animation
  }




  // Fetch reCAPTCHA site key and set it dynamically
  fetch('c_assets/php/recaptcha_key.php')
    .then(response => response.json())
    .then(data => {
      const recaptchaElement = document.querySelector('.g-recaptcha');
      recaptchaElement.setAttribute('data-sitekey', data.site_key);
      grecaptcha.render(recaptchaElement, {
        'sitekey': data.site_key
      });
    })
    .catch(error => console.error('Error fetching reCAPTCHA site key:', error));



  form.onsubmit = (e) => {
    e.preventDefault();

    // Check if reCAPTCHA is verified
    if (!grecaptcha.getResponse()) {
      alert("Please verify that you are not a robot.");
      return; // Prevent the form from submitting until reCAPTCHA is verified
    }

    startTitleAnimation(); // Start the "Sending..." animation
    modalBody.textContent = "Your message is being sent. Please wait...";
    modal.show();
    btnClose.disabled = true;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "c_assets/php/message.php", true);
    xhr.onload = () => {
      stopTitleAnimation(); // Stop the animation when the AJAX call completes
      btnClose.disabled = false; // Re-enable the close button
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        modalTitle.textContent = response.status === 'success' ? "Message Sent" : "Failed to Send";
        modalBody.textContent = response.message;

        if (response.status === 'success') {
          setTimeout(() => form.reset(), 1000); // Reset form after a delay if successful
          grecaptcha.reset(); // Reset the reCAPTCHA
        }
      } else {
        // Handle non-200 HTTP responses
        modalTitle.textContent = "Error";
        modalBody.textContent = "Your request could not be processed. Please try again.";
        grecaptcha.reset(); // Reset the reCAPTCHA
      }
    };
    xhr.onerror = () => {
      stopTitleAnimation(); // Ensure animation stops on network error

      // Handle network errors or issues with the AJAX request itself
      btnClose.disabled = false;
      modalTitle.textContent = "Network Error";
      modalBody.textContent = "There was a problem reaching the server. Please check your connection and try again.";
    };

    let formData = new FormData(form);
    xhr.send(formData);
  };
});
