#!/usr/bin/env python3
"""
Backend'deki processed_data.pkl dosyasından frontend için
ilçe ve mahalle listesini oluşturan script.

Kullanım:
  python3 scripts/sync-districts.py

Bu script frontend/lib/districts-data.ts dosyasını oluşturur.
"""

import pickle
import json
import os
from pathlib import Path

# Proje root dizini
ROOT_DIR = Path(__file__).parent.parent
DATA_FILE = ROOT_DIR / "processed_data.pkl"
OUTPUT_FILE = ROOT_DIR / "frontend" / "lib" / "districts-data.ts"


def load_districts_from_pickle():
    """Pickle dosyasından ilçe ve mahalle verilerini yükler."""
    with open(DATA_FILE, "rb") as f:
        df = pickle.load(f)

    districts_data = {}
    for _, row in df[["District", "Neighborhood"]].drop_duplicates().iterrows():
        district = row["District"]
        neighborhood = row["Neighborhood"]
        if district not in districts_data:
            districts_data[district] = []
        if neighborhood not in districts_data[district]:
            districts_data[district].append(neighborhood)

    # Alfabetik sırala
    for district in districts_data:
        districts_data[district] = sorted(districts_data[district])

    return dict(sorted(districts_data.items()))


def generate_typescript(districts_data: dict) -> str:
    """TypeScript dosya içeriğini oluşturur."""
    
    # District ID oluştur (küçük harf, Türkçe karaktersiz)
    def to_id(name: str) -> str:
        replacements = {
            "ı": "i", "İ": "i", "ğ": "g", "Ğ": "g",
            "ü": "u", "Ü": "u", "ş": "s", "Ş": "s",
            "ö": "o", "Ö": "o", "ç": "c", "Ç": "c"
        }
        result = name.lower()
        for tr, en in replacements.items():
            result = result.replace(tr, en)
        return result.replace(" ", "-")

    lines = [
        '/**',
        ' * İstanbul ilçe ve mahalle verileri',
        ' * Bu dosya otomatik olarak oluşturulmuştur.',
        ' * Değişiklik yapmak için scripts/sync-districts.py dosyasını kullanın.',
        f' * Son güncelleme: {len(districts_data)} ilçe, toplam mahalle sayısı hesaplanıyor...',
        ' */',
        '',
        'export interface District {',
        '  id: string;',
        '  name: string;',
        '  neighborhoods: string[];',
        '}',
        '',
        'export const ISTANBUL_DISTRICTS: District[] = ['
    ]

    total_neighborhoods = 0
    for district_name, neighborhoods in districts_data.items():
        total_neighborhoods += len(neighborhoods)
        district_id = to_id(district_name)
        neighborhoods_str = json.dumps(neighborhoods, ensure_ascii=False)
        lines.append(f'  {{')
        lines.append(f'    id: "{district_id}",')
        lines.append(f'    name: "{district_name}",')
        lines.append(f'    neighborhoods: {neighborhoods_str},')
        lines.append(f'  }},')

    lines.append('];')
    lines.append('')
    lines.append(f'// Toplam: {len(districts_data)} ilçe, {total_neighborhoods} mahalle')
    lines.append('')
    
    # Update the header comment with actual count
    lines[4] = f' * Son güncelleme: {len(districts_data)} ilçe, {total_neighborhoods} mahalle'

    return '\n'.join(lines)


def main():
    print("🔄 Backend verilerinden ilçe/mahalle listesi oluşturuluyor...")
    
    if not DATA_FILE.exists():
        print(f"❌ Veri dosyası bulunamadı: {DATA_FILE}")
        return 1

    districts_data = load_districts_from_pickle()
    print(f"✅ {len(districts_data)} ilçe bulundu")

    total_neighborhoods = sum(len(n) for n in districts_data.values())
    print(f"✅ {total_neighborhoods} mahalle bulundu")

    typescript_content = generate_typescript(districts_data)

    # Çıktı dizinini oluştur
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(typescript_content)

    print(f"✅ Dosya oluşturuldu: {OUTPUT_FILE}")
    return 0


if __name__ == "__main__":
    exit(main())
