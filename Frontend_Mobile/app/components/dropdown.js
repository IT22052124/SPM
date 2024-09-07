import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const DropdownComponent = ({ data, newItem, setNewItem }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const formattedItems = data.map((item) => ({
      label: item.name,
      value: item.name,
    }));
    setItems(formattedItems);
  }, [data]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        searchable={true}
        open={open}
        value={value}
        items={items}
        onChangeValue={(text) => setNewItem({ ...newItem, name: text })}
        setOpen={setOpen}
        setValue={(val) => setValue(val)}
        setItems={setItems}
        theme="LIGHT"
        multiple={false}
        mode="BADGE"
        placeholder="Select an item"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        searchContainerStyle={styles.searchContainer}
        searchTextInputStyle={styles.searchInput}
        listItemLabelStyle={styles.listItemLabel}
        arrowIconStyle={styles.arrowIcon}
        placeholderStyle={styles.placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 1,
  },
  dropdown: {
    backgroundColor: "#e0f2f1",
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    elevation: 8, // Adjust shadow for a subtle 3D effect
    justifyContent: 'center', // Center the text vertically
  },
  dropdownContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#007bff",
    height: 700,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    
    elevation: 8, // Enhance shadow to differentiate dropdown
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  searchContainer: {
    borderBottomColor: "#007bff",
    borderBottomWidth: 1,
  },
  searchInput: {
    borderColor: "#007bff",
    borderWidth: 0,
    borderRadius: 10,
    padding: 10,
  },
  listItemLabel: {
    fontSize: 16,
    color: "#007bff",
  },
  arrowIcon: {
    tintColor: "#007bff", // Custom color for the arrow icon
  },
  placeholder: {
    color: "#999999",
    fontSize: 16,
  },
});

export default DropdownComponent;
