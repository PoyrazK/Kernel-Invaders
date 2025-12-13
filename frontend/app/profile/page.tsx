"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  Target,
  TrendingUp,
} from "lucide-react";

/**
 * Profil Sayfası
 * Kullanıcı bilgileri ve ayarlar
 */

// Mock kullanıcı verisi
const mockUser = {
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  plan: "Ücretsiz",
  analysisCount: 3,
  analysisLimit: 5,
};

// Profil menü öğeleri
const menuItems = [
  { icon: Bell, label: "Bildirimler", description: "Bildirim tercihlerinizi yönetin" },
  { icon: Shield, label: "Gizlilik", description: "Gizlilik ayarlarınız" },
  { icon: HelpCircle, label: "Yardım & Destek", description: "SSS ve iletişim" },
];

export default function ProfilePage() {
  const progressPercent = (mockUser.analysisCount / mockUser.analysisLimit) * 100;

  return (
    <PageContainer className="space-y-6">
      {/* Kullanıcı Kartı */}
      <Card className="border-2 border-zinc-100 overflow-hidden">
        <div className="h-20 bg-zinc-900" />
        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            {/* Avatar */}
            <div className="w-20 h-20 bg-neon-blue rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-10 h-10 text-zinc-900" />
            </div>

            {/* Kullanıcı Bilgileri */}
            <div className="flex-1 space-y-1 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900">
                  {mockUser.name}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {mockUser.plan}
                </Badge>
              </div>
              <p className="text-zinc-500 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {mockUser.email}
              </p>
            </div>

            {/* Düzenle Butonu */}
            <Button variant="outline" size="sm">
              Profili Düzenle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kullanım İstatistikleri */}
      <Card className="border-2 border-zinc-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-neon-blue" />
            Kullanım
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Bu ay yapılan analizler</span>
              <span className="font-semibold text-zinc-900">
                {mockUser.analysisCount} / {mockUser.analysisLimit}
              </span>
            </div>
            <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-blue rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-neon-yellow" />
              <span className="font-semibold text-zinc-900">Pro'ya Yükseltin</span>
            </div>
            <p className="text-sm text-zinc-600">
              Sınırsız değerleme, detaylı raporlar ve öncelikli destek
            </p>
            <Button variant="neon-yellow" size="sm" className="w-full">
              Planları İncele
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-2 border-zinc-100">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-neon-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-900">12</p>
            <p className="text-xs text-zinc-500">Toplam Analiz</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-zinc-100">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-neon-blue mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-900">4</p>
            <p className="text-xs text-zinc-500">Fırsat Bulundu</p>
          </CardContent>
        </Card>
      </div>

      {/* Menü */}
      <Card className="border-2 border-zinc-100">
        <CardContent className="p-0">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-zinc-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-zinc-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-zinc-900">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Çıkış */}
      <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
        <LogOut className="mr-2 w-4 h-4" />
        Çıkış Yap
      </Button>

      {/* Versiyon */}
      <p className="text-center text-xs text-zinc-400">
        Metrekare v1.0.0 • Made with ❤️ in İstanbul
      </p>
    </PageContainer>
  );
}

