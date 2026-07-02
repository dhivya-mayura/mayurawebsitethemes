// =====================================
// Style Haven - Firebase First Main Script
// Products are loaded only from Firestore.
// =====================================

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const STORE_PHONE_NUMBER =
    (typeof CONFIG !== "undefined" && CONFIG.whatsapp)
        ? CONFIG.whatsapp
        : "919999999999";

let products = [];

document.addEventListener("DOMContentLoaded", async () => {
    setupMobileMenu();
    setupWhatsAppContact();
    updateWishlistCount();

    await loadProductsFromFirestore();

    renderHomeArrivals();
    renderProductsPage();
    renderWishlistPage();

    window.styleHaven = {
        products,
        productCard,
        getWhatsAppOrderLink,
        isWishlisted,
        toggleWishlist,
        reloadProducts: loadProductsFromFirestore
    };
});

async function loadProductsFromFirestore() {
    try {
        const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(productsQuery);

        products = snapshot.docs.map(doc => normalizeProduct(doc.id, doc.data()));
        return products;
    } catch (error) {
        console.error("Could not load products from Firestore:", error);
        products = [];
        showFirestoreError();
        return products;
    }
}

function normalizeProduct(id, data) {
    const sizes = Array.isArray(data.sizes)
        ? data.sizes
        : String(data.sizes || "").split(",").map(item => item.trim()).filter(Boolean);

    const colors = Array.isArray(data.colors)
        ? data.colors
        : String(data.colors || "").split(",").map(item => item.trim()).filter(Boolean);

    const images = Array.isArray(data.images)
        ? data.images.filter(Boolean)
        : [data.image].filter(Boolean);

    return {
        id,
        name: data.name || "Untitled Product",
        category: data.category || "Women",
        price: data.price || "₹0",
        image: data.image || images[0] || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900",
        images,
        short: data.short || "",
        description: data.description || "",
        fabric: data.fabric || data.composition || "Cotton",
        sizes,
        colors,
        stock: data.stock !== false,
        featured: data.featured === true,
        createdAt: data.createdAt || null
    };
}

function showFirestoreError() {
    const grids = [
        document.getElementById("productGrid"),
        document.getElementById("newArrivalsGrid"),
        document.getElementById("wishlistGrid")
    ];

    grids.forEach(grid => {
        if (grid) {
            grid.innerHTML = `
                <div class="premium-empty-wishlist">
                    <div class="empty-heart">!</div>
                    <h2>Unable to load products</h2>
                    <p>Please check Firebase Firestore rules and connection.</p>
                </div>
            `;
        }
    });
}

function setupMobileMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const isOpen = navMenu.classList.contains("active");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.textContent = isOpen ? "✕" : "☰";
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.textContent = "☰";
        });
    });
}

