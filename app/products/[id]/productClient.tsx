"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import {
  ChevronRight,
  Star,
  Trophy,
  Search,
  ChevronLeft,
  TriangleAlert,
  ZoomIn,
} from "lucide-react";

// Firebase
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Product Dialog
import ProductDialog from "@/components/ProductDialog";
import ImageLightbox, { useImageLightbox } from "@/components/ImageLightbox";

// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(num: number) {
  return num.toLocaleString("vi-VN") + "₫";
}

// ==========================================
// TYPES
// ==========================================

type Category = {
  id: string;
  name: string;
};

type Account = {
  id: string;
  code: string;
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
};

// ==========================================
// PAGE
// ==========================================

export default function ProductsPage() {
  // ========================================
  // DATA
  // ========================================

  const [data, setData] = useState<Account[]>([]);
  const [categories, setCategories] =
    useState<Category[]>([]);

  // ========================================
  // FILTER
  // ========================================

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [priceRange, setPriceRange] =
    useState<string>("all");

  // ========================================
  // PAGINATION
  // ========================================

  const [page, setPage] = useState(1);

  const pageSize = 16;

  // ========================================
  // LOADING
  // ========================================

  const [loading, setLoading] = useState(true);

  // ========================================
  // PRODUCT DIALOG
  // ========================================

  const [selectedProduct, setSelectedProduct] =
    useState<Account | null>(null);

  // ========================================
  // IMAGE LIGHTBOX
  // ========================================

  const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox();

  // ========================================
  // FETCH ACCOUNTS
  // ========================================

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const snapshot = await getDocs(
          collection(db, "accounts")
        );

        const list: Account[] =
          snapshot.docs.map((doc) => {
            const d = doc.data();

            return {
              id: doc.id,

              code: d.code,

              rank: d.rank,

              heroes_count:
                d.heroes_count || 0,

              skins_count:
                d.skins_count || 0,

              price:
                d.price || 0,

              fake_price:
                d.fake_price || 0,

              highlight:
                d.highlight || "",

              is_sale:
                d.is_sale || false,

              images:
                Array.isArray(d.images)
                  ? d.images
                  : [],

              created_at:
                d.created_at?.toDate?.() ||
                new Date(),

              category_id:
                d.category_id,

              categories:
                d.category || null,

              status: d.status || "unsold",
              is_active: d.is_active ?? true,
            };
          });

        // ====================================
        // SORT MỚI NHẤT
        // ====================================

        list.sort((a, b) => {
          const timeA =
            a.created_at instanceof Date
              ? a.created_at.getTime()
              : 0;

          const timeB =
            b.created_at instanceof Date
              ? b.created_at.getTime()
              : 0;

          return timeB - timeA;
        });

        setData(list);
      } catch (error) {
        console.error(
          "Lỗi fetch accounts:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    // ========================================
    // FETCH CATEGORIES
    // ========================================

    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "categories")
        );

        const list: Category[] =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));

        setCategories(list);
      } catch (error) {
        console.error(
          "Lỗi fetch categories:",
          error
        );
      }
    };

    fetchData();
    fetchCategories();
  }, []);

  // ==========================================
  // RESET PAGE KHI FILTER
  // ==========================================

  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    search,
    priceRange,
  ]);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredData = useMemo(() => {
    return data.filter((acc) => {
      // SEARCH

      const matchSearch =
        acc.code
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      // CATEGORY

      const matchCategory =
        selectedCategory === "all" ||
        acc.category_id ===
          selectedCategory;

      // PRICE

      let matchPrice = true;

      if (priceRange !== "all") {
        const [min, max] =
          priceRange
            .split("-")
            .map(Number);

        if (max) {
          matchPrice =
            acc.price >= min &&
            acc.price <= max;
        } else {
          matchPrice =
            acc.price >= min;
        }
      }

      // STATUS - chỉ hiển thị chưa bán và đang active
      const matchStatus = acc.status === "unsold" && acc.is_active;

      return (
        matchSearch &&
        matchCategory &&
        matchPrice &&
        matchStatus
      );
    });
  }, [
    data,
    search,
    selectedCategory,
    priceRange,
  ]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const start =
    (page - 1) * pageSize;

  const paginatedData =
    filteredData.slice(
      start,
      start + pageSize
    );

  const totalPages =
    Math.ceil(
      filteredData.length /
        pageSize
    );

  // ==========================================
  // PAGE NUMBERS
  // ==========================================

  const renderPageNumbers = () => {
    const pages: (
      | number
      | string
    )[] = [];

    const maxVisible = 5;

    if (
      totalPages <= maxVisible
    ) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(
          1,
          2,
          3,
          4,
          "...",
          totalPages
        );
      } else if (
        page >=
        totalPages - 2
      ) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          page - 1,
          page,
          page + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  // ==========================================
  // SCROLL TOP KHI ĐỔI PAGE
  // ==========================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  // ==========================================
  // OPEN LIGHTBOX
  // ==========================================

  const handleOpenLightbox = (
    item: Account
  ) => {
    const imageUrls = item.images?.length > 0 ? item.images : ["/acc.jpg"];
    openLightbox(imageUrls, 0);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      className="
        container
        mx-auto
        md:px-4
        px-2
        py-6
        space-y-6
      "
    >

      {/* ==================================== */}
      {/* TITLE */}
      {/* ==================================== */}

      <h1 className="text-2xl font-bold">
        Danh sách sản phẩm
      </h1>

      {/* ==================================== */}
      {/* SEARCH + FILTER */}
      {/* ==================================== */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          gap-3
          md:items-end
        "
      >

        {/* SEARCH */}

        <div
          className="
            w-full
            md:w-1/3
            space-y-1
          "
        >

          <span
            className="
              text-xs
              font-semibold
              text-gray-500
            "
          >
            Tìm kiếm
          </span>

          <div className="relative">

            <Search
              className="
                absolute
                left-3
                top-2.5
                w-4
                h-4
                text-gray-400
              "
            />

            <Input
              placeholder="Nhập mã acc..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="pl-10"
            />

          </div>

        </div>

        {/* CATEGORY */}

        <div
          className="
            space-y-1
            w-full
            md:w-56
          "
        >

          <span
            className="
              text-xs
              font-semibold
              text-gray-500
            "
          >
            Loại acc
          </span>

          <Select
            onValueChange={
              setSelectedCategory
            }
            defaultValue="all"
          >

            <SelectTrigger>
              <SelectValue
                placeholder="Chọn loại"
              />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                Tất cả
              </SelectItem>

              {categories.map(
                (c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </SelectItem>
                )
              )}

            </SelectContent>

          </Select>

        </div>

        {/* PRICE */}

        <div
          className="
            space-y-1
            w-full
            md:w-56
          "
        >

          <span
            className="
              text-xs
              font-semibold
              text-gray-500
            "
          >
            Khoảng giá
          </span>

          <Select
            onValueChange={
              setPriceRange
            }
            defaultValue="all"
          >

            <SelectTrigger>
              <SelectValue
                placeholder="Chọn giá"
              />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                Tất cả
              </SelectItem>

              <SelectItem value="0-500000">
                Dưới 500K
              </SelectItem>

              <SelectItem value="500000-1500000">
                500K - 1.5 Triệu
              </SelectItem>

              <SelectItem value="1500000-3500000">
                1.5 Triệu - 3.5 Triệu
              </SelectItem>

              <SelectItem value="3500000">
                Trên 3.5 Triệu
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

      </div>

      {/* ==================================== */}
      {/* GRID */}
      {/* ==================================== */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-3
          items-stretch
        "
      >

        {/* ================================== */}
        {/* LOADING */}
        {/* ================================== */}

        {loading ? (

          Array.from({
            length: pageSize,
          }).map((_, i) => (

            <Skeleton
              key={i}
              className="
                h-40
                w-full
                rounded-xl
              "
            />

          ))

        ) : paginatedData.length > 0 ? (

          paginatedData.map(
            (item) => (

              <Card
                key={item.id}
                className="
                  h-full
                  flex
                  flex-col
                  hover:scale-105
                  transition
                  duration-300
                  overflow-hidden
                "
              >

                <CardContent
                  className="
                    relative
                    p-0
                    h-full
                    flex
                    flex-col
                    overflow-hidden
                  "
                >

                  {/* ============================== */}
                  {/* BACKGROUND BLUR */}
                  {/* ============================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      pointer-events-none
                    "
                  >

                    <Image
                      src={
                        item.images?.[0] ||
                        "/acc.jpg"
                      }
                      alt=""
                      fill
                      quality={50}
                      className="
                        object-cover
                        scale-125
                        blur-3xl
                        opacity-20
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-br
                        from-indigo-500/20
                        via-purple-500/10
                        to-pink-500/20
                        blur-3xl
                        scale-125
                      "
                    />

                  </div>

                  {/* ============================== */}
                  {/* IMAGE */}
                  {/* ============================== */}

                  <div
                    className="
                      relative
                      z-10
                      w-full
                      overflow-hidden
                      rounded-t-lg
                      bg-black
                      cursor-zoom-in
                      group
                    "
                    onClick={(e) => {
                      e.stopPropagation();

                      handleOpenLightbox(item);
                    }}
                  >

                    <Image
                      src={
                        item.images?.[0] ||
                        "/acc.jpg"
                      }
                      alt={item.code}
                      width={400}
                      height={400}
                      quality={100}
                      className="
                        w-full
                        h-auto
                        object-contain
                        object-top
                        block
                        transition-transform
                        duration-300
                        group-hover:scale-[1.02]
                      "
                    />

                    {/* ============================ */}
                    {/* ZOOM ICON */}
                    {/* ============================ */}

                    <div
                      className="
                        absolute
                        inset-0
                        z-20
                        flex
                        items-center
                        justify-center
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                        duration-200
                        bg-black/10
                        pointer-events-none
                      "
                    >

                      <div
                        className="
                          w-11
                          h-11
                          rounded-full
                          bg-black/50
                          backdrop-blur-sm
                          flex
                          items-center
                          justify-center
                          text-white
                          shadow-lg
                        "
                      >

                        <ZoomIn
                          className="
                            w-5
                            h-5
                          "
                        />

                      </div>

                    </div>

                    {/* ============================ */}
                    {/* SALE */}
                    {/* ============================ */}

                    {item.is_sale && (

                      <Badge
                        className="
                          absolute
                          top-2
                          left-2
                          bg-gradient-to-r
                          from-red-500
                          to-red-600
                          text-white
                          text-[10px]
                          border-0
                          animate-pulse
                          shadow-md
                        "
                      >
                        Sale
                      </Badge>

                    )}

                    {/* ============================ */}
                    {/* CATEGORY */}
                    {/* ============================ */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                      "
                    >

                      <div
                        className="
                          bg-gradient-to-r
                          from-yellow-400
                          to-orange-500
                          text-white
                          font-semibold
                          text-[10px]
                          px-2
                          py-0.5
                          rounded-tr-lg
                          shadow-md
                        "
                      >

                        {
                          item.categories
                            ?.name
                        }

                      </div>

                    </div>

                  </div>

                  {/* ============================== */}
                  {/* CONTENT */}
                  {/* ============================== */}

                  <div
                    className="
                      relative
                      z-10
                      p-3
                      sm:p-4
                      flex
                      flex-col
                      mt-auto
                      bg-white
                    "
                  >

                    {/* MÃ + RANK */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <h3
                        className="
                          text-sm
                          sm:text-base
                          font-bold
                          mb-1
                          line-clamp-1
                        "
                      >
                        Mã: {item.code}
                      </h3>

                      <div
                        className="
                          flex
                          items-center
                          space-x-1
                          mb-3
                        "
                      >

                        <Trophy
                          className="
                            w-3
                            h-3
                            text-yellow-500
                          "
                        />

                        <span
                          className="
                            text-xs
                            sm:text-sm
                            font-medium
                            text-gray-700
                          "
                        >
                          Rank: {item.rank}
                        </span>

                      </div>

                    </div>

                    {/* ============================ */}
                    {/* PRICE */}
                    {/* ============================ */}

                    <div className="mb-3">

                      <div
                        className="
                          flex
                          items-center
                          space-x-2
                          mb-1
                        "
                      >

                        {/* GIÁ BÁN */}

                        <span
                          className="
                            md:text-lg
                            text-xs
                            font-bold
                            text-red-500
                          "
                        >
                          {formatPrice(
                            Number(
                              item.price
                            )
                          )}
                        </span>

                        {/* GIÁ GỐC */}

                        <span
                          className="
                            md:text-base
                            text-xs
                            line-through
                            text-gray-400
                          "
                        >
                          {formatPrice(
                            Number(
                              item.fake_price
                            )
                          )}
                        </span>

                      </div>

                      {/* TIẾT KIỆM */}

                      <p
                        className="
                          text-[14px]
                          text-green-600
                          font-bold
                        "
                      >
                        Tiết kiệm{" "}

                        {formatPrice(
                          Number(
                            item.fake_price
                          ) -
                            Number(
                              item.price
                            )
                        )}

                      </p>

                    </div>

                    {/* ============================ */}
                    {/* STAR + BUTTON */}
                    {/* ============================ */}

                    <div
                      className="
                        hidden
                        md:flex
                        items-center
                        justify-between
                        mt-auto
                      "
                    >

                      {/* STAR */}

                      <div className="flex">

                        {[
                          ...Array(5),
                        ].map(
                          (_, i) => (

                            <Star
                              key={i}
                              className="
                                w-3
                                h-3
                                fill-yellow-400
                                text-yellow-400
                              "
                            />

                          )
                        )}

                      </div>

                      {/* BUTTON */}

                      <Link 
                        href="https://zalo.me/0966216495"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
  <Button
    className="
      bg-gradient-to-r
      from-orange-500
      to-red-500
      text-white
      text-[14px]
      font-semibold
      px-2
      py-1
    "
  >
    Thuê Ngay

    <ChevronRight
      className="
        w-3
        h-3
        ml-1
      "
    />
  </Button>
</Link>

                    </div>

                  </div>

                </CardContent>

              </Card>

            )
          )

        ) : (

          /* ================================ */
          /* EMPTY */
          /* ================================ */

          <div
            className="
              col-span-full
              text-center
              py-10
            "
          >

            <TriangleAlert
              className="
                mx-auto
                w-10
                h-10
                text-red-400
              "
            />

            <p>
              Không tìm thấy acc
            </p>

          </div>

        )}

      </div>

      {/* ==================================== */}
      {/* PAGINATION */}
      {/* ==================================== */}

      {totalPages > 1 && (

        <div
          className="
            flex
            justify-center
            gap-2
          "
        >

          {/* PREVIOUS */}

          <Button
            disabled={
              page === 1
            }
            onClick={() =>
              setPage(
                (p) => p - 1
              )
            }
          >
            <ChevronLeft />
          </Button>

          {/* PAGE NUMBERS */}

          {renderPageNumbers().map(
            (p, i) =>
              p === "..." ? (

                <span key={i}>
                  ...
                </span>

              ) : (

                <Button
                  key={p}
                  onClick={() =>
                    setPage(
                      p as number
                    )
                  }
                  variant={
                    p === page
                      ? "default"
                      : "outline"
                  }
                >
                  {p}
                </Button>

              )
          )}

          {/* NEXT */}

          <Button
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(
                (p) => p + 1
              )
            }
          >
            <ChevronRight />
          </Button>

        </div>

      )}

      {/* ==================================== */}
      {/* IMAGE LIGHTBOX */}
      {/* ==================================== */}

      <ImageLightbox
        images={images}
        open={isOpen}
        onClose={closeLightbox}
        initialIndex={currentIndex}
      />

      {/* ==================================== */}
      {/* PRODUCT DIALOG */}
      {/* ==================================== */}

      <ProductDialog
        selectedProduct={
          selectedProduct
        }
        setSelectedProduct={
          setSelectedProduct
        }
      />

    </div>
  );
}