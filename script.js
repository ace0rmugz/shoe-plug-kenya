// --- 1. INITIALIZATION & DATA ---
let cart = JSON.parse(localStorage.getItem('shoePlugCart')) || [];

const shoeData = {
    "nike_airforce_1_black": { name: "AF1 Black", price: 2500, img: "nike_airforce_1_black.jpg" },
    "nike_airforce_1_white": { name: "AF1 White", price: 2500, img: "nike_airforce_1_white.jpg" },
    "adidas_campus": { name: "Adidas Campus", price: 3000, img: "adidas_campus.jpg" },
    "clarks": { name: "Clarks", price: 4000, img: "clarks.jpg" }
};

// --- 2. THE MASTER ONLOAD (Combines everything) ---
window.onload = () => {
    updateCartUI();
    
    // Handle Welcome Message & Logout Toggle
    const loggedInUser = localStorage.getItem('username');
    const welcomeDisplay = document.getElementById("userWelcome"); // for index.html
    const greetingElem = document.getElementById("user-greeting"); // for alternate headers
    
    const userDisplay = welcomeDisplay || greetingElem;

    if (loggedInUser && userDisplay) {
        userDisplay.innerText = `Karibu, ${loggedInUser}!`;
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.innerText = "Logout";
            loginLink.href = "#";
            loginLink.onclick = () => {
                localStorage.removeItem('username');
                alert("Logged out successfully!");
                location.reload();
            };
        }
    }

    // If we are on the product details page, load the shoe info
    if (window.location.pathname.includes('product-details.html')) {
        loadProductDetails();
    }
};

// --- 3. SHOPPING CART LOGIC ---
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    alert(name + " added to cart!");
}

function saveCart() {
    localStorage.setItem('shoePlugCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countElem = document.getElementById("cart-count");
    const listElem = document.getElementById("cart-items-list");
    const totalElem = document.getElementById("cart-total");

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countElem) countElem.innerText = totalCount;

    if (listElem) {
        listElem.innerHTML = cart.length === 0 ? "<p style='color:gray'>Your cart is empty</p>" : "";
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemDiv = document.createElement("div");
            itemDiv.style.display = "flex";
            itemDiv.style.justifyContent = "space-between";
            itemDiv.style.marginBottom = "8px";
            itemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>Ksh ${item.price * item.quantity} 
                <button onclick="removeItem(${index})" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold; margin-left:10px;">X</button></span>
            `;
            listElem.appendChild(itemDiv);
        });
        
        if (totalElem) totalElem.innerText = total.toLocaleString();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function toggleCart() {
    const popup = document.getElementById("cartPopup");
    if (popup) {
        popup.style.display = (popup.style.display === "none" || popup.style.display === "") ? "block" : "none";
    }
}

// --- 4. SEARCH & PRODUCT DETAILS ---
function searchShoes() {
    let input = document.getElementById('shoeSearch').value.toLowerCase();
    let cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        let name = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = name.includes(input) ? "" : "none";
    });
}

function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const shoeId = params.get('shoe');

    if (shoeId && shoeData[shoeId]) {
        const item = shoeData[shoeId];
        document.getElementById('mainShoeImage').src = item.img;
        document.getElementById('shoeName').innerText = item.name;
        document.getElementById('shoePrice').innerText = `Ksh ${item.price}`;
    } else {
        const nameDisplay = document.getElementById('shoeName');
        if (nameDisplay) nameDisplay.innerText = "Shoe Not Found";
    }
}

function addDetailedItemToCart() {
    const name = document.getElementById('shoeName').innerText;
    const priceText = document.getElementById('shoePrice').innerText;
    const price = parseInt(priceText.replace('Ksh ', '').replace(',', ''));
    const size = document.getElementById('shoeSize').value;

    const fullProductName = `${name} (Size ${size})`;
    addToCart(fullProductName, price);
    
    const msg = document.getElementById('addedMsg');
    if (msg) {
        msg.innerText = `✅ Added Size ${size} to cart!`;
        setTimeout(() => { msg.innerText = ""; }, 2000);
    }
}

// --- 5. CHECKOUT & LOGIN ---
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some sneakers first.");
        return;
    }

    const totalAmount = document.getElementById("cart-total").innerText;
    const clientName = localStorage.getItem('username') || "Guest Customer";

    let message = `*NEW ORDER - SHOE PLUG KENYA*\n\n`;
    message += `*Customer:* ${clientName}\n`;
    message += `I would like to order the following:\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (x${item.quantity}) - Ksh ${item.price * item.quantity}\n`;
    });

    message += `\n*Total Amount: Ksh ${totalAmount}*\n\nPlease confirm availability and delivery.`;

    const myPhoneNumber = "254110974624"; 
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    cart = [];
    saveCart();
    toggleCart();
}

function customerLogin() {
    const name = document.getElementById("usernameInput").value;
    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }
    localStorage.setItem('username', name);
    window.location.href = "index.html";
}

// --- 6. CONTACT FORM ---
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const msgContainer = document.getElementById("contact-msg");
        if (msgContainer) {
            msgContainer.innerText = "✅ Message sent! We'll call you soon.";
        }
        contactForm.reset();
    });
}
