// =====================================
// Style Haven - Firebase First Admin
// Firebase Auth + Firestore + Storage URL support
// =====================================

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { auth, db } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
    setupAdminLogin();
    setupAdminDashboard();
});

function setupAdminLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    onAuthStateChanged(auth, user => {
        if (user) {
            window.location.href = "admin.html";
        }
    });

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const message = document.getElementById("loginMessage");

        try {
            message.textContent = "Logging in...";
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "admin.html";
        } catch (error) {
            console.error("Login failed:", error);
            message.textContent = "Login failed. Check your Firebase Authentication user.";
        }
    });
}

function setupAdminDashboard() {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("adminProductList");

    if (!productForm || !productList) return;

    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }

        renderAdminProducts();
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async event => {
            event.preventDefault();
            await signOut(auth);
            window.location.href = "login.html";
        });
    }

    const resetBtn = document.getElementById("resetFormBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetAdminForm);
    }

    productForm.addEventListener("submit", async event => {
        event.preventDefault();
        await saveAdminProduct();
    });
}

async function saveAdminProduct() {
    const message = document.getElementById("adminMessage");
    const existingId = document.getElementById("productId").value;

    const imageInput = document.getElementById("adminProductImage").value.trim();
    const additionalImages = csvToArray(document.getElementById("adminProductImages")?.value || "");

    const images = [imageInput, ...additionalImages].filter(Boolean);

    const product = {
        name: document.getElementById("adminProductName").value.trim(),
        category: document.getElementById("adminProductCategory").value,
        price: document.getElementById("adminProductPrice").value.trim(),
        image: imageInput,
        images,
        short: document.getElementById("adminProductShort").value.trim(),
        description: document.getElementById("adminProductDescription").value.trim(),
        fabric: document.getElementById("adminProductFabric").value.trim(),
        sizes: csvToArray(document.getElementById("adminProductSizes").value),
        colors: csvToArray(document.getElementById("adminProductColors").value),
        stock: true,
        featured: false,
        updatedAt: serverTimestamp()
    };

    if (!product.name || !product.price || !product.image) {
        message.textContent = "Please fill product name, price, and image URL.";
        return;
    }

    try {
        message.textContent = "Saving product...";

        if (existingId) {
            await updateDoc(doc(db, "products", existingId), product);
        } else {
            product.createdAt = serverTimestamp();
            await addDoc(collection(db, "products"), product);
        }

        resetAdminForm();
        await renderAdminProducts();
        message.textContent = "Product saved successfully.";
    } catch (error) {
        console.error("Product save failed:", error);
        message.textContent = "Unable to save product. Check Firestore rules.";
    }
}

async function renderAdminProducts() {
    const list = document.getElementById("adminProductList");
    if (!list) return;

    list.innerHTML = `<p class="empty-state">Loading products...</p>`;

    try {
        const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(productsQuery);

        if (snapshot.empty) {
            list.innerHTML = `<p class="empty-state">No products added yet.</p>`;
            return;
        }

        list.innerHTML = snapshot.docs.map(item => {
            const product = item.data();

            return `
                <article class="admin-product-row">
                    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
                    <div>
                        <h3>${escapeHtml(product.name)}</h3>
                        <p>${escapeHtml(product.category)} | ${escapeHtml(product.price)}</p>
                    </div>
                    <div class="admin-row-actions">
                        <button type="button" data-edit-id="${item.id}">Edit</button>
                        <button type="button" data-delete-id="${item.id}">Delete</button>
                    </div>
                </article>
            `;
        }).join("");

        list.querySelectorAll("[data-edit-id]").forEach(button => {
            button.addEventListener("click", () => editAdminProduct(button.dataset.editId, snapshot));
        });

        list.querySelectorAll("[data-delete-id]").forEach(button => {
            button.addEventListener("click", () => deleteAdminProduct(button.dataset.deleteId));
        });
    } catch (error) {
        console.error("Unable to load admin products:", error);
        list.innerHTML = `<p class="empty-state">Unable to load products. Check Firestore rules.</p>`;
    }
}

function editAdminProduct(id, snapshot) {
    const found = snapshot.docs.find(item => item.id === id);
    if (!found) return;

    const product = found.data();

    document.getElementById("productId").value = id;
    document.getElementById("adminProductName").value = product.name || "";
    document.getElementById("adminProductCategory").value = product.category || "Women";
    document.getElementById("adminProductPrice").value = product.price || "";
    document.getElementById("adminProductImage").value = product.image || "";
    const extraImages = Array.isArray(product.images)
        ? product.images.filter(image => image !== product.image)
        : [];
    const extraInput = document.getElementById("adminProductImages");
    if (extraInput) extraInput.value = extraImages.join(", ");

    document.getElementById("adminProductShort").value = product.short || "";
    document.getElementById("adminProductDescription").value = product.description || "";
    document.getElementById("adminProductFabric").value = product.fabric || "";
    document.getElementById("adminProductSizes").value = Array.isArray(product.sizes) ? product.sizes.join(", ") : "";
    document.getElementById("adminProductColors").value = Array.isArray(product.colors) ? product.colors.join(", ") : "";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteAdminProduct(id) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    try {
        await deleteDoc(doc(db, "products", id));
        await renderAdminProducts();
    } catch (error) {
        console.error("Product delete failed:", error);
        alert("Unable to delete product. Check Firestore rules.");
    }
}

function resetAdminForm() {
    const form = document.getElementById("productForm");
    if (form) form.reset();

    const productId = document.getElementById("productId");
    if (productId) productId.value = "";

    const message = document.getElementById("adminMessage");
    if (message) message.textContent = "";
}

function csvToArray(value) {
    return value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
