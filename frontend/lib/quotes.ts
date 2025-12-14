/**
 * Website Quotes - Alıntılar ve Testimonial'lar
 * Motivasyonel sözler, eğitici ipuçları ve kullanıcı yorumları
 */

// Motivasyonel Alıntılar
export interface Quote {
  text: string;
  author: string;
  category: "investment" | "timing" | "location" | "patience" | "value";
}

export const motivationalQuotes: Quote[] = [
  {
    text: "Emlak, üzerinde yürüyebileceğiniz, hissedebileceğiniz tek yatırımdır.",
    author: "Louis Glickman",
    category: "investment",
  },
  {
    text: "En iyi yatırım, ev almaktır; çünkü onu kullanırken değer kazanır.",
    author: "Franklin D. Roosevelt",
    category: "investment",
  },
  {
    text: "Ev satın almak için en iyi zaman 20 yıl önceydi. İkinci en iyi zaman şimdi.",
    author: "Anonim",
    category: "timing",
  },
  {
    text: "Konumu satın alın, evi değil.",
    author: "Emlak Atasözü",
    category: "location",
  },
  {
    text: "Kiracı, ev sahibinin mortgage'ını öder.",
    author: "Robert Kiyosaki",
    category: "investment",
  },
  {
    text: "Fiyat, ödediğiniz şeydir. Değer, aldığınız şeydir.",
    author: "Warren Buffett",
    category: "value",
  },
  {
    text: "Panik satışı yapmayın, panik alışı da yapmayın.",
    author: "Peter Lynch",
    category: "patience",
  },
  {
    text: "Piyasa, sabırsızlardan sabırlılara para transferi yapan bir araçtır.",
    author: "Warren Buffett",
    category: "patience",
  },
  {
    text: "Emlak yatırımı, zenginliğin en güvenli yoludur.",
    author: "Andrew Carnegie",
    category: "investment",
  },
  {
    text: "Her büyük servetin arkasında bir gayrimenkul yatırımı vardır.",
    author: "Anonim",
    category: "investment",
  },
  {
    text: "Doğru evi bulmak, doğru insanı bulmak gibidir - sabır gerektirir.",
    author: "Anonim",
    category: "patience",
  },
  {
    text: "Lokasyon, lokasyon, lokasyon - emlakın altın kuralı.",
    author: "Emlak Atasözü",
    category: "location",
  },
];

// Eğitici İpuçları
export interface Tip {
  text: string;
  icon: "lightbulb" | "ruler" | "calendar" | "building" | "alert" | "chart" | "map" | "home";
  category: "valuation" | "comparison" | "age" | "floor" | "warning" | "market" | "location" | "general";
}

export const educationalTips: Tip[] = [
  {
    text: "Bir evin gerçek değeri, benzer özelliklerdeki komşu evlerin fiyatlarıyla belirlenir.",
    icon: "lightbulb",
    category: "valuation",
  },
  {
    text: "Metrekare fiyatı, farklı büyüklükteki evleri karşılaştırmanın en iyi yoludur.",
    icon: "ruler",
    category: "comparison",
  },
  {
    text: "Binanın yaşı, bakım maliyetlerini doğrudan etkiler. 20 yaş üstü binalarda ek masraflar bekleyin.",
    icon: "calendar",
    category: "age",
  },
  {
    text: "Orta katlar genellikle en değerli katlardır - ne çok gürültü, ne çok merdiven.",
    icon: "building",
    category: "floor",
  },
  {
    text: "Piyasa değerinin %10'undan fazla düşük fiyatlar, gizli sorunların işareti olabilir.",
    icon: "alert",
    category: "warning",
  },
  {
    text: "Emlak piyasası mevsimseldir - ilkbahar ve sonbahar en aktif dönemlerdir.",
    icon: "chart",
    category: "market",
  },
  {
    text: "Metro, metrobüs ve toplu taşıma yakınlığı, ev değerini %10-20 artırabilir.",
    icon: "map",
    category: "location",
  },
  {
    text: "3+1 daireler, hem aileler hem de yatırımcılar için en likit seçenektir.",
    icon: "home",
    category: "general",
  },
  {
    text: "Cephe yönü önemlidir - güney ve batı cepheler daha değerlidir.",
    icon: "lightbulb",
    category: "valuation",
  },
  {
    text: "Aidatı kontrol edin - yüksek aidat, toplam maliyeti önemli ölçüde artırır.",
    icon: "alert",
    category: "warning",
  },
];

