import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as Speech from "expo-speech";
import { Picker } from "@react-native-picker/picker"; // Importing Picker

export default function ReportGenerator({ navigation }) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [count, setCount] = useState(0);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState(null);

  const generateReport = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.get(
        `http://192.168.1.7:5000/shoppinglist/shopping-lists/reports/${month}/${year}`
      );

      // Check if the response has valid data
      if (response.data && response.data.report && response.data.shoppingListCount !== undefined) {
        const { report, shoppingListCount } = response.data;

        // Set the state for report and shopping list count
        setReport(report);
        setCount(shoppingListCount);
        setSummary(generateSummary(report)); // Generate and set summary
      } else {
        // Handle case when there's no data for the selected date
        setReport(null);
        setCount(0);
        setSummary(null);
        setErrorMessage("No report available for the selected month and year.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setErrorMessage("An error occurred while generating the report. Please try again later.");
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

  const generateSummary = (report) => {
    const totalPurchase = Object.values(report).reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const totalItems = Object.values(report).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const mostBoughtItem = getMostBoughtItem(report);

    return {
      totalPurchase: `$${totalPurchase.toFixed(2)}`,
      totalItems,
      mostBoughtItem,
      totalShoppingLists: count,
    };
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

  const x = new Date().toLocaleDateString();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Monthly Report</Text>

        {/* Month Picker */}
        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={(itemValue) => setMonth(itemValue)}
        >
          <Picker.Item label="Select Month" value="" />
          <Picker.Item label="January" value="1" />
          <Picker.Item label="February" value="2" />
          <Picker.Item label="March" value="3" />
          <Picker.Item label="April" value="4" />
          <Picker.Item label="May" value="5" />
          <Picker.Item label="June" value="6" />
          <Picker.Item label="July" value="7" />
          <Picker.Item label="August" value="8" />
          <Picker.Item label="September" value="9" />
          <Picker.Item label="October" value="10" />
          <Picker.Item label="November" value="11" />
          <Picker.Item label="December" value="12" />
        </Picker>

        {/* Year Picker */}
        <Picker
          selectedValue={year}
          style={styles.picker}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          <Picker.Item label="Select Year" value="" />
          <Picker.Item label="2022" value="2022" />
          <Picker.Item label="2023" value="2023" />
          <Picker.Item label="2024" value="2024" />
          <Picker.Item label="2025" value="2025" />
        </Picker>

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
            <Text style={styles.reportTitle}>Report Summary ({x})</Text>
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
                ([productName, { quantity, totalPrice, unit }], index) => (
                  <View key={productName} style={styles.tableRow}>
                    <Text style={styles.tableCell1}>{index + 1}</Text>
                    <View style={styles.verticalLine} />
                    <Text style={styles.tableCell}>{productName}</Text>
                    <View style={styles.verticalLine} />
                    <Text style={styles.tableCell2}>
                      {quantity} ({unit})
                    </Text>
                    <View style={styles.verticalLine} />
                    <Text style={styles.tableCell}>
                      ${totalPrice.toFixed(2)}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Total Purchase: {summary.totalPurchase}
            </Text>
            <Text style={styles.summaryText}>
              Total Items Bought: {summary.totalItems}
            </Text>
            <Text style={styles.summaryText}>
              Most Bought Item: {summary.mostBoughtItem}
            </Text>
            <Text style={styles.summaryText}>
              Total Shopping Lists: {summary.totalShoppingLists}
            </Text>
          </View>
        )}
        {report && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.speakButton} onPress={speakReport}>
            <Text style={styles.buttonText}>Speak Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.printButton} onPress={printReport}>
            <Text style={styles.buttonText}>Print Report</Text>
          </TouchableOpacity>
        </View>)}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  reportContainer: {
    marginTop: 20,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex: 2,
    padding: 8,
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableHeader1: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableHeader2: {
    flex: 2,
    padding: 8,
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 2,
    padding: 8,
    textAlign: "center",
  },
  tableCell1: {
    flex: 1,
    padding: 8,
    textAlign: "center",
  },
  tableCell2: {
    flex: 2,
    padding: 8,
    textAlign: "center",
  },
  verticalLine: {
    width: 1,
    backgroundColor: "#ccc",
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sam: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 1,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  speakButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  printButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
