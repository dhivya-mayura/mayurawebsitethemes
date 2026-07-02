// ======================================
// PRODUCTS DATA
// ======================================

const products = [

{
    id: 1,
    name: "Floral Cotton Kurti",
    category: "Women",
    price: "₹999",
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=900&q=80",

    description:
        "Soft floral printed cotton kurti designed for all-day comfort. Perfect for office wear, casual outings, and festive occasions.",

    fabric: "100% Cotton",

    sizes: ["S", "M", "L", "XL"],

    colors: ["Pink", "Blue", "White"]
},

{
    id: 2,
    name: "Men's Casual Shirt",
    category: "Men",
    price: "₹1,199",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",

    description:
        "Premium slim-fit casual shirt made with breathable cotton fabric for everyday comfort and style.",

    fabric: "Cotton Blend",

    sizes: ["M", "L", "XL", "XXL"],

    colors: ["White", "Black", "Blue"]
},

{
    id: 3,
    name: "Elegant Ethnic Dress",
    category: "Ethnic Wear",
    price: "₹1,799",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",

    description:
        "Beautiful ethnic wear crafted with premium fabric for weddings, festivals and traditional celebrations.",

    fabric: "Silk Blend",

    sizes: ["S", "M", "L"],

    colors: ["Maroon", "Green", "Gold"]
},

{
    id: 4,
    name: "Kids Denim Jacket",
    category: "Kids",
    price: "₹899",
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80",

    description:
        "Comfortable denim jacket for kids with durable stitching and a trendy everyday look.",

    fabric: "Denim",

    sizes: ["2-3Y", "4-5Y", "6-7Y"],

    colors: ["Blue", "Black"]
}

];

// ======================================
// MENU
// ======================================

const navMenu = document.getElementById("navMenu");
const menuBtn = document.getElementById("menuBtn");

if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

    navMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

        });

    });

}

// ======================================
// WHATSAPP LINK
// ======================================

function getWhatsAppLink(productName = "our clothing collection") {

    const phoneNumber = "919999999999"; // Replace with your WhatsApp number

    const message = `Hi,

I am interested in:

${productName}

Please share available sizes and delivery details.

Thank you.`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

}

// ======================================
// PRODUCT GRID
// ======================================

const productGrid = document.getElementById("productGrid");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

// ======================================
// RENDER PRODUCTS
// ======================================

function renderProducts() {

    if (!productGrid) return;

    const searchText = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "All";

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `
            <p class="empty-message">
                No products found.
            </p>
        `;

        return;

    }

    productGrid.innerHTML = filteredProducts.map(product => `

        <article class="product-card">

            <a href="product.html?id=${product.id}">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </a>

            <div class="product-info">

                <p>${product.category}</p>

                <h3>

                    <a
                        href="product.html?id=${product.id}"
                        style="text-decoration:none;color:inherit;"
                    >

                        ${product.name}

                    </a>

                </h3>

                <span class="price">

                    ${product.price}

                </span>

                <br><br>

                <a
                    href="product.html?id=${product.id}"
                    class="order-link"
                >
                    View Details
                </a>

            </div>

        </article>

    `).join("");

}

// ======================================
// EVENTS
// ======================================

if (searchInput) {

    searchInput.addEventListener("input", renderProducts);

}

if (categoryFilter) {

    categoryFilter.addEventListener("change", renderProducts);

}

// ======================================
// HOMEPAGE WHATSAPP BUTTON
// ======================================

const whatsappBtn = document.getElementById("whatsappBtn");

if (whatsappBtn) {

    whatsappBtn.href = getWhatsAppLink();

}

// ======================================
// INITIAL LOAD
// ======================================

renderProducts();
