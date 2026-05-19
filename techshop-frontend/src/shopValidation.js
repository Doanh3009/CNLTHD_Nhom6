export function cleanPhone(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 10);
}

export function isValidVietnamPhone(value) {
  return /^0\d{9}$/.test(String(value ?? ''));
}

export function isValidDeliveryAddress(value) {
  const address = String(value ?? '').trim();
  return address.length >= 8 && /\d/.test(address) && /\p{L}/u.test(address);
}

export function cleanShortText(value) {
  return String(value ?? '').replace(/[<>]/g, '').slice(0, 120);
}

export function cleanLongText(value) {
  return String(value ?? '').replace(/[<>]/g, '').slice(0, 240);
}
