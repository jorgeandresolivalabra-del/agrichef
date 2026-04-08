// Catálogo de productos
const products = [
    { id: 1, name: "Kale Orgánico", category: "Verde hoja", price: 6.90, description: "Rica en antioxidantes, crujiente y fresca. Cosecha ecológica.", imageLabel: "🥬", bgGradient: "linear-gradient(135deg, #b7d968, #6c9e3f)" },
    { id: 2, name: "Kimchi Tradicional", category: "Fermentado picante", price: 8.50, description: "Repollo coreano fermentado, especias auténticas, probióticos naturales.", imageLabel: "🌶️🥬", bgGradient: "linear-gradient(145deg, #d84c2c, #b13a1a)" },
    { id: 3, name: "Pescado Ahumado", category: "Ahumado en frío", price: 14.90, description: "Salmón noruego ahumado artesanalmente con madera de roble.", imageLabel: "🐟🔥", bgGradient: "linear-gradient(120deg, #f6ab6c, #e07c3c)" },
    { id: 4, name: "Sierra (Pescado)", category: "Pescado fresco", price: 12.50, description: "Sierra salvaje de costa, filete jugoso, ideal a la parrilla.", imageLabel: "🐟⚡", bgGradient: "linear-gradient(115deg, #6b9fc7, #2f6d8f)" }
];

let cart = [];

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const cartCountSpan = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalAmountSpan = document.getElementById("cartTotalAmount");
const cartIconBtn = document.getElementById("cartIconBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");
const closeCartBtn = document.getElementById("closeCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

function showToast(message) {
    const toast = document.getElementById("toastMsg");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
}

function saveCart() { localStorage.setItem("agrichefCart", JSON.stringify(cart)); }
function loadCart() {
    const stored = localStorage.getItem("agrichefCart");
    cart = stored ? JSON.parse(stored) : [];
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart">🛒 Tu cesta está vacía.<br>Añade productos deliciosos</div>`;
        cartTotalAmountSpan.textContent = `0 €`;
        return;
    }
    
    let cartHTML = "", total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        cartHTML += `
            <div class="cart-item">
                <div><h4>${item.name}</h4><p>${item.price.toFixed(2)} € c/u</p></div>
                <div class="cart-item-actions">
                    <button class="cart-decr" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="cart-incr" data-id="${item.id}">+</button>
                    <button class="cart-remove" data-id="${item.id}">✕</button>
                </div>
            </div>`;
    });
    cartItemsContainer.innerHTML = cartHTML;
    cartTotalAmountSpan.textContent = `${total.toFixed(2)} €`;
    
    document.querySelectorAll('.cart-decr').forEach(btn => btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1)));
    document.querySelectorAll('.cart-incr').forEach(btn => btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1)));
    document.querySelectorAll('.cart-remove').forEach(btn => btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.id))));
}

function updateQuantity(id, delta) {
    const index = cart.findIndex(i => i.id === id);
    if (index !== -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        saveCart();
        updateCartUI();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
    showToast("Producto eliminado");
}

function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    existing ? existing.quantity++ : cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    saveCart();
    updateCartUI();
    showToast(`✨ ${product.name} añadido`);
}

function renderProducts() {
    productsGrid.innerHTML = products.map(prod => `
        <div class="product-card">
            <div class="product-img" style="background: ${prod.bgGradient}">
                <span style="font-size:4rem">${prod.imageLabel}</span>
                <div class="badge-category">${prod.category}</div>
            </div>
            <div class="product-info">
                <div class="product-title"><span>${prod.name}</span><span class="product-price">${prod.price.toFixed(2)}€</span></div>
                <div class="product-desc">${prod.description}</div>
                <button class="add-to-cart" data-id="${prod.id}"><i class="fas fa-cart-plus"></i> Añadir</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => addToCart(products.find(p => p.id === parseInt(btn.dataset.id))));
    });
}

function openCart() { cartSidebar.classList.add("open"); cartOverlay.classList.add("active"); document.body.style.overflow = "hidden"; }
function closeCart() { cartSidebar.classList.remove("open"); cartOverlay.classList.remove("active"); document.body.style.overflow = ""; }
function handleCheckout() {
    if (cart.length === 0) return showToast("Carrito vacío");
    showToast(`✅ Pedido realizado! Total: ${cart.reduce((s,i)=>s+(i.price*i.quantity),0).toFixed(2)} €`);
    cart = []; saveCart(); updateCartUI(); closeCart();
}

// Inicialización
renderProducts();
loadCart();
cartIconBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
checkoutBtn.addEventListener("click", handleCheckout);
document.addEventListener("keydown", (e) => e.key === "Escape" && cartSidebar.classList.contains("open") && closeCart());