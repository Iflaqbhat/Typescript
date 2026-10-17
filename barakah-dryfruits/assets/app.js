import { validGrams, estimatePaise, cleanCart, whatsappOrderUrl } from './cart-utils.js';

const products = await fetch('/assets/catalog.json').then(r => { if (!r.ok) throw new Error('Catalog unavailable'); return r.json(); });
const STORAGE = 'barakah-bag-v1';
let cart = [];
try { cart = cleanCart(JSON.parse(localStorage.getItem(STORAGE)), products); } catch {}
const money = paise => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(paise / 100);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimer;
function toast(text) {
  const el = document.getElementById('toast');
  el.textContent = text; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
}
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify(cart)); } catch {}
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.reduce((n, x) => n + x.quantity, 0));
}
save();
function openDialog(dialog) {
  document.querySelectorAll('dialog[open]').forEach(d => d.close());
  dialog.showModal();
}
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => {
  if (e.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close();
  }
}));
const menuButton = document.querySelector('.mobile-menu-toggle');
const dropdown = document.querySelector('.nav-dropdown');
document.addEventListener('click', e => { if (dropdown && !dropdown.contains(e.target)) dropdown.open = false; });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (dropdown?.open) { dropdown.open = false; dropdown.querySelector('summary').focus(); }
    const nav = document.querySelector('.mobile-nav');
    if (!nav.hidden) { nav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); menuButton.focus(); }
  }
});
menuButton.addEventListener('click', () => {
  const nav = document.querySelector('.mobile-nav');
  nav.hidden = !nav.hidden;
  menuButton.setAttribute('aria-expanded', String(!nav.hidden));
  menuButton.setAttribute('aria-label', nav.hidden ? 'Open navigation' : 'Close navigation');
});

