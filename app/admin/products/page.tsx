"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  User,
  Shield,
  Filter,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { matchAccountFuzzy } from "@/lib/searchUtils";
import ImageLightbox, { useImageLightbox } from "@/components/ImageLightbox";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";
import { useAdminAuth } from "@/components/AdminLogin";
import { formatVND } from "@/lib/priceUtils";

type Product = {
  id: string;
  code: string;
  title?: string;
  highlight?: string;
  is_white?: boolean;
  rank: string;
  price: number; // Giá bán ngoài web (sau khi cộng % nếu là nhân viên)
  original_price?: number; // Giá thật nhân viên nhận về
  markup_percent?: number; // % cộng thêm
  fake_price: number;
  images: string[];
  status?: "sold" | "installment" | "unsold" | "hidden";
  is_active: boolean;
  seller_id?: string;
  seller_name?: string;
  seller_email?: string;
  seller_role?: "admin" | "staff";
  created_at: any;
};

const statusMap = {
  sold: { label: "Đã bán", color: "bg-red-100 text-red-700 hover:bg-red-200" },
  installment: { label: "Đang trả góp", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
  unsold: { label: "Chưa bán", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  hidden: { label: "Tạm ẩn", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
};

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const { user, profile, isAdmin, isStaff } = useAdminAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<string>("all");

  // State cho modal xác nhận xóa
  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const textMeasureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textMeasureRef.current) {
      setTextWidth(textMeasureRef.current.offsetWidth);
    }
  }, [searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);

  // Lightbox hook
  const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "accounts"));
      const allProducts = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Product[];

      // Sắp xếp theo ngày tạo mới nhất trước nếu có
      allProducts.sort((a, b) => {
        const timeA = a.created_at?.toDate ? a.created_at.toDate().getTime() : 0;
        const timeB = b.created_at?.toDate ? b.created_at.toDate().getTime() : 0;
        return timeB - timeA;
      });

      setProducts(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Lỗi tải dữ liệu", {
        description: "Không thể tải danh sách sản phẩm",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Danh sách các seller để filter (dành cho Admin)
  const sellersList = Array.from(
    new Set(
      products
        .map((p) => p.seller_name || (p.seller_role === "admin" ? "Admin" : "Chưa rõ"))
        .filter(Boolean)
    )
  );

  // Filter products by role, search term & seller filter
  useEffect(() => {
    let result = products;

    // Phân quyền: Nhân viên chỉ thấy và CRUD sản phẩm của chính mình
    if (isStaff && user) {
      result = result.filter(
        (product) => product.seller_id === user.uid || product.seller_email === user.email
      );
    } else if (isAdmin && selectedSeller !== "all") {
      // Admin filter theo người bán
      result = result.filter(
        (product) =>
          (product.seller_name || (product.seller_role === "admin" ? "Admin" : "Chưa rõ")) ===
          selectedSeller
      );
    }

    // Filter theo tìm kiếm
    if (searchTerm.trim() !== "") {
      result = result.filter((product) =>
        matchAccountFuzzy(
          {
            code: product.code,
            title: product.title,
            highlight: product.highlight,
          },
          searchTerm
        ) ||
        (product.seller_name && product.seller_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset trang khi filter thay đổi
  }, [searchTerm, products, isStaff, isAdmin, user, selectedSeller]);

  // Đổi trạng thái
  const handleChangeStatus = async (
    product: Product,
    newStatus: "sold" | "installment" | "unsold" | "hidden"
  ) => {
    // Kiểm tra quyền
    if (isStaff && product.seller_id && product.seller_id !== user?.uid) {
      toast.error("Bạn không có quyền đổi trạng thái sản phẩm của người khác!");
      return;
    }

    try {
      await updateDoc(doc(db, "accounts", product.id), {
        status: newStatus,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );
      toast.success("Đã cập nhật trạng thái");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Lỗi cập nhật", {
        description: "Không thể cập nhật trạng thái",
      });
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async () => {
    if (!deleteProductTarget) return;

    // Kiểm tra quyền: nhân viên chỉ được xóa sản phẩm của mình
    if (isStaff && deleteProductTarget.seller_id && deleteProductTarget.seller_id !== user?.uid) {
      toast.error("Bạn không có quyền xóa sản phẩm của người khác!");
      setDeleteProductTarget(null);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "accounts", deleteProductTarget.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteProductTarget.id));
      toast.success(`Đã xóa sản phẩm #${deleteProductTarget.code} thành công`);
      setDeleteProductTarget(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Lỗi khi xóa sản phẩm");
    } finally {
      setIsDeleting(false);
    }
  };

  const getProductStatus = (product: Product): "sold" | "installment" | "unsold" | "hidden" => {
    return product.status || "unsold";
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <AdminAuthWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
          <div className="text-slate-600 font-medium">Đang tải danh sách tài khoản...</div>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="p-4 sm:p-6 space-y-6">
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-black flex items-center gap-2">
                  <Tag className="w-6 h-6 text-yellow-300" />
                  {isAdmin ? "Quản lý tất cả sản phẩm" : "Sản phẩm của tôi"}
                </CardTitle>
                <p className="text-xs text-indigo-100 mt-1">
                  {isAdmin
                    ? `Hiển thị giá thật, giá bán trên Web (+%) và tên nhân viên đăng acc.`
                    : `Bạn chỉ có quyền xem, chỉnh sửa và quản lý sản phẩm do chính bạn đăng.`}
                </p>
              </div>

              <Link href="/admin">
                <Button className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-md cursor-pointer text-xs sm:text-sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Đăng sản phẩm mới
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 items-stretch sm:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />

                <span
                  ref={textMeasureRef}
                  aria-hidden="true"
                  className="absolute invisible pointer-events-none whitespace-pre text-sm font-normal -z-50 select-none"
                >
                  {searchTerm}
                </span>

                <Input
                  ref={inputRef}
                  placeholder="Tìm theo #mã code, tiêu đề hoặc tên nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-10 text-sm h-10 border-slate-200"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      inputRef.current?.focus();
                    }}
                    style={{
                      left: `min(calc(36px + ${textWidth}px + 6px), calc(100% - 28px))`,
                    }}
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-all cursor-pointer z-10"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Admin Filter by Seller */}
              {isAdmin && sellersList.length > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    className="border border-slate-200 bg-white text-xs font-semibold text-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Tất cả người đăng ({products.length})</option>
                    {sellersList.map((seller) => (
                      <option key={seller} value={seller}>
                        Người đăng: {seller}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
              <Table className="min-w-[850px]">
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-800 text-xs">Mã acc</TableHead>
                    <TableHead className="font-bold text-slate-800 text-xs">Ảnh</TableHead>
                    <TableHead className="font-bold text-slate-800 text-xs">Tiêu đề</TableHead>
                    {isAdmin && (
                      <TableHead className="font-bold text-slate-800 text-xs">
                        Người đăng (Nhân viên)
                      </TableHead>
                    )}
                    <TableHead className="font-bold text-slate-800 text-xs">
                      Giá thật (Gốc)
                    </TableHead>
                    <TableHead className="font-bold text-slate-800 text-xs">
                      Giá Web (+%)
                    </TableHead>
                    <TableHead className="font-bold text-slate-800 text-xs">
                      Chênh lệch shop
                    </TableHead>
                    <TableHead className="font-bold text-slate-800 text-xs">Giá fake</TableHead>
                    <TableHead className="font-bold text-slate-800 text-xs">Trạng thái</TableHead>
                    <TableHead className="font-bold text-slate-800 text-xs text-right">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 10 : 9}
                        className="text-center py-12 text-slate-500 text-sm"
                      >
                        {searchTerm
                          ? "Không tìm thấy sản phẩm nào phù hợp"
                          : isStaff
                          ? "Bạn chưa đăng sản phẩm nào. Bấm 'Đăng sản phẩm mới' để bắt đầu!"
                          : "Chưa có sản phẩm nào trong hệ thống"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentProducts.map((product) => {
                      const currentStatus = getProductStatus(product);
                      const originalPrice = product.original_price || product.price;
                      const sellingPrice = product.price;
                      const profit = Math.max(0, sellingPrice - originalPrice);
                      const markupPercent =
                        product.markup_percent !== undefined
                          ? product.markup_percent
                          : originalPrice > 0 && profit > 0
                          ? Math.round((profit / originalPrice) * 100)
                          : 0;

                      const isSellerAdmin =
                        product.seller_role === "admin" ||
                        (product.seller_name && product.seller_name.toLowerCase().includes("admin"));

                      return (
                        <TableRow key={product.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Mã acc */}
                          <TableCell className="font-mono text-sm font-black text-indigo-600">
                            #{product.code}
                          </TableCell>

                          {/* Ảnh preview */}
                          <TableCell>
                            {product.images && product.images.length > 0 ? (
                              <div
                                className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group shrink-0"
                                onClick={() => openLightbox(product.images, 0)}
                              >
                                <img
                                  src={product.images[0]}
                                  alt={product.code}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ZoomIn className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </TableCell>

                          {/* Tiêu đề */}
                          <TableCell className="max-w-[200px]">
                            <div className="text-xs font-bold text-slate-800 line-clamp-2">
                              {product.title || product.highlight || `Acc #${product.code}`}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                              Rank: {product.rank} {product.is_white && "• Trắng TT"}
                            </div>
                          </TableCell>

                          {/* Người đăng (Chỉ Admin thấy cột này) */}
                          {isAdmin && (
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                                  {isSellerAdmin ? (
                                    <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                  ) : (
                                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  )}
                                  <span>{product.seller_name || (isSellerAdmin ? "Admin" : "Nhân viên")}</span>
                                </div>
                                <span
                                  className={`inline-block px-1.5 py-0.2 text-[10px] rounded font-semibold w-fit ${
                                    isSellerAdmin
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {isSellerAdmin ? "Quản trị viên" : "Nhân viên"}
                                </span>
                              </div>
                            </TableCell>
                          )}

                          {/* Giá thật (Gốc) */}
                          <TableCell>
                            <div className="font-semibold text-xs text-slate-700">
                              {formatVND(originalPrice)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isStaff ? "Bạn thu về" : "Giá gốc"}
                            </div>
                          </TableCell>

                          {/* Giá Web (+%) */}
                          <TableCell>
                            <div className="font-black text-xs text-indigo-700">
                              {formatVND(sellingPrice)}
                            </div>
                            {markupPercent > 0 && (
                              <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-200">
                                +{markupPercent}%
                              </span>
                            )}
                          </TableCell>

                          {/* Chênh lệch shop */}
                          <TableCell>
                            {profit > 0 ? (
                              <div className="font-bold text-xs text-emerald-600">
                                +{formatVND(profit)}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">0 ₫ (Admin)</span>
                            )}
                          </TableCell>

                          {/* Giá fake */}
                          <TableCell>
                            <div className="text-xs text-slate-400 line-through">
                              {formatVND(product.fake_price)}
                            </div>
                          </TableCell>

                          {/* Trạng thái */}
                          <TableCell>
                            <select
                              value={currentStatus}
                              onChange={(e) =>
                                handleChangeStatus(product, e.target.value as any)
                              }
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 cursor-pointer outline-none transition ${
                                statusMap[currentStatus]?.color || statusMap.unsold.color
                              }`}
                            >
                              <option value="unsold">Chưa bán</option>
                              <option value="sold">Đã bán</option>
                              <option value="installment">Đang trả góp</option>
                              <option value="hidden">Tạm ẩn</option>
                            </select>
                          </TableCell>

                          {/* Thao tác (Sửa, Xóa) */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Chỉnh sửa sản phẩm"
                                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 h-8 w-8 rounded-lg cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                              </Link>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteProductTarget(product)}
                                title="Xóa sản phẩm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
                <div className="text-xs text-slate-500 font-medium">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} trong số{" "}
                  {filteredProducts.length} sản phẩm
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`h-8 w-8 p-0 text-xs font-bold ${
                        currentPage === page
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "border-slate-200 text-slate-700"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal xác nhận xóa sản phẩm */}
        <Dialog
          open={!!deleteProductTarget}
          onOpenChange={(open) => !open && setDeleteProductTarget(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Xác nhận xóa tài khoản
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-sm pt-2">
                Bạn có chắc chắn muốn xóa tài khoản mã{" "}
                <strong className="text-slate-900 font-bold">
                  #{deleteProductTarget?.code}
                </strong>{" "}
                ({deleteProductTarget?.title || deleteProductTarget?.highlight}) không?
                <br />
                Hành động này <span className="text-red-600 font-bold">không thể khôi phục</span>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteProductTarget(null)}
                disabled={isDeleting}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Lightbox */}
        <ImageLightbox
          images={images}
          open={isOpen}
          onClose={closeLightbox}
          initialIndex={currentIndex}
        />
      </div>
    </AdminAuthWrapper>
  );
}
