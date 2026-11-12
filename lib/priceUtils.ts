// Tiện ích tính toán giá bán, giá thật và chênh lệch lợi nhuận cho sản phẩm

export interface PricingTier {
  id: string;
  min: number;
  max: number | null; // null = không giới hạn trên
  markupPercent: number;
  label: string;
  shortLabel: string;
  exampleText: string;
}

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: "under_100k",
    min: 0,
    max: 100_000,
    markupPercent: 80,
    label: "Dưới 100.000đ (< 100k)",
    shortLabel: "< 100k",
    exampleText: "Nhập 50k -> Bán 90k (Lời 40k)",
  },
  {
    id: "100k_300k",
    min: 100_000,
    max: 300_000,
    markupPercent: 60,
    label: "100.000đ – dưới 300.000đ (100k - < 300k)",
    shortLabel: "100k - < 300k",
    exampleText: "Nhập 200k -> Bán 320k (Lời 120k)",
  },
  {
    id: "300k_1m",
    min: 300_000,
    max: 1_000_000,
    markupPercent: 30,
    label: "300.000đ – dưới 1.000.000đ (300k - < 1tr)",
    shortLabel: "300k - < 1tr",
    exampleText: "Nhập 850k -> Bán 1.110k (Lời 260k)",
  },
  {
    id: "1m_1_7m",
    min: 1_000_000,
    max: 1_700_000,
    markupPercent: 20,
    label: "1.000.000đ – dưới 1.700.000đ (1tr - < 1.7tr)",
    shortLabel: "1tr - < 1.7tr",
    exampleText: "Nhập 1.500k -> Bán 1.800k (Lời 300k)",
  },
  {
    id: "1_7m_2_5m",
    min: 1_700_000,
    max: 2_500_000,
    markupPercent: 18,
    label: "1.700.000đ – dưới 2.500.000đ (1.7tr - < 2.5tr)",
    shortLabel: "1.7tr - < 2.5tr",
    exampleText: "Nhập 2.000k -> Bán 2.360k (Lời 360k)",
  },
  {
    id: "above_2_5m",
    min: 2_500_000,
    max: null,
    markupPercent: 15,
    label: "Từ 2.500.000đ trở lên (>= 2.5tr)",
    shortLabel: ">= 2.5tr",
    exampleText: "Nhập 3.000k -> Bán 3.450k (Lời 450k)",
  },
];

export interface PriceCalculation {
  originalPrice: number;
  sellingPrice: number;
  markupPercent: number;
  profit: number;
  tier?: PricingTier;
}

/**
 * Quy tắc làm tròn số:
 * - Với acc có giá gốc < 300.000đ: Làm tròn lên mốc 5.000đ gần nhất (Math.ceil(rawPrice / 5000) * 5000).
 * - Với acc có giá gốc >= 300.000đ: Làm tròn lên mốc 10.000đ gần nhất (Math.ceil(rawPrice / 10000) * 10000).
 */
export function roundSellingPrice(rawPrice: number, originalPrice: number): number {
  if (originalPrice < 300_000) {
    return Math.ceil(rawPrice / 5000) * 5000;
  }
  return Math.ceil(rawPrice / 10000) * 10000;
}

/**
 * Tìm mốc tăng % tương ứng với giá gốc
 */
export function getTierForPrice(
  originalPrice: number,
  tiers: PricingTier[] = DEFAULT_PRICING_TIERS
): PricingTier | undefined {
  return tiers.find((tier) => {
    const minPass = originalPrice >= tier.min;
    const maxPass = tier.max === null ? true : originalPrice < tier.max;
    return minPass && maxPass;
  });
}

/**
 * Tính toán giá bán, % tăng và lợi nhuận
 * @param originalPriceInput Giá gốc (giá nhập)
 * @param isStaff true nếu áp dụng công thức % (nhân viên hoặc admin bật tính %)
 * @param customTiers Danh sách các mốc % tuỳ chỉnh (nếu có từ database)
 */
export function calculateAccountPrice(
  originalPriceInput: number | string,
  isStaff: boolean = true,
  customTiers?: PricingTier[]
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

  // Admin không cần tăng %, giữ nguyên giá bán (trừ khi admin chủ động áp dụng)
  if (!isStaff) {
    return {
      originalPrice,
      sellingPrice: originalPrice,
      markupPercent: 0,
      profit: 0,
    };
  }

  const tiers = customTiers && customTiers.length > 0 ? customTiers : DEFAULT_PRICING_TIERS;
  const matchedTier = getTierForPrice(originalPrice, tiers);
  const markupPercent = matchedTier ? matchedTier.markupPercent : 15;

  const rawSellingPrice = originalPrice * (1 + markupPercent / 100);
  const sellingPrice = roundSellingPrice(rawSellingPrice, originalPrice);
  const profit = Math.max(0, sellingPrice - originalPrice);

  return {
    originalPrice,
    sellingPrice,
    markupPercent,
    profit,
    tier: matchedTier,
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
