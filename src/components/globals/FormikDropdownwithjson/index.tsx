import Cross from "@assets/CreateProfile/cross.svg";
import Heart from "@assets/CreateProfile/heart-red.svg";
import Add from "@assets/CreateProfile/Vector.svg";
import Colors from "@src/constants/Colors";
import { hs, ms, vs } from "@utils/design/design";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FormikDropdownProps } from "./type";

export const FormikDropdownwithjson = ({
  title,
  value,
  options,
  placeholder,
  onSelect,
  touched,
  errors,
  errorText,
  required,
  additonalText,
  multipleFields,
  setValue = () => {},
  name = "name",
    openDirection="BOTTOM",
}: FormikDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);
useEffect(() => {
  setItems(options);
}, [options]);
  const [currentValue, setCurrentValue] = useState<string | number | null>(null);
  const [selectedData, setSelectedData] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (value === undefined || value === null ) return;

    if (multipleFields) {
      // For multi-select, handle string (comma-separated) or array
      const valuesArray =
        typeof value === "string"
          ? value.split(",").map(v => v.trim())
          : Array.isArray(value)
          ? value
          : [];

      setSelectedData(valuesArray);
    } else {
      setCurrentValue(value);
    }
  }, [value]);

  const handleAdd = () => {
    if (currentValue === null || currentValue === "") return;

    // Avoid duplicates
    if (selectedData.includes(currentValue)) return;

    const updated = [...selectedData, currentValue];
    setSelectedData(updated);

    // Send values to Formik (comma-separated string)
    setValue(name, updated.join(","));
    setCurrentValue(null);
    setOpen(false);
  };

  const handleRemove = (index: number) => {
    const updated = selectedData.filter((_, i) => i !== index);
    setSelectedData(updated);
    setValue(name, updated.join(","));
  };

  return (
    <View style={{ marginTop: vs(10), zIndex: open ? 1000 : 1 }}>
      {title && (
        <View style={{ flexDirection: "row", marginBottom: vs(10) }}>
          <Text style={styles.title}>{title}</Text>
          {required && <Text style={{ color: Colors.light.red,fontFamily: "PopinRegula", }}> *</Text>}
          {additonalText && (
            <Text style={{ paddingLeft: hs(5),fontFamily: "PopinRegula", }}>{`(${additonalText})`}</Text>
          )}
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
    
<TouchableOpacity
  activeOpacity={0.8}
  onPress={() => setOpen(true)}
  style={{
    height: vs(48),
    backgroundColor: Colors.light.LightGreen,
    borderRadius: ms(18),
    paddingHorizontal: hs(15),
    justifyContent: "center",
  }}
>
  <Text
    style={{
      fontFamily: "PopinRegula",
      color:
        currentValue === null || currentValue === ""
          ? "#8A8A8A"
          : "#000",
    }}
  >
    {currentValue !== null && currentValue !== ""
      ? items.find((item) => item.value === currentValue)?.label ??
        String(currentValue)
      : placeholder}
  </Text>
</TouchableOpacity>

<Modal
  visible={open}
  transparent
  animationType="fade"
  onRequestClose={() => setOpen(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "center",
      paddingHorizontal: hs(25),
    }}
  >
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: ms(15),
        maxHeight: "70%",
        paddingVertical: vs(10),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: hs(15),
          paddingVertical: vs(10),
        }}
      >
        <Text
          style={{
            fontSize: ms(16),
            fontWeight: "700",
            fontFamily: "PopinRegula",
          }}
        >
          {title || "Select option"}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpen(false)}
        >
          <Cross />
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#eee",
        }}
      />

      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          `${String(item.value)}-${index}`
        }
        showsVerticalScrollIndicator
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const selected = item.value === currentValue;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setCurrentValue(item.value);

                if (!multipleFields) {
                  setValue(name, item.value);
                  onSelect?.(item.value);
                }

                setOpen(false);
              }}
              style={{
                paddingVertical: vs(14),
                paddingHorizontal: hs(18),
                backgroundColor: selected
                  ? Colors.light.LightGreen
                  : "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text
                style={{
                  fontFamily: "PopinRegula",
                  fontSize: ms(14),
                  fontWeight: selected ? "700" : "400",
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  </View>
</Modal>
        </View>

        {multipleFields && (
          <TouchableOpacity
           activeOpacity={1}
            style={{
              marginLeft: hs(8),
              backgroundColor: Colors.light.LightGreen,
              borderRadius: ms(8),
              paddingHorizontal: hs(12),
              height: vs(45),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleAdd}
          >
            <Add />
          </TouchableOpacity>
        )}
      </View>

      {touched && errors && (
        <Text style={{ color: Colors.light.red, marginTop: vs(5),fontFamily: "PopinRegula", }}>
          {errorText}
        </Text>
      )}

      {multipleFields && (
        <FlatList
          data={selectedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const selectedLabel =
              options.find(opt => opt.value === item)?.label ||
              String(item);

            return (
              <View style={styles.card}>
                <View style={{ flexDirection: "row", gap: hs(8), alignItems: "center" }}>
                  <Heart />
                  <Text style={{fontFamily: "PopinRegula",}}>{selectedLabel}</Text>
                </View>
                <TouchableOpacity  activeOpacity={1}
                onPress={() => handleRemove(index)}>
                  <Cross />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: ms(14), fontWeight: "700",fontFamily: "PopinRegula", },
  card: {
    backgroundColor: "#fff",
    borderRadius: ms(10),
    marginVertical: vs(6),
    marginHorizontal: hs(3),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    padding: hs(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
