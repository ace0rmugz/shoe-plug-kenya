let cart = JSON.parse(localStorage.getItem('shoePlugCart')) || [];

const shoeData = {
    "nike_airforce_1_black": { name: "AF1 Black", price: 2500, img: "nike_airforce_1_black.jpg" },
    "nike_airforce_1_white": { name: "AF1 White", price: 2500, img: "nike_airforce_1_white.jpg" },
    "adidas_campus": { name: "Adidas Campus", price: 3000, img: "adidas_campus.jpg" },
    "clarks": { name: "Clarks", price: 4000, img: "clarks.jpg" },
    "nike_airmax_95": { name: "Nike Airmax 95's", price: 3500, img: "Nike_Airmax_95's.jpg" },
    "nike_airmax_97": { name: "Nike Airmax 97's", price: 3500, img: "Nike_Airmax_97's.jpg" },
    "santoni_loafers": { name: "Santoni loafers", price: 5000, img: "Santoni_loafers.jpg" }
};

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

    if (window.location.pathname.includes('product-details.html')) {
        loadProductDetails();
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
    if (popup) {
        popup.style.display = (popup.style.display === "none" || popup.style.display === "") ? "block" : "none";
    }
}

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
    }
}

function addDetailedItemToCart() {
    const name = document.getElementById('shoeName').innerText;
    const priceText = document.getElementById('shoePrice').innerText;
    const price = parseInt(priceText.replace('Ksh ', '').replace(',', ''));
    const size = document.getElementById('shoeSize').value;

    addToCart(`${name} (Size ${size})`, price);
    document.getElementById('addedMsg').innerText = `✅ Added Size ${size}!`;
    setTimeout(() => { document.getElementById('addedMsg').innerText = ""; }, 2000);
}

function checkout() {
    if (cart.length === 0) return alert("Cart empty!");
    
    const totalAmount = document.getElementById("cart-total").innerText;
    const clientName = localStorage.getItem('username') || "Guest Customer";

    let message = `*NEW ORDER - SHOE PLUG KENYA*\n\n`;
    message += `*Customer:* ${clientName}\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (x${item.quantity}) - Ksh ${item.price * item.quantity}\n`;
    });
    message += `\n*Total: Ksh ${totalAmount}*`;

    const myPhoneNumber = "254110974624"; 
    window.open(`https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(message)}`, '_blank');

    cart = [];
    saveCart();
    toggleCart();
}