function renderPack(container, p, modal = false) {
  const weights = p.id === 'kashmiri-saffron' ? [1, 2, 5] : [100, 250, 500, 1000];
  let grams = p.defaultGrams;
  const prefix = modal ? 'modal' : 'detail';
  container.innerHTML = `${modal ? `<span class="eyebrow">YOUR PERFECT PORTION</span><h2 id="pack-title">${p.name}</h2>` : ''}<form class="pack-form"><label>Choose your pack size</label><div class="weight-options">${weights.map(g => `<button type="button" class="weight-option" data-weight="${g}" aria-pressed="${g === grams}">${g >= 1000 ? g / 1000 + 'kg' : g + 'g'}</button>`).join('')}<button type="button" class="weight-option" data-weight="custom" aria-pressed="false">Custom weight</button></div><label class="custom-weight">Your weight in grams<input name="grams" type="number" inputmode="decimal" min="${p.minGrams}" max="${p.maxGrams}" step="${p.stepGrams}" value="${grams}" id="${prefix}-grams"><span class="subtle">${p.minGrams}g–${p.maxGrams}g, in ${p.stepGrams}g steps.</span></label><label>Number of packs<input name="quantity" class="pack-quantity" type="number" min="1" max="99" step="1" value="1" inputmode="numeric"></label><div class="pack-estimate"><span>Estimated product total</span><strong class="estimate-value"></strong></div><p class="error-message" role="alert"></p><button class="button" type="submit" data-pack-action="whatsapp">Order this pack on WhatsApp ↗</button><button class="button button-secondary" type="submit" data-pack-action="save">Add to bag · keep shopping</button><p class="subtle">Opens WhatsApp with your product, weight and quantity filled in. Just review and tap Send. We aim to confirm within 30 minutes of receiving your message; timing may vary.</p></form>`;
  const form = container.querySelector('form');
  const quantity = form.elements.quantity;
  const gramsInput = form.elements.grams;
  const error = form.querySelector('.error-message');
  function update() {
    const q = Number(quantity.value);
    grams = Number(gramsInput.value);
    const valid = validGrams(p, grams) && Number.isInteger(q) && q >= 1 && q <= 99;
    form.querySelector('.estimate-value').textContent = valid ? money(estimatePaise(p, grams, q)) : '—';
    error.textContent = valid ? '' : `Choose a weight in ${p.stepGrams}g steps (${p.minGrams}g–${p.maxGrams}g) and 1–99 packs.`;
    form.querySelectorAll('[type=submit]').forEach(button => button.disabled = !valid);
  }
  form.querySelectorAll('[data-weight]').forEach(button => button.addEventListener('click', () => {
    form.querySelectorAll('[data-weight]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const custom = button.dataset.weight === 'custom';
    form.querySelector('.custom-weight').classList.toggle('visible', custom);
    if (custom) gramsInput.focus();
    else gramsInput.value = button.dataset.weight;
    update();
  }));
  gramsInput.addEventListener('input', update); quantity.addEventListener('input', update);
  form.addEventListener('submit', e => {
    e.preventDefault(); update();
    const q = Number(quantity.value);
    if (!validGrams(p, grams) || !Number.isInteger(q) || q < 1 || q > 99) return;
    const existing = cart.find(x => x.id === p.id && x.grams === grams);
    if (existing && existing.quantity + q > 99) { error.textContent = 'Your bag can hold up to 99 packs of each weight. Please enquire on WhatsApp for larger orders.'; return; }
    if (!existing && cart.length >= 100) { error.textContent = 'Your bag is full. Please enquire on WhatsApp for larger orders.'; return; }
    if (existing) existing.quantity += q;
    else cart.push({ id: p.id, grams, quantity: q });
    save();
    if (modal) document.getElementById('pack-dialog').close();
    if (e.submitter?.dataset.packAction === 'save') toast(`${p.name} · ${grams}g saved to your bag`);
    else showOrderHandoff(whatsappOrderUrl([{ id: p.id, grams, quantity: q }], products));
  });
  update();
}
document.querySelectorAll('[data-customize]').forEach(button => button.addEventListener('click', () => {
  const p = products.find(x => x.id === button.dataset.customize);
  if (!p) return;
  renderPack(document.getElementById('pack-content'), p, true);
  openDialog(document.getElementById('pack-dialog'));
}));
document.querySelectorAll('.inline-pack').forEach(el => {
  const p = products.find(p => p.id === el.dataset.productId);
  if (p) renderPack(el, p);
});

function showOrderHandoff(url) {
  // Open synchronously within the customer's click; the site never sends the message.
  window.open(url, '_blank', 'noopener,noreferrer');
  let dialog = document.getElementById('order-handoff');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'order-handoff'; dialog.className = 'pack-dialog';
    dialog.setAttribute('aria-labelledby', 'handoff-title');
    document.body.append(dialog);
  }
  dialog.innerHTML = `<button class="dialog-close" aria-label="Close order message">×</button><span class="eyebrow">ONE TAP LEFT IN WHATSAPP</span><h2 id="handoff-title">Your message is ready.</h2><p class="handoff-copy">Your selected product, pack weight and quantity are already filled in. Review the message and tap <strong>Send</strong> in WhatsApp.</p><div class="response-note"><strong>Confirmation expected within 30 minutes</strong><p>After Shakir receives your message. Response time may vary. Your order is confirmed only when he replies.</p></div><a class="button" href="${escape(url)}" target="_blank" rel="noopener">Open WhatsApp again ↗</a><button class="button button-secondary handoff-back">Continue shopping</button>`;
  dialog.querySelector('.dialog-close').onclick = () => dialog.close();
  dialog.querySelector('.handoff-back').onclick = () => dialog.close();
  openDialog(dialog);
}

