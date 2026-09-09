// Fetch products from DummyJSON, render as cards, and support category filtering
const productsContainer = document.querySelector("#products");
const filtersContainer = document.querySelector("#product-filters");

let allProducts = [];
let activeCategory = "all";

// Build the star rating markup, e.g. 4.5 -> "★★★★☆"
function renderStars(rating) {
  const rounded = Math.round(rating); // nearest whole star
  const full = "★".repeat(rounded);
  const empty = "☆".repeat(5 - rounded);
  return `${full}${empty}`;
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
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
  `;

  return card;
}

function renderProducts(products) {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = `<p class="products-status">No products found in this category.</p>`;
    return;
  }

  products.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.appendChild(card);
  });
}

// Turn a category slug like "mens-shirts" into "Mens Shirts"
function formatCategoryLabel(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getUniqueCategories(products) {
  const categories = products.map((product) => product.category);
  return [...new Set(categories)].sort();
}

function applyFilter(category) {
  activeCategory = category;

  // Update which button looks active
  filtersContainer.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  const filtered =
    category === "all"
      ? allProducts
      : allProducts.filter((product) => product.category === category);

  renderProducts(filtered);
}

function renderFilters(categories) {
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

function showLoading() {
  productsContainer.innerHTML = `<p class="products-status">Loading products...</p>`;
}

function showError() {
  productsContainer.innerHTML = `<p class="products-status">Sorry, we couldn't load products right now. Please try again later.</p>`;
}

async function loadProducts() {
  showLoading();
  try {
    // limit=0 asks DummyJSON for the full catalog so every category is represented
    const response = await fetch("https://dummyjson.com/products?limit=0");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    allProducts = data.products;

    const categories = getUniqueCategories(allProducts);
    renderFilters(categories);
    applyFilter("all");
  } catch (error) {
    console.error("Failed to fetch products:", error);
    showError();
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
