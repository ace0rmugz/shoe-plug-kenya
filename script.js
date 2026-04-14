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

    let message = `*NEW ORDER - SHOE PLUG KENYA*%0A%0A`;
    message += `*Customer:* ${clientName}%0A`;
    message += `I would like to order the following:%0A`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (x${item.quantity}) - Ksh ${item.price * item.quantity}%0A`;
    });

    message += `%0A*Total Amount: Ksh ${totalAmount}*%0A%0A_Please confirm availability and delivery._`;

    const myPhoneNumber = "0110974624";
    const whatsappURL = `https://wa.me/${myPhoneNumber}?text=${message}`;

    window.open(whatsappURL, '_blank');

    cart = [];
    saveCart();
    toggleCart();
}

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