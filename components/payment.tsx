"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTrigger,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, CreditCard, Wallet, Copy, Loader2, AlertTriangle } from "lucide-react";

import TopUpCard from "./topUpCard";


import Link from "next/link";

export default function Payment({ data }: { data: any }) {

    const accountNumber = "0711000316522";
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => setCopied(false));
    };

    // Lấy email trước @ nếu có user

    const isPayment = process.env.MAINPAYMENT;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">

                    Mua Ngay (Liên Hệ - Để Cọc)
                </Button>
            </AlertDialogTrigger>

                       <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

                <AlertDialogHeader>
                    <AlertDialogTitle>Chuyển khoản</AlertDialogTitle>
                    <AlertDialogDescription>Chọn phương thức thanh toán</AlertDialogDescription>
                </AlertDialogHeader>

                <Tabs defaultValue="qr" className="mt-4">
                    <TabsList>
                        <TabsTrigger value="qr" className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-green-400" /> QR chuyển khoản
                        </TabsTrigger>
                        <TabsTrigger value="card" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-blue-400" /> Thẻ cào
                        </TabsTrigger>
                    </TabsList>

                    {/* QR chuyển khoản */}
                    <TabsContent value="qr" className="mt-4">
                    {
                                isPayment ? (

                                    <Card className="border">
                                        <CardContent className="flex flex-col items-center gap-4">
                                            <div className="w-40 h-50 bg-gray-200 flex items-center justify-center text-gray-500">
                                                <Image
                                                    src="/qr.jpg" // đặt qr.jpg trong thư mục public
                                                    width={250}
                                                    height={250}
                                                    quality={100}
                                                    alt="QR code"
                                                />
                                            </div>
                                            <div className="w-full space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span>Ngân Hàng:</span>
                                                    <span className="font-semibold">Vietcombank</span>
                                                </div>
                                            </div>
                                            <div className="w-full space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span>Chủ Tk:</span>
                                                    <span className="font-semibold">Nguyễn Văn Nam</span>
                                                </div>
                                            </div>
                                            <div className="w-full space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span>Tài khoản:</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{accountNumber}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex items-center gap-1"
                                                            onClick={() => handleCopy(accountNumber)}
                                                        >
                                                            <Copy className="w-4 h-4" /> {copied ? "Đã copy" : "Copy"}
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span>Nội dung chuyển khoản:</span>
                                                    <span className="font-semibold">vc</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-green-500 text-white text-center py-2 rounded-lg flex items-center justify-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Đợi thanh toán</span>
                                            </div>
                                        </CardContent>
                                    </Card>)
                                    : (
                                        <>
                                            <div className="w-full h-full flex items-center justify-center my-6 gap-2">
                                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                                <p className="text-red-500">Hệ thống đang bảo trì</p>
                                            </div>
                                            <p className="text-indigo-600 font-medium text-center">Vui lòng <Link href="https://zalo.me/0563275607" target="_blank" className="font-bold text-green-500 underline">liên hệ</Link> để được hỗ trợ hoặc dùng phương thức <span className="font-bold text-base underline">Thẻ Cào Chiết Khấu 0%</span></p>
                                        </>
                                    )
                            }
                    </TabsContent>

                    {/* Nạp thẻ cào */}
                    <TabsContent value="card" className="mt-4">
                        <TopUpCard />
                    </TabsContent>
                </Tabs>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline" className="w-full">
                            Đóng
                        </Button>
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>

    {/* <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
            <AlertDialogTitle>Nạp tiền</AlertDialogTitle>
            <AlertDialogDescription className="text-green-500 font-bold text-lg">Đăng nhập hoặc Đăng ký để nạp tiền</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
            <AlertDialogCancel asChild>
                <Button variant="outline" className="w-full">
                    Đóng
                </Button>
            </AlertDialogCancel>
        </AlertDialogFooter>
    </AlertDialogContent> */}

        </AlertDialog>
    );
}
