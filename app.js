// Elegant Wear — app.js

// ---------- Data ----------
const retailProducts = [
  { id: 1, name: "Kurti", price: 45, category: "Topwear", img: "images/Kurti.jpg" },
  { id: 2, name: "Saree", price: 80, category: "Traditional", img: "images/Saree.jpg" },
  { id: 3, name: "Dress", price: 70, category: "Western", img: "images/Dress.jpg" },
  { id: 4, name: "Tops", price: 30, category: "Topwear", img: "images/Tops.jpg" },
  { id: 5, name: "Jeans", price: 55, category: "Bottomwear", img: "images/Jeans.jpg" },
];

const wholesalePacks = [
  { id: "w1", name: "50 Kurtis Pack", quantity: 50, price: 900, img: "images/Kurti.jpg" },
  { id: "w2", name: "30 Sarees Pack", quantity: 30, price: 1200, img: "images/Saree.jpg" },
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
// Mobile menu toggle functionality
function initMobileMenu() {
  const nav = $('.nav');
  const topbar = $('.topbar');
  
  // Add hamburger menu button for very small screens
  if (window.innerWidth <= 480) {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-btn';
    hamburger.innerHTML = '☰';
    hamburger.style.cssText = `
      display: block;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      margin-left: auto;
    `;
    
    topbar.insertBefore(hamburger, nav);
    
    // Toggle menu visibility
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('mobile-menu-open');
    });
  }
}

// Touch-friendly cart interactions
function enhanceCartForMobile() {
  if ('ontouchstart' in window) {
    // Add swipe to remove functionality for cart items
    let startX, startY;
    
    document.addEventListener('touchstart', (e) => {
      if (e.target.closest('#cartList li')) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    });
    
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('#cartList li')) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = Math.abs(endY - startY);
        
        // If horizontal swipe is greater than vertical and exceeds threshold
        if (Math.abs(deltaX) > 100 && deltaY < 50) {
          const li = e.target.closest('li');
          if (li && confirm('Remove this item from cart?')) {
            // Find item index and remove from cart
            const itemIndex = Array.from(li.parentNode.children).indexOf(li);
            cart.splice(itemIndex, 1);
            updateCartUI();
          }
        }
      }
    });
  }
}

// Optimize images for mobile
function optimizeImagesForMobile() {
  const images = $$('img');
  images.forEach(img => {
    // Add loading="lazy" for better performance
    img.setAttribute('loading', 'lazy');
    
    // Add error handling
    img.addEventListener('error', () => {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyNEwyMCAyMEwyNCAyNEgxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
    });
  });
}

// Handle mobile viewport changes
function handleViewportChanges() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Re-initialize mobile features on orientation change
      if (window.innerWidth <= 768) {
        initMobileMenu();
      }
    }, 250);
  });
}

// Mobile-specific navigation improvements
function improveMobileNavigation() {
  const navBtns = $$('.nav-btn');
  
  navBtns.forEach(btn => {
    // Add active state visual feedback
    btn.addEventListener('touchstart', () => {
      btn.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('touchend', () => {
      btn.style.transform = 'scale(1)';
    });
  });
}

// Enhanced mobile cart UI
function updateCartUIMobile() {
  const cartCount = $("#cartCount");
  const cartList = $("#cartList");
  
  cartCount.textContent = cart.length;
  cartList.innerHTML = "";
  
  if (cart.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.textContent = "Your cart is empty";
    emptyMsg.style.fontStyle = "italic";
    emptyMsg.style.color = "#6b7280";
    cartList.appendChild(emptyMsg);
    return;
  }
  
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="cart-item-content">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${item.price}</span>
      </div>
      <button class="remove-btn" data-index="${i}">×</button>
    `;
    cartList.appendChild(li);
  });
  
  // Add remove functionality
  cartList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      updateCartUIMobile();
    }
  });
}

// Progressive Web App features
function initPWAFeatures() {
  // Add to home screen prompt
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install banner on mobile
    if (window.innerWidth <= 768) {
      const installBanner = document.createElement('div');
      installBanner.className = 'install-banner';
      installBanner.innerHTML = `
        <span>Install Elegant Wear app for better experience</span>
        <button id="installBtn">Install</button>
        <button id="dismissBtn">×</button>
      `;
      installBanner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #2563eb;
        color: white;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      `;
      
      document.body.appendChild(installBanner);
      
      // Show banner after a delay
      setTimeout(() => {
        installBanner.style.transform = 'translateY(0)';
      }, 2000);
      
      // Install button handler
      $('#installBtn').addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
          installBanner.remove();
        });
      });
      
      // Dismiss button handler
      $('#dismissBtn').addEventListener('click', () => {
        installBanner.remove();
      });
    }
  });
}

// Add to your existing window.addEventListener("DOMContentLoaded") function:
function initMobileFeatures() {
  if (window.innerWidth <= 768) {
    initMobileMenu();
    enhanceCartForMobile();
    optimizeImagesForMobile();
    handleViewportChanges();
    improveMobileNavigation();
    initPWAFeatures();
    
    // Override the original updateCartUI function with mobile version
    window.updateCartUI = updateCartUIMobile;
  }
}

// Call this in your DOMContentLoaded event
// Add this line to your existing DOMContentLoaded listener:
// initMobileFeatures();