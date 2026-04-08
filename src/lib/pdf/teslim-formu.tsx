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
});

export function TeslimFormuPdf({
  company,
  service,
}: {
  company: {
    firmaAdi: string;
    servisTeslimNotu: string;
  };
  service: {
    servisNo: string;
    customerName: string;
    vehiclePlate: string;
    closingKm: string;
    closingFuel: string;
    total: string;
    note: string;
  };
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{company.firmaAdi}</Text>
          <Text>Servis Teslim Formu</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Servis No: {service.servisNo}</Text>
            <Text>Plaka: {service.vehiclePlate}</Text>
          </View>
          <Text>Musteri: {service.customerName}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Kapanis KM: {service.closingKm}</Text>
            <Text>Kapanis Yakit: %{service.closingFuel}</Text>
          </View>
          <Text>Toplam Tahakkuk: {service.total}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Teslim Notu</Text>
          <Text>{service.note}</Text>
          <Text>{company.servisTeslimNotu}</Text>
        </View>

        <View style={styles.row}>
          <Text>Musteri Araci Tam ve Eksiksiz Aldi: ____________________</Text>
        </View>
      </Page>
    </Document>
  );
}
