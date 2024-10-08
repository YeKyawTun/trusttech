document.addEventListener('DOMContentLoaded', function() {
  fetch('c_assets/php/csrf_token.php') // Adjust the path if necessary
  .then(response => response.json())
  .then(data => {
      const csrfTokenInput = document.querySelector("input[name='csrf_token']");
      if(csrfTokenInput) {
          csrfTokenInput.value = data.csrf_token;
          // console.log("CSRF Token set: ", data.csrf_token); // For debugging
      }
  })
  .catch(error => console.error('Error fetching CSRF token:', error));

  const form = document.querySelector("form"),
  statusTxt = form.querySelector(".button-area span");

  form.onsubmit = (e)=>{
    e.preventDefault();
    statusTxt.style.color = "#0D6EFD";
    statusTxt.style.display = "block";
    statusTxt.innerText = "Sending your message...";
    form.classList.add("disabled");

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "c_assets/php/message.php", true);
    xhr.onload = ()=>{
      if(xhr.readyState == 4 && xhr.status == 200){
        let response = xhr.response;
        if(response.indexOf("Email and message field is required!") != -1 || response.indexOf("Enter a valid email address!") != -1 || response.indexOf("Sorry, failed to send your message!") != -1){
          statusTxt.style.color = "red";
        }else{
          form.reset();
          setTimeout(()=>{
            statusTxt.style.display = "none";
          }, 3000);
        }
        statusTxt.innerText = response;
        form.classList.remove("disabled");
      }
    }
    let formData = new FormData(form);
    xhr.send(formData);
  };
});
