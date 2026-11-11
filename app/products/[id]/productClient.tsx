"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
  ArrowUpDown,
  X,
  Grid,
  Crown,
  Zap,
  Flame,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from "lucide-react";

// Firebase
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Shared components
import AccountCard from "@/components/AccountCard";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { matchAccountFuzzy } from "@/lib/searchUtils";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// TYPES
// ==========================================

type Category = {
  id: string;
  name: string;
};

type CategoryKey = "all" | "white" | "lq_under1m" | "lq_1m_3m" | "lq_over3m";
type SortKey = "newest" | "price_asc" | "price_desc";

type Account = {
  id: string;
  code: string;
  title: string;
  rank: string;
  heroes_count: number;
  skins_count: number;
  price: number;
  fake_price: number;
  highlight: string;
  is_sale: boolean;
  images: string[];
  created_at: any;
  category_id: string;
  categories: Category | null;
  status?: "sold" | "installment" | "unsold" | "hidden";
  is_active: boolean;
  is_white?: boolean;
  viewers?: number;
  categoryType: "white" | "lq_under1m" | "lq_1m_3m" | "lq_over3m";
};

const CATEGORY_TABS = [
  {
    id: "all" as CategoryKey,
    label: "Tất Cả",
    icon: Grid,
    activeClasses: "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20",
    inactiveClasses: "bg-slate-100/90 hover:bg-slate-200 text-slate-700 border-slate-200",
    badgeActive: "bg-white/25 text-white",
    badgeInactive: "bg-white text-slate-600 border border-slate-200/80",
  },
  {
    id: "white" as CategoryKey,
    label: "Acc Trắng TT",
    icon: ShieldCheck,
    activeClasses: "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25",
    inactiveClasses: "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200/90",
    badgeActive: "bg-white/25 text-white",
    badgeInactive: "bg-white text-emerald-700 border border-emerald-200/80",
  },
  {
    id: "lq_under1m" as CategoryKey,
    label: "Acc LQ < 1M",
    icon: Zap,
    activeClasses: "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25",
    inactiveClasses: "bg-blue-50 hover:bg-blue-100/80 text-blue-800 border-blue-200/90",
    badgeActive: "bg-white/25 text-white",
    badgeInactive: "bg-white text-blue-700 border border-blue-200/80",
  },
  {
    id: "lq_1m_3m" as CategoryKey,
    label: "Acc LQ 1M–3M",
    icon: Flame,
    activeClasses: "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/25",
    inactiveClasses: "bg-violet-50 hover:bg-violet-100/80 text-violet-800 border-violet-200/90",
    badgeActive: "bg-white/25 text-white",
    badgeInactive: "bg-white text-violet-700 border border-violet-200/80",
  },
  {
    id: "lq_over3m" as CategoryKey,
    label: "Acc VIP 3M+",
    icon: Crown,
    activeClasses: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25",
    inactiveClasses: "bg-amber-50 hover:bg-amber-100/80 text-amber-800 border-amber-200/90",
    badgeActive: "bg-white/25 text-white",
    badgeInactive: "bg-white text-amber-700 border border-amber-200/80",
  },
];

