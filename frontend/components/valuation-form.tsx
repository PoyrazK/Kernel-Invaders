"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Building2, MapPin, Ruler, DoorOpen, Calendar, Layers, Home, Banknote, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { StepProgress, Step } from "@/components/ui/step-progress";
import { ISTANBUL_DISTRICTS, ROOM_OPTIONS, predictValue } from "@/lib/api";
import { ValuationFormData, PropertyStatus } from "@/lib/types";
import { addToHistory } from "@/lib/storage";

/**
 * Zod validasyon şeması
 */
const formSchema = z.object({
  district: z.string().min(1, "İlçe seçimi zorunludur"),
  neighborhood: z.string().min(1, "Mahalle seçimi zorunludur"),
  squareMeters: z.coerce
    .number()
    .min(20, "Minimum 20 m² olmalıdır")
    .max(1000, "Maksimum 1000 m² olabilir"),
  rooms: z.string().min(1, "Oda sayısı seçimi zorunludur"),
  buildingAge: z.coerce
    .number()
    .min(0, "Bina yaşı 0'dan küçük olamaz")
    .max(100, "Bina yaşı 100'den büyük olamaz"),
  floor: z.coerce
    .number()
    .min(-1, "Minimum bodrum kat (-1) olabilir")
    .max(50, "Maksimum 50. kat olabilir"),
  totalFloors: z.coerce
    .number()
    .min(1, "Minimum 1 kat olmalıdır")
    .max(50, "Maksimum 50 kat olabilir"),
  status: z.enum(["BOŞ", "KİRACILI"] as const),
  listingPrice: z.coerce
    .number()
    .min(100000, "Minimum fiyat 100.000 ₺ olmalıdır")
    .max(100000000, "Maksimum fiyat 100.000.000 ₺ olabilir"),
});

type FormValues = z.infer<typeof formSchema>;

// Form steps
const steps: Step[] = [
  { id: "location", title: "Konum", description: "İlçe ve Mahalle" },
  { id: "details", title: "Özellikler", description: "m², Oda, Kat" },
  { id: "price", title: "Fiyat", description: "İlan Fiyatı" },
];

const DRAFT_KEY = "valuationFormDraft";

/**
 * Değerleme Formu Bileşeni (Multi-step + Auto-save)
 */
export function ValuationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [hasDraft, setHasDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form hook
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      district: "",
      neighborhood: "",
      squareMeters: 100,
      rooms: "2+1",
      buildingAge: 5,
      floor: 3,
      totalFloors: 10,
      status: "BOŞ",
      listingPrice: 0, // 0 olarak başlatıp girişi zorunlu kılıyoruz (min 100.000)
    },
  });

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.reset(parsed);
        setSelectedDistrict(parsed.district || "");
        setHasDraft(true);
      } catch (error) {
        console.error("Draft parse error:", error);
      }
    }
  }, [form]);

  // Auto-save on form change (but not after submission)
  useEffect(() => {
    if (isSubmitting) return;
    const subscription = form.watch((value) => {
      // listingPrice'ı kaydetme, her seferinde kullanıcıdan iste
      const { listingPrice, ...rest } = value;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    });
    return () => subscription.unsubscribe();
  }, [form, isSubmitting]);

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    form.reset();
    setSelectedDistrict("");
    setCurrentStep(1);
    setHasDraft(false);
  };

  // Seçili ilçeye göre mahalleler
  const neighborhoods = useMemo(() => {
    const district = ISTANBUL_DISTRICTS.find((d) => d.name === selectedDistrict);
    return district?.neighborhoods.map((n) => ({ value: n, label: n })) || [];
  }, [selectedDistrict]);

  // Adım doğrulama
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["district", "neighborhood"];
        break;
      case 2:
        fieldsToValidate = ["squareMeters", "rooms", "buildingAge", "floor", "totalFloors", "status"];
        break;
      case 3:
        fieldsToValidate = ["listingPrice"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  // Sonraki adım
  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Önceki adım
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form gönderimi
  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const formData: ValuationFormData = {
        district: values.district,
        neighborhood: values.neighborhood,
        squareMeters: values.squareMeters,
        rooms: values.rooms,
        buildingAge: values.buildingAge,
        floor: values.floor,
        totalFloors: values.totalFloors,
        status: values.status as PropertyStatus,
        listingPrice: values.listingPrice,
      };

      // API çağrısı
      const result = await predictValue(formData);

      // Geçmişe ekle (karşılaştırma modu için)
      const saved = addToHistory(result);

      // Sonucu localStorage'a kaydet (Result sayfasında gösterilecek)
      localStorage.setItem("valuationResult", JSON.stringify(saved));

      // Auto-save'i durdur ve draft'ı temizle
      setIsSubmitting(true);
      localStorage.removeItem(DRAFT_KEY);

      // Sonuç sayfasına yönlendir
      router.push("/result");
    } catch (error) {
      console.error("Değerleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neon-blue rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            </div>
            <div>
              <CardTitle>Konut Bilgileri</CardTitle>
              <CardDescription>
                Analiz etmek istediğiniz konutun özelliklerini girin
              </CardDescription>
            </div>
          </div>
          {hasDraft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDraft}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Sıfırla
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Step Progress */}
        <StepProgress steps={steps} currentStep={currentStep} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">{/* Form içeriği değişmedi, sadece üst kısım güncellendi */}
            {/* Adım 1: Konum */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Konum Bilgileri
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* İlçe */}
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İlçe</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedDistrict(value);
                            form.setValue("neighborhood", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="İlçe seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ISTANBUL_DISTRICTS.map((district) => (
                              <SelectItem key={district.id} value={district.name}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mahalle */}
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mahalle</FormLabel>
                        <Combobox
                          options={neighborhoods}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Mahalle seçin"
                          searchPlaceholder="Mahalle ara..."
                          emptyText="Mahalle bulunamadı"
                          disabled={!selectedDistrict}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Adım 2: Özellikler */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Fiziksel Özellikler
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* m² */}
                  <FormField
                    control={form.control}
                    name="squareMeters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metrekare (m²)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Oda Sayısı */}
                  <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oda Sayısı</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROOM_OPTIONS.map((room) => (
                              <SelectItem key={room} value={room}>
                                {room}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bina Yaşı */}
                  <FormField
                    control={form.control}
                    name="buildingAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bina Yaşı</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Durum */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durum</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BOŞ">Boş</SelectItem>
                            <SelectItem value="KİRACILI">Kiracılı</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Kat */}
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bulunduğu Kat</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Toplam Kat */}
                  <FormField
                    control={form.control}
                    name="totalFloors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Toplam Kat Sayısı</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Adım 3: Fiyat */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Fiyat Bilgisi
                </h3>

                <FormField
                  control={form.control}
                  name="listingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlan Satış Fiyatı (₺)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="5.000.000" 
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? 0 : Number(e.target.value);
                            field.onChange(value);
                          }}
                          onKeyDown={(e) => {
                            // Block letters and special characters, allow only numbers and control keys
                            if (
                              !/[0-9]/.test(e.key) && 
                              !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) &&
                              !(e.ctrlKey || e.metaKey)
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Geri
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleNext}
                  className="flex-1"
                >
                  İleri
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analiz Ediliyor...
                    </>
                  ) : (
                    "Adil Değeri Hesapla"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
