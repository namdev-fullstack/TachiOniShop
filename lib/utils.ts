
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// utils/deposit.ts
export function getDeposit(price: number): number {
  if (price < 200_000) return 49_000;
  if (price >= 200_000 && price < 500_000) return 99_000;
  if (price >= 500_000 && price < 700_000) return 149_000;
  if (price >= 700_000 && price < 1_000_000) return 179_000;
  if (price >= 1_000_000 && price < 1_500_000) return 249_000;
  if (price >= 1_500_000 && price < 2_000_000) return 299_000;
  if (price >= 2_000_000 && price < 2_500_000) return 349_000;
  if (price >= 2_500_000 && price < 3_000_000) return 500_000;
  if (price >= 3_000_000 && price < 3_500_000) return 649_000;
  if (price >= 3_500_000 && price < 4_000_000) return 749_000;
  if (price >= 4_000_000 && price < 4_500_000) return 849_000;
  if (price >= 4_500_000 && price < 5_000_000) return 949_000;
  if (price >= 5_000_000 && price < 5_500_000) return 1_049_000;
  if (price >= 5_500_000 && price < 6_000_000) return 1_149_000;
  if (price >= 6_000_000 && price < 6_500_000) return 1_249_000;
  if (price >= 6_500_000 && price < 7_000_000) return 1_300_000;
  if (price >= 7_000_000 && price < 7_500_000) return 1_400_000;
  if (price >= 7_500_000 && price < 8_000_000) return 1_500_000;
  if (price >= 8_000_000 && price < 8_500_000) return 1_600_000;
  if (price >= 8_500_000 && price < 9_000_000) return 1_700_000;
  if (price >= 9_000_000 && price < 9_500_000) return 1_800_000;
  if (price >= 9_500_000 && price < 10_000_000) return 1_900_000;



  return 0; // ngoài range thì k cọc
}


export function addPrice(price: number): number {
  const ranges = [
    { min: 0, max: 100_000, add: 99_000 },
    { min: 100_000, max: 200_000, add: 149_000 },
    { min: 200_000, max: 300_000, add: 199_000 },
    { min: 300_000, max: 400_000, add: 249_000 },
    { min: 400_000, max: 500_000, add: 299_000 },
    { min: 500_000, max: 600_000, add: 349_000 },
    { min: 600_000, max: 700_000, add: 399_000 },
    { min: 700_000, max: 800_000, add: 449_000 },
    { min: 800_000, max: 900_000, add: 499_000 },
    { min: 900_000, max: 1_000_000, add: 549_000 },
    { min: 1_000_000, max: 1_200_000, add: 649_000 },
    { min: 1_200_000, max: 1_400_000, add: 749_000 },
    { min: 1_400_000, max: 1_600_000, add: 849_000 },
    { min: 1_600_000, max: 1_800_000, add: 949_000 },
    { min: 1_800_000, max: 2_000_000, add: 1_049_000 },
    { min: 2_000_000, max: 2_500_000, add: 1_249_000 },
    { min: 2_500_000, max: 3_000_000, add: 1_449_000 },
    { min: 3_000_000, max: 3_500_000, add: 1_649_000 },
    { min: 3_500_000, max: 4_000_000, add: 1_849_000 },
    { min: 4_000_000, max: 4_500_000, add: 2_049_000 },
    { min: 4_500_000, max: 5_000_000, add: 2_249_000 },
    { min: 5_000_000, max: 5_500_000, add: 2_499_000 },
    { min: 5_500_000, max: 6_000_000, add: 2_749_000 },
    { min: 6_000_000, max: 6_500_000, add: 2_999_000 },
    { min: 6_500_000, max: 7_000_000, add: 3_249_000 },
    { min: 7_000_000, max: 7_500_000, add: 3_499_000 },
    { min: 7_500_000, max: 8_000_000, add: 3_749_000 },
    { min: 8_000_000, max: 8_500_000, add: 3_999_000 },
    { min: 8_500_000, max: 9_000_000, add: 4_249_000 },
    { min: 9_000_000, max: 9_500_000, add: 4_499_000 },
    { min: 9_500_000, max: 10_000_000, add: 4_749_000 },
    { min: 10_000_000, max: 12_000_000, add: 5_249_000 },
    { min: 12_000_000, max: 15_000_000, add: 5_999_000 },
    { min: 15_000_000, max: 20_000_000, add: 6_999_000 },
    { min: 20_000_000, max: 30_000_000, add: 8_999_000 },
  ];


  const found = ranges.find(r => price >= r.min && price < r.max);
  return found ? found.add : 0;
}


export const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};