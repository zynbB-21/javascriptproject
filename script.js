"use strict";

var products = [
  {
    id: 1,
    name: "REDMAGIC Laptop",
    category: "laptops",
    price: 999,
    oldPrice: 1199,
    image: "images/laptop2.jpeg",
    description: "Powerful laptop for work and study.",
    rating: 5,
  },

  {
    id: 2,
    name: "Gaming Laptop",
    category: "gaming",
    price: 1499,
    oldPrice: 1799,
    image: "images/gaminglaptop.jpeg",
    description: "High-performance laptop for gaming.",
    rating: 5,
  },

  {
    id: 3,
    name: "Galaxy S24 Ultra ",
    category: "phones",
    price: 699,
    oldPrice: 799,
    image: "images/samsung.jpeg",
    description: "Modern smartphone with great camera.",
    rating: 5,
  },

  {
    id: 4,
    name: "iPhone 17 Pro",
    category: "phones",
    price: 1099,
    oldPrice: 1299,
    image: "images/iphone 17.jpeg",
    description: "Premium smartphone with powerful processor.",
    rating: 5,
  },

  {
    id: 5,
    name: "Wireless Keyboard",
    category: "accessories",
    price: 89,
    oldPrice: 120,
    image: "images/keyboard.jpeg",
    description: "Mechanical keyboard for gaming and work.",
    rating: 4,
  },

  {
    id: 6,
    name: "Wireless Mouse",
    category: "accessories",
    price: 49,
    oldPrice: 65,
    image: "images/mouse.jpeg",
    description: "Comfortable wireless mouse. Special mouse",
    rating: 4,
  },

  {
    id: 7,
    name: "Headphones",
    category: "accessories",
    price: 129,
    oldPrice: 169,
    image: "images/headphone.jpeg",
    description: "Gaming headset with high quality sound.",
    rating: 5,
  },

  {
    id: 8,
    name: "AirPods",
    category: "accessories",
    price: 70,
    oldPrice: 210,
    image: "images/airpod.jpeg",
    description: "Ultra HD monitor for work and gaming.",
    rating: 5,
  },
];

var results = document.getElementById("res");
var searchInput = document.getElementById("searchpro");
var sortSelect = document.getElementById("sortpro");
var categoryButtons = document.querySelectorAll(".category-btn");
var cart = JSON.parse(localStorage.getItem("cart")) || [];
var cartPanel = document.getElementById("cartPanel");
var cartItems = document.getElementById("cartItems");
var cartTotal = document.getElementById("cartTotal");
var cartBtn = document.getElementById("cartbtn");
var closeCart = document.getElementById("closeCart");
var selectedCategory = "all";
var counter = document.getElementById("counter");


function IncreaseCounter() {
  var count = 0;

  cart.forEach(function (ele) {
    count += ele.quantity;
  });

  counter.textContent = count;
}

function displayProducts(list) {
  results.innerHTML = " ";

  list.forEach(function (product) {
    var stars = "";

    for (var i = 0; i < product.rating; i++) {
      stars += '<i class="fa-solid fa-star" style="color:yellow;"></i>';
    }

    results.innerHTML += `
      <div class="product-card">

        <div class="product-image">
          <img src="${product.image}">
        </div>

        <h3>${product.name}</h3>

        <p class="product-category">
          ${product.category}
        </p>

        <p>
          ${product.description}
        </p>

        <p>
          ${stars}
        </p>

        <p class="product-price">
          $${product.price}

          <span class="old-price">
            $${product.oldPrice}
          </span>
        </p>

        <button onclick="addToCart(${product.id})">
          Add To Cart
        </button>

        <button onclick="showDetails(${product.id})">
          Details
        </button>

      </div>
    `;
  });
}

function filterAndSortProducts() {
  var searchText = searchInput.value.trim().toLowerCase();

  var filteredProducts = products.filter(function (product) {
    var categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;

    var searchMatch = product.name.toLowerCase().indexOf(searchText) !== -1;

    return categoryMatch && searchMatch;
  });

  if (sortSelect.value === "low") {
    filteredProducts.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortSelect.value === "high") {
    filteredProducts.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortSelect.value === "name") {
    filteredProducts.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  displayProducts(filteredProducts);
}

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    categoryButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    selectedCategory = button.getAttribute("data-category");

    filterAndSortProducts();
  });
});

searchInput.addEventListener("keyup", function () {
  filterAndSortProducts();
});

sortSelect.addEventListener("change", function () {
  filterAndSortProducts();
});

