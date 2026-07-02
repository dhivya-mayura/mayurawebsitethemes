// ================================
// Product Details Page
// ================================

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// Find selected product
const product = products.find(p => p.id === productId);

// Redirect if product not found
if (!product) {
    document.body.innerHTML = `
        <section class="section">
            <h2>Product Not Found</h2>
            <p>The product you are looking for does not exist.</p>
            <br>
            <a href="products.html" class="btn primary">
                Back to Products
            </a>
        </section>
    `;
    throw new Error("Product not found");
}

// ================================
// Populate Product Details
// ================================

document.getElementById("breadcrumbName").textContent = product.name;

document.getElementById("productImage").src = product.image;
document.getElementById("productImage").alt = product.name;

document.getElementById("productCategory").textContent = product.category;

document.getElementById("productName").textContent = product.name;

document.getElementById("productPrice").textContent = product.price;

document.getElementById("productDescription").textContent =
    product.description;

document.getElementById("productFabric").textContent =
    product.fabric;


// ================================
// Sizes
// ================================

const sizeContainer = document.getElementById("sizeContainer");

sizeContainer.innerHTML = "";

product.sizes.forEach(size => {

    sizeContainer.innerHTML += `
        <span class="size-badge">
            ${size}
        </span>
    `;

});


// ================================
// Colors
// ================================

const colorContainer = document.getElementById("colorContainer");

colorContainer.innerHTML = "";

product.colors.forEach(color => {

    colorContainer.innerHTML += `
        <span class="color-badge">
            ${color}
        </span>
    `;

});


// ================================
// WhatsApp Button
// ================================

const phoneNumber = "919999999999"; // Replace with your number

const message = `Hi,

I would like to order:

Product: ${product.name}
Price: ${product.price}

Please let me know the available sizes and delivery details.

Thank you.`;

document.getElementById("orderBtn").href =
`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


// ================================
// Related Products
// ================================

const relatedProducts = document.getElementById("relatedProducts");

const related = products.filter(item =>

    item.category === product.category &&
    item.id !== product.id

);

if (related.length === 0) {

    relatedProducts.innerHTML = `
        <p>No related products available.</p>
    `;

}
else {

    relatedProducts.innerHTML = related.map(item => `

        <article class="product-card">

            <a href="product.html?id=${item.id}">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </a>

            <div class="product-info">

                <p>${item.category}</p>

                <h3>${item.name}</h3>

                <span class="price">
                    ${item.price}
                </span>

                <br><br>

                <a
                    href="product.html?id=${item.id}"
                    class="order-link"
                >
                    View Details
                </a>

            </div>

        </article>

    `).join("");

}
