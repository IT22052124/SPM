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
  const [count, setCount] = useState(0);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const generateReport = async () => {
    setErrorMessage("");
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.7:5000/shoppinglist/shopping-lists/reports/${month}/${year}`
      );
      const { report, shoppingListCount } = response.data;

      // Set the state for report and shopping list count
      setReport(report); // Set the report data
      setCount(shoppingListCount);
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
      const speechString =
        `Report for month ${month}, year ${year}: ` +
        Object.entries(report)
          .map(
            ([key, { quantity, totalPrice }]) =>
              `${key}: ${quantity}, Total Price: $${totalPrice.toFixed(2)}`
          )
          .join(", ");
      Speech.speak(speechString);
    }
  };

  const printReport = async () => {
    const totalPrice = Object.values(report).reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
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
      .cell { border: 1px solid #ddd; padding: 8px; text-align: center; }
      th { background-color: #f2f2f2; }
      .total { font-weight: bold;text-align: center }
      .summary { margin-top: 20px; font-weight: bold; }
      .summary p { margin: 0; padding: 5px 0; }
    </style>
  </head>
  <body>
    <h1>Monthly Report Summary</h1>
    <b>Buisness Name :</b> ShopX<br>
   <b> Address :</b> Kandy road, Matale
   <br><b>Report for Month:</b> ${month}, Year: ${year}
    <br><b>Date:</b> ${new Date().toLocaleDateString()}
    <br>

    <table>
      <tr>
        <th>No.</th>
        <th>Product Name</th>
        <th>Unit</th>
        <th>Quantity</th>
        <th>Total Price</th>
      </tr>
      ${Object.entries(report)
        .map(
          ([productName, { quantity, totalPrice, unit }], index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${productName}</td>
          <td >${unit}</td>
          <td class="cell">${quantity}</td>
          <td class="cell">$${totalPrice.toFixed(2)}</td>
        </tr>
      `
        )
        .join("")}
      <tr>
        <td colspan="3" class="total">Total</td>
        <td class="total">${Object.values(report).reduce(
          (sum, item) => sum + item.quantity,
          0
        )}</td>
        <td class="total">$${Object.values(report)
          .reduce((sum, item) => sum + item.totalPrice, 0)
          .toFixed(2)}</td>
      </tr>
    </table>

    <div class="summary">
    <h3>Summary Information</h3>
    Total Purchase: $${Object.values(report)
      .reduce((sum, item) => sum + item.totalPrice, 0)
      .toFixed(2)}
      <br>Total Number of Items: ${Object.values(report).reduce(
        (sum, item) => sum + item.quantity,
        0
      )}
      
      <br>Most Bought Item: ${getMostBoughtItem(report)}
      <br>Total Shopping Lists Created: ${count}</p>
    </div>
  </body>
</html>

    `;

    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
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
              {Object.entries(report).map(
                ([productName, { quantity, totalPrice }], index) => (
                  <View key={productName} style={styles.tableRow}>
                    <Text style={styles.tableCell1}>{index + 1}</Text>
                    <View style={styles.verticalLine} />
                    <Text style={styles.tableCell}>{productName}</Text>
                    <View style={styles.verticalLine} />
                    <Text style={styles.tableCell2}>{quantity}</Text>
                    <View style={styles.verticalLine} />
                    <Text style={styles.tableCell}>
                      ${totalPrice.toFixed(2)}
                    </Text>
                  </View>
                )
              )}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Total</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.tableCell}>-</Text>
                <View style={styles.verticalLine} />
                <Text style={styles.tableCell}>
                  $
                  {Object.values(report)
                    .reduce((sum, item) => sum + item.totalPrice, 0)
                    .toFixed(2)}
                </Text>
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
    backgroundColor: "#fff",
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  reportContainer: {
    marginTop: 20,
    width: "100%",
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeader: {
    flex: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableHeader1: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableHeader2: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 2,
    textAlign: "center",
  },
  tableCell1: {
    flex: 1,
    textAlign: "center",
  },
  tableCell2: {
    flex: 1,
    textAlign: "center",
  },
  verticalLine: {
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  speakButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  printButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loadingText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
