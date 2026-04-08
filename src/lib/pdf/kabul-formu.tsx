import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    color: "#111111",
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1 solid #e5e7eb",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  heading: {
    fontSize: 12,
    marginBottom: 6,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  muted: {
    color: "#6b7280",
  },
});

export function KabulFormuPdf({
  company,
  service,
}: {
  company: {
    firmaAdi: string;
    acikAdres: string;
    telefon: string;
    email: string;
    servisKabulNotu: string;
  };
  service: {
    servisNo: string;
    customerName: string;
    customerPhone: string;
    vehiclePlate: string;
    vehicleModel: string;
    requests: string;
    total: string;
  };
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{company.firmaAdi}</Text>
          <Text>{company.acikAdres}</Text>
          <Text>{company.telefon} · {company.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Servis Kabul Formu</Text>
          <View style={styles.row}>
            <Text>Servis No: {service.servisNo}</Text>
            <Text>Plaka: {service.vehiclePlate}</Text>
          </View>
          <View style={styles.row}>
            <Text>Musteri: {service.customerName}</Text>
            <Text>Telefon: {service.customerPhone}</Text>
          </View>
          <Text>Arac: {service.vehicleModel}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Musteri Talepleri</Text>
          <Text>{service.requests}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Toplam</Text>
          <Text>{service.total}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Not</Text>
          <Text style={styles.muted}>{company.servisKabulNotu}</Text>
        </View>

        <View style={styles.row}>
          <Text>Servis Yetkili Imza: ____________________</Text>
          <Text>Musteri Imza: ____________________</Text>
        </View>
      </Page>
    </Document>
  );
}
