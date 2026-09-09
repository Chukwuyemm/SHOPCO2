const products = document.querySelector("#products");
fetch("https://dummyjson.com/products")
  .then(function (result) {
    return result.json();
  })

  .then(function (data) {
    console.log(data.products);
    data.products.forEach(function (product, id) {
      const productElement = document.createElement("p");
      productElement.innerText = `${product.title}`;
      products.appendChild(productElement);
    });
  });
