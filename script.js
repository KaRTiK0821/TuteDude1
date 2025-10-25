document.addEventListener('DOMContentLoaded', () => {

    // --- Email.js Configuration ---
    // !! REPLACE WITH YOUR VALUES FROM EMAILJS.COM !!
    const EMAILJS_SERVICE_ID = 'service_tcmn13p';
    const EMAILJS_TEMPLATE_ID = 'template_i2j4h36';
    const EMAILJS_USER_ID = 'S6jXezHzV9UpRSgiY';

    // Initialize Email.js
    (function() {
        emailjs.init(EMAILJS_USER_ID);
    })();

    // --- Element Selections ---
    const servicesList = document.querySelector('.services-list');
    const cartItemsTbody = document.getElementById('cart-items');
    const totalAmountEl = document.getElementById('total-amount');
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('success-msg');
    const scrollToBookingBtn = document.querySelector('.scroll-to-booking');

    // --- Cart State ---
    // Initial state based on the screenshot
    let cart = [];

    // --- Functions ---

    /**
     * Updates the cart table and total amount display.
     */
    function updateCartDisplay() {
        // Clear existing cart items
        cartItemsTbody.innerHTML = '';

        let total = 0;

        if (cart.length === 0) {
            cartItemsTbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No items added.</td></tr>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                `;
                cartItemsTbody.appendChild(tr);
            });
        }

        // Update total amount
        totalAmountEl.textContent = `₹${total.toFixed(2)}`;
    }

    /**
     * Handles adding an item to the cart.
     * @param {string} name - The name of the service.
     * @param {number} price - The price of the service.
     * @param {HTMLElement} button - The button that was clicked.
     */
    function addItem(name, price, button) {
        cart.push({ name, price });
        // Change button style and text
        button.textContent = 'Remove Item';
        button.classList.remove('add-btn');
        button.classList.add('remove-btn');
        updateCartDisplay();
    }

    /**
     * Handles removing an item from the cart.
     * @param {string} name - The name of the service to remove.
     * @param {HTMLElement} button - The button that was clicked.
     */
    function removeItem(name, button) {
        cart = cart.filter(item => item.name !== name);
        // Change button style and text
        button.textContent = 'Add Item';
        button.classList.remove('remove-btn');
        button.classList.add('add-btn');
        updateCartDisplay();
    }

    /**
     * Sends the booking email via Email.js.
     */
    function sendBookingEmail(e) {
        e.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (cart.length === 0) {
            alert("Please add at least one service to your cart before booking.");
            return;
        }
        
        // Prepare email template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            phone_number: phone,
            services_booked: cart.map(item => `${item.name} (₹${item.price.toFixed(2)})`).join('\n'),
            total_amount: totalAmountEl.textContent
        };

        // Send the email
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Show success message
                successMsg.style.display = 'block';
                // Reset form
                bookingForm.reset();
                // Reset cart (optional)
                // cart = [];
                // updateCartDisplay();
                // You might want to reset the buttons as well if you reset the cart
            }, function(error) {
                console.log('FAILED...', error);
                alert('Failed to send booking. Please try again.');
            });
    }

    // --- Event Listeners ---

    // Scroll to booking section
    scrollToBookingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('booking').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Event delegation for Add/Remove buttons
    servicesList.addEventListener('click', (e) => {
        const button = e.target;
        // Check if a button was clicked
        if (button.tagName === 'BUTTON') {
            const serviceItem = button.closest('.service-item');
            const name = serviceItem.dataset.name;
            const price = parseFloat(serviceItem.dataset.price);

            if (button.classList.contains('add-btn')) {
                addItem(name, price, button);
            } else if (button.classList.contains('remove-btn')) {
                removeItem(name, button);
            }
        }
    });

    // Form submission
    bookingForm.addEventListener('submit', sendBookingEmail);

    // --- Initial Page Load ---
    
    // Update the cart display on page load with the initial items
    updateCartDisplay();

});