function renderCart() {
  const container = document.getElementById('cart-content');
  document.getElementById('cart-heading-count').textContent = `(${cart.reduce((n, x) => n + x.quantity, 0)})`;
  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty"><h3>A little room for goodness.</h3><p>Your bag is waiting for its first favourite.</p><a class="button" href="/shop/">Explore the collection →</a></div>';
    return;
  }
  let total = 0;
  container.innerHTML = cart.map((item, i) => {
    const p = products.find(p => p.id === item.id);
    const amount = estimatePaise(p, item.grams, item.quantity); total += amount;
    return `<div class="cart-item"><img src="/assets/${p.image}" alt="${escape(p.alt)}"><div><h3>${p.name}</h3><p>${item.grams}g per pack</p><div class="quantity-controls"><button data-change="${i}" data-delta="-1" aria-label="Decrease ${p.name} quantity" ${item.quantity === 1 ? 'disabled' : ''}>−</button><span>${item.quantity}</span><button data-change="${i}" data-delta="1" aria-label="Increase ${p.name} quantity" ${item.quantity === 99 ? 'disabled' : ''}>+</button><button class="remove-item" data-remove="${i}" aria-label="Remove ${p.name} ${item.grams}g">Remove</button></div></div><span class="cart-item-price">${money(amount)}</span></div>`;
  }).join('') + `<div class="cart-total"><span>Estimated subtotal</span><strong>${money(total)}</strong></div><p class="subtle">Product estimate only. Delivery charges and final prices are confirmed on WhatsApp before payment.</p><form class="cart-checkout-form"><label>Delivery PIN code<input name="pincode" placeholder="Six-digit Indian PIN code" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" maxlength="6" required></label><label>Anything else? <span class="subtle">(optional)</span><textarea name="note" rows="2" maxlength="1000" placeholder="Variety, gift requirements, or a question…"></textarea></label><p class="error-message" role="alert"></p><button class="button" type="submit">Confirm on WhatsApp ↗</button><p class="subtle">Opens a message for you to review and send. No payment is taken here.</p></form>`;
  container.querySelectorAll('[data-change]').forEach(button => button.addEventListener('click', () => {
    const item = cart[Number(button.dataset.change)];
    item.quantity = Math.max(1, Math.min(99, item.quantity + Number(button.dataset.delta)));
    save(); renderCart();
  }));
  container.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
    cart.splice(Number(button.dataset.remove), 1); save(); renderCart();
  }));
  container.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      showOrderHandoff(whatsappOrderUrl(cart, products, form.elements.pincode.value.trim(), form.elements.note.value));
    } catch (error) { form.querySelector('.error-message').textContent = error.message; }
  });
}
document.querySelectorAll('.cart-toggle').forEach(button => button.addEventListener('click', () => { renderCart(); openDialog(document.getElementById('cart-dialog')); }));
document.getElementById('enquiry-form')?.addEventListener('submit', e => {
  e.preventDefault(); const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const message = `Hello Shakir! My name is ${form.elements.customer.value.trim()}.\nDelivery PIN code: ${form.elements.pincode.value.trim()}\n\n${form.elements.message.value.trim()}`;
  window.open('https://wa.me/917889826963?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});
const search = document.getElementById('product-search');
if (search) {
  const grid = document.querySelector('.shop-grid');
  const cards = [...grid.querySelectorAll('.product-card')];
  const sort = document.getElementById('product-sort');
  function filter() {
    const query = search.value.toLocaleLowerCase().trim();
    let count = 0;
    cards.forEach(card => { card.hidden = !card.dataset.search.includes(query); if (!card.hidden) count++; });
    document.getElementById('result-count').textContent = `${count} product${count === 1 ? '' : 's'}`;
    document.getElementById('no-results').hidden = count !== 0;
  }
  search.value = new URLSearchParams(location.search).get('q') || '';
  filter();
  search.addEventListener('input', filter);
  document.getElementById('clear-search').addEventListener('click', () => { search.value = ''; filter(); search.focus(); });
  sort.addEventListener('change', () => {
    const ordered = [...cards].sort((a, b) => {
      const pa = products.find(p => a.dataset.productId === p.id);
      const pb = products.find(p => b.dataset.productId === p.id);
      if (sort.value === 'name') return pa.name.localeCompare(pb.name);
      if (sort.value.startsWith('price')) return (estimatePaise(pa, pa.defaultGrams) - estimatePaise(pb, pb.defaultGrams)) * (sort.value === 'price-low' ? 1 : -1);
      return products.indexOf(pa) - products.indexOf(pb);
    });
    ordered.forEach(card => grid.append(card));
  });
}
window.addEventListener('storage', e => { if (e.key === STORAGE) { try { cart = cleanCart(JSON.parse(e.newValue), products); } catch { cart = []; } save(); if (document.getElementById('cart-dialog').open) renderCart(); } });
