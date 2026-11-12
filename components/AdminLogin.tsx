"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, query, limit } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, Shield, User as UserIcon, UserCheck, ShieldAlert } from "lucide-react";

export type UserRole = "admin" | "staff";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  created_at?: any;
}

// Bộ nhớ cache tạm thời trong phiên để tránh giật lag, flash màn hình khi chuyển giữa các trang quản trị
let cachedUser: User | null = null;
let cachedProfile: UserProfile | null = null;
let hasInitialAuthChecked = false;

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
  const [loading, setLoading] = useState(!hasInitialAuthChecked);

  // Lấy hoặc khởi tạo profile người dùng trong Firestore
  const fetchOrCreateProfile = async (currentUser: User): Promise<UserProfile> => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data() as UserProfile;
        cachedProfile = data;
        setProfile(data);
        return data;
      }

      // Nếu chưa có profile trong Firestore, kiểm tra xem có user nào chưa
      let role: UserRole = "staff";
      try {
        const usersSnap = await getDocs(query(collection(db, "users"), limit(2)));
        if (usersSnap.empty || currentUser.email?.toLowerCase().includes("admin")) {
          role = "admin";
        }
      } catch (err) {
        // Fallback an toàn
        if (currentUser.email?.toLowerCase().includes("admin")) {
          role = "admin";
        }
      }

      const defaultName =
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        (role === "admin" ? "Quản trị viên" : "Nhân viên");

      const newProfile: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email || "",
        name: defaultName,
        role,
        created_at: new Date(),
      };

      await setDoc(userDocRef, newProfile);
      cachedProfile = newProfile;
      setProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error("Lỗi lấy thông tin user profile:", error);
      const fallbackProfile: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email || "",
        name: currentUser.email?.split("@")[0] || "Người dùng",
        role: currentUser.email?.toLowerCase().includes("admin") ? "admin" : "staff",
      };
      cachedProfile = fallbackProfile;
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      cachedUser = currentUser;
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreateProfile(currentUser);
      } else {
        cachedProfile = null;
        setProfile(null);
      }
      hasInitialAuthChecked = true;
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      cachedUser = user;
      setUser(user);
      const userProf = await fetchOrCreateProfile(user);
      cachedProfile = userProf;
      hasInitialAuthChecked = true;
      toast.success("Đăng nhập thành công", {
        description: `Chào mừng ${userProf.role === "admin" ? "Quản trị viên" : "Cộng tác viên"}: ${userProf.name}!`,
      });
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Đăng nhập thất bại";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Email không hợp lệ";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "Không tìm thấy tài khoản";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Mật khẩu sai";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Email hoặc mật khẩu không đúng";
      }
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole = "staff") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      setUser(newUser);

      const userProfile: UserProfile = {
        uid: newUser.uid,
        email: newUser.email || email,
        name: name.trim() || email.split("@")[0],
        role,
        created_at: new Date(),
      };

      await setDoc(doc(db, "users", newUser.uid), userProfile);
      setProfile(userProfile);

      toast.success("Đăng ký tài khoản thành công!", {
        description: `Tài khoản vai trò: ${role === "admin" ? "Quản trị viên" : "Cộng tác viên"}`,
      });
      return true;
    } catch (error: any) {
      console.error("Register error:", error);
      let errorMessage = "Đăng ký thất bại";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email này đã được sử dụng";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Mật khẩu quá yếu (tối thiểu 6 ký tự)";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email không đúng định dạng";
      }
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      cachedUser = null;
      cachedProfile = null;
      hasInitialAuthChecked = true;
      setUser(null);
      setProfile(null);
      toast.success("Đã đăng xuất");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Lỗi đăng xuất");
    }
  };

  const role: UserRole = profile?.role || (user?.email?.toLowerCase().includes("admin") ? "admin" : "staff");
  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  return {
    user,
    profile,
    role,
    isAdmin,
    isStaff,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }

    setSubmitting(true);
    const success = await login(email.trim(), password);
    setSubmitting(false);

    if (success) {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-7 h-7 text-yellow-300" />
            <CardTitle className="text-xl sm:text-2xl font-black tracking-wide">
              Cổng Quản Trị Hệ Thống
            </CardTitle>
          </div>
          <CardDescription className="text-indigo-100 text-center text-xs">
            Đăng nhập dành cho Quản trị viên & Cộng tác viên
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Gmail / Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com hoặc nhanvien@..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Mật khẩu
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-[0.99] mt-2 cursor-pointer"
            >
              {submitting ? "Đang xác thực..." : "Đăng nhập ngay"}
            </Button>

            <div className="pt-3 border-t border-slate-100 text-center space-y-2">
              <p className="text-[11px] text-slate-500">
                🔒 Tài khoản cộng tác viên được cấp trực tiếp bởi <strong>Quản trị viên (Admin)</strong>.
              </p>
              <div>
                <a
                  href="/"
                  className="inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ← Quay lại trang chủ bán hàng
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
