import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import axios from "axios";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as Speech from "expo-speech";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Printer,
  Volume2,
  DollarSign,
  ShoppingBag,
  Star,
  List,
  Calendar,
} from "lucide-react-native";
import { IPAddress } from "../../globals";
export default function ReportGenerator() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showPicker, setShowPicker] = useState(false); // State to control showing month/year picker
  const [count, setCount] = useState(0);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params || {};
  const email = username;

  useEffect(() => {
    // Cleanup function to stop speech when navigating away
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      Speech.stop(); // Stop speech when navigating away
    });

    // Clean up the listener when component is unmounted
    return unsubscribe;
  }, [navigation]);

  const generateReport = async () => {
    if (!month || !year) {
      Speech.speak("please select a date");
      Toast.show({
        type: "error",
        position: "top",
        text1: "Select a Date",
        text2:
          "Please select both month and year before generating the report.",
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }
    Toast.show({
      type: "success",
      position: "top",
      text1: "Generating Report",
      text2: `Report for the selected month and year.`,
      visibilityTime: 4000,
      autoHide: true,
    });
    Speech.speak("generating report");

    setErrorMessage("");
    setLoading(true);

    try {
      // Make sure to include the email in the URL
      const response = await axios.get(
        `http://${IPAddress}:5000/shoppinglist/shopping-lists/reports/${month}/${year}/${email}` // Include email in the URL
      );

      if (
        response.data &&
        response.data.report &&
        response.data.shoppingListCount !== undefined
      ) {
        const { report, shoppingListCount } = response.data;
        setReport(report);
        setCount(shoppingListCount);
        setSummary(generateSummary(report)); // Generate and set summary
      } else {
        setReport(null);
        setCount(0);
        setSummary(null);
        setErrorMessage("No report available for the selected month and year.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setErrorMessage(
        "An error occurred while generating the report. Please try again later."
      );
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
      totalPurchase: `${totalPurchase.toFixed(2)}`,
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
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Monthly Report Summary</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f7fa;
        }
        .report-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin-top: 20px;
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .header-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 10px;
            background-color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
        }
        .header-info p {
            margin: 0;
            font-size: 0.9em;
        }
        .header-info strong {
            color: "black";
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 20px;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #ecf0f1;
            color: "2c3e50";
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .cell, .total {
            text-align: center;
        }
        .total {
            font-weight: bold;
            background-color: #e9ecef;
        }
        .summary {
            margin-top: 30px;
            background-color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .summary h3 {
            color: #2c3e50;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        .summary p {
            margin: 8px 0;
            font-size: 0.95em;
        }
    </style>
</head>
<body>
    <div class="report-container">
        <h1>Monthly Report Summary</h1>
        <div class="header-info">
            <p><strong>Business Name:</strong> ShopX</p>
            <p><strong>Address:</strong> Kandy road, Matale</p>
            <p><strong>Report for Month:</strong> ${month}</p>
            <p><strong>Year:</strong> ${year}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Product Name</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(report)
                  .map(
                    ([productName, { quantity, totalPrice, unit }], index) => `
                    <tr>
                        <td class="cell">${index + 1}</td>
                        <td>${productName}</td>
                        <td class="cell">${unit}</td>
                        <td class="cell">${quantity}</td>
                        <td class="cell">${totalPrice.toFixed(2)}</td>
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
                    <td class="total">${Object.values(report)
                      .reduce((sum, item) => sum + item.totalPrice, 0)
                      .toFixed(2)}/-</td>
                </tr>
            </tbody>
        </table>

        <div class="summary">
            <h3>Summary Information</h3>
            <p><strong>Total Price(Rs):</strong> ${Object.values(report)
              .reduce((sum, item) => sum + item.totalPrice, 0)
              .toFixed(2)}</p>
            <p><strong>Total Items Added:</strong> ${Object.values(
              report
            ).reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p><strong>Most Bought Item:</strong> ${getMostBoughtItem(
              report
            )}</p>
            <p><strong>Total Shopping Lists Created:</strong> ${count}</p>
        </div>
    </div>
</body>
</html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const currentDate = new Date();
  const months = String(currentDate.getMonth() + 1).padStart(2, "0"); // Ensures 2 digits
  const years = currentDate.getFullYear();

  const formattedDate = `${months}-${years}`;
  console.log(formattedDate); // Output will be something like "10/2024"

  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Monthly Report</Text>

        {/* Button to open date picker (for month and year) */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowPicker(true)}
        >
          <Calendar color="#007AFF" size={24} />
          <Text style={styles.datePickerButtonText}>
            {month && year ? `${month}/${year}` : "Select Date"}
          </Text>
        </TouchableOpacity>

        {/* Month and Year Picker - Shown conditionally */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)} // Close modal if back is pressed
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Month and Year</Text>

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
              </Picker>

              {/* Confirm and Cancel Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.button}
          onPress={generateReport}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>
        {errorMessage && (
          <>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Image source={require("../assets/no.png")} style={styles.image} />
          </>
        )}
        {loading && (
          <Text style={styles.loadingText}>Generating report...</Text>
        )}

        {report && (
          <View style={styles.reportContainer}>
            <Text style={styles.reportTitle}>
              Report Summary ({formattedDate})
            </Text>
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
                      {totalPrice.toFixed(2)}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary Information</Text>
            <View style={styles.summaryItem}>
              <DollarSign color="#4CAF50" size={24} />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Total Price(Rs):</Text>
                <Text style={styles.summaryValue}>{summary.totalPurchase}</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <ShoppingBag color="#2196F3" size={24} />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Total Items Added:</Text>
                <Text style={styles.summaryValue}>{summary.totalItems}</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <Star color="#FFC107" size={24} />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Most Added Item:</Text>
                <Text style={styles.summaryValue}>
                  {summary.mostBoughtItem}
                </Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <List color="#9C27B0" size={24} />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Total Shopping Lists:</Text>
                <Text style={styles.summaryValue}>{count}</Text>
              </View>
            </View>
          </View>
        )}

        {report && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.actionButton1}
              onPress={speakReport}
            >
              <Volume2 color="#FFFFFF" size={24} />
              <Text style={styles.buttonText}>Speak Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={printReport}>
              <Printer color="#FFFFFF" size={24} />
              <Text style={styles.buttonText}>Print Report</Text>
            </TouchableOpacity>
          </View>
        )}
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

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    paddingLeft: 40,
    justifyContent: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },
  image: {
    width: 300,
    height: 300,
    marginLeft: 10,
    alignSelf: "center",
    marginBottom: 15,
    marginTop: 50,
  },
  picker: {
    height: 200,
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "49%",

    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
    width: "49%",
    alignItems: "center",
  },
  errorText: {
    marginTop: 25,
    color: "red",
    textAlign: "center",
    fontSize: 20,
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
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: 20,
  },
  summaryContainer: {
    backgroundColor: "#F5F7F5",
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButton1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datePickerButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
});
