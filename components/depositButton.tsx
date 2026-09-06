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

export default function DepositButton() {
  
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


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 hover:shadow-lg transition-all text-white">
                    <Wallet className="w-4 h-4" />
                    Nạp tiền
                </Button>
            </AlertDialogTrigger>
           
        </AlertDialog>
    );
}
