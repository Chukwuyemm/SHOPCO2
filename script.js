const productsContainer = document.querySelector("#products");
const filtersContainer = document.querySelector("#product-filters");
let allProducts = [];

function renderStars(rating) {
  const rounded = Math.round(rating);
  const full = "★".repeat(rounded);
  const empty = "☆".repeat(5 - rounded);
  return `${full}${empty}`;
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
  <div class="product-card">
    <div class="product-img-bg">
      <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" />
    </div>
    <div class="product-info">
      <p class="product-title"><b>${product.title}</b></p>
      <p class="product-category">${product.category}</p>
      <div class="product-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span class="rating-number">${product.rating.toFixed(1)}/5</span>
      </div>
      <p class="product-price">$${product.price}</p>
    </div>
  </div>
  `;

  return card;
}

function formatCategoryLabel(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderProducts(products) {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML =
      '<p class="products-status">No products found in this category.</p>';
    return;
  }

  products.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.appendChild(card);
  });
}

function getUniqueCategories(products) {
  const categories = products.map((product) => product.category);
  return [...new Set(categories)].sort();
}

function renderFilters(categories) {
  if (!filtersContainer) return;

  filtersContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.dataset.category = "all";
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => applyFilter("all"));
  filtersContainer.appendChild(allBtn);

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.category = category;
    btn.textContent = formatCategoryLabel(category);
    btn.addEventListener("click", () => applyFilter(category));
    filtersContainer.appendChild(btn);
  });
}

function applyFilter(category) {
  if (!filtersContainer) return;

  filtersContainer.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  const filtered =
    category === "all"
      ? allProducts
      : allProducts.filter((product) => product.category === category);

  renderProducts(filtered);
}

async function loadProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    const products = Array.isArray(data.products) ? data.products : [];

    allProducts = products;
    renderProducts(allProducts);

    if (filtersContainer) {
      renderFilters(getUniqueCategories(products));
    }
  } catch (error) {
    if (productsContainer) {
      productsContainer.innerHTML = "<p>Unable to load products right now.</p>";
    }
    console.error("Failed to load products:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const subscribeBtn = document.querySelector("#subscribe-btn");
  const newsletterInput = document.querySelector("#newsletter-email");

  if (subscribeBtn && newsletterInput) {
    subscribeBtn.addEventListener("click", () => {
      const email = newsletterInput.value.trim();

      if (!email) {
        newsletterInput.focus();
        newsletterInput.placeholder = "Please enter your email";
        return;
      }

      subscribeBtn.textContent = "Subscribed!";
      newsletterInput.value = "";
      newsletterInput.placeholder = "Enter your email address";
    });
  }

  loadProducts();
});
