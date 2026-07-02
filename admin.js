// =====================================
// Style Haven Admin Demo Script
// This version stores admin products in localStorage.
// Later, this can be connected to Firebase Firestore.
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    setupAdminLogin();
    setupAdminDashboard();
});

function setupAdminLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const message = document.getElementById("loginMessage");

        if (!email || !password) {
            message.textContent = "Please enter email and password.";
            return;
        }

        localStorage.setItem("styleHavenAdminLoggedIn", "true");
        window.location.href = "admin.html";
    });
}

function setupAdminDashboard() {
    const productForm = document.getElementById("productForm");
    const list = document.getElementById("adminProductList");

    if (!productForm || !list) return;

    if (localStorage.getItem("styleHavenAdminLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", event => {
            event.preventDefault();
            localStorage.removeItem("styleHavenAdminLoggedIn");
            window.location.href = "login.html";
        });
    }

    const resetBtn = document.getElementById("resetFormBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetAdminForm);
    }

    productForm.addEventListener("submit", event => {
        event.preventDefault();
        saveAdminProduct();
    });

    renderAdminProducts();
}

function getAdminProducts() {
    return JSON.parse(localStorage.getItem("styleHavenAdminProducts") || "[]");
}

function saveAdminProducts(items) {
    localStorage.setItem("styleHavenAdminProducts", JSON.stringify(items));
}

function saveAdminProduct() {
    const message = document.getElementById("adminMessage");
    const products = getAdminProducts();

    const existingId = document.getElementById("productId").value;
    const product = {
        id: existingId ? Number(existingId) : Date.now(),
        name: document.getElementById("adminProductName").value.trim(),
        category: document.getElementById("adminProductCategory").value,
        price: document.getElementById("adminProductPrice").value.trim(),
        image: document.getElementById("adminProductImage").value.trim(),
        short: document.getElementById("adminProductShort").value.trim(),
        description: document.getElementById("adminProductDescription").value.trim(),
        fabric: document.getElementById("adminProductFabric").value.trim(),
        sizes: document.getElementById("adminProductSizes").value.split(",").map(item => item.trim()).filter(Boolean),
        colors: document.getElementById("adminProductColors").value.split(",").map(item => item.trim()).filter(Boolean)
    };

    const index = products.findIndex(item => item.id === product.id);

    if (index >= 0) {
        products[index] = product;
    } else {
        products.push(product);
    }

    saveAdminProducts(products);
    resetAdminForm();
    renderAdminProducts();

    if (message) {
        message.textContent = "Product saved successfully.";
    }
}

function renderAdminProducts() {
    const list = document.getElementById("adminProductList");
    if (!list) return;

    const products = getAdminProducts();

    list.innerHTML = products.length
        ? products.map(product => `
            <article class="admin-product-row">
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p>${product.category} | ${product.price}</p>
                </div>
                <div class="admin-row-actions">
                    <button type="button" onclick="editAdminProduct(${product.id})">Edit</button>
                    <button type="button" onclick="deleteAdminProduct(${product.id})">Delete</button>
                </div>
            </article>
        `).join("")
        : `<p class="empty-state">No admin products added yet.</p>`;
}

function editAdminProduct(id) {
    const product = getAdminProducts().find(item => item.id === id);
    if (!product) return;

    document.getElementById("productId").value = product.id;
    document.getElementById("adminProductName").value = product.name;
    document.getElementById("adminProductCategory").value = product.category;
    document.getElementById("adminProductPrice").value = product.price;
    document.getElementById("adminProductImage").value = product.image;
    document.getElementById("adminProductShort").value = product.short;
    document.getElementById("adminProductDescription").value = product.description;
    document.getElementById("adminProductFabric").value = product.fabric;
    document.getElementById("adminProductSizes").value = product.sizes.join(", ");
    document.getElementById("adminProductColors").value = product.colors.join(", ");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteAdminProduct(id) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    saveAdminProducts(getAdminProducts().filter(item => item.id !== id));
    renderAdminProducts();
}

function resetAdminForm() {
    const form = document.getElementById("productForm");
    if (form) form.reset();

    const productId = document.getElementById("productId");
    if (productId) productId.value = "";
}
