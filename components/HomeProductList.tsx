"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import AccountCard, { AccountCardData } from "./AccountCard";
import ImagePreviewModal from "./ImagePreviewModal";

export type CategoryKey = "all" | "white" | "lq_under1m" | "lq_1m_3m" | "lq_over3m";

export type AccItem = AccountCardData & {
  categoryType: "white" | "lq_under1m" | "lq_1m_3m" | "lq_over3m";
};

// Dữ liệu mẫu chuẩn bị sẵn theo 4 thể loại chuẩn của hệ thống
const fallbackAccounts: AccItem[] = [
  {
    id: "fb-white-1",
    code: "WFWS2",
    title: "Acc Reg Trắng Thông Tin 100% - Tự Đổi Pass",
    price: 45000,
    fake_price: 90000,
    images: ["/bannerReg.jpeg"],
    categoryType: "white",
    viewers: 28,
  },
  {
    id: "fb-white-2",
    code: "H9IDJ",
    title: "Acc Reg SLL Trắng Thông Tin Đã Tạo Sẵn Tướng",
    price: 65000,
    fake_price: 120000,
    images: ["/bannerReg.jpeg"],
    categoryType: "white",
    viewers: 15,
  },
  {
    id: "fb-white-3",
    code: "7TM1T",
    title: "Acc Reg Trắng Thông Tin An Toàn Đổi Pass Ngay",
    price: 50000,
    fake_price: 95000,
    images: ["/bannerReg.jpeg"],
    categoryType: "white",
    viewers: 12,
  },
  {
    id: "fb-lq1-1",
    code: "EBZYL",
    title: "Acc Liên Quân Cao Thủ 25★ - 50 Skin",
    price: 180000,
    fake_price: 320000,
    images: ["/acc.jpg"],
    categoryType: "lq_under1m",
    viewers: 23,
  },
  {
    id: "fb-lq1-2",
    code: "N25DA",
    title: "Acc Liên Quân Full Tướng Ngọc 90 - Rank Vàng",
    price: 350000,
    fake_price: 600000,
    images: ["/acc1.jpg"],
    categoryType: "lq_under1m",
    viewers: 17,
  },
  {
    id: "fb-lq1-3",
    code: "PX9KL",
    title: "Acc LQ Bạch Kim - 120 Tướng & 80 Skin",
    price: 750000,
    fake_price: 1200000,
    images: ["/acc.jpg"],
    categoryType: "lq_under1m",
    viewers: 20,
  },
  {
    id: "fb-lq2-1",
    code: "ZR7W9",
    title: "Acc LQ Kim Cương - Full Ngọc & 200 Skin",
    price: 1500000,
    fake_price: 2500000,
    images: ["/acc.jpg"],
    categoryType: "lq_1m_3m",
    viewers: 19,
  },
  {
    id: "fb-lq2-2",
    code: "AIFR6",
    title: "Acc LQ Thách Đấu - Florentino Muay Thái",
    price: 2200000,
    fake_price: 3500000,
    images: ["/acc1.jpg"],
    categoryType: "lq_1m_3m",
    viewers: 14,
  },
  {
    id: "fb-lq3-1",
    code: "WT816",
    title: "Acc LQ VIP - Tulen Chí Tôn Kiếm Tiên + Lauriel SSS",
    price: 4500000,
    fake_price: 7000000,
    images: ["/acc.jpg"],
    categoryType: "lq_over3m",
    viewers: 16,
  },
  {
    id: "fb-lq3-2",
    code: "KM3TR",
    title: "Acc LQ Siêu VIP - Full Skin Thứ Nguyên Vệ Thần",
    price: 6500000,
    fake_price: 10000000,
    images: ["/acc1.jpg"],
    categoryType: "lq_over3m",
    viewers: 11,
  },
];

