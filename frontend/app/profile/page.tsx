"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Heart,
  Code,
  Cpu,
  GraduationCap,
  MapPin,
  Github,
  Globe,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import logoDark from "@/assets/logo2.png";

/**
 * Hakkımızda Sayfası
 * Takım ve proje bilgileri
 */

// Takım üyeleri
const teamMembers = [
  {
    name: "Bahadır Koşapınar",
    role: "Takım Lideri & Full Stack Developer",
    avatar: "BK",
    color: "bg-blue-500",
  },
  {
    name: "Ravan Aliyev",
    role: "Full Stack Developer",
    avatar: "RA",
    color: "bg-emerald-500",
  },
  {
    name: "Muhammet Türker Akarsu",
    role: "Data Scientist & ML Engineer",
    avatar: "MA",
    color: "bg-purple-500",
  },
  {
    name: "Hüseyin Poyraz Küçükarslan",
    role: "Backend Developer",
    avatar: "PK",
    color: "bg-orange-500",
  },
];

// Neden Metrekare?
const whyMetrekare = [
  {
    title: "23.000+ Gerçek Veri",
    description:
      "Modelimiz İstanbul'daki 23.000'den fazla gerçek emlak ilanı verisiyle eğitildi. Sahte veya tahmini veri yok, sadece piyasadan toplanan güncel veriler.",
  },
  {
    title: "LightGBM Makine Öğrenmesi",
    description:
      "Gradient boosting tabanlı LightGBM algoritması kullanıyoruz. Bu model, karmaşık fiyat ilişkilerini yakalayarak %92+ doğruluk oranı sağlıyor.",
  },
  {
    title: "Bölgesel Fiyat Analizi",
    description:
      "Sadece genel tahmin değil, ilçe ve mahalle bazında ortalama fiyatları, m² değerlerini ve piyasa trendlerini de görüyorsunuz.",
  },
  {
    title: "Anlık Sonuç",
    description:
      "Emlakçıya gitmenize gerek yok. 3 adımda, saniyeler içinde evinizin adil piyasa değerini öğrenin ve fırsat mı pahalı mı hemen görün.",
  },
];

// Teknolojiler
const technologies = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "FastAPI", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "LightGBM", category: "ML" },
  { name: "Pandas", category: "ML" },
];

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLogo = mounted && resolvedTheme === "dark" ? logoDark : logo;

  return (
    <PageContainer className="space-y-8 pt-4">
      {/* Hero Bölümü */}
      <Card className="border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <CardContent className="pt-10 pb-8 px-6">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-28 h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Image 
                src={currentLogo}
                alt="Metrekare Logo" 
                width={72} 
                height={72}
                className="rounded-xl"
              />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-3">
              Metrekare
            </h1>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Yapay zeka destekli emlak değerleme platformu. 
              İstanbul&apos;daki ev fiyatlarını doğru tahmin edin, fırsatları keşfedin.
            </p>
            
            <div className="flex items-center gap-3 mt-6">
              <Badge variant="secondary" className="text-xs px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1.5" />
                AI Powered
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1">
                <MapPin className="w-3 h-3 mr-1.5" />
                İstanbul
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Neden Metrekare? */}
      <Card className="border-2 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Neden Metrekare?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          {whyMetrekare.map((item, index) => (
            <div
              key={item.title}
              className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-foreground">
                  {item.title}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                {item.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Takım */}
      <Card className="border-2 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-blue-500" />
            Kernel Invaders Takımı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
            >
              <div className={`w-14 h-14 ${member.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                {member.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 flex items-center justify-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm">Atatürk Üniversitesi - Bilgisayar Mühendisliği</span>
          </div>
        </CardContent>
      </Card>

      {/* Teknolojiler */}
      <Card className="border-2 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code className="w-5 h-5 text-emerald-500" />
            Kullanılan Teknolojiler
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge
                key={tech.name}
                variant="secondary"
                className={`text-xs px-3 py-1 ${
                  tech.category === "Frontend"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : tech.category === "Backend"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                }`}
              >
                {tech.name}
              </Badge>
            ))}
          </div>
          
          <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Model:</span> LightGBM ile eğitilmiş regresyon modeli
            </div>
          </div>
        </CardContent>
      </Card>

      {/* İletişim */}
      <Card className="border-2 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5 text-orange-500" />
            Bağlantılar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-6">
          <a
            href="https://github.com/PoyrazK/Kernel-Invaiders"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Github className="w-6 h-6" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">GitHub Repository</p>
              <p className="text-sm text-muted-foreground mt-0.5">Kaynak kodları inceleyin</p>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* Versiyon */}
      <div className="text-center space-y-3 py-6">
        <p className="text-sm text-muted-foreground">
          Metrekare v1.0.0
        </p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
          Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Erzurum for İstanbul
        </p>
      </div>
    </PageContainer>
  );
}