function resolveCategoryType(
  catId: string,
  catName: string,
  price: number
): Account["categoryType"] {
  if (catId === "white" || catName.includes("trắng") || catName.includes("reg")) return "white";
  if (price < 1_000_000) return "lq_under1m";
  if (price <= 3_000_000) return "lq_1m_3m";
  return "lq_over3m";
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const catQuery = searchParams ? searchParams.get("category") : null;
  const urlSearchQuery = searchParams ? searchParams.get("search") || searchParams.get("q") : null;
  const focusQuery = searchParams ? searchParams.get("focus") : null;

  // ========================================
  // DATA
  // ========================================
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // FILTER & SORT
  // ========================================
  const [search, setSearch] = useState(urlSearchQuery || "");
  const textMeasureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  // Đồng bộ từ khóa tìm kiếm khi URL thay đổi
  useEffect(() => {
    if (urlSearchQuery !== null) {
      setSearch(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  // Tự động focus và cuộn đến ô tìm kiếm khi có param focus hoặc nhận event
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    if (focusQuery) {
      const timer = setTimeout(focusInput, 150);
      return () => clearTimeout(timer);
    }

    const handleFocusEvent = () => {
      focusInput();
    };

    window.addEventListener("focus-search-input", handleFocusEvent);
    return () => window.removeEventListener("focus-search-input", handleFocusEvent);
  }, [focusQuery]);

  // Đo chiều dài text để đặt nút X ngay cạnh từ vừa gõ
  useEffect(() => {
    if (textMeasureRef.current) {
      setTextWidth(textMeasureRef.current.offsetWidth);
    }
  }, [search]);

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>(
    (catQuery as CategoryKey) || "all"
  );
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  // Đồng bộ category khi URL query param thay đổi
  useEffect(() => {
    if (catQuery) setSelectedCategory(catQuery as CategoryKey);
  }, [catQuery]);

  // ========================================
  // PAGINATION
  // ========================================
  const [page, setPage] = useState(1);
  const pageSize = 16;

  // ========================================
  // IMAGE PREVIEW MODAL
  // ========================================
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ========================================
  // FETCH DATA
  // ========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "accounts"));

        const list: Account[] = snapshot.docs
          .map((doc, idx) => {
            const d = doc.data();
            const price = Number(d.price) || 100000;
            const fakePrice = Number(d.fake_price) || Math.round(price * 1.7);
            const viewers = 8 + ((idx * 7) % 21);
            const catId = (d.category_id || d.category?.id || "").toLowerCase().trim();
            const catName = (d.category?.name || d.categories?.name || "").toLowerCase().trim();

            const cleanCode = (d.code || `${100 + idx}`).toString();
            const title = d.title || d.highlight || `Acc #${cleanCode}`;

            const catType = resolveCategoryType(catId, catName, price);
            const isWhite = Boolean(
              d.is_white !== undefined
                ? d.is_white
                : catType === "white" || catName.includes("trắng")
            );

            return {
              id: doc.id,
              code: cleanCode,
              title,
              rank: d.rank || "Trong Ảnh",
              heroes_count: d.heroes_count || 0,
              skins_count: d.skins_count || 0,
              price,
              fake_price: fakePrice,
              highlight: d.highlight || title,
              is_sale: d.is_sale ?? true,
              is_white: isWhite,
              images: d.images?.length > 0 ? d.images : ["/acc.jpg"],
              created_at: d.created_at?.toDate?.() || new Date(),
              category_id: catId,
              categories: d.category || null,
              status: d.status || "unsold",
              is_active: d.is_active ?? true,
              viewers,
              categoryType: catType,
            };
          })
          .filter((acc) => acc.status !== "sold" && acc.is_active !== false);

        // Sort mặc định: mới nhất
        list.sort((a, b) => {
          const timeA = a.created_at instanceof Date ? a.created_at.getTime() : 0;
          const timeB = b.created_at instanceof Date ? b.created_at.getTime() : 0;
          return timeB - timeA;
        });

        setData(list);
      } catch (error) {
        console.error("Lỗi fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset page khi filter
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, search, sortKey]);

  // ==========================================
  // FILTER + SORT LOGIC
  // ==========================================
  const filteredData = useMemo(() => {
    let result = data.filter((acc) => {
      const matchSearch =
        !search.trim() ||
        matchAccountFuzzy(
          { code: acc.code, title: acc.title, highlight: acc.highlight },
          search
        );

      const matchCategory =
        selectedCategory === "all" || acc.categoryType === selectedCategory;

      return matchSearch && matchCategory;
    });

    if (sortKey === "price_asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortKey === "price_desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    // "newest" đã sort từ fetch

    return result;
  }, [data, search, selectedCategory, sortKey]);

  // ==========================================
  // PAGINATION
  // ==========================================
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedData = filteredData.slice(start, start + pageSize);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Đếm số lượng theo category
  const counts = useMemo(() => ({
    all: data.length,
    white: data.filter((a) => a.categoryType === "white").length,
    lq_under1m: data.filter((a) => a.categoryType === "lq_under1m").length,
    lq_1m_3m: data.filter((a) => a.categoryType === "lq_1m_3m").length,
    lq_over3m: data.filter((a) => a.categoryType === "lq_over3m").length,
  }), [data]);

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">

        {/* TITLE + INFO (Giữ nguyên giao diện sáng ban đầu) */}
        <div className="border-b border-slate-200 pb-4 space-y-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Kho Tài Khoản Trải Nghiệm
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{filteredData.length}</span> tài khoản có sẵn · Cập nhật liên tục 24/7
            </p>
          </div>

          {/* Cam kết */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {[
              { icon: "🔒", text: "Acc không chung chủ" },
              { icon: "🔄", text: "Hỗ trợ đổi thông tin" },
              { icon: "🛡️", text: "Bảo hành 100%" },
              { icon: "⚡", text: "Bàn giao tức thì" },
            ].map((item) => (
              <motion.span
                key={item.text}
                variants={{
                  hidden: { opacity: 0, scale: 0.85 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
                }}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"
              >
                {item.icon} {item.text}
              </motion.span>
            ))}
          </motion.div>

          {/* Lưu ý */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex gap-2 items-start">
            <span className="text-amber-500 text-sm mt-px shrink-0">⚠️</span>
            <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
              <span className="font-bold">Lưu ý:</span> Acc khẳng định đúng như hình & mô tả. Mức rank có thể thay đổi do reset theo mùa giải.
            </p>
          </div>
        </div>

        {/* CATEGORY TABS — Màu sắc riêng biệt cho từng tab */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CATEGORY_TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            const count = counts[tab.id];

            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setPage(1);
                }}
                className={`relative w-full py-2.5 px-3 rounded-xl sm:rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer touch-manipulation select-none flex items-center justify-between gap-1.5 border ${
                  isActive
                    ? `${tab.activeClasses} scale-[1.01]`
                    : `${tab.inactiveClasses}`
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0 transition-colors ${
                    isActive ? tab.badgeActive : tab.badgeInactive
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* SEARCH + SORT BAR */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />

            <span
              ref={textMeasureRef}
              aria-hidden="true"
              className="absolute invisible pointer-events-none whitespace-pre text-xs sm:text-sm font-normal -z-50 select-none"
            >
              {search}
            </span>

            <Input
              id="search-account-input"
              ref={inputRef}
              placeholder="Tìm theo #mã số hoặc tên acc (vd: #10245, nak, flo, tulen...)..."
              value={search}
              onFocus={() => {
                window.dispatchEvent(new CustomEvent("search-input-focused"));
              }}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-10 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm h-10 shadow-2xs hover:border-slate-300 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  inputRef.current?.focus();
                }}
                style={{
                  left: `min(calc(36px + ${textWidth}px + 6px), calc(100% - 28px))`,
                }}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200/90 hover:bg-slate-300 active:scale-90 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer z-10 shadow-2xs"
                title="Xóa tìm kiếm"
              >
                <X className="w-3 h-3 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="sm:w-52 shrink-0">
            <Select onValueChange={(v) => { setSortKey(v as SortKey); setPage(1); }} value={sortKey}>
              <SelectTrigger className="rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs sm:text-sm h-10 shadow-2xs transition-all px-3">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price_asc">Giá: Thấp → Cao</SelectItem>
                <SelectItem value="price_desc">Giá: Cao → Thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* STATUS BAR: KẾT QUẢ TÌM KIẾM & NÚT ĐẶT LẠI */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span>Hiển thị</span>
            <strong className="text-slate-800 font-bold">{filteredData.length}</strong>
            <span>tài khoản phù hợp</span>
          </div>

          {(search || selectedCategory !== "all" || sortKey !== "newest") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSortKey("newest");
                setPage(1);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        {/* GRID SẢN PHẨM */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + sortKey + page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5"
          >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3"
              >
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </motion.div>
            ))
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25, ease: "easeOut" }}
              >
                <AccountCard
                  item={{
                    id: item.id,
                    code: item.code,
                    title: item.title || item.highlight || `Acc #${item.code}`,
                    price: item.price,
                    fake_price: item.fake_price,
                    images: item.images,
                    viewers: item.viewers,
                    is_white: item.is_white,
                  }}
                  onPreviewImage={(url) => setPreviewImage(url)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3"
            >
              <TriangleAlert className="mx-auto w-10 h-10 text-amber-500" />
              <h3 className="font-bold text-slate-800 text-base">Không tìm thấy tài khoản phù hợp</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Vui lòng thử đổi bộ lọc thể loại hoặc xoá từ khoá tìm kiếm.
              </p>
              <Button
                variant="outline"
                onClick={() => { setSearch(""); setSelectedCategory("all"); setSortKey("newest"); }}
                className="rounded-xl mt-2 text-xs"
              >
                Đặt lại bộ lọc
              </Button>
            </motion.div>
          )}
          </motion.div>
        </AnimatePresence>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 pt-4">
            <Button
              variant="outline" size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-xl h-9 w-9 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {renderPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-slate-400 text-sm">...</span>
              ) : (
                <Button
                  key={p} size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p as number)}
                  className={`rounded-xl h-9 w-9 p-0 text-xs font-bold ${p === page ? "bg-slate-900 text-white" : ""}`}
                >
                  {p}
                </Button>
              )
            )}

            <Button
              variant="outline" size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="rounded-xl h-9 w-9 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

      </div>

      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
