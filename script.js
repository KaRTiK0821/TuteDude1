// Initialize EmailJS
(function() {
    emailjs.init("S6jXezHzV9UpRSgiY"); // Replace with your actual EmailJS public key
})();

// DOM Elements
const usernameModal = document.getElementById('usernameModal');
const usernameInput = document.getElementById('usernameInput');
const saveUsernameBtn = document.getElementById('saveUsernameBtn');
const userDisplay = document.getElementById('userDisplay');
const changeUsernameBtn = document.getElementById('changeUsernameBtn');
const bookServiceBtn = document.getElementById('bookServiceBtn');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const bookingForm = document.getElementById('bookingForm');
const confirmationMessage = document.getElementById('confirmationMessage');
const newsletterForm = document.getElementById('newsletterForm');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Cart State
let cart = [];
let total = 0;

// Username Functions
function showUsernameModal() {
    usernameModal.style.display = 'flex';
}

function hideUsernameModal() {
    usernameModal.style.display = 'none';
}

function saveUsername() {
    const username = usernameInput.value.trim();
    if (username) {
        userDisplay.textContent = username;
        localStorage.setItem('laundryUsername', username);
        hideUsernameModal();
    } else {
        alert('Please enter a valid name');
    }
}

function changeUsername() {
    showUsernameModal();
}

// Check for saved username on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedUsername = localStorage.getItem('laundryUsername');
    if (savedUsername) {
        userDisplay.textContent = savedUsername;
    } else {
        showUsernameModal();
    }
    
    // Add event listeners to all "Add Item" buttons
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Book service button scroll
    bookServiceBtn.addEventListener('click', function() {
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Booking form submission
    bookingForm.addEventListener('submit', handleBooking);
    
    // Newsletter form submission
    newsletterForm.addEventListener('submit', handleNewsletter);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', mobileMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', closeMenu));
    
    // Username modal events
    saveUsernameBtn.addEventListener('click', saveUsername);
    changeUsernameBtn.addEventListener('click', changeUsername);
    
    // Close modal when clicking outside
    usernameModal.addEventListener('click', function(e) {
        if (e.target === usernameModal) {
            hideUsernameModal();
        }
    });
    
    // Allow Enter key to save username
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveUsername();
        }
    });
});

// Cart Functions
function addToCart(event) {
    const service = event.target.dataset.service;
    const price = parseInt(event.target.dataset.price);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.service === service);
    
    if (existingItemIndex !== -1) {
        // Item exists, update quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            service: service,
            price: price,
            quantity: 1
        });
    }
    
    // Update total
    total += price;
    
    // Update UI
    updateCartUI();
}

function removeFromCart(service) {
    // Find item in cart
    const itemIndex = cart.findIndex(item => item.service === service);
    
    if (itemIndex !== -1) {
        // Update total
        total -= cart[itemIndex].price * cart[itemIndex].quantity;
        
        // Remove item from cart
        cart.splice(itemIndex, 1);
        
        // Update UI
        updateCartUI();
    }
}

function updateCartUI() {
    // Clear cart display
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No items added yet</p>';
    } else {
        // Add each item to cart display
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <strong>${index + 1}. ${item.service}</strong>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div>
                    <p>¥${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" data-service="${item.service}">Remove Item</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                removeFromCart(this.dataset.service);
            });
        });
    }
    
    // Update total amount
    totalAmount.textContent = `¥${total.toFixed(2)}`;
}

// Form Handlers
function handleBooking(event) {
    event.preventDefault();
    
    // Get form data
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Validate cart is not empty
    if (cart.length === 0) {
        alert('Please add at least one service to your cart before booking.');
        return;
    }
    
    // Prepare email parameters
    const serviceList = cart.map(item => 
        `${item.service} (Qty: ${item.quantity}) - ¥${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const templateParams = {
        to_name: 'Laundry Service',
        from_name: fullName,
        from_email: email,
        phone: phone,
        message: `Booking Details:\n\nServices:\n${serviceList}\n\nTotal Amount: ¥${total.toFixed(2)}`
    };
    
    // Send email using EmailJS
    emailjs.send('service_mfzmyxo', 'template_3yipo7p', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show confirmation message
            confirmationMessage.textContent = 'Thank you For Booking the Service We will get back to you soon!';
            confirmationMessage.style.display = 'block';
            
            // Reset form and cart
            bookingForm.reset();
            cart = [];
            total = 0;
            updateCartUI();
            
            // Hide confirmation message after 5 seconds
            setTimeout(() => {
                confirmationMessage.style.display = 'none';
            }, 5000);
        }, function(error) {
            console.log('FAILED...', error);
            alert('There was an error sending your booking. Please try again.');
        });
}

function handleNewsletter(event) {
    event.preventDefault();
    
    const name = document.getElementById('newsletterName').value;
    const email = document.getElementById('newsletterEmail').value;
    
    // In a real application, you would send this data to your server
    alert(`Thank you ${name} for subscribing to our newsletter!`);
    
    // Reset form
    newsletterForm.reset();
}

// Mobile Menu Functions
function mobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}