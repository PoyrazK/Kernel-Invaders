"use client";

import Link from "next/link";
import { ArrowRight, LineChart, Scale, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { QuoteBanner, TestimonialsSection } from "@/components/quotes";
import { cn } from "@/lib/utils";

/**
 * Landing Page
 * Güven + Akademik ciddiyet + Net değer önerisi
 */

// Özellik kartları verisi
const features = [
  {
    icon: LineChart,
    title: "Veri Odaklı Değerleme",
    description:
      "Binlerce gerçek ilan verisinden eğitilmiş makine öğrenmesi modeli ile objektif değerleme.",
    color: "bg-neon-blue",
    glowClass: "neon-blue-glow",
  },
  {
    icon: Scale,
    title: "Fiyat / Değer Karşılaştırması",
    description:
      "İlan fiyatını piyasa değeriyle karşılaştırın. Aradaki farkı net olarak görün.",
    color: "bg-neon-yellow",
    glowClass: "neon-yellow-glow",
  },
  {
    icon: TrendingUp,
    title: "Objektif Yatırım Tavsiyesi",
    description:
      "Fırsat mı, pahalı mı? Veriye dayalı, duygusal olmayan yatırım kararları alın.",
    color: "bg-neon-green",
    glowClass: "neon-green-glow",
  },
];

// İstatistikler
const stats = [
  { value: "27K+", label: "Analiz Edilen İlan" },
  { value: "39", label: "İlçe Kapsamı" },
  { value: "%96", label: "Tahmin Doğruluğu" },
  { value: "2sn", label: "Sonuç Süresi" },
];

export default function HomePage() {
  return (
    <PageContainer className="space-y-12">
      {/* Hero Section */}
      <section className="pt-8 pb-4">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            Yapay Zeka Destekli Analiz
          </div>

          {/* Başlık */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
            İstanbul Konut Piyasasında{" "}
            <span className="font-serif italic bg-gradient-to-r from-[rgba(82,82,91,1)] to-[rgba(198,184,184,1)] dark:from-[rgba(161,161,170,1)] dark:to-[rgba(228,228,231,1)] bg-clip-text text-transparent blur-[1px]">
              Gerçek Değeri
            </span>{" "}
            Veriye Dayalı Keşfet.
          </h1>

          {/* Alt başlık */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Makine öğrenmesi modelleri ile konutunuzun{" "}
            <span className="text-foreground font-semibold">adil piyasa değerini</span>{" "}
            hesaplayın ve yatırım kararınızı güvenle verin.
          </p>

          {/* CTA Butonları */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/analyze">
              <Button size="xl" className="w-full sm:w-auto group">
                Evi Analiz Et
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Nasıl Çalışır?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "text-center p-6 rounded-3xl bg-secondary animate-slide-up",
                `animate-delay-${(index + 1) * 100}`
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Özellik Kartları */}
      <section id="features" className="py-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Neden Metrekare?
          </h2>
          <p className="text-muted-foreground">
            Duygusal değil, veriye dayalı kararlar için
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={cn(
                  "card-hover border-2 border-border overflow-hidden animate-slide-up"
                )}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  {/* İkon */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      feature.color
                    )}
                  >
                    <Icon className="w-7 h-7 text-zinc-900 dark:text-zinc-100" />
                  </div>

                  {/* İçerik */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            3 Adımda Değerleme
          </h2>
          <p className="text-muted-foreground">Hızlı, kolay ve güvenilir</p>
        </div>

        <div className="relative">
          {/* Bağlantı çizgisi */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Bilgileri Girin",
                description: "Konutun özelliklerini ve ilan fiyatını girin",
              },
              {
                step: "02",
                title: "Analiz Edin",
                description: "ML modeli saniyeler içinde değeri hesaplar",
              },
              {
                step: "03",
                title: "Karar Verin",
                description: "Fırsat mı, pahalı mı hemen görün",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center space-y-3 animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                {/* Numara */}
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold relative z-10">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivasyonel Alıntı Banner */}
      <section className="py-8">
        <QuoteBanner />
      </section>

      {/* Kullanıcı Yorumları */}
      <TestimonialsSection />

      {/* Son CTA */}
      <section className="py-12">
        <Card className="bg-primary border-0 overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              Yatırım Kararınızı Bugün Verin
            </h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto">
              Duygulara değil, verilere dayanın. İlk analiz tamamen ücretsiz.
            </p>
            <Link href="/analyze">
              <Button variant="secondary" size="xl" className="mt-4">
                Hemen Başla
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}

