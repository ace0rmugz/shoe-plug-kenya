let cart = JSON.parse(localStorage.getItem('shoePlugCart')) || [];
window.onload = () => {
    updateCartUI();
    const loggedInUser = localStorage.getItem('username');
    const greetingElem = document.getElementById("user-greeting");
    
    if (loggedInUser && greetingElem) {
        greetingElem.innerText = `Karibu, ${loggedInUser}!`;
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
};

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
    popup.style.display = (popup.style.display === "none" || popup.style.display === "") ? "block" : "none";
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some sneakers first.");
        return;
    }

    const totalAmount = document.getElementById("cart-total").innerText;
    const clientName = localStorage.getItem('username') || "Guest Customer";

    // 1. Build the message with normal line breaks (\n)
    let message = `*NEW ORDER - SHOE PLUG KENYA*\n\n`;
    message += `*Customer:* ${clientName}\n`;
    message += `I would like to order the following:\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (x${item.quantity}) - Ksh ${item.price * item.quantity}\n`;
    });

    message += `\n*Total Amount: Ksh ${totalAmount}*\n\nPlease confirm availability and delivery.`;

    // 2. IMPORTANT: Use international format (254) and NO leading zero
    const myPhoneNumber = "254110974624"; 

    // 3. Use encodeURIComponent to make the URL safe for all phones
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    // Reset everything
    cart = [];
    saveCart();
    if (typeof toggleCart === "function") {
        toggleCart();
    }
}

// Contact form logic
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
