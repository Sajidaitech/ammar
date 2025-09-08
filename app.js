// Elegant Wear — app.js

// ---------- Data ----------
const retailProducts = [
  { id: 1, name: "Kurti", price: 45, category: "Topwear", img: "https://via.placeholder.com/200x250?text=Kurti" },
  { id: 2, name: "Saree", price: 80, category: "Traditional", img: "https://via.placeholder.com/200x250?text=Saree" },
  { id: 3, name: "Dress", price: 70, category: "Western", img: "https://via.placeholder.com/200x250?text=Dress" },
  { id: 4, name: "Tops", price: 30, category: "Topwear", img: "https://via.placeholder.com/200x250?text=Tops" },
  { id: 5, name: "Jeans", price: 55, category: "Bottomwear", img: "https://via.placeholder.com/200x250?text=Jeans" },
];

const wholesalePacks = [
  { id: "w1", name: "50 Kurtis Pack", quantity: 50, price: 900, img: "https://via.placeholder.com/200x250?text=50+Kurtis" },
  { id: "w2", name: "30 Sarees Pack", quantity: 30, price: 1200, img: "https://via.placeholder.com/200x250?text=30+Sarees" },
];

// ---------- State ----------
let session = { loggedIn: true, role: "customer", username: "guest" }; 
let cart = [];

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
    if(item){ cart.push(item); updateCartUI(); }
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
  const list=$("#cartList"); list.innerHTML="";
  cart.forEach((item,i)=>{
    const li=document.createElement("li");
    li.textContent=`${i+1}. ${item.name} — $${item.price}`;
    list.appendChild(li);
  });
}

// ---------- Init ----------
window.addEventListener("DOMContentLoaded",()=>{
  $("#year").textContent=new Date().getFullYear();
  renderRetail(); renderWholesale(); renderAdminTable();
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
});