interface HomeProductListProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function HomeProductList({
  activeCategory = "all",
  onSelectCategory,
}: HomeProductListProps) {
  // Quản lý tab nội bộ để phản hồi click ngay lập tức
  const [currentTab, setCurrentTab] = useState<string>(activeCategory || "all");
  const [accounts, setAccounts] = useState<AccItem[]>(fallbackAccounts);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Đồng bộ tab khi prop activeCategory thay đổi từ bên ngoài (ví dụ click vào 3 thẻ category ở trên)
  useEffect(() => {
    if (activeCategory) {
      setCurrentTab(activeCategory);
    }
  }, [activeCategory]);

  // Fetch Firestore accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const snap = await getDocs(collection(db, "accounts"));
        if (!snap.empty) {
          const list: AccItem[] = [];

          snap.docs.forEach((doc, idx) => {
            const d = doc.data();

            // Bỏ tài khoản đã bán hoặc bị ẩn
            if (d.status === "sold" || d.is_active === false) {
              return;
            }

            const rawCatId = (d.category_id || d.category?.id || "").toLowerCase().trim();
            const rawCatName = (d.category?.name || d.categories?.name || "").toLowerCase().trim();

            // Map đúng chuẩn 4 loại theo giá tiền:
            // 1. white / trắng / reg -> Acc Reg Trắng TT
            // 2. price < 1_000_000  -> Acc LQ dưới 1M
            // 3. price 1M-3M        -> Acc LQ từ 1M-3M
            // 4. price > 3M         -> Acc LQ từ 3M trở đi
            const price = Number(d.price) || 100000;
            let categoryType: "white" | "lq_under1m" | "lq_1m_3m" | "lq_over3m";

            if (
              rawCatId === "white" ||
              rawCatName.includes("trắng") ||
              rawCatName.includes("reg")
            ) {
              categoryType = "white";
            } else if (price < 1_000_000) {
              categoryType = "lq_under1m";
            } else if (price <= 3_000_000) {
              categoryType = "lq_1m_3m";
            } else {
              categoryType = "lq_over3m";
            }
            const fakePrice = Number(d.fake_price) || Math.round(price * 1.7);
            const title = d.highlight || d.code || `Acc #${d.code || 100 + idx}`;
            const images = d.images && d.images.length > 0 ? d.images : ["/acc.jpg"];
            const viewers = 8 + ((idx * 7) % 21);

            list.push({
              id: doc.id,
              code: d.code || `ACC-${100 + idx}`,
              title,
              price,
              fake_price: fakePrice,
              images,
              categoryType,
              viewers,
            });
          });

          if (list.length > 0) {
            setAccounts(list);
          }
        }
      } catch (err) {
        console.warn("Using sample accounts for home");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Xử lý click tab mượt mà và gọi callback ra ngoài
  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    onSelectCategory?.(tabId);
  };

  // Đếm số lượng tài khoản theo từng tab
  const counts = useMemo(() => {
    return {
      all: accounts.length,
      white: accounts.filter((a) => a.categoryType === "white").length,
      lq_under1m: accounts.filter((a) => a.categoryType === "lq_under1m").length,
      lq_1m_3m: accounts.filter((a) => a.categoryType === "lq_1m_3m").length,
      lq_over3m: accounts.filter((a) => a.categoryType === "lq_over3m").length,
    };
  }, [accounts]);

  // Lọc chuẩn theo tab đang chọn
  const filteredAccounts = useMemo(() => {
    if (currentTab === "all") return accounts;
    return accounts.filter((item) => item.categoryType === currentTab);
  }, [accounts, currentTab]);

  // Link trang sản phẩm theo category hiện tại
  const productsUrl =
    currentTab === "all" ? "/products" : `/products?category=${currentTab}`;

  return (
    <section id="product-list-section" className="relative w-full py-5 sm:py-10 md:py-14 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        
        {/* Header danh sách & Nút xem thêm */}
        <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-200/80 mb-4 sm:mb-6">
          <div className="border-l-4 border-red-600 pl-2.5 sm:pl-3">
            <h2 className="text-3d-heading text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Danh Sách Tài Khoản
            </h2>
          </div>

          <Link
            href={productsUrl}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors group shrink-0"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Tab Thể Loại: TỰ ĐỘNG XUỐNG HÀNG TRÊN MOBILE, KHÔNG CẦN SCROLL NGANG */}
        <div className="relative z-20 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 mb-4 sm:mb-6">
          {[
            { id: "all", label: "Tất Cả", count: counts.all, color: "bg-slate-900" },
            { id: "white", label: "Acc Reg Trắng TT", count: counts.white, color: "bg-emerald-600" },
            { id: "lq_under1m", label: "Acc LQ < 1M", count: counts.lq_under1m, color: "bg-blue-600" },
            { id: "lq_1m_3m", label: "Acc LQ 1M–3M", count: counts.lq_1m_3m, color: "bg-violet-600" },
            { id: "lq_over3m", label: "Acc LQ 3M+", count: counts.lq_over3m, color: "bg-amber-500" },
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(tab.id);
                }}
                className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all cursor-pointer touch-manipulation select-none flex items-center justify-center gap-1.5 ${
                  isActive
                    ? `${tab.color} text-white tab-3d-active`
                    : "tab-3d-inactive text-slate-700 hover:text-slate-900"
                }`}
              >
                <span className="leading-tight text-center">{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid Danh Sách Acc - 2 cột cực chuẩn trên Mobile */}
        {filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {filteredAccounts.slice(0, 12).map((item) => (
              <AccountCard
                key={item.id}
                item={item}
                onPreviewImage={(url) => setPreviewImage(url)}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-500 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200 p-6">
            Hiện chưa có tài khoản nào thuộc thể loại này. Vui lòng chọn danh mục khác!
          </div>
        )}

        {/* Nút Xem Thêm Tài Khoản ở Cuối */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href={productsUrl}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 hover:text-slate-900 font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all group"
          >
            <span>Xem thêm tất cả tài khoản</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Modal hiển thị ảnh gần full chiều cao, không co giãn */}
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </section>
  );
}
