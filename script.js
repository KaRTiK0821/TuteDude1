document.addEventListener('DOMContentLoaded', () => 
{
    const EMAILJS_SERVICE_ID = 'service_tcmn13p';
    const EMAILJS_TEMPLATE_ID = 'template_i2j4h36';
    const EMAILJS_USER_ID = 'S6jXezHzV9UpRSgiY';

    (function() 
    {
        emailjs.init(EMAILJS_USER_ID);
    })();

    const servicesList = document.querySelector('.services-list');
    const cartItemsTbody = document.getElementById('cart-items');
    const totalAmountEl = document.getElementById('total-amount');
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('success-msg');
    const scrollToBookingBtn = document.querySelector('.scroll-to-booking');

    let cart = [];

    function updateCartDisplay() {
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

        totalAmountEl.textContent = `₹${total.toFixed(2)}`;
    }

    function addItem(name, price, button) {
        cart.push({ name, price });
        button.textContent = 'Remove Item';
        button.classList.remove('add-btn');
        button.classList.add('remove-btn');
        updateCartDisplay();
    }

    function removeItem(name, button) {
        cart = cart.filter(item => item.name !== name);
        button.textContent = 'Add Item';
        button.classList.remove('remove-btn');
        button.classList.add('add-btn');
        updateCartDisplay();
    }

    function sendBookingEmail(e) 
    {

    e.preventDefault();

    const name = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (cart.length === 0) {
        alert("Please add at least one service to your cart before booking.");
        return;
    }
    
    const templateParams = 
    {
        from_name: name,
        from_email: email,
        phone_number: phone,

        services_booked: cart.map(item => `${item.name} (₹${item.price.toFixed(2)})`).join('\n'),
        total_amount: totalAmountEl.textContent,
        email: email


    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {

            console.log('SUCCESS!', response.status, response.text);
            successMsg.style.display = 'block';

            bookingForm.reset();
            
            resetCartAndServices();

        }, 
        function(error) {
            console.log('FAILED...', error);
            alert('Failed to send booking. Please try again.');


        });
}


function resetCartAndServices() {

    cart = [];

    updateCartDisplay();

    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => 
    {
        const button = item.querySelector('button');

        button.textContent = 'Add Item';
        button.classList.remove('remove-btn');
        button.classList.add('add-btn');

    });
}

    scrollToBookingBtn.addEventListener('click', (e) => 
    {
        e.preventDefault();
        document.getElementById('booking').scrollIntoView({
            behavior: 'smooth'
        });
    });

    servicesList.addEventListener('click', (e) => 
    {
        const button = e.target;
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

    bookingForm.addEventListener('submit', sendBookingEmail);

    updateCartDisplay();
});