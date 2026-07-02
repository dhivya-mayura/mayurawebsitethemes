const products = [
  {
    name: "Floral Cotton Kurti",
    category: "Women",
    price: "₹999",
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Men's Casual Shirt",
    category: "Men",
    price: "₹1,199",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Elegant Ethnic Dress",
    category: "Ethnic Wear",
    price: "₹1,799",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kids Denim Jacket",
    category: "Kids",
    price: "₹899",
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80"
  }
];

const navMenu = document.getElementById("navMenu");
const menuBtn = document.getElementById("menuBtn");
const productGrid = document.getElementById("productGrid");
const whatsappBtn = document.getElementById("whatsappBtn");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

function getWhatsAppLink(productName = "your clothing collection") {
  const phoneNumber = "919999999999"; // Replace with your WhatsApp Business number
  const message = `Hi, I am interested in ${productName}.`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function renderProducts() {
  if (!productGrid) return;

  const searchText = searchInput ? searchInput.value.toLowerCase() : "";
  const selectedCategory = categoryFilter ? categoryFilter.value : "All";

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <p>${product.category}</p>
            <h3>${product.name}</h3>
            <span class="price">${product.price}</span>
            <a class="order-link" href="${getWhatsAppLink(product.name)}" target="_blank" rel="noopener">Order on WhatsApp</a>
          </div>
        </article>
      `
    )
    .join("");

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `<p class="empty-message">No products found.</p>`;
  }
}

if (searchInput) searchInput.addEventListener("input", renderProducts);
if (categoryFilter) categoryFilter.addEventListener("change", renderProducts);

if (whatsappBtn) {
  whatsappBtn.href = getWhatsAppLink();
}

renderProducts();
