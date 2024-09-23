import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as Speech from "expo-speech";

export default function ReportGenerator({ navigation }) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const generateReport = async () => {
    setErrorMessage("");
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://172.20.10.3:5000/shoppinglist/shopping-lists/reports/${month}/${year}`
      );
      setReport(response.data);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };
  const getMostBoughtItem = (report) => {
  const mostBought = Object.entries(report).reduce((prev, curr) => {
    return curr[1].quantity > prev[1].quantity ? curr : prev;
  });
  return mostBought[0];
};


  const validateInputs = () => {
    if (month < 1 || month > 12) {
      setErrorMessage("Please enter a valid month (1-12).");
      return false;
    }
    if (!year || year.length !== 4) {
      setErrorMessage("Please enter a valid year (e.g., 2024).");
      return false;
    }
    return true;
  };

  const speakReport = () => {
    if (report) {
      const speechString = `Report for month ${month}, year ${year}: ` +
        Object.entries(report).map(([key, { quantity, totalPrice }]) =>
          `${key}: ${quantity}, Total Price: $${totalPrice.toFixed(2)}`
        ).join(', ');
      Speech.speak(speechString);
    }
  };

  const printReport = async () => {
    const totalPrice = Object.values(report).reduce((sum, item) => sum + item.totalPrice, 0);
    const html = `
      <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { font-family: Arial, sans-serif; }
      h1 { text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th{ border: 1px solid #ddd; padding: 8px; text-align: center; }
      td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      .total { font-weight: bold; }
      .summary { margin-top: 20px; font-weight: bold; }
      .summary p { margin: 0; padding: 5px 0; }
    </style>
  </head>
  <body>
    <h1>Monthly Report Summary</h1>
    <p>Buisness Name : ShopX</p>
    <p>Address : Kandy road, Matale</p>
    <p >Date: ${new Date().toLocaleDateString()}</p>
    <p>Report for Month: ${month}, Year: ${year}</p>

    <table>
      <tr>
        <th>No.</th>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Total Price</th>
      </tr>
      ${Object.entries(report).map(([productName, { quantity, totalPrice }], index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${productName}</td>
          <td>${quantity}</td>
          <td>$${totalPrice.toFixed(2)}</td>
        </tr>
      `).join('')}
      <tr>
        <td colspan="2" class="total">Total</td>
        <td class="total">${Object.values(report).reduce((sum, item) => sum + item.quantity, 0)}</td>
        <td class="total">$${Object.values(report).reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</td>
      </tr>
    </table>

    <div class="summary">
      <p>Total Number of Items: ${Object.values(report).reduce((sum, item) => sum + item.quantity, 0)}</p>
      <p>Total Purchase: $${Object.values(report).reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</p>
      <p>Most Bought Item: ${getMostBoughtItem(report)}</p>
      <p>Total Shopping Lists Created: ${Object.keys(report).length}</p>
    </div>
  </body>
</html>

    `;

    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Monthly Report</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Month (1-12)"
          keyboardType="numeric"
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Year (e.g., 2024)"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={generateReport}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>

        {loading && <Text style={styles.loadingText}>Generating report...</Text>}

        {report && (
          <View style={styles.reportContainer}>
            <Text style={styles.reportTitle}>Report Summary</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
              <Text style={styles.tableHeader1}>No</Text>
              <View style={styles.verticalLine} />
                <Text style={styles.tableHeader}>Product</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.tableHeader2}>Qty</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.tableHeader}>Price</Text>
              </View>
              {Object.entries(report).map(([productName, { quantity, totalPrice }],index) => (
                <View key={productName} style={styles.tableRow}>
                <Text style={styles.tableCell1}>{index + 1}</Text>
                  <View style={styles.verticalLine} />
                  <Text style={styles.tableCell}>{productName}</Text>
                  <View style={styles.verticalLine} />
                  <Text style={styles.tableCell2}>{quantity}</Text>
                  <View style={styles.verticalLine} />
                  <Text style={styles.tableCell}>${totalPrice.toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Total</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.tableCell}>-</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.tableCell}>${Object.values(report).reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {report && (
        <TouchableOpacity style={styles.speakButton} onPress={speakReport}>
          <Text style={styles.buttonText}>Read Report</Text>
        </TouchableOpacity>
      )}

      {report && (
        <TouchableOpacity style={styles.printButton} onPress={printReport}>
          <Text style={styles.buttonText}>Print Report as PDF</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
  },
  reportContainer: {
    backgroundColor: "#f9f9f9",
    padding: 0,
    borderRadius: 8,
    marginTop: 20,
    width:"100%"
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeader: {
    padding:1,
    marginBottom:6,
    fontWeight: "bold",
    fontSize: 16,
    color: "#007bff",
    flex: 1,
    textAlign: "center",
  },
  tableHeader1: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#007bff",
    flex: 0.4,
    textAlign: "center",
    width:"80%"
  },
  tableHeader2: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#007bff",
    flex: 0.6,
    textAlign: "center",
    width:"80%"
  },
  tableCell: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  tableCell1: {
    fontSize: 16,
    color: "#333",
    flex: 0.4,
    textAlign: "center",
  },
  tableCell2: {
    fontSize: 16,
    color: "#333",
    flex: 0.6,
    textAlign: "center",
  },
  verticalLine: {
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  speakButton: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: "#28a745",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  printButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#17a2b8",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
