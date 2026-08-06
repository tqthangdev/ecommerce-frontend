"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPromotionById,
  Promotion,
} from "@/services/admin/promotion.admin.service";
import PromotionForm from "@/components/admin/PromotionForm";
import Loading from "@/components/ui/Loading";

export default function EditPromotionPage() {
  const { id } = useParams<{ id: string }>();
  const promotionId = Number(id);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPromotionById(promotionId)
      .then(setPromotion)
      .finally(() => setLoading(false));
  }, [promotionId]);

  if (loading) return <Loading />;
  if (!promotion) return <p className="p-10">Promotion not found</p>;

  return <PromotionForm initial={promotion} promotionId={promotionId} />;
}
