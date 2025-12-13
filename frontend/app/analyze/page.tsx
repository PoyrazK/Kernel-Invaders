import { PageContainer } from "@/components/layout/page-container";
import { ValuationForm } from "@/components/valuation-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

/**
 * Değerleme Sayfası
 * Konut bilgilerini girmek için form
 */

export const metadata = {
  title: "Değerleme | Metrekare",
  description: "Konutunuzun adil piyasa değerini hesaplayın",
};

export default function AnalyzePage() {
  return (
    <PageContainer className="space-y-6">
      {/* Sayfa Başlığı */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900">Değerleme Yap</h1>
        <p className="text-zinc-500">
          Analiz etmek istediğiniz konutun bilgilerini girin
        </p>
      </div>

      {/* Bilgi Notu */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>İpucu</AlertTitle>
        <AlertDescription>
          Daha doğru sonuçlar için tüm alanları doğru ve eksiksiz doldurun.
          İlan fiyatı, satıcının talep ettiği fiyat olmalıdır.
        </AlertDescription>
      </Alert>

      {/* Form */}
      <ValuationForm />
    </PageContainer>
  );
}

