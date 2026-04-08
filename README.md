# H&C OtoServis

Tek kullanicili, Turkce, koyu temali ve responsive oto servis yonetim sistemi.

## Teknoloji

- Next.js 15 + App Router + TypeScript
- Tailwind CSS v4
- Prisma + Supabase Postgres
- React PDF, Recharts, SheetJS
- Tek kullanicili credentials tabanli oturum

## Kurulum

```bash
npm install
npm run prisma:generate
npm run build
npm run dev
```

Repo artik `.env` ile gelir. Ilk calistirmadan once sadece su iki alanda gercek database sifresini girin:

- `DATABASE_URL` icindeki `[YOUR-PASSWORD]`
- `DIRECT_URL` icindeki `[YOUR-PASSWORD]`

Kullanilan env alanlari:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `NEXT_PUBLIC_FIRMA_ADI`
- `NEXT_PUBLIC_TEMA`

## Prisma

Schema `prisma/schema.prisma` icindedir. Gercek Supabase projesi baglandiginda:

```bash
npx prisma migrate dev --name init
npm run seed
```

Production veya Vercel sonrasi:

```bash
npx prisma migrate deploy
```

## Vercel

Vercel entegrasyonu repo seviyesinde hazirlandi:

- `vercel.json` eklendi
- `postinstall` ile otomatik `prisma generate` calisir
- `build` komutu `prisma generate && next build`

Vercel Dashboard > Project > Settings > Environment Variables alanina su anahtarlari ekleyin:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `NEXT_PUBLIC_FIRMA_ADI`
- `NEXT_PUBLIC_TEMA`

## Moduller

- Ana Sayfa dashboard
- Klasik Servis Kabul
- Hizli Kabul
- Servis detay, kabul formu, teslim formu, durum akisi
- Musteri ve arac kartlari
- Urun/Hizmet stok kartlari, satislar, raporlar
- Tahsilat, kasa-banka ve masraf ekranlari
- Firma, notlar, marka ve teknisyen ayarlari
- PDF endpointleri ve Excel export
- WhatsApp deeplink, klavye kisayollari ve global arama

## Upload ve PDF

- `POST /api/upload`: Supabase Storage'a optimize edilmis `webp` gorsel yukler
- `GET /api/pdf/kabul/:id`: kabul PDF'i
- `GET /api/pdf/teslim/:id`: teslim PDF'i
- `GET /api/export/:resource`: xlsx export

## Not

Bu repository Supabase ortam degiskenleri olmadan demo veri ile arayuzu gosterecek sekilde hazirlandi. Gercek CRUD ve migration akislarini aktif etmek icin Supabase baglantisi tanimlanmalidir.
