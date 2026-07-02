// =====================================
// Style Haven - Firebase First Product Page
// =====================================

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const STORE_PHONE_NUMBER =
    (typeof CONFIG !== "undefined" && CONFIG.whatsapp)
        ? CONFIG.whatsapp
        : "919999999999";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        showProductNotFound();
        return;
    }

    const product = await loadProduct(productId);

    if (!product) {
        showProductNotFound();
        return;
    }

    renderProduct(product);
    renderRelatedProducts(product);
});

async function loadProduct(productId) {
    try {
        const snapshot = await getDoc(doc(db, "products", productId));
        if (!snapshot.exists()) return null;
        return normalizeProduct(snapshot.id, snapshot.data());
    } catch (error) {
        console.error("Unable to load product:", error);
        return null;
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
        stock: data.stock !== false
    };
}

function renderProduct(product) {
    document.title = `${product.name} | Style Haven`;

    setText("breadcrumbName", product.name);
    setText("productCategory", product.category);
    setText("productName", product.name);
    setText("productSubtitle", product.short);
    setText("productPrice", product.price);
    setText("productDescription", product.description);
    setText("productFabric", product.fabric);
    setText("productDisplayColor", product.colors.join(", "));
    setText("productComposition", product.fabric);

    setupProductGallery(product);
    renderProductOptions(product);
    setupProductActions(product);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value || "";
}

function setupProductGallery(product) {
    const productImage = document.getElementById("productImage");
    const productThumbs = document.getElementById("productThumbs");
    const galleryImages = product.images.length ? product.images : [product.image];

    if (productImage) {
        productImage.src = galleryImages[0];
        productImage.alt = product.name;
    }

    if (!productThumbs) return;

    productThumbs.innerHTML = galleryImages.map((image, index) => `
        <button class="thumb-btn ${index === 0 ? "active" : ""}" type="button" aria-label="View image ${index + 1}">
            <img src="${image}" alt="${escapeHtml(product.name)} view ${index + 1}">
        </button>
    `).join("");

    productThumbs.querySelectorAll(".thumb-btn").forEach((button, index) => {
        button.addEventListener("click", () => {
            productImage.src = galleryImages[index];
            productThumbs.querySelectorAll(".thumb-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
}

function renderProductOptions(product) {
    const sizeContainer = document.getElementById("sizeContainer");
    if (sizeContainer) {
        sizeContainer.innerHTML = product.sizes
            .map((size, index) => `
                <button class="size-badge ${index === 0 ? "selected" : ""}" type="button">
                    ${escapeHtml(size)}
                </button>
            `)
            .join("");

        sizeContainer.querySelectorAll(".size-badge").forEach(button => {
            button.addEventListener("click", () => {
                sizeContainer.querySelectorAll(".size-badge").forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
            });
        });
    }

    const colorContainer = document.getElementById("colorContainer");
    if (colorContainer) {
        colorContainer.innerHTML = product.colors
            .map((color, index) => `
                <button class="color-badge ${index === 0 ? "selected" : ""}" type="button">
                    ${escapeHtml(color)}
                </button>
            `)
            .join("");

        colorContainer.querySelectorAll(".color-badge").forEach(button => {
            button.addEventListener("click", () => {
                colorContainer.querySelectorAll(".color-badge").forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
            });
        });
    }
}

function setupProductActions(product) {
    const orderBtn = document.getElementById("orderBtn");
    if (orderBtn) {
        orderBtn.href = getWhatsAppOrderLink(product);
    }

    const detailWishlistBtn = document.getElementById("detailWishlistBtn");
    if (detailWishlistBtn) {
        updateDetailWishlistButton(product.id);

        detailWishlistBtn.addEventListener("click", () => {
            toggleWishlist(product.id);
            updateDetailWishlistButton(product.id);
        });
    }
}

function getWhatsAppOrderLink(product) {
    const selectedSize = document.querySelector(".size-badge.selected")?.textContent?.trim() || "";
    const selectedColor = document.querySelector(".color-badge.selected")?.textContent?.trim() || "";

    const message = `Hi, I would like to order:

Product: ${product.name}
Price: ${product.price}
Size: ${selectedSize}
Color: ${selectedColor}

Please share delivery details.`;

    return `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

function getWishlist() {
    try {
        const value = JSON.parse(localStorage.getItem("styleHavenWishlist") || "[]");
        return Array.isArray(value) ? value.map(String) : [];
    } catch {
        localStorage.removeItem("styleHavenWishlist");
        return [];
    }
}

function saveWishlist(ids) {
    localStorage.setItem("styleHavenWishlist", JSON.stringify(ids.map(String)));
    document.querySelectorAll("#wishlistCount").forEach(element => {
        element.textContent = ids.length;
    });
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
}

function updateDetailWishlistButton(productId) {
    const detailWishlistBtn = document.getElementById("detailWishlistBtn");
    if (!detailWishlistBtn) return;

    const wished = isWishlisted(productId);
    detailWishlistBtn.classList.toggle("active", wished);
    detailWishlistBtn.textContent = wished ? "♥ Remove from Wishlist" : "♡ Add to Wishlist";
}

async function renderRelatedProducts(currentProduct) {
    const relatedProducts = document.getElementById("relatedProducts");
    if (!relatedProducts) return;

    try {
        const relatedQuery = query(
            collection(db, "products"),
            where("category", "==", currentProduct.category),
            limit(8)
        );

        const snapshot = await getDocs(relatedQuery);
        const related = snapshot.docs
            .filter(item => item.id !== currentProduct.id)
            .map(item => normalizeProduct(item.id, item.data()));

        relatedProducts.classList.add("related-scroller");

        relatedProducts.innerHTML = related.length
            ? related.map(productCard).join("")
            : `<p class="empty-state">No related products available.</p>`;
    } catch (error) {
        console.error("Unable to load related products:", error);
        relatedProducts.innerHTML = `<p class="empty-state">No related products available.</p>`;
    }
}

function productCard(product) {
    return `
        <article class="product-card">
            <a href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${escapeHtml(product.name)}">
                <img src="${product.image}" alt="${escapeHtml(product.name)}">
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

function showProductNotFound() {
    document.querySelector("main").innerHTML = `
        <section class="section">
            <h1>Product Not Found</h1>
            <p>The product you are looking for does not exist.</p>
            <br>
            <a href="products.html" class="btn primary">Back to Products</a>
        </section>
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
