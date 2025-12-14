/**
 * İstanbul ilçe ve mahalle verileri
 * Bu dosya otomatik olarak oluşturulmuştur.
 * Değişiklik yapmak için scripts/sync-districts.py dosyasını kullanın.
 * Son güncelleme: 39 ilçe, 721 mahalle
 */

export interface District {
  id: string;
  name: string;
  neighborhoods: string[];
}

export const ISTANBUL_DISTRICTS: District[] = [
  {
    id: "adalar",
    name: "Adalar",
    neighborhoods: ["Burgazada Mh.", "Heybeliada Mah.", "Kınalıada Mh.", "Maden Mh.", "Nizam Mh."],
  },
  {
    id: "arnavutkoy",
    name: "Arnavutköy",
    neighborhoods: ["Anadolu Mah.", "Arnavutköy Merkez Mh.", "Atatürk Mh.", "Bolluca Mah.", "Boğazköy İstiklal Mh.", "Deliklikaya Mah.", "Dursunköy Mh.", "Hadımköy Mh.", "Haraççı Mh.", "Hastane Mah.", "Hicret Mah.", "Karlıbayır Mh.", "Mareşal Fevzi Çakmak Mh.", "Mavigöl Mh.", "Mehmet Akif Ersoy Mah.", "Mustafa Kemal Paşa Mh.", "Nenehatun Mah.", "Taşoluk Mh.", "Yunus Emre Mah.", "Ömerli Mh.", "İslambey Mh."],
  },
  {
    id: "atasehir",
    name: "Ataşehir",
    neighborhoods: ["Atatürk Mh.", "Aşıkysel Mh.", "Barbaros Mah.", "Esatpaşa Mh.", "Ferhatpaşa Mh.", "Fetih Mah.", "Kayışdağı Mh.", "Küçükbakkalköy Mh.", "Mevlana Mah.", "Mimar Sinan Mah.", "Mustafa Kemal Mah.", "Yeni Çamlıca Mh.", "Yenişehir Mh.", "Örnek Mh.", "İnönü Mh.", "İçerenköy Mh."],
  },
  {
    id: "avcilar",
    name: "Avcılar",
    neighborhoods: ["Ambarlı Mh.", "Cihangir Mah.", "Denizköşkler Mh.", "Firuzköy Mh.", "Gümüşpala Mh.", "Merkez Mah.", "Mustafa Kemal Paşa Mh.", "Tahtakale Mah.", "Yeşilkent Mh.", "Ünirsite Mh."],
  },
  {
    id: "bahcelievler",
    name: "Bahçelievler",
    neighborhoods: ["Bahçelievler Mh.", "Cumhuriyet Mah.", "Fevzi Çakmak Mh.", "Hürriyet Mh.", "Kocasinan Merkez Mah.", "Siyavuşpaşa Mh.", "Soğanlı Mh.", "Yenibosna Merkez Mah.", "Zafer Mah.", "Çobançeşme Mh.", "Şirinevler Mh."],
  },
  {
    id: "bakirkoy",
    name: "Bakırköy",
    neighborhoods: ["Ataköy 1. Kısım Mh.", "Ataköy 2-5-6. Kısım Mh.", "Ataköy 3-4-11. Kısım Mh.", "Ataköy 7-8-9-10. Kısım Mh.", "Basınköy Mh.", "Cevizlik Mah.", "Kartaltepe Mah.", "Osmaniye Mah.", "Sakızağacı Mh.", "Yenimahalle Mah.", "Yeşilköy Mh.", "Yeşilyurt Mh.", "Zeytinlik Mah.", "Zuhuratbaba Mah.", "Şenlikköy Mh."],
  },
  {
    id: "bayrampasa",
    name: "Bayrampaşa",
    neighborhoods: ["Altıntepsi Mh.", "Cevatpaşa Mh.", "Kartaltepe Mah.", "Kocatepe Mah.", "Muratpaşa Mh.", "Ortamahalle Mah.", "Terazidere Mah.", "Vatan Mah.", "Yenidoğan Mh.", "Yıldırım Mh.", "İsmet Paşa Mh."],
  },
  {
    id: "bagcilar",
    name: "Bağcılar",
    neighborhoods: ["100. Yıl Mh.", "15 Temmuz Mh.", "Barbaros Mah.", "Bağlar Mh.", "Demirkapı Mh.", "Fatih Mah.", "Fevzi Çakmak Mh.", "Göztepe Mh.", "Güneşli Mh.", "Hürriyet Mh.", "Kazım Karabekir Mh.", "Kemalpaşa Mh.", "Kirazlı Mh.", "Mahmutbey Mah.", "Merkez Mah.", "Sancaktepe Mah.", "Yavuz Selim Mah.", "Yenigün Mh.", "Yenimahalle Mah.", "Yıldıztepe Mh.", "Çınar Mh.", "İnönü Mh."],
  },
  {
    id: "basaksehir",
    name: "Başakşehir",
    neighborhoods: ["Altınşehir Mh.", "Bahçeşehir 1. Kısım Mh.", "Bahçeşehir 2. Kısım Mh.", "Başak Mh.", "Başakşehir Mh.", "Gürcintepe Mh.", "Kayabaşı Mh.", "Ziya Gökalp Mh.", "İkitelli OSB"],
  },
  {
    id: "beykoz",
    name: "Beykoz",
    neighborhoods: ["Acarlar Mah.", "Anadolu Hisarı Mh.", "Göztepe Mh.", "Kanlıca Mh.", "Kavacık Mh.", "Merkez Mah.", "Paşabahçe Mh.", "Riva Köyü", "Rüzgarlıbahçe Mh.", "Soğuksu Mh.", "Yalıköy Mh.", "Yavuz Selim Mah.", "Çubuklu Mh."],
  },
  {
    id: "beylikduzu",
    name: "Beylikdüzü",
    neighborhoods: ["Adnan Kahci Mah.", "Barış Mh.", "Beylikdüzü OSB", "Büyükşehir Mh.", "Cumhuriyet Mah.", "Dereağzı Mh.", "Gürpınar Mh.", "Kavaklı Mh.", "Marmara Mah.", "Sahil Mah.", "Yakuplu Mah."],
  },
  {
    id: "beyoglu",
    name: "Beyoğlu",
    neighborhoods: ["Arap Cami Mah.", "Asmalı Mescit Mh.", "Bereketzade Mah.", "Bostan Mah.", "Bülbül Mh.", "Cihangir Mah.", "Evliya Çelebi Mh.", "Firuzağa Mh.", "Gümüşsuyu Mh.", "Hacıahmet Mh.", "Hacımimi Mh.", "Halıcıoğlu Mh.", "Hüseyinağa Mh.", "Kadımehmet Efendi Mh.", "Kalyoncu Kulluğu Mh.", "Kamer Hatun Mah.", "Kaptanpaşa Mh.", "Katip Mustafa Çelebi Mh.", "Keçeci Piri Mh.", "Kocatepe Mah.", "Kulaksız Mh.", "Kuloğlu Mh.", "Küçük Piyale Mh.", "Kılıçali Paşa Mh.", "Müeyyetzade Mh.", "Piri Paşa Mh.", "Pürtelaş Hasan Efendi Mh.", "Sururi Mehmet Efendi Mah.", "Sütlüce Mh.", "Tomtom Mah.", "Yahya Kahya Mah.", "Yenişehir Mh.", "Çatma Mescit Mh.", "Çukur Mh.", "Ömer Avni Mh.", "Örnektepe Mh.", "İstiklal Mh.", "Şahkulu Mh.", "Şehit Muhtar Mh."],
  },
  {
    id: "besiktas",
    name: "Beşiktaş",
    neighborhoods: ["Abbasağa Mh.", "Akat Mah.", "Arnavutköy Mh.", "Balmumcu Mah.", "Bebek Mah.", "Cihannüma Mh.", "Dikilitaş Mh.", "Etiler Mah.", "Gayrettepe Mah.", "Konaklar Mah.", "Kuruçeşme Mh.", "Kültür Mh.", "Lent Mah.", "Levazım Mh.", "Mecidiye Mah.", "Muradiye Mah.", "Nisbetiye Mh.", "Ortaköy Mh.", "Sinanpaşa Mh.", "Türkali Mh.", "Ulus Mah.", "Vişnezade Mh.", "Yıldız Mh."],
  },
  {
    id: "buyukcekmece",
    name: "Büyükçekmece",
    neighborhoods: ["19 Mayıs Mh.", "Alkent 2000 Mah.", "Atatürk Mh.", "Bahçelievler Mh.", "Celaliye Mah.", "Cumhuriyet Mah.", "Dizdariye Mah.", "Ekinoba Mah.", "Fatih Mah.", "Güzelce Mh.", "Hürriyet Mh.", "Kamiloba Mah.", "Karaağaç Mh.", "Kumburgaz Merkez Mah.", "Mimar Sinan Merkez Mh.", "Mimaroba", "Murat Çeşme Mh.", "Pınartepe Mh.", "Sinanoba", "Türkoba Mh.", "Ulus Mah.", "Yenimahalle Mah.", "Çakmaklı Mh."],
  },
  {
    id: "esenler",
    name: "Esenler",
    neighborhoods: ["Birlik Mah.", "Davutpaşa Mh.", "Fatih Mah.", "Fevzi Çakmak Mh.", "Havaalanı Mh.", "Kazım Karabekir Mh.", "Kemer Mah.", "Menderes Mah.", "Mimar Sinan Mah.", "Namık Kemal Mh.", "Nine Hatun Mah.", "Oruçreis Mh.", "Tuna Mah.", "Turgut Reis Mah.", "Yavuz Selim Mah."],
  },
  {
    id: "esenyurt",
    name: "Esenyurt",
    neighborhoods: ["Akevler Mh.", "Akçaburgaz Mh.", "Akşemseddin Mh.", "Ardıçlı Mh.", "Atatürk Mh.", "Aşık ysel Mh.", "Balıkyolu Mh.", "Barbaros Hayrettin Paşa Mh.", "Battalgazi Mh.", "Bağlarçeşme Mh.", "Cumhuriyet Mah.", "Esenkent Mah.", "Fatih Mah.", "Gökevler Mh.", "Güzelyurt Mh.", "Hürriyet Mh.", "Koza Mh.", "Mehmet Akif Ersoy Mh.", "Mehterçeşme Mh.", "Mevlana Mh.", "Namık Kemal Mh.", "Necip Fazıl Kısakürek Mh.", "Orhan Gazi Mah.", "Osmangazi Mh.", "Piri Reis Mh.", "Pınar Mh.", "Saadetdere Mah.", "Selahaddin Eyyubi Mh.", "Sultaniye Mh.", "Süleymaniye Mh.", "Talatpaşa Mh.", "Turgut Özal Mh.", "Yenikent Mah.", "Yeşilkent Mh.", "Yunus Emre Mh.", "Zafer Mh.", "Çınar Mh.", "Örnek Mh.", "Üçevler Mh.", "İncirtepe Mh.", "İnönü Mh.", "İstiklal Mh.", "Şehitler Mh."],
  },
  {
    id: "eyupsultan",
    name: "Eyüpsultan",
    neighborhoods: ["Akşemsettin Mh.", "Alibeyköy Mh.", "Defterdar Mah.", "Düğmeciler Mh.", "Emniyettepe Mah.", "Esentepe Mah.", "Eyüp Merkez Mah.", "Göktürk Merkez Mh.", "Güzeltepe Mh.", "Karadolap Mah.", "Mimar Sinan Mh.", "Mithatpaşa Mh.", "Nişancı Mh.", "Rami Cuma Mah.", "Rami Yeni Mah.", "Sakarya Mah.", "Silahtarağa Mh.", "Yeşilpınar Mh.", "Çırçır Mh.", "İslambey Mh."],
  },
  {
    id: "fatih",
    name: "Fatih",
    neighborhoods: ["Aksaray Mah.", "Akşemsettin Mh.", "Ali Kuşçu Mh.", "Atikali Mah.", "Ayvansaray Mah.", "Balat Mah.", "Binbirdirek Mah.", "Cerrahpaşa Mh.", "Cibali Mah.", "Derviş Ali Mh.", "Emin Sinan Mah.", "Haseki Sultan Mah.", "Hırka-i Şerif Mh.", "Karagümrük Mh.", "Katip Kasım Mh.", "Kemal Paşa Mh.", "Koca Mustafapaşa Mh.", "Mevlanakapı Mh.", "Molla Gürani Mh.", "Muhsine Hatun Mah.", "Nişanca Mh.", "Seyyid Ömer Mh.", "Silivrikapı Mh.", "Sümbül Efendi Mh.", "Topkapı Mh.", "Yavuz Sultan Selim Mah.", "Yedikule Mah.", "Zeyrek Mah.", "İskenderpaşa Mh.", "Şehremini Mh."],
  },
  {
    id: "gaziosmanpasa",
    name: "Gaziosmanpaşa",
    neighborhoods: ["Barbaros Hayrettinpaşa Mh.", "Bağlarbaşı Mh.", "Fevzi Çakmak Mh.", "Hürriyet Mh.", "Karadeniz Mah.", "Karayolları Mh.", "Karlıtepe Mh.", "Kazım Karabekir Mh.", "Merkez Mah.", "Mevlana Mah.", "Pazariçi Mh.", "Sarıgöl Mh.", "Yeni Mahalle Mh.", "Yenidoğan Mh.", "Yıldıztabya Mh.", "Şemsipaşa Mh."],
  },
  {
    id: "gungoren",
    name: "Güngören",
    neighborhoods: ["Abdurrahman Nafiz Gürman Mh.", "Akıncılar Mh.", "Gençosman Mh.", "Gün Mh.", "Güneştepe Mh.", "Haznedar Mah.", "Mareşal Çakmak Mh.", "Mehmet Nesih Özmen Mh.", "Merkez Mah.", "Sanayi Mah.", "Tozkoparan Mah."],
  },
  {
    id: "kadikoy",
    name: "Kadıköy",
    neighborhoods: ["19 Mayıs Mh.", "Acıbadem Mh.", "Bostancı Mh.", "Caddebostan Mah.", "Caferağa Mh.", "Dumlupınar Mh.", "Erenköy Mh.", "Eğitim Mh.", "Fenerbahçe Mh.", "Feneryolu Mah.", "Fikirtepe Mah.", "Göztepe Mh.", "Hasanpaşa Mh.", "Kozyatağı Mh.", "Koşuyolu Mh.", "Merdinköy Mh.", "Osmanağa Mh.", "Rasimpaşa Mh.", "Sahrayı Cedit Mh.", "Suadiye Mah.", "Zühtüpaşa Mh."],
  },
  {
    id: "kartal",
    name: "Kartal",
    neighborhoods: ["Atalar Mah.", "Cevizli Mah.", "Cumhuriyet Mah.", "Esentepe Mah.", "Gümüşpınar Mh.", "Hürriyet Mh.", "Karlıktepe Mh.", "Kordonboyu Mah.", "Orhantepe Mah.", "Orta Mah.", "Petroliş Mh.", "Soğanlık Yeni Mh.", "Topselvi Mah.", "Uğur Mumcu Mh.", "Yakacık Yeni Mh.", "Yakacık Çarşı Mh.", "Yalı Mh.", "Yukarı Mh.", "Yunus Mah.", "Çavuşoğlu Mh."],
  },
  {
    id: "kagithane",
    name: "Kağıthane",
    neighborhoods: ["Emniyet Evleri Mh.", "Gültepe Mh.", "Gürsel Mh.", "Hamidiye Mah.", "Harmantepe Mah.", "Hürriyet Mh.", "Mehmet Akif Ersoy Mah.", "Merkez Mah.", "Nurtepe Mah.", "Ortabayır Mh.", "Seyrantepe Mah.", "Sultan Selim Mh.", "Talatpaşa Mh.", "Telsizler Mah.", "Yahya Kemal Mah.", "Yeşilce Mh.", "Çağlayan Mh.", "Çeliktepe Mh.", "Şirintepe Mh."],
  },
  {
    id: "kucukcekmece",
    name: "Küçükçekmece",
    neighborhoods: ["Atakent Mah.", "Atatürk Mh.", "Beşyol Mh.", "Cennet Mah.", "Cumhuriyet Mah.", "Fatih Mah.", "Fevzi Çakmak Mh.", "Gültepe Mh.", "Halkalı Merkez Mh.", "Kanarya Mah.", "Kartaltepe Mah.", "Kemalpaşa Mh.", "Mehmet Akif Mah.", "Sultan Murat Mah.", "Söğütlü Çeşme Mh.", "Tevfik Bey Mah.", "Yarımburgaz Mh.", "Yeni Mahalle Mah.", "Yeşilova Mh.", "İnönü Mh.", "İstasyon Mh."],
  },
  {
    id: "maltepe",
    name: "Maltepe",
    neighborhoods: ["Altayçeşme Mh.", "Altıntepe Mh.", "Aydınevler Mh.", "Bağlarbaşı Mh.", "Başıbüyük Mh.", "Cevizli Mah.", "Esenkent Mah.", "Feyzullah Mah.", "Fındıklı Mh.", "Girne Mah.", "Gülsuyu Mh.", "Küçükyalı Mh.", "Yalı Mh.", "Zümrütevler Mh.", "Çınar Mh.", "İdealtepe Mh."],
  },
  {
    id: "pendik",
    name: "Pendik",
    neighborhoods: ["Ahmet Yesevi Mah.", "Bahçelievler Mh.", "Batı Mh.", "Doğu Mh.", "Dumlupınar Mh.", "Esenler Mah.", "Esenyalı Mh.", "Fatih Mah.", "Fevzi Çakmak Mh.", "Güllü Bağlar Mh.", "Güzelyalı Mh.", "Harmandere Mah.", "Kavakpınar Mh.", "Kaynarca Mah.", "Kurtköy Mh.", "Orhangazi Mah.", "Orta Mah.", "Sapan Bağları Mh.", "Sülüntepe Mh.", "Yayalar Mah.", "Yeni Mahalle Mah.", "Yenişehir Mh.", "Yeşilbağlar Mh.", "libaba Mah.", "Çamlık Mh.", "Çamçeşme Mh.", "Çınardere Mh.", "Şeyhli Mh."],
  },
  {
    id: "sancaktepe",
    name: "Sancaktepe",
    neighborhoods: ["Abdurrahmangazi Mah.", "Akpınar Mh.", "Atatürk Mh.", "Emek Mah.", "Eyüp Sultan Mh.", "Fatih Mah.", "Hilal Mah.", "Kemal Türkler Mh.", "Meclis Mah.", "Mer Mah.", "Mevlana Mah.", "Osmangazi Mah.", "Safa Mah.", "Sarıgazi Mh.", "Yenidoğan Mh.", "Yunus Emre Mah.", "ysel Karani Mah.", "İnönü Mh."],
  },
  {
    id: "sariyer",
    name: "Sarıyer",
    neighborhoods: ["Ayazağa Mh.", "Bahçeköy Kemer Mh.", "Bahçeköy Merkez Mh.", "Bahçeköy Yeni Mh.", "Baltalimanı Mh.", "Büyükdere Mh.", "Cumhuriyet Mah.", "Darüşşafaka Mh.", "Demirciköy Mh.", "Emirgan Mah.", "Ferahevler Mah.", "Huzur Mah.", "Kireçburnu Mh.", "Kumköy Mh.", "Maden Mah.", "Maslak Mah.", "Merkez Mah.", "Poligon Mah.", "Pınar Mh.", "Reşitpaşa Mh.", "Rumeli Hisarı Mh.", "Rumeli Kavağı Mh.", "Tarabya Mah.", "Uskumruköy Mh.", "Yeniköy Mh.", "Zekeriyaköy Mh.", "Çamlıtepe Mh.", "İstinye Mh."],
  },
  {
    id: "silivri",
    name: "Silivri",
    neighborhoods: ["Alibey Mah.", "Alipaşa Mh.", "Balaban Mh.", "Cumhuriyet Mah.", "Fatih Silivri Mah.", "Fevzipaşa Mh.", "Gümüşyaka Mh.", "Mimar Sinan Mh.", "Piri Mehmet Paşa Mh.", "Sancaktepe Mh.", "Selimpaşa Mh.", "Semizkumlar Mah.", "Yeni Mah.", "İsmetpaşa Mh."],
  },
  {
    id: "sultanbeyli",
    name: "Sultanbeyli",
    neighborhoods: ["Abdurrahmangazi Mah.", "Adil Mah.", "Ahmet Yesevi Mah.", "Akşemsettin Mh.", "Battalgazi Mah.", "Fatih Mah.", "Hasanpaşa Mh.", "Mecidiye Mah.", "Mehmet Akif Mah.", "Mimar Sinan Mah.", "Necip Fazıl Mh.", "Orhangazi Mah.", "Turgut Reis Mah.", "Yavuz Selim Mah."],
  },
  {
    id: "sultangazi",
    name: "Sultangazi",
    neighborhoods: ["50. Yıl Mh.", "75. Yıl Mh.", "Cebeci Mah.", "Cumhuriyet Mah.", "Esentepe Mah.", "Eski Habipler Mah.", "Gazi Mah.", "Habibler Mh.", "Malkoçoğlu Mh.", "Sultançiftliği Mh.", "Uğur Mumcu Mh.", "Yunus Emre Mah.", "Zübeyde Hanım Mh.", "İsmetpaşa Mh."],
  },
  {
    id: "tuzla",
    name: "Tuzla",
    neighborhoods: ["Aydınlı Mh.", "Aydıntepe Mh.", "Cami Mah.", "Evliya Çelebi Mh.", "Fatih Mah.", "Mescit Mah.", "Mimar Sinan Mah.", "Orhanlı Mh.", "Orta Mah.", "Postane Mah.", "Tepeören Mh.", "Yayla Mah.", "İstasyon Mh.", "İçmeler Mh.", "Şifa Mh."],
  },
  {
    id: "zeytinburnu",
    name: "Zeytinburnu",
    neighborhoods: ["Beştelsiz Mh.", "Gökalp Mh.", "Kazlıçeşme Mh.", "Maltepe Mah.", "Merkezefendi Mah.", "Nuripaşa Mh.", "Seyitnizam Mah.", "Sümer Mh.", "Telsiz Mah.", "Yenidoğan Mh.", "Yeşiltepe Mh.", "liefendi Mah.", "Çırpıcı Mh."],
  },
  {
    id: "catalca",
    name: "Çatalca",
    neighborhoods: ["Akalan Köyü", "Ferhatpaşa Mh.", "Kaleiçi Mh.", "Muratbey Merkez Mah."],
  },
  {
    id: "cekmekoy",
    name: "Çekmeköy",
    neighborhoods: ["Alemdağ Mh.", "Aydınlar Mh.", "Cumhuriyet Mah.", "Ekşioğlu Mh.", "Güngören Mh.", "Hamidiye Mah.", "Kirazlıdere Mh.", "Mehmet Akif Ersoy Mah.", "Merkez Mah.", "Mimar Sinan Mah.", "Nişantepe Mh.", "Soğukpınar Mh.", "Sultançiftliği Mh.", "Taşdelen Mh.", "Çamlık Mh.", "Çatalmeşe Mh.", "Ömerli Mh."],
  },
  {
    id: "umraniye",
    name: "Ümraniye",
    neighborhoods: ["Adem Yavuz Mah.", "Altınşehir Mh.", "Armağanevler Mh.", "Atakent Mah.", "Atatürk Mh.", "Aşağı Dudullu Mh.", "Cemil Meriç Mh.", "Elmalıkent Mh.", "Esenevler Mah.", "Esenkent Mah.", "Esenşehir Mh.", "Fatih Sultan Mehmet Mah.", "Finanskent Mh.", "Huzur Mah.", "Ihlamurkuyu Mah.", "Madenler Mah.", "Mehmet Akif Mah.", "Namık Kemal Mh.", "Necip Fazıl Mh.", "Parseller Mah.", "Saray Mah.", "Site Mah.", "Tantavi Mah.", "Tatlısu Mh.", "Tepeüstü Mh.", "Yamanevler Mh.", "Yukarı Dudullu Mh.", "Çakmak Mh.", "Çamlık Mh.", "İnkılap Mh.", "İstiklal Mh.", "Şerifali Mh."],
  },
  {
    id: "uskudar",
    name: "Üsküdar",
    neighborhoods: ["Acıbadem Mh.", "Ahmediye Mah.", "Altunizade Mah.", "Aziz Mahmut Hüdayi Mh.", "Bahçelievler Mh.", "Barbaros Mah.", "Beylerbeyi Mah.", "Bulgurlu Mah.", "Burhaniye Mah.", "Cumhuriyet Mah.", "Ferah Mah.", "Güzeltepe Mh.", "Kandilli Mah.", "Kuzguncuk Mah.", "Küplüce Mh.", "Küçük Çamlıca Mh.", "Küçüksu Mh.", "Kısıklı Mh.", "Mehmet Akif Ersoy Mah.", "Mimar Sinan Mh.", "Murat Reis Mah.", "Salacak Mah.", "Selami Ali Mah.", "Selimiye Mah.", "Sultantepe Mah.", "Valide-i Atik Mh.", "Zeynep Kamil Mah.", "Çengelköy Mh.", "Ünalan Mh.", "İcadiye Mh."],
  },
  {
    id: "sile",
    name: "Şile",
    neighborhoods: ["Ahmetli Köyü", "Ağva Merkez Mh.", "Balibey Mah.", "Hacı Kasım Mh.", "Kurna Köyü", "Meşrutiyet Mh.", "Oruçoğlu Mh.", "Çavuş Mh."],
  },
  {
    id: "sisli",
    name: "Şişli",
    neighborhoods: ["19 Mayıs Mh.", "Bozkurt Mah.", "Cumhuriyet Mah.", "Duatepe Mah.", "Ergenekon Mah.", "Esentepe Mah.", "Eskişehir Mh.", "Feriköy Mh.", "Fulya Mah.", "Gülbahar Mh.", "Halaskargazi Mah.", "Halide Edip AdıAvailable Mh.", "Halil Rıfat Paşa Mh.", "Harbiye Mah.", "Kaptan Paşa Mh.", "Kuştepe Mh.", "Mahmut Şevket Paşa Mh.", "Mecidiyeköy Mh.", "Merkez Mah.", "Meşrutiyet Mh.", "Paşa Mh.", "Teşvikiye Mh.", "Yayla Mah.", "İnönü Mh.", "İzzet Paşa Mh."],
  },
];

// Toplam: 39 ilçe, 721 mahalle
