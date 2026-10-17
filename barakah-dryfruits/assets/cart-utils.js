export function validGrams(product, grams) {
  return Number.isFinite(grams) && grams >= product.minGrams && grams <= product.maxGrams && Math.abs(grams / product.stepGrams - Math.round(grams / product.stepGrams)) < 1e-8;
}
export function estimatePaise(product, grams, quantity = 1) {
  return Math.round(product.pricePerKg * 100 * grams / 1000) * quantity;
}
export function cleanCart(value, products) {
  if (!Array.isArray(value)) return [];
  const cleaned = [];
  for (const item of value.slice(0, 100)) {
    const product = products.find(p => p.id === item?.id);
    if (!product || !validGrams(product, item.grams) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) continue;
    const existing = cleaned.find(x => x.id === item.id && x.grams === item.grams);
    if (existing) existing.quantity = Math.min(99, existing.quantity + item.quantity);
    else cleaned.push({ id: item.id, grams: item.grams, quantity: item.quantity });
  }
  return cleaned;
}
export function orderMessage(cart, products, pin = '', note = '') {
  if (pin && !/^[1-9][0-9]{5}$/.test(pin)) throw new Error('Enter a valid six-digit Indian PIN code.');
  let total = 0;
  const lines = cart.map(item => {
    const p = products.find(p => p.id === item.id);
    if (!p || !validGrams(p, item.grams) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) throw new Error('Please review your bag.');
    const paise = estimatePaise(p, item.grams, item.quantity);
    total += paise;
    return `• ${p.name} — ${item.grams}g × ${item.quantity} — ₹${(paise / 100).toLocaleString('en-IN')}`;
  });
  if (!lines.length) throw new Error('Add a product to your bag first.');
  return `Hello Shakir! Please confirm my Barakah Dryfruits order request:\n\n${lines.join('\n')}\n\nIndicative product total: ₹${(total / 100).toLocaleString('en-IN')}\n${pin ? 'Delivery PIN code: ' + pin : 'Delivery: please confirm my address and PIN code in this chat.'}${note.trim() ? '\nNotes: ' + note.trim().slice(0, 1000) : ''}\n\nPlease confirm varieties, availability, final prices, delivery charges and payment details before placing my order. Please also confirm the INSTA5 follower offer (5% off products, delivery excluded). I understand the order is confirmed only after your reply. Expected response: within 30 minutes after you receive this message; timing may vary.`;
}

export function whatsappOrderUrl(cart, products, pin = '', note = '') {
  return 'https://wa.me/917889826963?text=' + encodeURIComponent(orderMessage(cart, products, pin, note));
}
