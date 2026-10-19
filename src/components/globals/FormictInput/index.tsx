import Cross from "@assets/CreateProfile/cross.svg";
import Heart from "@assets/CreateProfile/heart-red.svg";
import Add from "@assets/CreateProfile/Vector.svg";
import Colors from "@src/constants/Colors";
import { hs, ms, vs } from "@utils/design/design";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FormikInputProps } from "./typ";

export const FormikInput = ({
  title,
  placeholder,
  onChangeText,
  onBlur,
  value,
  touched,
  errors,
  errorText,
  additonalText,
  required,
  multiline,
  mulipleFields,
  setValue=()=>{},
  name="name",
  editable=true,
}: FormikInputProps) => {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [multivariable, setMultivariable] = useState("");
  useEffect(() => {
    if (mulipleFields && value) {
      const vals = value
        .split(",")
        .map(v => v.trim())
        .filter(Boolean);

      setSelectedData(vals);
      
    } else {
      setSelectedData([]);
    }
  }, [value, mulipleFields]);
  const handleAdd = () => {
     const trimmedValue = multivariable.trim();
    if (!trimmedValue) return;
    if (selectedData.includes(trimmedValue)) return; 

    const updated = [...selectedData, multivariable.trim()];

    setSelectedData(updated);
    setMultivariable("");

    setValue(name, updated.join(",")); 
  };

  const handleRemove = (index: number) => {
    const updated = selectedData.filter((_, i) => i !== index);

    setSelectedData(updated);
    setValue(name, updated.join(",")); 
   
  };

  return (
    <View style={{ marginTop: vs(10) }}>
      <View className="flex-row" style={{ marginBottom: vs(10) }}>
        {title && <Text style={styles.title}>{title}</Text>}
        {required && (
          <Text
            style={{
              color: Colors.light.red,
              fontFamily: "PopinRegula",
            }}
          >
            *
          </Text>
        )}
        {additonalText && (
          <Text style={{ paddingLeft: hs(5),fontFamily: "PopinRegula", }}>{`(${additonalText})`}</Text>
        )}
      </View>
      <View className="flex-row gap-2">
        <View
          style={{
            borderRadius: ms(18),
            paddingVertical: vs(5),
            backgroundColor: Colors.light.LightGreen,
            paddingHorizontal: hs(5),
            width: mulipleFields ? "80%" : "100%",
          }}
        >
          <TextInput
            placeholder={placeholder}
            value={mulipleFields ? multivariable : value}
            onChangeText={mulipleFields ? setMultivariable : onChangeText}
            onBlur={onBlur}
            editable={editable}
            multiline={multiline}
            cursorColor={Colors.light.DarkGreen}
            placeholderTextColor={Colors.light.DarkGreen}
            style={[
              multiline ? styles.inputdes : styles.input,

              { color: Colors.light.DarkGreen },
            ]}
          />
        </View>
        {mulipleFields && (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.light.LightGreen,
              borderRadius: ms(8),
            }}
            className="justify-center px-4 "
            onPress={handleAdd}
          >
            <Add />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {mulipleFields && (
          <FlatList
            data={selectedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                style={[styles.card,{
                  padding: ms(8),
                  flexDirection: "row",
                  alignItems:'center',
                  justifyContent: "space-between",
                }]}
              >
                <View className="flex-row gap-3 items-center py-4">
                  <Heart />

                  <Text
                    style={{
                      color: Colors.light.DarkGreen,
                      fontSize: ms(15),
                      fontWeight: "500",
                      width:hs(250),
                      fontFamily: "PopinRegula",
                    }}
                  >
                    {item}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleRemove(index);
                  }}
                >
                  <Cross />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
      {touched && errors && (
        <Text style={{ color: Colors.light.red ,fontFamily: "PopinRegula",}}>{errorText}</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  title: { fontSize: ms(14), fontWeight: 700,fontFamily: "PopinRegula", },
inputdes: {
  minHeight: 100,
  maxHeight: 160,
  textAlignVertical: "top",
  paddingTop: 12,
  paddingHorizontal: 10,
  fontFamily: "PopinRegula",
},
input: {
  height: 48,
  backgroundColor: "transparent",
  fontFamily: "PopinRegula",
  paddingHorizontal: 10,
},
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
    },
});
