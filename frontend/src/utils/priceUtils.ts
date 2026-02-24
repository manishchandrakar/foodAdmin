export const getDiscountPercent = (price: number, mrp?: number): number => {
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}
