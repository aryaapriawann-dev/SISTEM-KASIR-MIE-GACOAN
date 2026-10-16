import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderTotals,
  formatRupiah,
  getSpicyDetails,
  generateQueueNumber,
  validateOrder,
} from './orderMath.ts';
import type { OrderItem } from './orderMath.ts';

test('formatRupiah formats numbers into Indonesian currency strings', () => {
  assert.equal(formatRupiah(10000), 'Rp 10.000');
  assert.equal(formatRupiah(10500), 'Rp 10.500');
  assert.equal(formatRupiah(0), 'Rp 0');
  assert.equal(formatRupiah(150000), 'Rp 150.000');
});

test('calculateOrderTotals correctly calculates subtotal, 10% PB1 tax, and total for dine in', () => {
  const items: OrderItem[] = [
    {
      id: '1',
      menuId: 'mie_hompimpa',
      name: 'Mie Hompimpa',
      price: 10500,
      quantity: 2,
      category: 'mie',
      spicyLevel: 2,
    },
    {
      id: '2',
      menuId: 'udang_keju',
      name: 'Udang Keju',
      price: 9500,
      quantity: 1,
      category: 'dimsum',
    },
  ];

  // Subtotal = (10500 * 2) + (9500 * 1) = 21000 + 9500 = 30500
  // No packaging fee for dine_in
  // PB1 tax = 10% of 30500 = 3050
  // Total = 30500 + 3050 = 33550
  const totals = calculateOrderTotals(items, 'dine_in');
  assert.equal(totals.subtotal, 30500);
  assert.equal(totals.packagingFee, 0);
  assert.equal(totals.discount, 0);
  assert.equal(totals.pb1Tax, 3050);
  assert.equal(totals.total, 33550);
});

test('calculateOrderTotals applies takeaway packaging fee of Rp 1.000 per food box', () => {
  const items: OrderItem[] = [
    {
      id: '1',
      menuId: 'mie_hompimpa',
      name: 'Mie Hompimpa',
      price: 10500,
      quantity: 3,
      category: 'mie',
    },
    {
      id: '2',
      menuId: 'es_gobak_sodor',
      name: 'Es Gobak Sodor',
      price: 9000,
      quantity: 2,
      category: 'minuman',
    },
  ];

  // Food items = 3 (mie). Beverages do not incur the Rp 1.000 food box fee.
  const totals = calculateOrderTotals(items, 'takeaway');
  assert.equal(totals.packagingFee, 3000);
});

test('calculateOrderTotals handles valid discount voucher correctly', () => {
  const items: OrderItem[] = [
    {
      id: '1',
      menuId: 'paket_hemat',
      name: 'Paket Kenyang',
      price: 40000,
      quantity: 1,
      category: 'paket',
    },
  ];

  // Voucher HEMAT10K: flat Rp 10.000 discount (min spend 40.000)
  // Subtotal = 40.000
  // Discount = 10.000 -> Taxable = 30.000
  // PB1 Tax = 3.000
  // Total = 33.000
  const totals = calculateOrderTotals(items, 'dine_in', 'HEMAT10K');
  assert.equal(totals.discount, 10000);
  assert.equal(totals.pb1Tax, 3000);
  assert.equal(totals.total, 33000);
  assert.equal(totals.appliedVoucher?.code, 'HEMAT10K');
});

test('getSpicyDetails returns proper chili count and danger flag', () => {
  const level0 = getSpicyDetails(0);
  assert.equal(level0.isExtremelySpicy, false);
  assert.match(level0.chiliCount, /0 Cabe/);

  const level3 = getSpicyDetails(3);
  assert.equal(level3.isExtremelySpicy, false);
  assert.match(level3.chiliCount, /35 Cabe/);

  const level8 = getSpicyDetails(8);
  assert.equal(level8.isExtremelySpicy, true);
  assert.match(level8.chiliCount, /100\+/);
});

test('generateQueueNumber produces padded queue identifiers', () => {
  assert.equal(generateQueueNumber(1), 'GC-A001');
  assert.equal(generateQueueNumber(25), 'GC-A025');
  assert.equal(generateQueueNumber(50), 'GC-A050');
  assert.equal(generateQueueNumber(51), 'GC-B001');
});

test('validateOrder checks dine_in table number and takeaway name constraints', () => {
  const invalidDineIn = validateOrder({
    orderType: 'dine_in',
    tableNumber: '',
    customerName: '',
    itemCount: 2,
  });
  assert.equal(invalidDineIn.valid, false);

  const validDineIn = validateOrder({
    orderType: 'dine_in',
    tableNumber: '12',
    customerName: '',
    itemCount: 2,
  });
  assert.equal(validDineIn.valid, true);

  const invalidTakeaway = validateOrder({
    orderType: 'takeaway',
    tableNumber: '',
    customerName: 'A',
    itemCount: 2,
  });
  assert.equal(invalidTakeaway.valid, false);

  const validTakeaway = validateOrder({
    orderType: 'takeaway',
    tableNumber: '',
    customerName: 'Budi Santoso',
    itemCount: 1,
  });
  assert.equal(validTakeaway.valid, true);
});
