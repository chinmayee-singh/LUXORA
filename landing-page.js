/* -------- CHECK LOGIN -------- */

let user = localStorage.getItem("luxoraUser");

if(!user){
  var loader = document.getElementById("page-loader");
  if(loader){
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
  }
  window.location.href = "login.html";
}

console.log("LUXORA loaded");

/* -------- PAGE LOADER -------- */

window.onload = function(){
  setTimeout(function(){
    var loader = document.getElementById("page-loader");
    if(loader){
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
    }
  }, 1500);
};

/* -------- TOAST -------- */

function showToast(message, emoji){
  emoji = emoji || "✨";
  const toast = document.getElementById("toast");
  toast.innerHTML = "<span>" + emoji + "</span> " + message;
  toast.classList.add("show");
  setTimeout(function(){ toast.classList.remove("show"); }, 3000);
}

/* -------- BACK TO TOP -------- */

window.addEventListener("scroll", function(){
  const btn = document.getElementById("back-to-top");
  if(btn){
    if(window.scrollY > 400){
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }
});

/* -------- CART SYSTEM -------- */

let cart = JSON.parse(localStorage.getItem("luxoraCart")) || [];

const cartDisplay = document.getElementById("cart-count");

function updateCartCount(){
  if(cartDisplay){
    cartDisplay.textContent = cart.reduce(function(a, b){
      return a + (b.quantity || 1);
    }, 0);
    cartDisplay.classList.remove("cart-pop");
    void cartDisplay.offsetWidth;
    cartDisplay.classList.add("cart-pop");
  }
}

updateCartCount();

/* -------- ADD TO CART -------- */

document.querySelectorAll(".add-cart").forEach(function(button){

  button.addEventListener("click", function(e){

    e.stopPropagation();

    const card = this.closest(".card");

    const product = {
      name:     card.querySelector("h3").innerText,
      price:    card.querySelector(".price").innerText,
      image:    card.querySelector("img").src,
      quantity: 1
    };

    const existing = cart.find(function(i){ return i.name === product.name; });

    if(existing){
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("luxoraCart", JSON.stringify(cart));
    updateCartCount();
    showToast(product.name + " added to cart!", "🛍");

    const cartLink = document.querySelector("a[href='cart.html']");
    if(cartLink){
      cartLink.classList.remove("shake");
      void cartLink.offsetWidth;
      cartLink.classList.add("shake");
      setTimeout(function(){ cartLink.classList.remove("shake"); }, 600);
    }

  });

});

/* -------- FILTER -------- */

const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".card");

filterButtons.forEach(function(button){

  button.addEventListener("click", function(){

    const category = button.dataset.category;

    products.forEach(function(product){
      if(category === "all"){
        product.style.display = "block";
      } else if(product.dataset.category === category){
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });

    const noResults = document.getElementById("no-results");
    if(noResults) noResults.style.display = "none";

  });

});

/* -------- SEARCH -------- */

const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("keyup", function(){

  const value = searchBar.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".card");
  let visibleCount = 0;

  cards.forEach(function(card){

    const name     = card.querySelector("h3").innerText.toLowerCase();
    const dataName = (card.dataset.name     || "").toLowerCase();
    const category = (card.dataset.category || "").toLowerCase();

    if(name.includes(value) || dataName.includes(value) || category.includes(value)){
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }

  });

  const noResults = document.getElementById("no-results");
  if(noResults){
    if(visibleCount === 0 && value !== ""){
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";
    }
  }

});

/* -------- SHOP NOW SCROLL -------- */

document.getElementById("shop-btn").addEventListener("click", function(){
  document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
});

/* -------- WISHLIST -------- */

document.querySelectorAll(".wishlist").forEach(function(btn){

  btn.addEventListener("click", function(){
    if(btn.classList.contains("active")){
      btn.classList.remove("active");
      btn.innerText = "♡";
    } else {
      btn.classList.add("active");
      btn.innerText = "❤️";
    }
  });

});

/* -------- IMAGE ZOOM -------- */

document.querySelectorAll(".card").forEach(function(card){

  const img = card.querySelector("img");
  if(!img) return;

  card.addEventListener("mousemove", function(e){
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const moveX   = (x - centerX) / 20;
    const moveY   = (y - centerY) / 20;
    img.style.transform = "scale(1.2) translate(" + moveX + "px, " + moveY + "px)";
  });

  card.addEventListener("mouseleave", function(){
    img.style.transform = "scale(1)";
  });

});

/* -------- OPEN PRODUCT DETAIL -------- */

document.querySelectorAll(".card img, .card h3").forEach(function(item){

  item.addEventListener("click", function(){

    const card = this.closest(".card");

    const product = {
      name:  card.querySelector("h3").innerText,
      price: card.querySelector(".price").innerText,
      image: card.querySelector("img").src
    };

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";

  });

});

/* -------- LOGOUT -------- */

function logout(){
  localStorage.removeItem("luxoraUser");
  window.location.href = "login.html";
}