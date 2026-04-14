export const SHIPPING_THRESHOLD = 500
export const SHIPPING_FEE = 99

/**
 * Returns shipping cost in MXN.
 * Free (0) for orders >= SHIPPING_THRESHOLD, otherwise SHIPPING_FEE.
 */
export function calculateShipping(subtotal) {
  return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}
