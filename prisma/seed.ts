import { PrismaClient, KalemTipi, KasaTipi, MusteriTipi, ServisAltDurumu, ServisDurumu, TahsilatKaynak, YakitTipi, VitesTipi } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash =
    process.env.ADMIN_PASSWORD_HASH ?? (await bcrypt.hash("123456", 10));

  await prisma.kullanici.upsert({
    where: { kullaniciAdi: process.env.ADMIN_USERNAME ?? "kivanc" },
    update: {
      sifreHash: passwordHash,
      adSoyad: "Kivanc Komurcu",
      aktif: true,
    },
    create: {
      kullaniciAdi: process.env.ADMIN_USERNAME ?? "kivanc",
      sifreHash: passwordHash,
      adSoyad: "Kivanc Komurcu",
      aktif: true,
    },
  });

  await prisma.firma.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      firmaAdi: "H&C Otomotiv",
      vergiNo: "1234567890",
      acikAdres: "Sasmaz Oto Sanayi Sitesi, Ankara",
      sehir: "Ankara",
      telefon: "+90 312 000 00 00",
      email: "info@hcotomotiv.com",
      website: "https://hcotomotiv.com",
      vergiDairesi: "Yenimahalle",
      iban: "TR00 0000 0000 0000 0000 0000 00",
      mersisNo: "0000000000000000",
      servisKabulNotu: "Arac kabul sirasinda tespit edilemeyen arizalar sonradan cikabilir.",
      servisTeslimNotu: "Arac tesliminde eksik veya hasar var ise ayni gun icinde bilgi verilmelidir.",
      hizmetKategorileri: JSON.stringify([
        "OTOMOBIL",
        "SUV",
        "KAMYONET",
        "MOTOSIKLET_ATV",
      ]),
      haricMarkalar: JSON.stringify(["Acura"]),
    },
  });

  const teknisyen = await prisma.teknisyen.upsert({
    where: { id: "seed-teknisyen-1" },
    update: {},
    create: {
      id: "seed-teknisyen-1",
      adSoyad: "Ugur Kaya",
      telefon: "+90 532 000 00 00",
      uzmanlik: "Mekanik",
    },
  });

  const kasa = await prisma.kasa.upsert({
    where: { id: "seed-kasa-1" },
    update: {},
    create: {
      id: "seed-kasa-1",
      ad: "Merkez Kasa",
      tip: KasaTipi.KASA,
      aciklama: "Varsayilan tahsilat hesabi",
    },
  });

  const kategori = await prisma.urunKategori.upsert({
    where: { ad: "Periyodik Bakim" },
    update: {},
    create: {
      ad: "Periyodik Bakim",
      aciklama: "Periyodik servis ve bakim kalemleri",
    },
  });

  const urun = await prisma.urunHizmet.upsert({
    where: { kod: "YAG-5W30" },
    update: {},
    create: {
      ad: "5W30 Motor Yagi",
      kod: "YAG-5W30",
      tip: KalemTipi.URUN,
      kategoriId: kategori.id,
      kdvOrani: 20,
      alisFiyatiKdvDahil: 950,
      satisFiyatiKdvDahil: 1250,
      kalanMiktar: 16,
      uyariMiktari: 4,
    },
  });

  const hizmet = await prisma.urunHizmet.upsert({
    where: { kod: "HIZ-PBAKIM" },
    update: {},
    create: {
      ad: "Periyodik Bakim Isciligi",
      kod: "HIZ-PBAKIM",
      tip: KalemTipi.HIZMET,
      kategoriId: kategori.id,
      kdvOrani: 20,
      alisFiyatiKdvDahil: 0,
      satisFiyatiKdvDahil: 1800,
      kalanMiktar: 999,
      uyariMiktari: 0,
    },
  });

  const musteri = await prisma.musteri.upsert({
    where: { musteriKodu: "MUS-0001" },
    update: {},
    create: {
      musteriKodu: "MUS-0001",
      tip: MusteriTipi.BIREYSEL,
      ad: "Ahmet",
      soyad: "Yuksel",
      telefon: "+90 555 555 55 55",
      email: "ahmet@example.com",
      sehir: "Ankara",
      etiket: "VIP",
      bakiye: 4200,
    },
  });

  const arac = await prisma.arac.upsert({
    where: { plaka: "06HC1234" },
    update: {},
    create: {
      plaka: "06HC1234",
      marka: "Volkswagen",
      seri: "Golf",
      model: "1.6 TDI",
      modelYili: 2018,
      renk: "Beyaz",
      motorNo: "CZC123456",
      motorGucu: "115 HP",
      motorHacmi: "1598 cc",
      yakitTipi: YakitTipi.DIZEL,
      vitesTipi: VitesTipi.OTOMATIK,
      muayeneBitis: new Date("2026-10-12T09:00:00.000Z"),
      musteriId: musteri.id,
    },
  });

  const servis = await prisma.servis.upsert({
    where: { servisNo: "2026040001" },
    update: {},
    create: {
      servisNo: "2026040001",
      durum: ServisDurumu.BAKIM_ONARIMDA,
      altDurum: ServisAltDurumu.MEKANIK,
      girisTarihi: new Date(),
      musteriId: musteri.id,
      aracId: arac.id,
      teknisyenId: teknisyen.id,
      servisDanismani: "Kivanc Komurcu",
      araciGetiren: "Ahmet Yuksel",
      acilisKm: 128540,
      acilisYakitOrani: 35,
      musteriTalepleri: "Periyodik bakim, on takim ses kontrolu",
      musteriyeNot: "Arac gun icinde hazir olabilir.",
      icNotlar: "Fren balata kontrolu tavsiye edilecek.",
      toplamKdvHaric: 2541.67,
      toplamKdv: 508.33,
      toplamKdvDahil: 3050,
    },
  });

  await prisma.servisKalemi.createMany({
    data: [
      {
        servisId: servis.id,
        urunHizmetId: urun.id,
        tip: KalemTipi.URUN,
        ad: urun.ad,
        kdvOrani: 20,
        birimFiyat: 1041.67,
        miktar: 1,
        indirimTutari: 0,
        satirToplami: 1250,
      },
      {
        servisId: servis.id,
        urunHizmetId: hizmet.id,
        tip: KalemTipi.HIZMET,
        ad: hizmet.ad,
        kdvOrani: 20,
        birimFiyat: 1500,
        miktar: 1,
        indirimTutari: 0,
        satirToplami: 1800,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.servisDurumGecmisi.create({
    data: {
      servisId: servis.id,
      eskiDurum: ServisDurumu.SERVISE_ALINIYOR,
      yeniDurum: ServisDurumu.BAKIM_ONARIMDA,
      altDurum: ServisAltDurumu.MEKANIK,
      aciklama: "Seed kaydi olusturuldu.",
      yapan: "Sistem",
    },
  });

  await prisma.tahsilat.create({
    data: {
      musteriId: musteri.id,
      servisId: servis.id,
      kasaId: kasa.id,
      kaynak: TahsilatKaynak.SERVIS,
      tarih: new Date(),
      aciklama: "06HC1234 servis avansi",
      tutar: 1500,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