function addToCart(id) {
  var product = products.find(function (item) {
    return item.id === id;
  });

  if (!product) {
    return;
  }

  var existingProduct = cart.find(function (item) {
    return item.id === id;
  });

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart();
  displayCart();
  IncreaseCounter();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCart() {
  cartItems.innerHTML = "";

  var total = 0;

  cart.forEach(function (item) {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">

        <img src="${item.image}">

        <div class="cart-item-info">

          <h3>${item.name}</h3>

          <p class="cart-item-price">
            $${item.price}
          </p>

          <div class="quantity">

            <button onclick="decreaseQuantity(${item.id})">
              -
            </button>

            <span>
              ${item.quantity}
            </span>

            <button onclick="increaseQuantity(${item.id})">
              +
            </button>

          </div>

        </div>

        <button
          class="delete-btn"
          onclick="deleteFromCart(${item.id})"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>
    `;
  });

  cartTotal.textContent = total;
}

function increaseQuantity(id) {
  var item = cart.find(function (item) {
    return item.id === id;
  });

  if (item) {
    item.quantity++;

    saveCart();
    displayCart();
    IncreaseCounter();
  }
}

function decreaseQuantity(id) {
  var item = cart.find(function (item) {
    return item.id === id;
  });

  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      deleteFromCart(id);
      return;
    }

    saveCart();
    displayCart();
    IncreaseCounter();
  }
}

function deleteFromCart(id) {
  cart = cart.filter(function (item) {
    return item.id !== id;
  });

  saveCart();
  displayCart();
  IncreaseCounter();
}

cartBtn.addEventListener("click", function () {
  cartPanel.classList.add("show");
  displayCart();
});

closeCart.addEventListener("click", function () {
  cartPanel.classList.remove("show");
});

document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Order confirmed!\nTotal: $" + cartTotal.textContent);
});

function showDetails(id) {
  var product = products.find(function (item) {
    return item.id === id;
  });

  if (product) {
    alert(
      product.name +
        "\n\n" +
        product.description +
        "\nPrice: $" +
        product.price,
    );
  }
}

var darkModeBtn = document.getElementById("darkmd");

var darkIcon = darkModeBtn.querySelector("i");

darkModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkIcon.classList.remove("fa-sun");
    darkIcon.classList.add("fa-moon");
  } else {
    darkIcon.classList.remove("fa-moon");
    darkIcon.classList.add("fa-sun");
  }
});
var loginBtn = document.getElementById("login");
var loginModal = document.getElementById("loginModal");
var closeLogin = document.getElementById("closeLogin");
var loginSubmit = document.getElementById("loginSubmit");

var loginName = document.getElementById("loginName");
var loginEmail = document.getElementById("loginEmail");
var loginPassword = document.getElementById("loginPassword");
var loginMessage = document.getElementById("loginMessage");

loginBtn.addEventListener("click", function () {
  loginModal.classList.add("show");
});

closeLogin.addEventListener("click", function () {
  loginModal.classList.remove("show");
});

loginModal.addEventListener("click", function (event) {
  if (event.target === loginModal) {
    loginModal.classList.remove("show");
  }
});

loginSubmit.addEventListener("click", function () {
  var name = loginName.value.trim();
  var email = loginEmail.value.trim();
  var password = loginPassword.value.trim();

  if (name === "" || email === "" || password === "") {
    loginMessage.textContent = "Please fill in all fields.";
    return;
  }

  var user = {
    name: name,
    email: email
  };

  localStorage.setItem("user", JSON.stringify(user));

  loginMessage.textContent = "Login successful! Welcome " + name;

  setTimeout(function () {
    loginModal.classList.remove("show");
    loginMessage.textContent = "";
    loginName.value = "";
    loginEmail.value = "";
    loginPassword.value = "";
  }, 1500);
});
var contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = document.getElementById("contname").value.trim();
  var email = document.getElementById("contemail").value.trim();
  var message = document.getElementById("contmessage").value.trim();

  if (name === "" || email === "" || message === "") {
    alert("Please fill in all fields.");
    return;
  }

  alert("Thank you " + name + "! Your message has been sent successfully.");

  contactForm.reset();
});
var endDate = new Date("September 15, 2026 23:59:59").getTime();

setInterval(function () {

  var now = new Date().getTime();

  var difference = endDate - now;

  var days = Math.floor(difference / (1000 * 60 * 60 * 24));
  var hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );
  var minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );
  var seconds = Math.floor(
    (difference / 1000) % 60
  );

  document.getElementById("days").textContent = days;
  document.getElementById("hrs").textContent = hours;
  document.getElementById("mins").textContent = minutes;
  document.getElementById("sec").textContent = seconds;

}, 1000);
displayProducts(products);
displayCart();
IncreaseCounter();
