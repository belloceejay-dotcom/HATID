// ─── AUTH ───────────────────────────────────────────────────
const currentUser = JSON.parse(sessionStorage.getItem('hatid_user') || 'null');

function initNav() {
  const navRight = document.getElementById('navRight');
  if (!navRight) return;
  if (currentUser) {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    navRight.innerHTML = `
      <div class="nav-user">
        <div class="nav-avatar">${initials}</div>
        <div><div class="nav-name">${currentUser.name}</div><div class="nav-role">${currentUser.role === 'traveler' ? '✈️ Traveler' : '🛍️ Buyer'}</div></div>
        <button class="logout-btn" onclick="logout()">Sign Out</button>
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

function renderRoleView() {
  if (!currentUser) return;
  // Show/hide sections based on role
  const travelerSections = document.querySelectorAll('.traveler-only');
  const buyerSections    = document.querySelectorAll('.buyer-only');
  travelerSections.forEach(el => el.style.display = currentUser.role === 'traveler' ? '' : 'none');
  buyerSections.forEach(el    => el.style.display = currentUser.role === 'buyer'    ? '' : 'none');
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
      <div class="listing-body">
        <div class="traveler-row">
          <div class="avatar ${l.avatarClass}">${l.avatar}</div>
          <div class="traveler-info">
            <div class="traveler-name">${l.name}</div>
            <div class="stars">⭐ ${l.rating} · ${l.trips} trips</div>
          </div>
          <span class="badge badge-green">✓ Verified</span>
        </div>
        <div class="listing-details">
          <div class="detail-item"><div class="detail-label">Capacity</div><div class="detail-value">${l.capacity}</div></div>
          <div class="detail-item"><div class="detail-label">Service Fee</div><div class="detail-value">${l.fee}</div></div>
        </div>
        <div class="categories">${l.cats.map(c => `<span class="cat-tag">${c}</span>`).join('')}</div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;font-size:0.88rem"
          onclick="selectTraveler('${l.name}','${l.route}','${l.dates}')">Request to This Traveler →</button>
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
  const preview = document.getElementById('imagePreview');
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
function submitOrder() {
  if (!currentUser) { showToast('⚠️ Please sign in first.'); setTimeout(() => { window.location.href = 'login.html'; }, 1200); return; }

  const name     = document.getElementById('buyerName').value.trim();
  const traveler = document.getElementById('selectedTraveler');
  const item     = document.getElementById('itemName').value.trim();
  const budget   = parseFloat(document.getElementById('itemBudget').value) || 0;

  if (!name || !item || !traveler.value || !budget) { showToast('⚠️ Please fill in all required fields.'); return; }

  const orderId  = 'HTD-2025-' + String(Math.floor(Math.random() * 9000) + 1000);
  const requiresDP = budget >= DP_THRESHOLD;
  const dp       = (budget * DP_RATE).toFixed(2);

  document.getElementById('modalTraveler').textContent = traveler.options[traveler.selectedIndex].text;
  document.getElementById('modalItem').textContent     = item;
  document.getElementById('modalBudget').textContent   = budget.toLocaleString('en-PH', { minimumFractionDigits: 2 });
  document.getElementById('modalOrderId').textContent  = orderId;

  const dpRow = document.getElementById('modalDpRow');
  if (requiresDP && dpRow) {
    dpRow.style.display = '';
    document.getElementById('modalDp').textContent = 'PHP ' + parseFloat(dp).toLocaleString('en-PH', { minimumFractionDigits: 2 });
  } else if (dpRow) { dpRow.style.display = 'none'; }

  document.getElementById('successModal').classList.add('open');

  // Reset
  ['buyerName','buyerContact','itemName','itemLink','itemBudget','itemQty','itemNotes'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  if (traveler) traveler.selectedIndex = 0;
  const dpNotice = document.getElementById('dpNotice'); if (dpNotice) dpNotice.classList.remove('show');
  const preview  = document.getElementById('imagePreview'); if (preview) preview.innerHTML = '';
}

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

function closeSuccessModal() {
  closeModal('successModal');
  document.getElementById('tracker').scrollIntoView({ behavior: 'smooth' });
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
// ─── RATINGS & REVIEW ───────────────────────────────────────
let currentRating = 0;
const miniRatings = { comm: 0, accuracy: 0, speed: 0 };
const ratingLabels = ['', 'Poor 😕', 'Fair 🙂', 'Good 👍', 'Great 😊', 'Excellent! 🌟'];

function confirmDelivery() {
  // Update tracker steps
  document.getElementById('stepDelivered').className = 'step-circle step-done';
  document.getElementById('stepDelivered').textContent = '✓';
  document.getElementById('stepCompleted').className  = 'step-circle step-active';

  // Hide action buttons, hide cancel warning
  document.getElementById('confirmDeliveryBtn').style.display = 'none';
  document.getElementById('cancelOrderBtn').style.display     = 'none';
  document.getElementById('cancelWarningBox').style.display   = 'none';

  // Update status badge
  const badge = document.getElementById('orderStatusBadge');
  badge.textContent  = 'Delivered ✓';
  badge.className    = 'badge badge-green';

  // Show review section
  document.getElementById('reviewSection').style.display = 'block';
  document.getElementById('reviewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

  showToast('✅ Delivery confirmed! Escrow released to traveler.');
}

function setRating(val) {
  currentRating = val;
  document.querySelectorAll('.star-rating .star').forEach((s, i) => {
    s.classList.toggle('active', i < val);
  });
  document.getElementById('ratingLabel').textContent = ratingLabels[val];
  document.getElementById('ratingLabel').style.color = 'var(--gold)';
  document.getElementById('ratingLabel').style.fontWeight = '600';
}

function setMiniRating(cat, val) {
  miniRatings[cat] = val;
  document.querySelectorAll(`#stars-${cat} span`).forEach((s, i) => {
    s.classList.toggle('active', i < val);
  });
}

