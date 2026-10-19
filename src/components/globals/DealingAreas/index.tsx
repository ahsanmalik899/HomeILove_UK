import {
  useGetAddressSuggestionsQuery,
  useGetCityesSuggestionsQuery,
  useLazyGetPlaceDetailsQuery,
} from "@/store/api/user/Google";
import Cross from "@assets/CreateProfile/cross.svg";
import Heart from "@assets/CreateProfile/heart-red.svg";
import Add from "@assets/CreateProfile/Vector.svg";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@src/constants/Colors";
import { renderToastError } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AddressInputProps } from "./type";

export const DealingAreas = ({
  title,
  zip,
  city,
  value,
  onSelect,
  touched,
  errors,
  errorText,
  required,
  additonalText,
  state,
  placeholder,
  setValue = () => {},
  name = "name",
  cityOnly=false,
}: AddressInputProps) => {
  const [currentValue, setCurrentValue] = useState<string>(
    value?.toString() || ""
  );
  const [currentCity, setCurrentCity] = useState<string>("");
  const [currentlat, setCurrentlat] = useState<number | null>(null);
  const [currentlong, setCurrentlong] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedlat, setSelectedlat] = useState<number[]>([]);
  const [selectedlog, setSelectedlong] = useState<number[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  useEffect(() => {
    if (!value) {
      setSelectedData([]);
      setCurrentValue("");
      return;
    }

    // ✅ Nationwide should NOT go into array
    if (value === "Nationwide") {
      setSelectedData([]); // ✅ empty array
      setCurrentValue("Nationwide");
      return;
    }

    // Normal CSV values
    const addresses = value.split(",").map((v) => v.trim());
    setSelectedData(addresses);
    setCurrentValue("");

    if (city) {
      setSelectedCity(city.split(","));
    }

    if ((state as any)?.latitude) {
      setSelectedlat(
        String((state as any).latitude)
          .split(",")
          .map(Number)
      );
    }

    if ((state as any)?.longitude) {
      setSelectedlong(
        String((state as any).longitude)
          .split(",")
          .map(Number)
      );
    }
  }, [value]);

  const normalize = (str: string) =>
    str.replace(/,/g, "").replace(/\s+/g, " ").trim();
  const [getPlaceDetails] = useLazyGetPlaceDetailsQuery();
const cityQuery = useGetCityesSuggestionsQuery(
  { input: currentValue },
  {
    skip: !cityOnly || currentValue.length < 3,
  }
);

const addressQuery = useGetAddressSuggestionsQuery(
  { input: currentValue },
  {
    skip: cityOnly || currentValue.length < 3,
  }
);

const googleData = cityOnly ? cityQuery.data : addressQuery.data;
const isFetching = cityOnly
  ? cityQuery.isFetching
  : addressQuery.isFetching;

  const handleSelectSuggestion = async (address: string, id: string) => {
    setCurrentValue(address.replace(/,/g, ""));
    setShowSuggestions(false);

    try {
      const result = await getPlaceDetails({ placeId: id }).unwrap();
      const components = result?.result?.address_components || [];

      const findComponent = (type: string) =>
        components.find((c: any) => c.types.includes(type));

      const cityName =
        findComponent("locality")?.long_name ||
        findComponent("administrative_area_level_2")?.long_name ||
        "";

      const latitude = result?.result?.geometry?.location?.lat ?? null;
      const longitude = result?.result?.geometry?.location?.lng ?? null;

      setCurrentCity(cityName);
      setCurrentlat(latitude);
      setCurrentlong(longitude);
    } catch (err: any) {
      renderToastError(err?.message || "Failed to fetch place details");
    }
  };

  const handleAdd = () => {
    if (!currentValue) return;
    const isValid = googleData?.predictions.some(
      (p) => normalize(p.description) === normalize(currentValue)
    );

    if (!isValid) return;
    if (selectedData.includes(currentValue)) return;

    const updatedData = [...selectedData, currentValue];
    const updatedCity = [...selectedCity, currentCity];
    const updatedLat = [...selectedlat, currentlat ?? 0];
    const updatedLong = [...selectedlog, currentlong ?? 0];

    setSelectedData(updatedData);
    setSelectedCity(updatedCity);
    setSelectedlat(updatedLat);
    setSelectedlong(updatedLong);

    // Update Formik values
    setValue(name, updatedData.join(","));
    setValue(city, updatedCity.join(","));
    setValue("latitude", updatedLat.join(","));
    setValue("longitude", updatedLong.join(","));

    // Reset current input
    setCurrentValue("");
    setCurrentCity("");
    setCurrentlat(null);
    setCurrentlong(null);
  };

  const handleRemove = (index: number) => {
    const updatedData = selectedData.filter((_, i) => i !== index);
    const updatedCity = selectedCity.filter((_, i) => i !== index);
    const updatedLat = selectedlat.filter((_, i) => i !== index);
    const updatedLong = selectedlog.filter((_, i) => i !== index);

    setSelectedData(updatedData);
    setSelectedCity(updatedCity);
    setSelectedlat(updatedLat);
    setSelectedlong(updatedLong);

    // Update Formik values
    setValue(name, updatedData.join(","));
    setValue(city, updatedCity.join(","));
    setValue("latitude", updatedLat.join(","));
    setValue("longitude", updatedLong.join(","));
  };

  const toggleNationwide = () => {
    if (value === "Nationwide") {
      setCurrentValue("");
      setValue(name, "");
      setCurrentCity("");
      setCurrentlat(null);
      setCurrentlong(null);
    } else {
      setCurrentValue("Nationwide");
      setValue(name, "Nationwide");
      setValue(city, "");
      setValue("latitude", "");
      setValue("longitude", "");
    }
  };

  return (
    <View style={{ marginTop: vs(10), zIndex: 1000 }}>
      {title && (
        <View style={{ flexDirection: "row", marginBottom: vs(10),fontFamily: "PopinRegula", }}>
          <Text style={styles.title}>{title}</Text>
          {required && <Text style={{ color: Colors.light.red,fontFamily: "PopinRegula", }}> *</Text>}
          {additonalText && (
            <Text style={{ paddingLeft: hs(5),fontFamily: "PopinRegula", }}>({additonalText})</Text>
          )}
        </View>
      )}

      {/* Nationwide Toggle */}
      <View className="flex-row items-center gap-1 ">
        <TouchableOpacity onPress={toggleNationwide}>
          <MaterialIcons
            size={25}
            color={Colors.light.DarkGreen}
            name={
              value === "Nationwide" ? "check-box" : "check-box-outline-blank"
            }
          />
        </TouchableOpacity>
        <Text style={{ marginLeft: hs(5),fontFamily: "PopinRegula", }}>Nationwide</Text>
      </View>

      {/* Input + Add Button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: vs(10),
        }}
      >
        <TextInput
          value={currentValue}
          onChangeText={(val) => {
            setCurrentValue(val);
            setShowSuggestions(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 1000)}
          placeholder={placeholder}
          editable={value !== "Nationwide"}
          style={{
            flex: 1,
            backgroundColor: Colors.light.LightGreen,
            borderRadius: ms(18),
            paddingHorizontal: hs(12),
            height: 45,
          }}
        />
        <TouchableOpacity
          style={{
            marginLeft: hs(8),
            backgroundColor: Colors.light.LightGreen,
            borderRadius: ms(8),
            paddingHorizontal: hs(12),
            height: 45,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleAdd}
        >
          <Add />
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: ms(12),
          marginTop: vs(5),
          maxHeight: vs(150),
          elevation: 5,
        }}
      >
        {isFetching && (
          <View
            style={{
              padding: vs(10),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="small" color={Colors.light.DarkGreen} />
            <Text style={{ marginTop: vs(5),fontFamily: "PopinRegula", }}>Loading...</Text>
          </View>
        )}

        {showSuggestions && isFocused && (
          <FlatList
            data={googleData?.predictions}
            nestedScrollEnabled
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  handleSelectSuggestion(item.description, item.place_id)
                }
                style={{
                  padding: vs(10),
                  borderBottomWidth: 0.5,
                  borderColor: Colors.light.lightGray,
                }}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {!googleData?.predictions?.length && showSuggestions && isFocused && (
          <View
            style={{
              padding: vs(10),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: Colors.light.DarkGreen,fontFamily: "PopinRegula", }}>
              No addresses found
            </Text>
          </View>
        )}
      </View>

      {/* Selected Addresses */}
      <FlatList
        data={selectedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              {
                padding: ms(8),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <View className="flex-row gap-3 items-center">
              <Heart />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: Colors.light.DarkGreen,
                  width: hs(250),
                  fontSize: ms(15),
                  fontWeight: "500",
                  fontFamily: "PopinRegula",
                }}
              >
                {item}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(index)}>
              <Cross />
            </TouchableOpacity>
          </View>
        )}
      />

      {touched && errors && (
        <Text style={{ color: Colors.light.red, marginTop: vs(5),fontFamily: "PopinRegula", }}>
          {errorText}
        </Text>
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
  },
});
