"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Plus, Pencil, DollarSign, Tag, Image as ImageIcon, Search, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Link from "next/link";
import ImageLightbox, { useImageLightbox } from "@/components/ImageLightbox";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";

type Product = {
  id: string;
  code: string;
  rank: string;
  price: number;
  fake_price: number;
  images: string[];
  status?: "sold" | "installment" | "unsold" | "hidden";
  is_active: boolean;
  created_at: any;
};

const statusMap = {
  sold: { label: "Đã bán", color: "bg-red-100 text-red-700" },
  installment: { label: "Đang trả góp", color: "bg-yellow-100 text-yellow-700" },
  unsold: { label: "Chưa bán", color: "bg-green-100 text-green-700" },
  hidden: { label: "Tạm ẩn", color: "bg-gray-100 text-gray-700" },
};

const formatVND = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Lightbox hook
  const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "accounts"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
      setFilteredProducts(productsData);
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

  // Filter products by search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, products]);

  // Change status
  const handleChangeStatus = async (product: Product, newStatus: "sold" | "installment" | "unsold" | "hidden") => {
    try {
      await updateDoc(doc(db, "accounts", product.id), {
        status: newStatus,
      });
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, status: newStatus } : p
        )
      );
      toast.success("Đã cập nhật trạng thái");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Lỗi cập nhật", {
        description: "Không thể cập nhật trạng thái",
      });
    }
  };

  // Get current status or default to "unsold"
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="p-6">
        <Card className="max-w-7xl mx-auto shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Tag className="w-6 h-6" />
              Quản lý sản phẩm
            </CardTitle>
            <Link href="/admin">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm theo mã code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold">Mã code</TableHead>
                  <TableHead className="font-semibold">Ảnh</TableHead>
                  <TableHead className="font-semibold">Giá thật</TableHead>
                  <TableHead className="font-semibold">Giá fake</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      {searchTerm ? "Không tìm thấy sản phẩm nào" : "Chưa có sản phẩm nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProducts.map((product) => {
                    const currentStatus = getProductStatus(product);
                    return (
                      <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-mono text-sm font-medium text-indigo-600">
                          {product.code}
                        </TableCell>
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <div
                              className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
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
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            {/* <DollarSign className="w-4 h-4" /> */}
                            {formatVND(product.price)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-600">
                            {/* <DollarSign className="w-4 h-4" /> */}
                            {formatVND(product.fake_price)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <select
                            value={currentStatus}
                            onChange={(e) => handleChangeStatus(product, e.target.value as any)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                              statusMap[currentStatus]?.color || statusMap.unsold.color
                            }`}
                          >
                            <option value="sold">Đã bán</option>
                            <option value="installment">Đang trả góp</option>
                            <option value="unsold">Chưa bán</option>
                            <option value="hidden">Tạm ẩn</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
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
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} của {filteredProducts.length} sản phẩm
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
