// Smooth scroll to booking section when hero button clicked
document.getElementById("book-btn").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("services-section").scrollIntoView({ behavior: "smooth" });
});

/* ========== EmailJS setup ========== */
/* 1) Sign up at https://www.emailjs.com
   2) Create an email service (e.g. Gmail) and a template with fields: name, email, service
   3) Copy your service ID, template ID and public key and replace below.
*/
(function(){
  // initialize EmailJS - replace with YOUR_PUBLIC_KEY
  emailjs.init("YOUR_PUBLIC_KEY");
})();

document.getElementById("booking-form").addEventListener("submit", function (ev) {
  ev.preventDefault();

  const templateParams = {
    name: this.name.value,
    email: this.email.value,
    service: this.service.value
  };

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then(function(response) {
      alert("Booking successful! A confirmation email has been sent.");
      document.getElementById("booking-form").reset();
    }, function(error) {
      console.error("EmailJS error:", error);
      alert("Sorry — something went wrong sending the email. Check console for details.");
    });
});
