// Elegant Wear — app.js

// ---------- Data ----------
const retailProducts = [
  { id: 1, name: "Kurti", price: 45, category: "Topwear", img: "images/Kurti.jpg" },
  { id: 2, name: "Saree", price: 80, category: "Traditional", img: "images/Saree.jpg" },
  { id: 3, name: "Dress", price: 70, category: "Western", img: "images/Dress.jpg" },
  { id: 4, name: "Tops", price: 30, category: "Topwear", img: "images/Tops.jpg" },
  { id: 5, name: "Jeans", price: 55, category: "Bottomwear", img: "images/Jeans.jpg" },
  { id: 6, name: "Shirts", price: 50, category: "Topwear", img: "images/Shirts.jpg" },
];

const wholesalePacks = [
  { id: "w1", name: "50 Kurtis Pack", quantity: 50, price: 900, img: "images/Kurti.jpg" },
  { id: "w2", name: "30 Sarees Pack", quantity: 30, price: 1200, img: "images/Saree.jpg" },
  { id: "w3", name: "30 Shirts Pack", quantity: 40, price: 1500, img: "images/Shirts.jpg" },
];

// ---------- State ----------
let session = { loggedIn: true, role: "customer", username: "guest" }; 
let cart = [];
let orderHistory = [];

// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function showApp(role){
  if(role === "admin"){
    $$(".only-admin").forEach(el => el.style.display="inline-flex");
    $$(".only-customer").forEach(el => el.style.display="none");
    navigateTo("admin");
  }else{
    $$(".only-admin").forEach(el => el.style.display="none");
    $$(".only-customer").forEach(el => el.style.display="inline-flex");
    navigateTo("retail");
  }
}

function navigateTo(target){
  const map = {
    retail:"#retailSection",
    wholesale:"#wholesaleSection",
    customer:"#customerSection",
    admin:"#adminSection",
  };
  Object.values(map).forEach(sel => $(sel).classList.add("hidden"));
  $(map[target]).classList.remove("hidden");
}

function renderRetail(){
  const grid=$("#retailGrid");
  grid.innerHTML="";
  retailProducts.forEach(p=>{
    const card=document.createElement("article");
    card.className="card";
    card.innerHTML=`
      <img src="${p.img}" alt="${p.name}" />
      <div class="info">
        <strong>${p.name}</strong> <span class="muted">· ${p.category}</span>
        <div class="price">$${p.price}</div>
        <button class="btn primary add" data-id="${p.id}">Add to Cart</button>
      </div>`;
    grid.appendChild(card);
  });
  grid.addEventListener("click",(e)=>{
    const btn=e.target.closest(".add");
    if(!btn) return;
    const item=retailProducts.find(x=>x.id==btn.dataset.id);
    if(item){ 
      cart.push(item); 
      updateCartUI(); 
    }
  });
}

function renderWholesale(){
  const grid=$("#wholesaleGrid");
  grid.innerHTML="";
  wholesalePacks.forEach(p=>{
    const card=document.createElement("article");
    card.className="card";
    card.innerHTML=`
      <img src="${p.img}" alt="${p.name}" />
      <div class="info">
        <strong>${p.name}</strong> <span class="muted">· Qty: ${p.quantity}</span>
        <div class="price">$${p.price}</div>
      </div>`;
    grid.appendChild(card);
  });
}

function renderAdminTable(){
  const tbody=$("#adminProductsTable tbody");
  tbody.innerHTML="";
  retailProducts.forEach((p,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${i+1}</td>
      <td><img src="${p.img}" alt="${p.name}" width="48" height="60"/></td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>$${p.price}</td>`;
    tbody.appendChild(tr);
  });
}

function updateCartUI(){
  $("#cartCount").textContent=cart.length;
  const list=$("#cartList"); 
  list.innerHTML="";

  if (cart.length === 0) {
    list.innerHTML = `<li>Your cart is empty</li>`;
    return;
  }

  cart.forEach((item,i)=>{
    const li=document.createElement("li");
    li.innerHTML = `
      ${i+1}. ${item.name} — $${item.price}
      <button class="remove-btn" data-index="${i}">Remove</button>
    `;
    list.appendChild(li);
  });

  // Add event listeners to remove buttons
  list.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      updateCartUI();
    });
  });
}

function updateOrderHistoryUI() {
  const list = $("#orderHistory");
  list.innerHTML = "";
  if (orderHistory.length === 0) {
    list.innerHTML = `<li>No past orders</li>`;
    return;
  }
  orderHistory.forEach((order, i) => {
    const li = document.createElement("li");
    li.innerHTML = `#ORD-${1000 + i} — ${order.items.map(it => it.name).join(", ")} — <em>${order.status}</em>`;
    list.appendChild(li);
  });
}

function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Show payment modal
  $("#paymentModal").classList.remove("hidden");
}

function handlePayment(e) {
  e.preventDefault();

  const name = $("#username").value;
  const card = $("#card").value;
  const bank = $("#bank").value;
  const address = $("#address").value;
  const phone = $("#phone").value;

  // Validate form
  if (!name || !card || !bank || !address || !phone) {
    alert("Please fill all fields");
    return;
  }

  // Save order
  orderHistory.push({
    items: [...cart],
    status: "Pending Payment",
    customer: name,
    address: address,
    phone: phone
  });

  // Clear cart
  cart = [];
  updateCartUI();
  updateOrderHistoryUI();

  // Close modal and reset form
  $("#paymentModal").classList.add("hidden");
  $("#paymentForm").reset();

  alert("Payment confirmed! Your order has been placed.");
}

// ---------- Init ----------
window.addEventListener("DOMContentLoaded",()=>{
  $("#year").textContent=new Date().getFullYear();
  renderRetail(); 
  renderWholesale(); 
  renderAdminTable();
  updateCartUI();
  updateOrderHistoryUI();
  showApp(session.role);

  $$(".nav-btn").forEach(btn=>{
    btn.addEventListener("click",()=>navigateTo(btn.dataset.target));
  });

  $("#logoutBtn").addEventListener("click",()=>{
    alert("Logout disabled. Later will redirect to Google login.");
  });

  $("#addProductBtn").addEventListener("click",()=>{
    alert("Add Product - Placeholder");
  });

  // Payment functionality
  $("#checkoutBtn").addEventListener("click", handleCheckout);
  $("#closeModal").addEventListener("click", () => {
    $("#paymentModal").classList.add("hidden");
  });
  $("#paymentForm").addEventListener("submit", handlePayment);
  
  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === $("#paymentModal")) {
      $("#paymentModal").classList.add("hidden");
    }
  });
});