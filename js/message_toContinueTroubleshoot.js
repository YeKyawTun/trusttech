document.addEventListener('DOMContentLoaded', function() {
  // Fetch CSRF token 
  fetch('c_assets/php/csrf_token.php')
      .then(response => response.json())
      .then(data => {
          const csrfTokenInput = document.querySelector("input[name='csrf_token']");
          if (csrfTokenInput) {
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

  // Styling
  modalTitle.classList.add("text-center");
  modalBody.classList.add("text-center");

  form.onsubmit = (e) => {
      e.preventDefault();

      // Disable the close button temporarily
      btnClose.disabled = true;

      // Show the modal during sending
      modalTitle.textContent = "Sending...";
      modalBody.textContent = "Your message is being sent. Please wait...";
      modal.show();

      let xhr = new XMLHttpRequest();
      xhr.open("POST", "c_assets/php/message.php", true);

      xhr.onload = () => {
          if (xhr.readyState == 4) {
              // Re-enable the close button
              btnClose.disabled = false;

              if (xhr.status == 200) {
                  try {
                      const response = JSON.parse(xhr.responseText);
                      if (response.status === 'success') {
                          modalTitle.textContent = "Message Sent";
                          //modalBody.textContent = "Your message has been sent successfully.";
                          modalBody.textContent = response.message;
                          setTimeout(() => form.reset(), 1000); 
                      } else {
                          modalTitle.textContent = "Failed to Send";
                          //modalBody.textContent = response.message || "Sorry, your message could not be sent. Please try again later.";
                          modalBody.textContent = response.message;
                      }
                  } catch (error) {
                      console.error('Error parsing response:', error); 
                      modalTitle.textContent = "Error";
                      //modalBody.textContent = "There was an error sending your message. Please try again.";
                      modalBody.textContent = response.message;
                  }
              } else {
                  // Handle non-200 status codes
                  console.error('Error sending message:', xhr.status, xhr.responseText); 
                  modalTitle.textContent = "Error";
                  //modalBody.textContent = "There was an error sending your message. Please try again.";
                  modalBody.textContent = response.message;
              }
          }
      };

      xhr.onerror = () => {
          // Re-enable the close button
          btnClose.disabled = false;

          console.error('Network error occurred.');
          modalTitle.textContent = "Error";
          modalBody.textContent = "There was an error sending your message. Please check your network connection and try again.";
      };

      let formData = new FormData(form);
      xhr.send(formData);
  };
});
