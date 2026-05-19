import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cleanLongText,
  cleanPhone,
  cleanShortText,
  isValidDeliveryAddress,
  isValidVietnamPhone,
} from './shopValidation.js';

test('cleanPhone keeps only ten numeric characters', () => {
  assert.equal(cleanPhone(' 0912-345-678 abc'), '0912345678');
});

test('isValidVietnamPhone accepts only ten digit local numbers starting with zero', () => {
  assert.equal(isValidVietnamPhone('0912345678'), true);
  assert.equal(isValidVietnamPhone('1912345678'), false);
  assert.equal(isValidVietnamPhone('091234567'), false);
});

test('isValidDeliveryAddress requires a house number and street text', () => {
  assert.equal(isValidDeliveryAddress('12 Nguyen Trai'), true);
  assert.equal(isValidDeliveryAddress('12 Nguyen Trai, Quan 5'), true);
  assert.equal(isValidDeliveryAddress('Nguyen Trai'), false);
  assert.equal(isValidDeliveryAddress('12345678'), false);
});

test('text cleaners remove angle brackets and enforce length limits', () => {
  assert.equal(cleanShortText('<script>abc</script>'), 'scriptabc/script');
  assert.equal(cleanShortText('a'.repeat(140)).length, 120);
  assert.equal(cleanLongText('b'.repeat(260)).length, 240);
});
