// ================================
// Product Details Page
// ================================

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));
    const product = products.find(item => item.id === productId);

    if (!product) {
        document.querySelector("main").innerHTML = `
            <section class="section">
                <h1>Product Not Found</h1>
                <p>The product you are looking for does not exist.</p>
                <br>
                <a href="products.html" class="btn primary">Back to Products</a>
            </section>
        `;
        return;
    }

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
    renderRelatedProducts(product);
});

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function setupProductGallery(product) {
    const productImage = document.getElementById("productImage");
    const productThumbs = document.getElementById("productThumbs");

    const galleryImages = [
        product.image,
        product.image,
        product.image
    ];

    if (productImage) {
        productImage.src = galleryImages[0];
        productImage.alt = product.name;
    }

    if (!productThumbs) return;

    productThumbs.innerHTML = galleryImages.map((image, index) => `
        <button class="thumb-btn ${index === 0 ? "active" : ""}" type="button" aria-label="View image ${index + 1}">
            <img src="${image}" alt="${product.name} view ${index + 1}">
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
                    ${size}
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
                    ${color}
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

function updateDetailWishlistButton(productId) {
    const detailWishlistBtn = document.getElementById("detailWishlistBtn");
    if (!detailWishlistBtn) return;

    const wished = isWishlisted(productId);
    detailWishlistBtn.classList.toggle("active", wished);
    detailWishlistBtn.textContent = wished ? "♥ Remove from Wishlist" : "♡ Add to Wishlist";
}

function renderRelatedProducts(currentProduct) {
    const relatedProducts = document.getElementById("relatedProducts");
    if (!relatedProducts) return;

    const related = products
        .filter(item => item.category === currentProduct.category && item.id !== currentProduct.id);

    relatedProducts.classList.add("related-scroller");

    relatedProducts.innerHTML = related.length
        ? related.map(productCard).join("")
        : `<p class="empty-state">No related products available.</p>`;
}
