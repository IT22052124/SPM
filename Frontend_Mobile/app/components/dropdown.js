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
    <View>
      <DropDownPicker
        searchable={true}
        open={open}
        value={value}
        items={items}
        onChangeValue={(text) => setNewItem({ ...newItem, name: text })}
        setOpen={setOpen}
        setValue={(val) => {
          setValue(val);
        }}
        setItems={setItems}
        theme="LIGHT"
        multiple={false}
        mode="BADGE"
        placeholder="Select an item"
      />
    </View>
  );
};

export default DropdownComponent;