// Kullanıcı Testimonial'ları
export interface Testimonial {
  text: string;
  author: string;
  location: string;
  savings?: string;
  avatar: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    text: "Satın almayı düşündüğüm ev, piyasa değerinin %15 üzerindeymiş. Metrekare sayesinde pazarlık gücü kazandım.",
    author: "Ahmet Y.",
    location: "Kadıköy",
    savings: "180.000 ₺",
    avatar: "AY",
    rating: 5,
  },
  {
    text: "3 farklı evi analiz ettim, en uygun fırsatı yakaladım. Veriye dayalı karar vermek çok rahatlatıcı.",
    author: "Zeynep K.",
    location: "Beşiktaş",
    savings: "250.000 ₺",
    avatar: "ZK",
    rating: 5,
  },
  {
    text: "Emlakçının söylediği fiyat abartılıymış. Metrekare ile gerçek değeri öğrendim ve doğru fiyattan aldım.",
    author: "Mehmet S.",
    location: "Ataşehir",
    savings: "95.000 ₺",
    avatar: "MS",
    rating: 5,
  },
  {
    text: "İlk ev alımımda çok stresliyim. Bu uygulama sayesinde hangi fiyatın makul olduğunu anladım.",
    author: "Elif D.",
    location: "Üsküdar",
    avatar: "ED",
    rating: 5,
  },
  {
    text: "Yatırım amaçlı ev arıyordum. Fırsat analizi özelliği tam da ihtiyacım olan şeydi.",
    author: "Can B.",
    location: "Maltepe",
    savings: "320.000 ₺",
    avatar: "CB",
    rating: 5,
  },
  {
    text: "Karşılaştırma özelliği harika! 5 farklı daireyi yan yana koyup değerlendirdim.",
    author: "Selin T.",
    location: "Şişli",
    avatar: "ST",
    rating: 4,
  },
];

// Sonuç Sayfası Insights
export interface Insight {
  condition: "FIRSAT" | "NORMAL" | "PAHALI";
  texts: string[];
}

export const resultInsights: Insight[] = [
  {
    condition: "FIRSAT",
    texts: [
      "Bu fiyat bölge ortalamasının altında. Hızlı karar avantaj sağlayabilir.",
      "Benzer evler genellikle daha yüksek fiyatlarla satılıyor. İyi bir fırsat!",
      "Fiyat/değer oranı olumlu görünüyor. Detaylı inceleme yapmanızı öneririz.",
      "Bu bölgede bu fiyata rastlamak zor. Acele etmeden ama gecikmeden değerlendirin.",
    ],
  },
  {
    condition: "NORMAL",
    texts: [
      "Fiyat piyasa değerine uygun görünüyor. Makul bir seçenek.",
      "Ne pahalı ne ucuz - adil bir fiyat. Pazarlık payı sınırlı olabilir.",
      "Bölge ortalamasıyla uyumlu. Güvenle değerlendirebilirsiniz.",
      "Standart piyasa fiyatı. Ek özelliklere göre karar verebilirsiniz.",
    ],
  },
  {
    condition: "PAHALI",
    texts: [
      "Fiyat bölge ortalamasının üzerinde. Pazarlık yapmanızı öneririz.",
      "Benzer evler daha uygun fiyatlara bulunabilir. Alternatifleri araştırın.",
      "Yüksek fiyat, özel bir özellikten mi kaynaklanıyor kontrol edin.",
      "Acele etmeyin - bu bölgede daha iyi fırsatlar çıkabilir.",
    ],
  },
];

// Helper Fonksiyonlar

/**
 * Rastgele bir motivasyonel alıntı döndürür
 */
export function getRandomQuote(): Quote {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

/**
 * Belirli bir kategoriden rastgele alıntı döndürür
 */
export function getQuoteByCategory(category: Quote["category"]): Quote {
  const filtered = motivationalQuotes.filter((q) => q.category === category);
  return filtered.length > 0
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : getRandomQuote();
}

/**
 * Rastgele bir eğitici ipucu döndürür
 */
export function getRandomTip(): Tip {
  return educationalTips[Math.floor(Math.random() * educationalTips.length)];
}

/**
 * Belirli bir kategoriden rastgele ipucu döndürür
 */
export function getTipByCategory(category: Tip["category"]): Tip {
  const filtered = educationalTips.filter((t) => t.category === category);
  return filtered.length > 0
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : getRandomTip();
}

/**
 * Sonuç durumuna göre rastgele insight döndürür
 */
export function getInsightByCondition(condition: Insight["condition"]): string {
  const insight = resultInsights.find((i) => i.condition === condition);
  if (!insight) return "";
  return insight.texts[Math.floor(Math.random() * insight.texts.length)];
}

/**
 * Rastgele N adet testimonial döndürür
 */
export function getRandomTestimonials(count: number = 3): Testimonial[] {
  const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
