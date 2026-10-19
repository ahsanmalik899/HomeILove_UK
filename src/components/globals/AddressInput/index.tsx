import {
  useGetAddressSuggestionsQuery,
  useLazyGetPlaceDetailsQuery,
  useLazyReverseGeocodeQuery,
} from "@/store/api/user/Google";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@src/constants/Colors";
import { renderToastError } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { MapType, Marker, Region } from "react-native-maps";
import { AddressInputProps } from "./type";

export const AdressInput = ({
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
  latValue,
  longValue,
  state,
  lat,
  long,
  setValue = () => {},
  name = "name",
  withmap = true,
}: AddressInputProps) => {
  const [currentValue, setCurrentValue] = useState(value?.toString() || "");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  useEffect(() => {
    if (value) {
      setCurrentValue(value.toString());
    }

    if (latValue && longValue) {
      const latitude = Number(latValue);
      const longitude = Number(longValue);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005,
        };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 500);
      }
    }
  }, [value, latValue, longValue]);

  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [region, setRegion] = useState<Region>({
    latitude: Number(latValue) || 51.5074,
    longitude: Number(longValue) || -0.1278,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [getPlaceDetails] = useLazyGetPlaceDetailsQuery();
  const [reverseGeocode] = useLazyReverseGeocodeQuery();

  const { data: googleData, isFetching } = useGetAddressSuggestionsQuery(
    { input: currentValue },
    { skip: currentValue.length < 3 }
  );

  const handleSelectSuggestion = async (address: string, placeId: string) => {
    setCurrentValue(address);
    setShowSuggestions(false);
    onSelect?.(address);
    setValue(name, address);

    try {
      const result = await getPlaceDetails({ placeId }).unwrap();
      const components = result?.result?.address_components || [];
      console.log(result);
      const findComponent = (type: string) =>
        components.find((c: any) => c.types.includes(type));

      const cityName =
        findComponent("locality")?.long_name ||
        findComponent("administrative_area_level_2")?.long_name ||
        "";
      const stateCode =
        findComponent("administrative_area_level_1")?.short_name || "";
      const zipCode = findComponent("postal_code")?.long_name || "";

      const latitude = result?.result?.geometry?.location?.lat ?? 51.5074;
      const longitude = result?.result?.geometry?.location?.lng ?? -0.1278;

      setValue(lat, latitude);
      setValue(long, longitude);
      setValue(city, cityName);
      setValue(state, stateCode);
      setValue(zip, zipCode);

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 500);

      mapRef.current?.animateToRegion(newRegion, 500);
    } catch (err: any) {
      renderToastError(err?.message || "Failed to fetch place details");
    }
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0005,
      longitudeDelta: 0.0005,
    });
    setValue(lat, latitude);
    setValue(long, longitude);

    try {
      const res = await reverseGeocode({
        lat: latitude,
        lng: longitude,
      }).unwrap();
      const result = res?.results?.[0];
      if (!result) return;

      const components = result.address_components || [];
      const findComponent = (type: string) =>
        components.find((c: any) => c.types.includes(type));

      const address = result.formatted_address || "";
      const cityName =
        findComponent("locality")?.long_name ||
        findComponent("administrative_area_level_2")?.long_name ||
        "";
      const stateCode =
        findComponent("administrative_area_level_1")?.short_name || "";
      const zipCode = findComponent("postal_code")?.long_name || "";

      setCurrentValue(address);
      setValue(name, address);
      setValue(city, cityName);
      setValue(state, stateCode);
      setValue(zip, zipCode);
    } catch (err: any) {
      renderToastError("Failed to fetch address from map");
    }
  };

  return (
    <View style={{ marginTop: vs(10) }}>
      {title && (
        <View style={{ flexDirection: "row", marginBottom: vs(10) }}>
          <Text style={styles.title}>{title}</Text>
          {required && <Text style={{ color: Colors.light.red,fontFamily: "PopinRegula", }}> *</Text>}
          {additonalText && (
            <Text style={{ paddingLeft: hs(5),fontFamily: "PopinRegula", }}>{`(${additonalText})`}</Text>
          )}
        </View>
      )}

      <TextInput
        value={currentValue}
        onChangeText={(val) => {
          setCurrentValue(val);
          setValue(name, "");
          setShowSuggestions(true);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 1000)}
        placeholder="Enter address..."
        placeholderTextColor={Colors.light.DarkGreen}
        style={{
          color: Colors.light.DarkGreen,
          backgroundColor: Colors.light.LightGreen,
          borderRadius: ms(18),
          paddingHorizontal: hs(12),
          height: 45,
        }}
      />

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
            <Text style={{ marginTop: vs(5) ,fontFamily: "PopinRegula",}}>Loading...</Text>
          </View>
        )}
        {showSuggestions && isFocused && (
          <FlatList
            data={googleData?.predictions}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
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
                <Text style={{fontFamily: "PopinRegula",}}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {touched && errors && (
        <Text style={{ color: Colors.light.red, marginTop: vs(5),fontFamily: "PopinRegula", }}>
          {errorText}
        </Text>
      )}
      {withmap && (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setMapType("standard")}
            >
              <MaterialCommunityIcons
                name="map-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setMapType("satellite")}
            >
              <MaterialCommunityIcons
                name="satellite"
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setMapType("hybrid")}
            >
              <MaterialCommunityIcons
                name="google-maps"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <MapView
            ref={mapRef}
            mapType={mapType}
            style={{ height: vs(300), width: "100%", marginTop: vs(10) }}
            region={region}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: ms(14), fontWeight: "700", zIndex: 0,fontFamily: "PopinRegula", },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.6)",
    marginLeft: hs(5),
    padding: hs(8),
    borderRadius: 8,
  },
});