function setupWhatsAppContact() {
    const whatsappBtn = document.getElementById("whatsappBtn");
    if (!whatsappBtn) return;

    const message = "Hi, I would like to know more about Style Haven products.";
    whatsappBtn.href = `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

function productCard(product) {
    const wished = isWishlisted(product.id);
    const heart = wished ? "♥" : "♡";
    const label = wished ? "Remove from wishlist" : "Add to wishlist";

    return `
        <article class="product-card">
            <button
                class="wishlist-btn ${wished ? "active" : ""}"
                data-product-id="${product.id}"
                aria-label="${label}">
                ${heart}
            </button>

            <a href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${escapeHtml(product.name)}">
                <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
            </a>

            <div class="product-info">
                <p class="product-category">${escapeHtml(product.category)}</p>

                <a class="product-link" href="product.html?id=${encodeURIComponent(product.id)}">
                    <h3>${escapeHtml(product.name)}</h3>
                </a>

                <p class="product-short">${escapeHtml(product.short)}</p>
                <span class="price">${escapeHtml(product.price)}</span>

                <div class="product-buttons">
                    <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn secondary">Details</a>
                    <a href="${getWhatsAppOrderLink(product)}" class="order-link" target="_blank" rel="noopener">Order</a>
                </div>
            </div>
        </article>
    `;
}

function getWhatsAppOrderLink(product) {
    const message = `Hi, I would like to order ${product.name} (${product.price}). Please share size, color, and delivery details.`;
    return `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderHomeArrivals() {
    const grid = document.getElementById("newArrivalsGrid");
    if (!grid) return;

    const visibleProducts = products.slice(0, 4);

    grid.innerHTML = visibleProducts.length
        ? visibleProducts.map(productCard).join("")
        : emptyProductsMessage("No products added yet", "Login to admin and add products from Firestore.");
}

function renderProductsPage() {
    const grid = document.getElementById("productGrid");
    const filterBar = document.getElementById("filterBar");

    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    let selectedCategory = params.get("category") || "All";

    function render(category) {
        const visibleProducts = category === "All"
            ? products
            : products.filter(product => product.category === category);

        grid.innerHTML = visibleProducts.length
            ? visibleProducts.map(productCard).join("")
            : emptyProductsMessage("No products found", "Add products in this category from the admin dashboard.");

        if (filterBar) {
            filterBar.querySelectorAll(".filter-btn").forEach(button => {
                button.classList.toggle("active", button.dataset.category === category);
            });
        }
    }

    if (filterBar) {
        filterBar.querySelectorAll(".filter-btn").forEach(button => {
            button.addEventListener("click", () => {
                selectedCategory = button.dataset.category;
                const newUrl = selectedCategory === "All"
                    ? "products.html"
                    : `products.html?category=${encodeURIComponent(selectedCategory)}`;
                history.replaceState(null, "", newUrl);
                render(selectedCategory);
            });
        });
    }

    render(selectedCategory);
}

function emptyProductsMessage(title, message) {
    return `
        <div class="premium-empty-wishlist">
            <div class="empty-heart">+</div>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(message)}</p>
            <a href="login.html" class="btn primary">Go to Admin</a>
        </div>
    `;
}

// Wishlist
function getWishlist() {
    try {
        const value = JSON.parse(localStorage.getItem("styleHavenWishlist") || "[]");
        return Array.isArray(value) ? value.map(String) : [];
    } catch (error) {
        localStorage.removeItem("styleHavenWishlist");
        return [];
    }
}

function saveWishlist(ids) {
    localStorage.setItem("styleHavenWishlist", JSON.stringify(ids.map(String)));
    updateWishlistCount();
}

function isWishlisted(productId) {
    return getWishlist().includes(String(productId));
}

function toggleWishlist(productId) {
    productId = String(productId);
    const wishlist = getWishlist();

    if (wishlist.includes(productId)) {
        saveWishlist(wishlist.filter(id => id !== productId));
    } else {
        saveWishlist([...wishlist, productId]);
    }

    refreshWishlistButtons();
    renderWishlistPage();
}

function updateWishlistCount() {
    const count = getWishlist().length;
    document.querySelectorAll("#wishlistCount").forEach(element => {
        element.textContent = count;
    });
}

function refreshWishlistButtons() {
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        const productId = String(button.dataset.productId);
        const wished = isWishlisted(productId);

        button.classList.toggle("active", wished);
        button.textContent = wished ? "♥" : "♡";
        button.setAttribute("aria-label", wished ? "Remove from wishlist" : "Add to wishlist");
    });
}

document.addEventListener("click", event => {
    const wishlistButton = event.target.closest(".wishlist-btn");
    if (wishlistButton) {
        event.preventDefault();
        toggleWishlist(wishlistButton.dataset.productId);
    }

    const removeButton = event.target.closest(".remove-wishlist-btn");
    if (removeButton) {
        event.preventDefault();
        toggleWishlist(removeButton.dataset.productId);
    }

    const clearButton = event.target.closest("#clearWishlistBtn");
    if (clearButton) {
        saveWishlist([]);
        renderWishlistPage();
        refreshWishlistButtons();
    }
});

function renderWishlistPage() {
    const wishlistGrid = document.getElementById("wishlistGrid");
    if (!wishlistGrid) return;

    const wishlistIds = getWishlist();
    const wishlistProducts = products.filter(product => wishlistIds.includes(String(product.id)));

    wishlistGrid.innerHTML = wishlistProducts.length
        ? wishlistProducts.map(wishlistItem).join("")
        : `
            <div class="premium-empty-wishlist">
                <div class="empty-heart">♡</div>
                <h2>Your wishlist is empty</h2>
                <p>Save your favorite products by clicking the heart icon on any product.</p>
                <a href="products.html" class="btn primary">Explore Products</a>
            </div>
        `;

    const clearBtn = document.getElementById("clearWishlistBtn");
    if (clearBtn) {
        clearBtn.style.display = wishlistProducts.length ? "inline-flex" : "none";
    }
}

function wishlistItem(product) {
    return `
        <article class="wishlist-item">
            <a class="wishlist-image" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${escapeHtml(product.name)}">
                <img src="${product.image}" alt="${escapeHtml(product.name)}">
            </a>

            <div class="wishlist-details">
                <p class="product-category">${escapeHtml(product.category)}</p>
                <a class="product-link" href="product.html?id=${encodeURIComponent(product.id)}">
                    <h3>${escapeHtml(product.name)}</h3>
                </a>
                <p>${escapeHtml(product.short)}</p>

                <div class="wishlist-meta">
                    <span class="price">${escapeHtml(product.price)}</span>
                    <span>Fabric: ${escapeHtml(product.fabric)}</span>
                </div>

                <div class="wishlist-actions">
                    <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn secondary">View Details</a>
                    <a href="${getWhatsAppOrderLink(product)}" class="order-link" target="_blank" rel="noopener">Order on WhatsApp</a>
                    <button class="remove-wishlist-btn" data-product-id="${product.id}" type="button">
                        Remove
                    </button>
                </div>
            </div>
        </article>
    `;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
