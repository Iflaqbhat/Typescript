import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validGrams, estimatePaise, cleanCart, orderMessage, whatsappOrderUrl } from '../assets/cart-utils.js';
const products = JSON.parse(readFileSync(new URL('../catalog.json', import.meta.url)));
const walnut = products[0], saffron = products.find(p => p.id === 'kashmiri-saffron');
test('custom packs calculate integer paise and enforce weight increments', () => {
  assert.equal(estimatePaise(walnut, 325, 2), 78000);
  assert.equal(estimatePaise(saffron, 0.5, 3), 45000);
  assert.equal(validGrams(walnut, 325), true);
  for (const weight of [-1, 0, 51, Infinity, NaN, 25001]) assert.equal(validGrams(walnut, weight), false);
  assert.equal(validGrams(saffron, 0.5), true);
  assert.equal(validGrams(saffron, 0.7), false);
});
test('persisted cart drops invalid data and combines duplicate packs', () => {
  const cart = cleanCart([{id:walnut.id,grams:250,quantity:2},{id:walnut.id,grams:250,quantity:1},{id:'missing',grams:250,quantity:1},{id:walnut.id,grams:-20,quantity:2},{id:walnut.id,grams:250,quantity:1.5},null],products);
  assert.deepEqual(cart,[{id:walnut.id,grams:250,quantity:3}]);
});
test('WhatsApp summary includes custom weights, quantities, total, PIN and confirmation', () => {
  const message = orderMessage([{id:walnut.id,grams:325,quantity:2},{id:saffron.id,grams:0.5,quantity:1}],products,'190001','Gift pack please');
  assert.match(message,/325g × 2/); assert.match(message,/0.5g × 1/);
  assert.match(message,/₹930/); assert.match(message,/190001/); assert.match(message,/Gift pack please/); assert.match(message,/final prices/);
  assert.throws(() => orderMessage([],products,'190001'),/Add a product/);
  assert.throws(() => orderMessage([{id:walnut.id,grams:250,quantity:1}],products,'000000'),/PIN/);
});

test('5g saffron opens a fully prefilled WhatsApp request without requiring typing', () => {
  const url = new URL(whatsappOrderUrl([{id:saffron.id,grams:5,quantity:1}], products));
  assert.equal(url.origin + url.pathname, 'https://wa.me/917889826963');
  const message=url.searchParams.get('text');
  assert.match(message,/Kashmiri Saffron — 5g × 1 — ₹1,500/);
  assert.match(message,/Please confirm my.*order request/);
  assert.match(message,/30 minutes/);
  assert.match(message,/confirmed only after your reply/);
  assert.match(message,/INSTA5/);
  assert.doesNotMatch(message,/undefined|NaN/);
  assert.throws(() => whatsappOrderUrl([{id:saffron.id,grams:0.7,quantity:1}],products),/review your bag/);
});
