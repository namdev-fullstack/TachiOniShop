import { Award, Shield } from "lucide-react";

export default function Footer() {
  return <footer className="bg-gradient-to-br md:mt-24 mt-20 from-gray-900 via-gray-800 to-black text-white py-16 relative overflow-hidden">
  {/* Background Decorations */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-full animate-float"></div>
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-float-delayed"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-500/5 to-blue-500/5 rounded-full animate-pulse"></div>
  </div>

  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">ShopLiênQuân</span>
        </div>
        <p className="text-gray-400 mb-4">
          Nền tảng mua bán tài khoản game uy tín và an toàn hàng đầu Việt Nam.
        </p>
        <div className="flex space-x-4">
          <div className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-violet-600 hover:to-blue-600 hover:scale-110 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg">
            <span className="text-sm font-bold">f</span>
          </div>
          <div className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:scale-110 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg">
            <span className="text-sm font-bold">t</span>
          </div>
          <div className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:scale-110 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg">
            <span className="text-sm font-bold">ig</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sản Phẩm</h3>
        <ul className="space-y-2 text-gray-400">
          <li><a href="#" className="hover:text-violet-400 hover:scale-105 transition-all duration-300 inline-block">Liên Quân Mobile</a></li>
          <li><a href="#" className="hover:text-blue-400 hover:scale-105 transition-all duration-300 inline-block">Liên Minh Huyền Thoại</a></li>
          <li><a href="#" className="hover:text-red-400 hover:scale-105 transition-all duration-300 inline-block">Valorant</a></li>
          <li><a href="#" className="hover:text-orange-400 hover:scale-105 transition-all duration-300 inline-block">PUBG Mobile</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Hỗ Trợ</h3>
        <ul className="space-y-2 text-gray-400">
          <li><a href="#" className="hover:text-green-400 hover:scale-105 transition-all duration-300 inline-block">Trung tâm trợ giúp</a></li>
          <li><a href="#" className="hover:text-blue-400 hover:scale-105 transition-all duration-300 inline-block">Chính sách bảo hành</a></li>
          <li><a href="#" className="hover:text-yellow-400 hover:scale-105 transition-all duration-300 inline-block">Điều khoản sử dụng</a></li>
          <li><a href="#" className="hover:text-purple-400 hover:scale-105 transition-all duration-300 inline-block">Chính sách bảo mật</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
        <div className="space-y-2 text-gray-400">
          <p>📧 support@gamephobian.com</p>
          <p>📞 0966 216 495</p>
          <p>🕒 Hỗ trợ 24/7</p>
          <p>🏢 Hà Nội, Việt Nam</p>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-400 mb-4 md:mb-0">
        © 2023 ShopLiênQuân. All rights reserved.
      </p>
      <div className="flex items-center space-x-6 text-sm text-gray-400">
        <span className="flex items-center">
          <Shield className="w-4 h-4 mr-1 text-green-500 animate-pulse" />
          Bảo mật SSL
        </span>
        <span className="flex items-center">
          <Award className="w-4 h-4 mr-1 text-blue-500 animate-pulse" />
          Uy tín hàng đầu
        </span>
      </div>
    </div>
  </div>
</footer>
}