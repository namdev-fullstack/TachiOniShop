"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Plus,
  X,
  RotateCcw,
  Check,
  Tag,
  Flame,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { removeVietnameseTones } from "@/lib/searchUtils";

// ==========================================
// CONSTANTS & HELPERS
// ==========================================

export const PRICE_STEPS = [
  0, 100000, 200000, 300000, 500000, 800000, 1000000, 1500000, 2000000,
  3000000, 5000000, 10000000,
];

export const PRICE_LABELS = [
  "0đ",
  "100k",
  "200k",
  "300k",
  "500k",
  "800k",
  "1M",
  "1.5M",
  "2M",
  "3M",
  "5M",
  "10M+",
];

export const HOT_HERO_TAGS = [
  "Tachi benimaru",
  "Bolt baron",
  "Nakroth bạch diện",
  "Hayate kid",
  "Ngộ không",
];

export const QUICK_PRESETS = [
  { label: "Dưới 200k", min: 0, max: 200000 },
  { label: "200k - 500k", min: 200000, max: 500000 },
  { label: "500k - 1.5M", min: 500000, max: 1500000 },
  { label: "VIP trên 1.5M", min: 1500000, max: 10000000 },
];

export function priceToStepIndex(price: number): number {
  let bestIdx = 0;
  let minDiff = Infinity;
  for (let i = 0; i < PRICE_STEPS.length; i++) {
    const diff = Math.abs(PRICE_STEPS[i] - price);
    if (diff < minDiff) {
      minDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function formatPriceDisplay(price: number, isMax = false): string {
  if (isMax && price >= 10000000) {
    return "10.000.000đ+";
  }
  if (price === 0) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

// Kiểm tra xem 1 tag hot có đang được chọn hay không (hỗ trợ slug rút gọn như 'tachi' hoặc 'nakroth')
export function isHeroTagSelected(tag: string, selectedHeroes: string[]): boolean {
  const normTag = removeVietnameseTones(tag).toLowerCase().trim();
  return selectedHeroes.some((h) => {
    const normH = removeVietnameseTones(h).toLowerCase().trim();
    return normTag === normH || normTag.startsWith(normH) || normTag.includes(normH);
  });
}

// ==========================================
// COMPONENT PROPS
// ==========================================

interface AccountFiltersProps {
  minPrice: number;
  maxPrice: number;
  selectedHeroes: string[];
  onPriceChange: (min: number, max: number) => void;
  onHeroesChange: (heroes: string[]) => void;
  onResetFilters: () => void;
  onClose?: () => void;
}

export default function AccountFilters({
  minPrice,
  maxPrice,
  selectedHeroes,
  onPriceChange,
  onHeroesChange,
  onResetFilters,
  onClose,
}: AccountFiltersProps) {
  const [customHeroInput, setCustomHeroInput] = useState("");

  const minStepIdx = priceToStepIndex(minPrice);
  const maxStepIdx = priceToStepIndex(maxPrice);

  // Xử lý kéo thanh trượt 2 đầu có độ hít snap-to-step
  const handleSliderChange = (vals: number[]) => {
    if (!vals || vals.length < 2) return;
    const [lowIdx, highIdx] = vals;
    const newMin = PRICE_STEPS[Math.min(lowIdx, highIdx)];
    const newMax = PRICE_STEPS[Math.max(lowIdx, highIdx)];
    onPriceChange(newMin, newMax);
  };

  // Áp dụng nút chọn nhanh khoảng giá
  const handleSelectPreset = (presetMin: number, presetMax: number) => {
    onPriceChange(presetMin, presetMax);
  };

  // Toggle chọn tag tướng hot
  const handleToggleHotHero = (hotTag: string) => {
    const isSelected = isHeroTagSelected(hotTag, selectedHeroes);
    if (isSelected) {
      const normHot = removeVietnameseTones(hotTag).toLowerCase().trim();
      const updated = selectedHeroes.filter((h) => {
        const normH = removeVietnameseTones(h).toLowerCase().trim();
        return !(normHot === normH || normHot.startsWith(normH) || normHot.includes(normH));
      });
      onHeroesChange(updated);
    } else {
      onHeroesChange([...selectedHeroes, hotTag]);
    }
  };

  // Thêm tag tướng từ ô input
  const handleAddCustomHero = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customHeroInput.trim();
    if (!clean) return;

    const normClean = removeVietnameseTones(clean).toLowerCase();
    const exists = selectedHeroes.some(
      (h) => removeVietnameseTones(h).toLowerCase() === normClean
    );

    if (!exists) {
      onHeroesChange([...selectedHeroes, clean]);
    }
    setCustomHeroInput("");
  };

  // Xóa 1 tag tướng
  const handleRemoveHero = (heroToRemove: string) => {
    onHeroesChange(selectedHeroes.filter((h) => h !== heroToRemove));
  };

  const isPriceFiltered = minPrice > 0 || maxPrice < 10000000;
  const isHeroesFiltered = selectedHeroes.length > 0;
  const hasActiveFilters = isPriceFiltered || isHeroesFiltered;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-5">
      {/* HEADER BỘ LỌC */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#5B5DFE]/10 text-[#5B5DFE]">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Bộ Lọc Chuyên Sâu
          </h2>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#5B5DFE]/10 text-[#5B5DFE]">
              {(isPriceFiltered ? 1 : 0) + selectedHeroes.length} đang áp dụng
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Đóng bộ lọc"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PHẦN A: THANH TRƯỢT KHOẢNG GIÁ CÓ ĐỘ HÍT THEO MỐC */}
      {/* ============================================================== */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>Khoảng Giá</span>
            <span className="text-[11px] font-normal text-slate-400">
              (Hít tự động theo mốc)
            </span>
          </label>

          {/* NHÃN GIÁ TRỊ RÕ RÀNG TRÊN 2 ĐẦU KÉO */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs">
            <span>
              Từ: <strong className="text-[#5B5DFE] font-bold">{formatPriceDisplay(minPrice)}</strong>
            </span>
            <span className="text-slate-300">–</span>
            <span>
              Đến: <strong className="text-[#5B5DFE] font-bold">{formatPriceDisplay(maxPrice, true)}</strong>
            </span>
          </div>
        </div>

        {/* THANH KÉO DUAL-THUMB SNAP-TO-STEP */}
        <div className="pt-2 px-1 pb-1">
          <Slider
            min={0}
            max={PRICE_STEPS.length - 1}
            step={1}
            value={[minStepIdx, maxStepIdx]}
            onValueChange={handleSliderChange}
            className="w-full cursor-pointer py-1"
            aria-label="Khoảng giá tài khoản"
          />

          {/* CÁC VẠCH CHIA (TICK MARKS) */}
          <div className="relative w-full h-3 mt-1.5 select-none">
            {PRICE_STEPS.map((step, idx) => {
              const percent = (idx / (PRICE_STEPS.length - 1)) * 100;
              const inRange = idx >= minStepIdx && idx <= maxStepIdx;
              const isSelectedThumb = idx === minStepIdx || idx === maxStepIdx;

              return (
                <div
                  key={step}
                  style={{ left: `${percent}%` }}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                >
                  <span
                    className={`w-1 transition-all rounded-full ${
                      isSelectedThumb
                        ? "h-2.5 bg-[#5B5DFE] ring-2 ring-[#5B5DFE]/20"
                        : inRange
                        ? "h-2 bg-[#5B5DFE]/80"
                        : "h-1.5 bg-slate-300"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* NHÃN MỐC TIÊU BIỂU DƯỚI VẠCH CHIA */}
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-medium text-slate-400 select-none px-0.5">
            <span>0đ</span>
            <span className="hidden sm:inline">300k</span>
            <span className="hidden sm:inline">800k</span>
            <span>1.5M</span>
            <span className="hidden sm:inline">3M</span>
            <span className="hidden sm:inline">5M</span>
            <span>10M+</span>
          </div>
        </div>

        {/* 4 NÚT CHỌN NHANH (QUICK PRESETS) */}
        <div className="pt-1">
          <div className="text-[11px] font-medium text-slate-500 mb-1.5">
            Chọn nhanh mức giá:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {QUICK_PRESETS.map((preset) => {
              const isActive = minPrice === preset.min && maxPrice === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset.min, preset.max)}
                  className={`h-8 sm:h-9 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isActive
                      ? "bg-[#5B5DFE] text-white shadow-xs font-bold"
                      : "bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 border border-slate-200/60"
                  }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* ============================================================== */}
      {/* PHẦN B: GỢI Ý 5 TAG TƯỚNG HOT + Ô TÌM NHANH TƯỚNG */}
      {/* ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Tướng & Trang Phục Yêu Thích</span>
          </label>
          {selectedHeroes.length > 0 && (
            <span className="text-[11px] font-medium text-slate-500">
              Đã chọn: <strong className="text-slate-800">{selectedHeroes.length}</strong>
            </span>
          )}
        </div>

        {/* 5 TAG TƯỚNG HOT NỔI BẬT */}
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-1.5">
            Gợi ý tướng hot kèm skin (chọn nhiều):
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {HOT_HERO_TAGS.map((hotTag) => {
              const active = isHeroTagSelected(hotTag, selectedHeroes);
              return (
                <button
                  key={hotTag}
                  type="button"
                  onClick={() => handleToggleHotHero(hotTag)}
                  className={`h-8 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                    active
                      ? "bg-[#5B5DFE] text-white shadow-xs"
                      : "bg-slate-100/90 hover:bg-slate-200 text-slate-700 border border-slate-200/70"
                  }`}
                >
                  {active ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Tag className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{hotTag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ô INPUT NHẬP TÊN TƯỚNG KHÁC */}
        <form onSubmit={handleAddCustomHero} className="pt-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={customHeroInput}
                onChange={(e) => setCustomHeroInput(e.target.value)}
                placeholder="Nhập tên tướng khác (VD: Murad, Aya, Liliana...)"
                className="h-10 text-xs sm:text-sm pl-3.5 pr-8 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#5B5DFE] focus-visible:ring-2 focus-visible:ring-[#5B5DFE]/20 transition-all"
              />
              {customHeroInput && (
                <button
                  type="button"
                  onClick={() => setCustomHeroInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={!customHeroInput.trim()}
              className="h-10 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Thêm</span>
            </Button>
          </div>
        </form>

        {/* DANH SÁCH CÁC TAG TƯỚNG ĐANG ĐƯỢC CHỌN (KÈM DẤU X ĐỂ XÓA) */}
        <AnimatePresence>
          {selectedHeroes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-1"
            >
              <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center justify-between">
                <span>Đang lọc theo tướng:</span>
                <button
                  type="button"
                  onClick={() => onHeroesChange([])}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                >
                  Xóa tất cả tướng
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedHeroes.map((hero) => (
                  <span
                    key={hero}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-lg bg-[#5B5DFE]/10 border border-[#5B5DFE]/25 text-[#5B5DFE] text-xs font-bold"
                  >
                    <span>{hero}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHero(hero)}
                      className="p-0.5 rounded-full hover:bg-[#5B5DFE]/20 text-[#5B5DFE] transition-colors cursor-pointer"
                      title={`Bỏ chọn ${hero}`}
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
