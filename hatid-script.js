// ─── AUTH ───────────────────────────────────────────────────
const currentUser = JSON.parse(sessionStorage.getItem('hatid_user') || 'null');

function initNav() {
  const navRight = document.getElementById('navRight');
  if (!navRight) return;
  if (currentUser) {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
   navRight.innerHTML = `
  <div class="nav-user dropdown">
    
    <div class="nav-profile" onclick="toggleProfileMenu()">
      <div class="nav-avatar">${initials}</div>

      <div>
        <div class="nav-name">${currentUser.name}</div>
        <div class="nav-role">
          ${currentUser.role === 'traveler'
            ? '✈️ Traveler Seller'
            : '🛍️ Buyer'}
        </div>
      </div>

      <div class="dropdown-arrow">▾</div>
    </div>

    <div class="profile-menu" id="profileMenu">
      <button onclick="showToast('Opening profile...')">👤 Profile</button>
      <button onclick="showToast('Opening settings...')">⚙️ Settings</button>
      <button onclick="logout()" class="danger">🚪 Sign Out</button>
    </div>

  </div>`;
    renderRoleView();
  } else {
    navRight.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <a href="login.html" class="btn btn-outline" style="padding:8px 18px;font-size:0.85rem">Sign In</a>
        <a href="register.html" class="btn btn-primary" style="padding:8px 18px;font-size:0.85rem">Register</a>
      </div>`;
  }
}

function logout() {
  sessionStorage.removeItem('hatid_user');
  showToast('Signed out. See you next time! 👋');
  setTimeout(() => location.reload(), 1000);
}
function toggleProfileMenu() {
  document.getElementById('profileMenu')?.classList.toggle('show');
}
function renderRoleView() {
  if (!currentUser) return;

  const travelerSections = document.querySelectorAll('.traveler-only');
  const buyerSections = document.querySelectorAll('.buyer-only');

  const listingsSection = document.getElementById('listings');
  const heroTitle = document.querySelector('#hero h1');
  const heroSub = document.querySelector('.hero-sub');

  if (currentUser.role === 'traveler') {
    document.body.classList.add('traveler-mode');

    // SHOW traveler sections
    travelerSections.forEach(el => el.style.display = '');

    // HIDE buyer sections
    buyerSections.forEach(el => el.style.display = 'none');

    // CHANGE HERO TEXT
    if (heroTitle) {
      heroTitle.innerHTML = `Your Seller Dashboard,<br>manage orders with ease.`;
    }

    if (heroSub) {
      heroSub.textContent =
        'Track incoming requests, manage listings, and earn through trusted pasabuy transactions.';
    }

    // OPTIONAL: hide traveler browsing
    if (listingsSection) {
      listingsSection.style.display = 'none';
    }

  } else {
    document.body.classList.remove('traveler-mode');

    // BUYER VIEW
    travelerSections.forEach(el => el.style.display = 'none');
    buyerSections.forEach(el => el.style.display = '');

    if (listingsSection) {
      listingsSection.style.display = '';
    }
  }
}

// Hamburger menu
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ─── LISTINGS DATA ──────────────────────────────────────────
const listings = [
  { id: 1, dest:'japan', flag:'🇯🇵', route:'Tokyo → Manila', dates:'Jun 15–22, 2025', name:'Maria R.', rating:'4.9', trips:'143', avatar:'MR', avatarClass:'avatar-a', capacity:'10 kg', fee:'8%', cats:['Skincare','Fashion','Snacks','Electronics'] },
  { id: 2, dest:'korea', flag:'🇰🇷', route:'Seoul → Manila', dates:'Jun 20–27, 2025', name:'Jose M.', rating:'4.8', trips:'88',  avatar:'JM', avatarClass:'avatar-b', capacity:'8 kg',  fee:'10%', cats:['K-Beauty','Clothing','Accessories'] },
  { id: 3, dest:'us',    flag:'🇺🇸', route:'New York → Manila', dates:'Jul 5–8, 2025',  name:'Ana T.',  rating:'5.0', trips:'32',  avatar:'AT', avatarClass:'avatar-c', capacity:'15 kg', fee:'12%', cats:['Supplements','Gadgets','Clothing','Books'] },
  { id: 4, dest:'uae',   flag:'🇦🇪', route:'Dubai → Manila',    dates:'Jun 28, 2025',   name:'Carlo S.',rating:'4.7', trips:'212', avatar:'CS', avatarClass:'avatar-d', capacity:'20 kg', fee:'7%',  cats:['Perfume','Watches','Gold Jewelry','Gadgets'] },
  { id: 5, dest:'sg',    flag:'🇸🇬', route:'Singapore → Manila',dates:'Jul 2–3, 2025',  name:'Rina B.', rating:'4.9', trips:'67',  avatar:'RB', avatarClass:'avatar-a', capacity:'6 kg',  fee:'9%',  cats:['Skincare','Baby Products','Health'] },
  { id: 6, dest:'japan', flag:'🇯🇵', route:'Osaka → Manila',    dates:'Jul 10–14, 2025',name:'Leo C.',  rating:'4.6', trips:'51',  avatar:'LC', avatarClass:'avatar-b', capacity:'12 kg', fee:'8%',  cats:['Anime Merch','Snacks','Cosmetics'] },
];

function renderListings(data) {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  grid.innerHTML = data.map(l => `
    <div class="listing-card" data-dest="${l.dest}">
      <div class="listing-header">
        <div class="listing-route">${l.flag} ${l.route}</div>
        <div class="listing-dates">✈️ ${l.dates}</div>
      </div>
     <div class="listing-body card-flex">
        <div class="traveler-row">
          <div class="avatar ${l.avatarClass}">${l.avatar}</div>
          <div class="traveler-info">
            <div class="traveler-name">${l.name}</div>
            <div class="trip-meta">
  ⭐ ${l.rating} · ${l.trips} trips
</div>
          </div>
          <span class="verified-icon" title="Verified Traveler">✔</span>
        </div>
        <div class="listing-details">
          <div class="detail-item"><div class="detail-label">Capacity</div><div class="detail-value">${l.capacity}</div></div>
          <div class="detail-item"><div class="detail-label">Service Fee</div><div class="detail-value">${l.fee}</div></div>
        </div>
        <div class="categories">${l.cats.map(c => `<span class="cat-tag">${c}</span>`).join('')}</div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;font-size:0.88rem"
          onclick="selectTraveler('${l.name}','${l.route}','${l.dates}')">Request to This Traveler →</button>
          ${l.id === 1
  ? `<button class="view-items-btn" onclick="openTravelerItems()">🛍️ View Maria's Listed Items</button>`
  : ''}

      </div>
    </div>`).join('');
}

function filterListings(dest, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderListings(dest === 'all' ? listings : listings.filter(l => l.dest === dest));
}

function selectTraveler(name, route, dates) {
  if (!currentUser) { showToast('⚠️ Please sign in to place an order.'); setTimeout(() => { window.location.href = 'login.html'; }, 1200); return; }
  const sel = document.getElementById('selectedTraveler');
  if (!sel) return;
  const optText = `${name} · ${route} (${dates.split('–')[0]})`;
  let found = false;
  for (let o of sel.options) { if (o.text === optText) { o.selected = true; found = true; break; } }
  if (!found) { const opt = new Option(optText, name, true, true); sel.add(opt); }
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  showToast(`Traveler ${name} selected!`);
}

// ─── DP LOGIC ───────────────────────────────────────────────
const DP_THRESHOLD = 2000;   // PHP — orders above this require DP
const DP_RATE      = 0.30;   // 30%

function onBudgetChange() {
  const budget  = parseFloat(document.getElementById('itemBudget').value) || 0;
  const dpNotice = document.getElementById('dpNotice');
  if (!dpNotice) return;
  if (budget >= DP_THRESHOLD) {
    const dp = (budget * DP_RATE).toLocaleString('en-PH', { minimumFractionDigits: 2 });
    dpNotice.innerHTML = `⚠️ <strong>Down Payment Required:</strong> This order exceeds PHP ${DP_THRESHOLD.toLocaleString()}. A <strong>30% down payment of PHP ${dp}</strong> is required upon order acceptance. The remaining balance will be held in escrow and released upon delivery.`;
    dpNotice.classList.add('show');
  } else {
    dpNotice.classList.remove('show');
  }
}

// ─── IMAGE UPLOAD PREVIEW ───────────────────────────────────
function handleImageUpload(input) {
  const preview = input.id === 'itemPhoto'
  ? document.getElementById('orderImagePreview')
  : document.getElementById('listingImagePreview');
  if (!preview) return;
  preview.innerHTML = '';
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result; img.className = 'preview-img';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// ─── ORDER SUBMISSION ───────────────────────────────────────


// ─── CANCELLATION ───────────────────────────────────────────
// Penalty rules:
//  - Buyer cancels after acceptance but before purchase → 5% of order value (minimum PHP 50)
//  - Traveler cancels after acceptance → 10% penalty + must notify buyer
//  - Either party cancels within 24h of travel date → maximum penalty applies

function showCancelModal(role) {
  document.getElementById('cancelModal').classList.add('open');
  const msg = document.getElementById('cancelPenaltyMsg');
  if (role === 'buyer') {
    msg.innerHTML = `<strong>Buyer cancellation penalty:</strong><br>
    • Cancelled <em>before</em> traveler accepts → <strong>No penalty</strong><br>
    • Cancelled <em>after</em> acceptance, before item purchased → <strong>5% of order value</strong> (min PHP 50) deducted from next transaction credit<br>
    • Cancelled <em>after</em> item purchased → <strong>Not allowed</strong>. Dispute process required.`;
  } else {
    msg.innerHTML = `<strong>Traveler cancellation penalty:</strong><br>
    • Cancelled before accepting order → <strong>No penalty</strong><br>
    • Cancelled <em>after</em> accepting, before item purchased → <strong>10% of order value</strong> deducted from earnings + buyer gets full refund<br>
    • Cancelled within 24h of travel date → <strong>Account strike</strong>. Three strikes = suspension.`;
  }
}

function confirmCancel() {
  document.getElementById('cancelModal').classList.remove('open');
  showToast('Order cancelled. Penalty notice sent via email.');
  // Show cancellation notification banner
  const banner = document.getElementById('notifyBanner');
  if (banner) {
    banner.className = 'notify-banner danger';
    banner.innerHTML = '🚫 <strong>Order #HTD-2025-0042 cancelled.</strong> A penalty fee has been applied per HATID cancellation policy. Check your email for details.';
    banner.style.display = 'flex';
  }
}

// ─── TRAVELER ITEM UPLOAD ────────────────────────────────────
const sampleItems = [
  { name: 'Shiseido Anessa SPF50+', price: 'PHP 1,200', from: '🇯🇵 Japan', emoji: '🧴' },
  { name: 'Sulwhasoo First Serum',  price: 'PHP 3,500', from: '🇰🇷 Korea', emoji: '✨' },
  { name: 'GNC Fish Oil 1000mg x90',price: 'PHP 980',   from: '🇺🇸 USA',   emoji: '💊' },
  { name: 'Ajman Gold Ring 18k',    price: 'PHP 12,000',from: '🇦🇪 UAE',   emoji: '💍' },
];

function renderItems() {
  const grid = document.getElementById('itemsGrid');
  if (!grid) return;
  grid.innerHTML = sampleItems.map(item => `
    <div class="item-card">
      <div class="item-img">${item.emoji}</div>
      <div class="item-body">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price}</div>
        <div class="item-meta">${item.from}</div>
      </div>
    </div>`).join('');
}

function submitItemListing() {
  const name  = document.getElementById('listItemName').value.trim();
  const price = document.getElementById('listItemPrice').value.trim();
  if (!name || !price) { showToast('⚠️ Item name and price are required.'); return; }
  showToast(`✅ "${name}" listed successfully!`);
  document.getElementById('listItemName').value = '';
  document.getElementById('listItemPrice').value = '';
  document.getElementById('listItemDesc').value = '';
}

// ─── MODALS ─────────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id || 'successModal').classList.remove('open');
}


// Close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });
  initNav();
  renderListings(listings);
  renderItems();
});

// ─── TOAST ──────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errEl    = document.getElementById('loginError');

  if (!email || !password) {
    errEl.textContent = 'Please fill in all fields.';
    errEl.classList.add('show');
    return;
  }

  const account = demoAccounts[email];
  if (!account || account.password !== password || account.role !== currentRole) {
    errEl.textContent = 'Invalid credentials or wrong account type selected.';
    errEl.classList.add('show');
    return;
  }

  errEl.classList.remove('show');
  sessionStorage.setItem('hatid_user', JSON.stringify({ email, name: account.name, role: account.role }));
  showToast('Welcome back, ' + account.name + '! 👋');

  // ✅ Redirect straight to dashboard
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('profileMenu');
  const profile = document.querySelector('.nav-profile');

  if (!menu || !profile) return;

  if (!profile.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('show');
  }
});

let selectedRating = 0;

function openRatingModal() {
  document.getElementById('ratingModal').classList.add('open');
  renderStars();
}

function renderStars() {
  const container = document.getElementById('starRating');
  container.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.textContent = i <= selectedRating ? '⭐' : '☆';
    star.onclick = () => {
      selectedRating = i;
      renderStars();
    };
    container.appendChild(star);
  }
}
function submitRating() {
  const comment = document.getElementById('ratingComment').value;

  if (selectedRating === 0) {
    showToast('Please select a rating');
    return;
  }

  showToast(`Thanks for ${selectedRating}⭐ rating!`);

  console.log({
    rating: selectedRating,
    comment
  });

  // reset
  selectedRating = 0;
  document.getElementById('ratingComment').value = '';

  closeModal('ratingModal');
}

function confirmDelivery() {
  showToast('Delivery confirmed! 🎉');

  // after short delay, open rating modal
  setTimeout(() => {
    openRatingModal();
  }, 500);
}

// ─── PASTE THIS BLOCK ANYWHERE NEAR THE BOTTOM OF hatid-script.js ───────────

// ─── MARIA'S LISTED ITEMS ───────────────────────────────────────────────────
const mariaItems = [
  { id: 'm1', emoji: '🧴', name: 'Shiseido Anessa Sunscreen SPF50+', desc: '60ml · Don Quijote exclusive', price: 1400 },
  { id: 'm2', emoji: '💄', name: 'CANMAKE Moist Lasting Tint',       desc: 'Lip tint · all shades available', price: 450 },
  { id: 'm3', emoji: '🍫', name: 'Royce Nama Chocolate (Milk)',       desc: 'Standard box · refrigerated packaging', price: 850 },
  { id: 'm4', emoji: '👜', name: 'Marimekko Tote Bag',                desc: 'Original from Marimekko Japan store', price: 2200 },
  { id: 'm5', emoji: '🧖', name: 'Hada Labo Gokujyun Lotion',        desc: '170ml pump bottle', price: 650 },
];

// Open Maria's items modal (called from listing card button)
function openTravelerItems() {
  const grid = document.getElementById('mariaItemsGrid');
  if (!grid) return;
  grid.innerHTML = mariaItems.map(item => `
    <div class="ti-card" onclick="requestMariasItem('${item.id}')">
      <div class="ti-emoji">${item.emoji}</div>
      <div class="ti-info">
        <div class="ti-name">${item.name}</div>
        <div class="ti-desc">${item.desc}</div>
      </div>
      <div class="ti-right">
        <div class="ti-price">₱${item.price.toLocaleString()}</div>
        <button class="ti-req-btn" onclick="event.stopPropagation();requestMariasItem('${item.id}')">Request</button>
      </div>
    </div>`).join('');
  document.getElementById('travelerItemsModal').classList.add('open');
}

// Pre-fill order form from Maria's item
function requestMariasItem(itemId) {
  const item = mariaItems.find(i => i.id === itemId);
  if (!item) return;
  closeModal('travelerItemsModal');

  // Pre-fill order form
  const selTraveler = document.getElementById('selectedTraveler');
  if (selTraveler) {
    // Find or create Maria option
    let found = false;
    for (let o of selTraveler.options) {
      if (o.text.includes('Maria')) { o.selected = true; found = true; break; }
    }
    if (!found) {
      const opt = new Option('Maria R. · Tokyo → Manila (Jun 15)', 'maria', true, true);
      selTraveler.add(opt);
    }
  }

  const nameEl   = document.getElementById('itemName');
  const budgetEl = document.getElementById('itemBudget');
  const qtyEl    = document.getElementById('itemQty');
  const notesEl  = document.getElementById('itemNotes');

  if (nameEl)   nameEl.value   = item.name;
  if (budgetEl) budgetEl.value = item.price;
  if (qtyEl)    qtyEl.value    = 1;
  if (notesEl)  notesEl.value  = item.desc;

  onBudgetChange();
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  showToast(`✅ Pre-filled: ${item.name}`);
}

function customRequestMaria() {
  closeModal('travelerItemsModal');
  const selTraveler = document.getElementById('selectedTraveler');
  if (selTraveler) {
    for (let o of selTraveler.options) {
      if (o.text.includes('Maria')) { o.selected = true; break; }
    }
  }
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  showToast('Maria selected! Fill in your custom request below.');
}

// ─── PAYMENT MODAL ──────────────────────────────────────────────────────────
let payOrder       = {};
let payMethod      = '';

// Called by submitOrder() — replace the existing successModal open with this
function openPaymentModal(order) {
  payOrder  = order;
  payMethod = '';

  const total   = order.budget * order.qty;
  const isDP    = total >= DP_THRESHOLD;
  const dp      = isDP ? Math.round(total * DP_RATE) : total;
  const balance = total - dp;

  payOrder.total   = total;
  payOrder.dp      = dp;
  payOrder.isDP    = isDP;
  payOrder.balance = balance;
  payOrder.orderId = 'HTD-2025-' + String(Math.floor(Math.random() * 9000) + 1000);

  const travelerLabel = document.querySelector('#selectedTraveler option:checked')?.textContent || order.traveler;

  // Step 1 — Review
  document.getElementById('payReviewSummary').innerHTML = `
    <div><strong>Buyer:</strong> ${order.name} · ${order.contact}</div>
    <div><strong>Traveler:</strong> ${travelerLabel}</div>
    <div><strong>Item:</strong> ${order.item}</div>
    <div><strong>Budget:</strong> ₱${order.budget.toLocaleString()} × ${order.qty} = ₱${total.toLocaleString()}</div>`;

  const amountHTML = `
    <div class="pay-row"><span>Item Total</span><span>₱${total.toLocaleString()}</span></div>
    ${isDP ? `<div class="pay-row"><span>Balance (held in escrow)</span><span>₱${balance.toLocaleString()}</span></div>` : ''}
    <div class="pay-row pay-total"><span>${isDP ? '30% DP Due Now' : 'Amount Due Now'}</span><span>₱${dp.toLocaleString()}</span></div>`;

  document.getElementById('payAmountBox').innerHTML  = amountHTML;
  document.getElementById('payAmountBox2').innerHTML = amountHTML;

  goPayStep(1);
  document.getElementById('paymentModal').classList.add('open');
}

function goPayStep(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById(`payStep${i}`).style.display = i === n ? 'block' : 'none';
    const dot = document.getElementById(`pdot${i}`);
    if (dot) dot.className = 'pdot' + (i < n ? ' pdot-done' : i === n ? ' pdot-active' : '');
  });
  if (n === 2) {
    payMethod = '';
    document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.pay-fields').forEach(f => f.style.display = 'none');
  }
}

function selectPayMethod(method) {
  payMethod = method;
  document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(`pm-${method}`).classList.add('selected');
  document.querySelectorAll('.pay-fields').forEach(f => f.style.display = 'none');
  document.getElementById(`pf-${method}`).style.display = 'block';
}

function formatCardNum(el) {
  el.value = el.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
}
function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '');
  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
  el.value = v;
}

function processPayment() {
  if (!payMethod) { showToast('⚠️ Please select a payment method.'); return; }

  if (payMethod === 'gcash') {
    const n = document.getElementById('gcashNum').value.trim();
    if (n.length < 11) { showToast('❌ Enter a valid 11-digit GCash number.'); return; }
  } else if (payMethod === 'maya') {
    const n = document.getElementById('mayaNum').value.trim();
    if (n.length < 11) { showToast('❌ Enter a valid 11-digit Maya number.'); return; }
  } else if (payMethod === 'card') {
    if (document.getElementById('cardNum').value.replace(/\s/g,'').length < 16) { showToast('❌ Enter a valid card number.'); return; }
    if (document.getElementById('cardExp').value.length < 5)                    { showToast('❌ Enter a valid expiry date.'); return; }
    if (document.getElementById('cardCvv').value.length < 3)                    { showToast('❌ Enter a valid CVV.'); return; }
    if (!document.getElementById('cardName').value.trim())                       { showToast('❌ Enter name on card.'); return; }
  }

  goPayStep(3);
  document.getElementById('payProcessing').style.display = 'block';
  document.getElementById('paySuccessContent').style.display = 'none';

  setTimeout(() => {
    document.getElementById('payProcessing').style.display = 'none';
    document.getElementById('paySuccessContent').style.display = 'block';
    const methodLabel = { gcash: 'GCash', maya: 'Maya', card: 'Credit/Debit Card' }[payMethod];
    document.getElementById('paySuccessSummary').innerHTML = `
      <div><strong>Order ID:</strong> #${payOrder.orderId}</div>
      <div><strong>Item:</strong> ${payOrder.item}</div>
      <div><strong>Amount Paid:</strong> ₱${payOrder.dp.toLocaleString()} (${payOrder.isDP ? '30% DP' : 'Full Payment'})</div>
      ${payOrder.isDP ? `<div><strong>Escrow Balance:</strong> ₱${payOrder.balance.toLocaleString()} — released on delivery</div>` : ''}
      <div><strong>Method:</strong> ${methodLabel}</div>
      <div style="color:var(--sage);font-weight:700">✓ Payment Confirmed & Secured</div>`;
  }, 2500);
}

// ─── REPLACE submitOrder() WITH THIS VERSION ────────────────────────────────
// (Delete or comment out the original submitOrder function, paste this instead)

function submitOrder() {
  if (!currentUser) {
    showToast('⚠️ Please sign in first.');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }

  const name    = document.getElementById('buyerName').value.trim();
  const contact = document.getElementById('buyerContact').value.trim();
  const traveler = document.getElementById('selectedTraveler');
  const item    = document.getElementById('itemName').value.trim();
  const budget  = parseFloat(document.getElementById('itemBudget').value) || 0;
  const qty     = parseInt(document.getElementById('itemQty').value) || 1;

  if (!name)           { showToast('⚠️ Please enter your name.'); return; }
  if (!contact)        { showToast('⚠️ Please enter your contact.'); return; }
  if (!traveler.value) { showToast('⚠️ Please select a traveler.'); return; }
  if (!item)           { showToast('⚠️ Please enter the item name.'); return; }
  if (!budget)         { showToast('⚠️ Please enter your budget.'); return; }

  openPaymentModal({ name, contact, traveler: traveler.value, item, budget, qty });
}
