"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Shield,
  Flame,
  Phone,
  HomeIcon,
  Menu,
  X,
  UserPlus,
  Wallet,
  LogOut,
  Settings,
  Bell,
} from "lucide-react"
import { Button } from "./ui/button"
import DepositButton from "./depositButton"

import { auth } from "@/utils/firebaseConfig"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathname = usePathname()


  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">

            <Image src="/avatar2-removebg.PNG" alt="ShopTachiOni" className="w-16 h-16" width={32} height={32} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-2 font-semibold group transition-all
    ${pathname === "/"
                  ? "text-violet-600"
                  : "text-gray-700 hover:text-violet-600"}
  `}
            >
              <HomeIcon className={`w-5 h-5 
    ${pathname === "/" ? "text-violet-600" : "text-gray-500 group-hover:text-violet-600"}
  `} />
              <span>Trang Chủ</span>
            </Link>
            <Link
              href="/products"
               className={`flex items-center space-x-2 font-semibold group transition-all
    ${pathname.startsWith("/products") 
      ? "text-red-600" 
      : "text-gray-700 hover:text-red-600"}
  `}
            >
              <Flame className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors" />
              <span>Danh Sách Acc</span>
            </Link>
            <Link
              href="/contact"
              
              className={`flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-all font-semibold group ${pathname === "/contact" ? "text-green-600" : ""}`}
            >
              <Phone className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" />
              <span>Liên Hệ</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">



          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-14 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-lg animate-fade-in-down rounded-b-2xl">
            <nav className="flex flex-col space-y-4 px-6 py-6">
              <Link
                href="/"
                className={`flex items-center gap-3 text-gray-800 font-semibold hover:text-violet-600 transition-colors ${pathname === "/" ? "text-violet-600" : ""}`}
              >
                <HomeIcon className="w-5 h-5 text-violet-500" /> Trang Chủ
              </Link>
              <Link
                href="/products"
                className={`flex items-center gap-3 text-gray-800 font-semibold hover:text-pink-600 transition-colors ${pathname.startsWith("/products") ? "text-pink-600" : ""}`}
              >
                <Flame className="w-5 h-5 text-pink-500" /> Danh Sách Acc
              </Link>
              <Link
                href="https://zalo.me/0966216495"
                target="_blank"
                className={`flex items-center gap-3 text-gray-800 font-semibold hover:text-green-600 transition-colors ${pathname === "/contact" ? "text-green-600" : ""}`}
              >
                <Phone className="w-5 h-5 text-green-500" /> Liên Hệ
              </Link>

              <div className="border-t border-gray-200/50 pt-4 flex flex-col space-y-3">
                {/* <DepositButton /> */}


              </div>
            </nav>
          </div>
        )}

      </div>
    </header>
  )
}
