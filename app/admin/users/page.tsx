"use client";

import { useState, useEffect, useMemo } from "react";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, firebaseConfig } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Shield,
  User,
  Pencil,
  ShieldAlert,
  UserPlus,
  RefreshCw,
  Mail,
  Eye,
  EyeOff,
  Trash2,
  Search,
  KeyRound,
  Percent,
} from "lucide-react";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";
import { useAdminAuth, UserProfile, UserRole } from "@/components/AdminLogin";

export default function AdminUsersPage() {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create employee state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("staff");
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit user state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("staff");
  const [saving, setSaving] = useState(false);

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      })) as UserProfile[];

      setUsersList(list);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Tạo nhân viên mới bằng Gmail, Tên và Mật khẩu (Chỉ Admin mới có quyền)
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra quyền Admin nghiêm ngặt
    if (!isAdmin) {
      toast.error("Chỉ có Quản trị viên (Admin) mới có quyền tạo nhân viên!");
      return;
    }

    const trimmedEmail = newEmail.trim().toLowerCase();
    const trimmedName = newName.trim();
    const trimmedPassword = newPassword.trim();

    if (!trimmedEmail) {
      toast.error("Vui lòng nhập địa chỉ Gmail / Email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Địa chỉ Gmail / Email không đúng định dạng!");
      return;
    }

    if (!trimmedName) {
      toast.error("Vui lòng nhập tên nhân viên");
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setCreating(true);
    let secondaryApp = null;

    try {
      // Khởi tạo Firebase App thứ cấp tạm thời để không ảnh hưởng phiên đăng nhập Admin
      const secondaryAppName = `StaffCreationApp_${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);

      // Tạo tài khoản Firebase Auth trên secondaryAuth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        trimmedEmail,
        trimmedPassword
      );
      const createdUser = userCredential.user;

      // Lưu hồ sơ nhân viên vào collection 'users' trên Firestore
      const newProfile: UserProfile = {
        uid: createdUser.uid,
        email: trimmedEmail,
        name: trimmedName,
        role: newRole,
        created_at: new Date(),
      };

      await setDoc(doc(db, "users", createdUser.uid), newProfile);

      // Sign out khỏi secondaryAuth
      await signOut(secondaryAuth);

      toast.success(`Tạo nhân viên "${trimmedName}" thành công! 🎉`, {
        description: `Tài khoản: ${trimmedEmail} (${newRole === "admin" ? "Admin" : "Nhân viên"})`,
      });

      // Reset form & close dialog
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setNewRole("staff");
      setShowPassword(false);
      setIsCreateOpen(false);

      // Cập nhật lại danh sách nhân viên
      await fetchUsers();
    } catch (error: any) {
      console.error("Error creating employee:", error);
      let message = "Không thể tạo tài khoản nhân viên";
      if (error?.code === "auth/email-already-in-use") {
        message = "Gmail / Email này đã được đăng ký tài khoản trước đó!";
      } else if (error?.code === "auth/weak-password") {
        message = "Mật khẩu quá yếu (tối thiểu 6 ký tự)!";
      } else if (error?.code === "auth/invalid-email") {
        message = "Gmail / Email không hợp lệ!";
      } else if (error?.message) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch (cleanupErr) {
          console.warn("Cleanup secondary app error:", cleanupErr);
        }
      }
      setCreating(false);
    }
  };

  // Open modal edit
  const handleOpenEdit = (targetUser: UserProfile) => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền chỉnh sửa tài khoản nhân viên!");
      return;
    }
    setEditingUser(targetUser);
    setEditName(targetUser.name || "");
    setEditRole(targetUser.role || "staff");
  };

  // Save user changes
  const handleSaveUser = async () => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền lưu thay đổi!");
      return;
    }
    if (!editingUser) return;
    if (!editName.trim()) {
      toast.error("Vui lòng nhập tên nhân viên");
      return;
    }

    try {
      setSaving(true);
      await updateDoc(doc(db, "users", editingUser.uid), {
        name: editName.trim(),
        role: editRole,
      });

      setUsersList((prev) =>
        prev.map((u) =>
          u.uid === editingUser.uid
            ? { ...u, name: editName.trim(), role: editRole }
            : u
        )
      );

      toast.success(`Đã cập nhật thông tin tài khoản ${editName}! 🎉`);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Lỗi cập nhật người dùng");
    } finally {
      setSaving(false);
    }
  };

  // Quick toggle role
  const handleToggleRole = async (targetUser: UserProfile) => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền phân quyền!");
      return;
    }

    if (targetUser.uid === user?.uid) {
      toast.error("Bạn không thể tự hạ quyền Admin của chính mình!");
      return;
    }

    const newTargetRole: UserRole = targetUser.role === "admin" ? "staff" : "admin";
    try {
      await updateDoc(doc(db, "users", targetUser.uid), {
        role: newTargetRole,
      });

      setUsersList((prev) =>
        prev.map((u) => (u.uid === targetUser.uid ? { ...u, role: newTargetRole } : u))
      );

      toast.success(
        `Đã đổi quyền của ${targetUser.name || targetUser.email} thành ${
          newTargetRole === "admin" ? "Quản trị viên (Admin)" : "Nhân viên (Staff)"
        }`
      );
    } catch (error) {
      console.error("Error toggling role:", error);
      toast.error("Lỗi đổi quyền người dùng");
    }
  };

  // Xóa tài khoản nhân viên khỏi Firestore
  const handleDeleteUser = async () => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền xóa tài khoản nhân viên!");
      return;
    }
    if (!deletingUser) return;

    if (deletingUser.uid === user?.uid) {
      toast.error("Không thể xóa tài khoản Admin đang đăng nhập!");
      setDeletingUser(null);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "users", deletingUser.uid));

      setUsersList((prev) => prev.filter((u) => u.uid !== deletingUser.uid));
      toast.success(`Đã xóa tài khoản nhân viên ${deletingUser.name || deletingUser.email}!`);
      setDeletingUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Lỗi xóa tài khoản nhân viên");
    } finally {
      setIsDeleting(false);
    }
  };

  // Lọc danh sách nhân viên theo từ khóa tìm kiếm
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return usersList;
    return usersList.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [usersList, searchQuery]);

  const adminCount = useMemo(
    () => usersList.filter((u) => u.role === "admin").length,
    [usersList]
  );
  const staffCount = useMemo(
    () => usersList.filter((u) => u.role !== "admin").length,
    [usersList]
  );

  // Chỉ Admin mới được truy cập trang này
  if (!isAdmin && !authLoading) {
    return (
      <AdminAuthWrapper>
        <div className="p-4 sm:p-8 text-center max-w-md mx-auto my-8 sm:my-16 bg-white rounded-2xl border border-slate-200 shadow-md">
          <ShieldAlert className="w-14 h-14 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Không có quyền truy cập</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Trang này chỉ dành riêng cho <strong>Quản trị viên (Admin)</strong> để tạo và quản lý tài khoản nhân viên.
          </p>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 text-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <CardTitle className="text-lg sm:text-2xl font-black flex items-center gap-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                  Quản lý nhân viên & Phân quyền Role
                </CardTitle>
                <CardDescription className="text-xs text-indigo-100 mt-1">
                  Chỉ Quản trị viên (Admin) mới có quyền tạo và quản lý tài khoản nhân viên.
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                  className="flex-1 sm:flex-none bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer h-9"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Tạo nhân viên mới
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUsers}
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs font-semibold cursor-pointer h-9 px-3"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span className="hidden xs:inline">Làm mới</span>
                </Button>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 pt-3 border-t border-white/10 text-xs">
              <span className="bg-white/15 px-2.5 py-1 rounded-full font-semibold">
                Tổng số: <strong className="text-yellow-300">{usersList.length}</strong>
              </span>
              <span className="bg-white/15 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3 text-yellow-300" />
                Admin: <strong className="text-yellow-300">{adminCount}</strong>
              </span>
              <span className="bg-white/15 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-300" />
                Nhân viên: <strong className="text-emerald-300">{staffCount}</strong>
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-6 space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 w-full sm:max-w-sm">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Tìm theo tên, email, vai trò..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs sm:text-sm border-slate-200 h-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Đang tải danh sách tài khoản...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                {searchQuery
                  ? "Không tìm thấy nhân viên phù hợp với từ khóa tìm kiếm."
                  : "Chưa có tài khoản nào được lưu trong cơ sở dữ liệu."}
              </div>
            ) : (
              <>
                {/* 1. Mobile Cards View (Hiển thị trên màn hình nhỏ < md) */}
                <div className="md:hidden space-y-3">
                  {filteredUsers.map((u) => {
                    const isTargetAdmin = u.role === "admin";
                    const isCurrentUser = u.uid === user?.uid;

                    return (
                      <div
                        key={u.uid}
                        className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                isTargetAdmin ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {isTargetAdmin ? (
                                <Shield className="w-4 h-4" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{u.name || "Chưa đặt tên"}</span>
                                {isCurrentUser && (
                                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
                                    Bạn
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span className="truncate max-w-[200px]">{u.email}</span>
                              </div>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isTargetAdmin
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {isTargetAdmin ? "Admin" : "Nhân viên"}
                          </span>
                        </div>

                        {/* Pricing rule info */}
                        <div className="text-[11px] bg-slate-50 text-slate-600 rounded-lg p-2 flex items-center gap-1.5">
                          <Percent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {isTargetAdmin
                              ? "Toàn quyền, không tính % chênh lệch khi đăng"
                              : "Đăng acc: <1tr (+30%) | ≥1tr (+25%)"}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(u)}
                            className="text-xs h-8 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Sửa
                          </Button>

                          {!isCurrentUser && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleRole(u)}
                                className="text-xs h-8 text-slate-600 hover:text-indigo-600 cursor-pointer"
                              >
                                Đổi thành {isTargetAdmin ? "Staff" : "Admin"}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingUser(u)}
                                className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Desktop Table View (Hiển thị trên màn hình >= md) */}
                <div className="hidden md:block rounded-xl border border-slate-200 overflow-x-auto bg-white">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-bold text-slate-800 text-xs">Tên nhân viên</TableHead>
                        <TableHead className="font-bold text-slate-800 text-xs">Gmail / Email</TableHead>
                        <TableHead className="font-bold text-slate-800 text-xs">Vai trò (Role)</TableHead>
                        <TableHead className="font-bold text-slate-800 text-xs">Quy tắc đăng acc</TableHead>
                        <TableHead className="font-bold text-slate-800 text-xs text-right">
                          Hành động
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => {
                        const isTargetAdmin = u.role === "admin";
                        const isCurrentUser = u.uid === user?.uid;

                        return (
                          <TableRow key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                            <TableCell className="font-bold text-slate-900 text-sm">
                              <div className="flex items-center gap-2">
                                {isTargetAdmin ? (
                                  <Shield className="w-4 h-4 text-purple-600 shrink-0" />
                                ) : (
                                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                <span>{u.name || "Chưa đặt tên"}</span>
                                {isCurrentUser && (
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                                    Bạn
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-xs text-slate-600 font-mono">
                              {u.email}
                            </TableCell>

                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  isTargetAdmin
                                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {isTargetAdmin ? "Quản trị viên (Admin)" : "Nhân viên (Staff)"}
                              </span>
                            </TableCell>

                            <TableCell className="text-xs text-slate-600">
                              {isTargetAdmin ? (
                                <span className="text-purple-700 font-medium">
                                  Không tăng % khi đăng acc mới
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-medium">
                                  &lt;1tr: +30% | ≥1tr: +25%
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEdit(u)}
                                  className="text-xs h-8 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 mr-1" />
                                  Sửa
                                </Button>

                                {!isCurrentUser && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleRole(u)}
                                      className="text-xs h-8 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer"
                                    >
                                      Đổi thành {isTargetAdmin ? "Nhân viên" : "Admin"}
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setDeletingUser(u)}
                                      className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                      title="Xóa tài khoản nhân viên"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal Tạo nhân viên mới */}
        <Dialog open={isCreateOpen} onOpenChange={(open) => !creating && setIsCreateOpen(open)}>
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <div className="flex items-center gap-2 text-indigo-600">
                <UserPlus className="w-5 h-5" />
                <DialogTitle className="text-slate-900 font-bold text-base sm:text-lg">
                  Tạo tài khoản nhân viên mới
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-500">
                Chỉ Quản trị viên mới có quyền cấp tài khoản nhân viên bằng Gmail, Tên và Mật khẩu.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateEmployee} className="space-y-4 py-2">
              <div>
                <Label className="text-xs font-bold text-slate-700">
                  Địa chỉ Gmail / Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="VD: nhanvien1@gmail.com"
                    className="pl-9 text-base sm:text-sm border-slate-200"
                    disabled={creating}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">
                  Họ và tên nhân viên <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A..."
                    className="pl-9 text-base sm:text-sm border-slate-200"
                    disabled={creating}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tên này sẽ hiển thị ở cột Người đăng khi nhân viên đăng bán acc.
                </p>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">
                  Mật khẩu đăng nhập <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="pl-9 pr-10 text-base sm:text-sm border-slate-200 font-mono"
                    disabled={creating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Vai trò (Role)</Label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg mt-1 text-sm bg-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={creating}
                >
                  <option value="staff">Nhân viên (Staff) - Có tính % chênh lệch khi đăng</option>
                  <option value="admin">Quản trị viên (Admin) - Toàn quyền, không tính %</option>
                </select>
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2 flex flex-col-reverse sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={creating}
                  className="w-full sm:w-auto"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {creating ? "Đang tạo tài khoản..." : "Xác nhận tạo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal chỉnh sửa thông tin người dùng */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-bold">
                Chỉnh sửa tài khoản nhân viên
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Email: <span className="font-mono font-semibold">{editingUser?.email}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label className="text-xs font-bold text-slate-700">
                  Tên hiển thị nhân viên
                </Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="VD: Tuấn Nhân Viên..."
                  className="mt-1 text-base sm:text-sm border-slate-200"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tên này sẽ hiển thị ở cột Người đăng trên trang danh sách sản phẩm.
                </p>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Vai trò (Role)</Label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg mt-1 text-sm bg-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="staff">Nhân viên (Staff) - Có tính % chênh lệch khi đăng</option>
                  <option value="admin">Quản trị viên (Admin) - Toàn quyền, không tính %</option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 flex flex-col-reverse sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={saving}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal xác nhận xóa nhân viên */}
        <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
          <AlertDialogContent className="w-[95vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600 flex items-center gap-2 text-base sm:text-lg">
                <Trash2 className="w-5 h-5" />
                Xác nhận xóa tài khoản nhân viên
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm">
                Bạn có chắc chắn muốn xóa tài khoản của nhân viên{" "}
                <strong className="text-slate-900">
                  {deletingUser?.name} ({deletingUser?.email})
                </strong>{" "}
                khỏi hệ thống? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
              <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminAuthWrapper>
  );
}
