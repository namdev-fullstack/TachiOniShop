// Tiện ích tính toán giá bán, giá thật và chênh lệch lợi nhuận cho sản phẩm

export interface PriceCalculation {
  originalPrice: number;
  sellingPrice: number;
  markupPercent: number;
  profit: number;
}

/**
 * Quy tắc tính giá:
 * - Admin đăng: Giữ nguyên giá thật (markup = 0%), không cộng % chênh lệch.
 * - Nhân viên đăng:
 *   + Dưới 1 triệu (< 1,000,000đ): Tăng 30% (+30%)
 *   + Từ 1 triệu trở lên (>= 1,000,000đ): Tăng 25% (+25%)
 */
export function calculateAccountPrice(
  originalPriceInput: number | string,
  isStaff: boolean
): PriceCalculation {
  const originalPrice =
    typeof originalPriceInput === "string"
      ? Number(originalPriceInput.replace(/\D/g, ""))
      : Number(originalPriceInput || 0);

  if (originalPrice <= 0) {
    return {
      originalPrice: 0,
      sellingPrice: 0,
      markupPercent: 0,
      profit: 0,
    };
  }

  // Admin không cần tăng %, giữ nguyên giá bán
  if (!isStaff) {
    return {
      originalPrice,
      sellingPrice: originalPrice,
      markupPercent: 0,
      profit: 0,
    };
  }

  // Nhân viên: dưới 1tr tăng 30%, từ 1tr trở lên tăng 25%
  const markupPercent = originalPrice < 1_000_000 ? 30 : 25;
  const profit = Math.round((originalPrice * markupPercent) / 100);
  const sellingPrice = originalPrice + profit;

  return {
    originalPrice,
    sellingPrice,
    markupPercent,
    profit,
  };
}

export const formatVND = (price: number | string | undefined | null): string => {
  if (price === undefined || price === null || price === "") return "0 ₫";
  const num = typeof price === "string" ? Number(price.replace(/\D/g, "")) : Number(price);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};