function submitReview() {
  if (!currentRating) { showToast('⚠️ Please select an overall star rating.'); return; }

  const reviewText  = document.getElementById('reviewText').value.trim();
  const recommended = document.getElementById('recommendCheck').checked;
  const stars       = '★'.repeat(currentRating) + '☆'.repeat(5 - currentRating);

  // Build display
  const display = document.getElementById('reviewDisplay');
  display.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
      <div>
        <div style="font-weight:700;font-size:0.95rem">Maria R.</div>
        <div style="color:var(--gold);font-size:1.1rem;letter-spacing:2px">${stars}</div>
      </div>
      <div style="font-size:0.75rem;color:var(--muted)">${new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">
      ${miniRatings.comm     ? `<span style="background:#fff3e0;color:var(--gold);padding:2px 8px;border-radius:100px;font-size:0.75rem;font-weight:600">Communication ${'★'.repeat(miniRatings.comm)}</span>` : ''}
      ${miniRatings.accuracy ? `<span style="background:#fff3e0;color:var(--gold);padding:2px 8px;border-radius:100px;font-size:0.75rem;font-weight:600">Item Accuracy ${'★'.repeat(miniRatings.accuracy)}</span>` : ''}
      ${miniRatings.speed    ? `<span style="background:#fff3e0;color:var(--gold);padding:2px 8px;border-radius:100px;font-size:0.75rem;font-weight:600">Delivery Speed ${'★'.repeat(miniRatings.speed)}</span>` : ''}
    </div>
    ${reviewText ? `<div style="font-size:0.88rem;color:var(--ink);line-height:1.6;margin-bottom:8px">"${reviewText}"</div>` : ''}
    ${recommended ? `<div style="font-size:0.82rem;color:var(--sage);font-weight:600">👍 Recommends this traveler</div>` : ''}
  `;

  // Update completed step
  document.getElementById('stepCompleted').className  = 'step-circle step-done';
  document.getElementById('stepCompleted').textContent = '✓';
  document.getElementById('completedTime').textContent = 'Just now';

  // Update badge
  const badge = document.getElementById('orderStatusBadge');
  badge.textContent = 'Completed ⭐';
  badge.className   = 'badge badge-green';

  // Hide form, show submitted card
  document.querySelector('#reviewSection .submit-btn').style.display = 'none';
  document.querySelector('#reviewSection textarea').style.display    = 'none';
  document.querySelector('#reviewSection .star-rating').parentElement.style.display = 'none';
  document.querySelectorAll('#reviewSection > div:not(#reviewSubmitted)').forEach(el => {
    if (!el.querySelector('h3') && el.id !== 'reviewSubmitted') el.style.display = 'none';
  });
  document.getElementById('reviewSubmitted').style.display = 'block';
  document.getElementById('reviewSubmitted').scrollIntoView({ behavior: 'smooth' });

  showToast('⭐ Review submitted! Salamat sa feedback.');
}