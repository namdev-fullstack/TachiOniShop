"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { PricingTier, DEFAULT_PRICING_TIERS } from "@/lib/priceUtils";

export function usePricingTiers() {
  const [tiers, setTiers] = useState<PricingTier[]>(DEFAULT_PRICING_TIERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "pricing_tiers"),
      (snapshot) => {
        if (snapshot.exists() && Array.isArray(snapshot.data()?.tiers)) {
          setTiers(snapshot.data().tiers);
        } else {
          setTiers(DEFAULT_PRICING_TIERS);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi lắng nghe cấu hình mốc %:", error);
        setTiers(DEFAULT_PRICING_TIERS);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { tiers, loading };
}
