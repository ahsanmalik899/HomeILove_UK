import Cross from "@assets/CreateProfile/cross.svg";
import PropertyType from "@src/components/globals/PropertyType";
import Colors from "@src/constants/Colors";
import { hs, ms, vs } from "@utils/design/design";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormikDropdown } from "../FormikDropdown/indes";
import { FormikDropdownwithjson } from "../FormikDropdownwithjson";
import LargeButton from "../LaregeButton";
import SerchBar from "../SerchBar";
import { filtertype } from "./type";
const index = ({
  errors,
  handleSubmit,
  resetForm,
  setFieldValue,
  touched,
  values,
  setFieldTouched,
  setshowFilter,
  setAddress,
  setCity,
  setLat,
  setLng,
  setState,
  setZip,
  onpress,
  value,
  latValue,
  longValue,
  type,
}: filtertype) => {
  const propertyConditions = [
    { label: "Newly build / new home", value: "Newly build" },
    { label: "Total Re-build", value: "Total Re-build" },
    { label: "Partial Re-build", value: "Partial Re-build" },
    { label: "Good condition", value: "Good condition" },
    { label: "Moderate", value: "Moderate" },
    { label: "Need Repairs", value: "Need Repairs" },
  ];
 const PorposeForProperty = [
    { label: "Retirement homes", value: "Retirement homes" },
    { label: "Student accomodation", value: "Student accomodation" },
  ];
  const propertyOptions = {
    House: [
      "All",
      "Detached house",
      "Semi-detached house",
      "Town house Condo",
      "Bungalow Co-op",
      "Flats/ Apartments Condop",
      "Penthouse",
      "Park homes",
      "Others",
    ],
    Commercial: [
      "All",
      "Office",
      "Office workspace",
      "Retail properties",
      "Leisure / Hospitality",
      "Others",
    ],
    "Farms/Lands": [
      "All",
      "Land",
      "Commercial development",
      "Industrial development",
      "Farms",
      "Residential development",
    ],
  };
  const toggleValue = (
    field: string,
    value: string,
    values: any,
    setFieldValue: any
  ) => {
    const current = values[field] || [];

    if (value === "All") {
      setFieldValue(field, ["All"]);
      return;
    }

    const filtered = current.filter((v: string) => v !== "All");

    if (filtered.includes(value)) {
      setFieldValue(
        field,
        filtered.filter((v: string) => v !== value)
      );
    } else {
      setFieldValue(field, [...filtered, value]);
    }
  };

  const options =
    values.propertyType &&
    propertyOptions[values.propertyType as keyof typeof propertyOptions]
      ? propertyOptions[values.propertyType as keyof typeof propertyOptions]
      : [];
  const [cardshow, setcardShow] = useState("");
  return (
    <View style={styles.card}>
      <TouchableOpacity
       activeOpacity={1}
        style={{
          backgroundColor: Colors.light.lightGray,
          alignSelf: "flex-end",
          borderRadius: ms(20),
          paddingHorizontal: hs(2),
          paddingVertical: vs(2),
          marginTop: vs(40),
        }}
        onPress={() => setshowFilter(false)}
      >
        <Cross />
      </TouchableOpacity>
      <Text
        style={{
          alignSelf: "center",
          fontWeight: 700,
          fontFamily: "PopinRegula",
          fontSize: ms(15),
          marginBottom: vs(20),
          
        }}
      >
        Filter
      </Text>

      <SerchBar
        setAddress={setAddress}
        setCity={setCity}
        setLat={setLat}
        setLng={setLng}
        setState={setState}
        setZip={setZip}
        onpress={() => {
          handleSubmit();
        }}
        latValue={latValue}
        longValue={longValue}
        value={value.toString()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View className="mt-3">
            <FormikDropdownwithjson
              title={""}
              placeholder={"Radius (miles)"}
              value={values.radius}
              options={[
                { label: "1 mile", value: "1" },
                { label: "5 miles", value: "5" },
                { label: "10 miles", value: "10" },
                { label: "20 miles", value: "20" },
                { label: "30 miles", value: "30" },
                { label: "40 miles", value: "40" },
                { label: "50 miles", value: "50" },
              ]}
              name="radius"
              touched={false}
              errors={false}
              errorText={""}
              onSelect={(val) => {}}
              setValue={setFieldValue}
            />
          </View>
        </View>

        <View>
          <View
            style={{
              height: vs(1),
              marginTop: vs(20),

              backgroundColor: Colors.light.textGray,
              opacity: 0.2,
            }}
          />
          <Text
            style={{
              fontWeight: 700,
              fontFamily: "PopinRegula",
              fontSize: ms(15),
              marginVertical: vs(10),
            }}
          >
            Search Properties
          </Text>
          <PropertyType
            onPress={(value) => {
              setFieldValue("propertyType", value);
              setFieldValue("propertysubType", ["All"]);
            }}
            value={values.propertyType}
            errorText={""}
          />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginTop: vs(10),
            }}
          >
            {options.map((option) => (
              <TouchableOpacity
               activeOpacity={1}
                key={option}
                onPress={() =>
                  toggleValue("propertysubType", option, values, setFieldValue)
                }
                style={{
                  padding: 8,
                  borderRadius: 5,
                  paddingHorizontal: hs(10),
                  paddingVertical: vs(10),
                  backgroundColor: values.propertysubType?.includes(option)
                    ? Colors.light.DarkGreen
                    : "lightgray",
                }}
              >
                <Text
                  style={{
                    color: values.propertysubType?.includes(option)
                      ? "white"
                      : "black",
                      fontFamily: "PopinRegula",
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {values.propertyType !== "Farms/Lands" && (
          <>
            <View>
              <View
                style={{
                  height: vs(1),
                  marginTop: vs(20),

                  backgroundColor: Colors.light.textGray,
                  opacity: 0.2,
                }}
              />

              <Text
                style={{
                  fontWeight: 700,
                  fontFamily: "PopinRegula",
                  fontSize: ms(15),
                  marginVertical: vs(10),
                  
                }}
              >
                Condition
              </Text>
              {propertyConditions.map((item) => (
                <TouchableOpacity
                 activeOpacity={1}
                  key={item.value}
                  onPress={() =>
                    toggleValue(
                      "propertyCondition",
                      item.value,
                      values,
                      setFieldValue
                    )
                  }
                  style={{
                    padding: 8,
                    borderRadius: 5,
                    marginVertical: vs(5),
                    paddingHorizontal: hs(10),
                    paddingVertical: vs(10),
                    backgroundColor: values.propertyCondition?.includes(
                      item.value
                    )
                      ? Colors.light.DarkGreen
                      : "lightgray",
                  }}
                >
                  <Text
                    style={{
                      color: values.propertyCondition?.includes(item.value)
                        ? "white"
                        : "black",
                        fontFamily: "PopinRegula",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View>
               <Text
                style={{
                  fontWeight: 700,
                  fontFamily: "PopinRegula",
                  fontSize: ms(15),
                  marginVertical: vs(10),
                  
                }}
              >
                Purposeful property
              </Text>
            {PorposeForProperty.map((item) => (
                <TouchableOpacity
                 activeOpacity={1}
                  key={item.value}
                  onPress={() =>
                    toggleValue(
                      "purposeful_property",
                      item.value,
                      values,
                      setFieldValue
                    )
                  }
                  style={{
                    padding: 8,
                    borderRadius: 5,
                    marginVertical: vs(5),
                    paddingHorizontal: hs(10),
                    paddingVertical: vs(10),
                    backgroundColor: values.purposeful_property?.includes(
                      item.value
                    )
                      ? Colors.light.DarkGreen
                      : "lightgray",
                  }}
                >
                  <Text
                    style={{
                      color: values.purposeful_property?.includes(item.value)
                        ? "white"
                        : "black",
                        fontFamily: "PopinRegula",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
              </View>
            {type === "rent" && (
              <>
              
                <View
                  style={{
                    height: vs(1),
                    marginTop: vs(20),

                    backgroundColor: Colors.light.textGray,
                    opacity: 0.2,
                  }}
                />

                <Text
                  style={{
                    fontWeight: 700,
                    fontFamily: "PopinRegula",
                    fontSize: ms(15),
                    marginVertical: vs(10),
                  }}
                >
                  Pet Allowed
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: vs(5),
                  }}
                >
                  {["Yes", "No"].map((option) => (
                    <TouchableOpacity
                     activeOpacity={1}
                      key={option}
                      onPress={() => setFieldValue("pet_allowers", option)}
                      style={{
                        width: "48%",
                        padding: 8,
                        borderRadius: 5,
                        backgroundColor:
                          values.pet_allowers === option
                            ? Colors.light.DarkGreen
                            : "lightgray",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            values.pet_allowers === option ? "white" : "black",
                          fontFamily: "PopinRegula",
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={{
                    height: vs(1),
                    marginTop: vs(20),

                    backgroundColor: Colors.light.textGray,
                    opacity: 0.2,
                  }}
                />

                <Text
                  style={{
                    fontWeight: 700,
                    fontFamily: "PopinRegula",
                    fontSize: ms(15),
                    marginVertical: vs(10),
                  }}
                >
                  Available For Rent From
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: vs(5),
                  }}
                >
                  {["Vacant now", "Any Date"].map((option) => (
                    <TouchableOpacity
                     activeOpacity={1}
                      key={option}
                      onPress={() =>
                        setFieldValue(
                          "available_on",
                          option === "Any Date" ? null : option
                        )
                      }
                      style={{
                        width: "48%",
                        padding: 8,
                        borderRadius: 5,
                        backgroundColor:
                          values.available_on ===
                          (option === "Any Date" ? null : option)
                            ? Colors.light.DarkGreen
                            : "lightgray",
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            values.available_on ===
                            (option === "Any Date" ? null : option)
                              ? "white"
                              : "black",
                       fontFamily: "PopinRegula",
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={{
                    height: vs(1),
                    marginTop: vs(20),

                    backgroundColor: Colors.light.textGray,
                    opacity: 0.2,
                  }}
                />

                <Text
                  style={{
                    fontWeight: 700,
                    fontFamily: "PopinRegula",
                    fontSize: ms(15),
                    marginVertical: vs(10),
                  }}
                >
                  Furnishing Type
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginVertical: vs(5),
                  }}
                >
                  {[
                    "Fully Furnished",
                    "Partly Furnished",
                    "Unfurnished",
                    "Under Construction",
                  ].map((option) => (
                    <TouchableOpacity
                     activeOpacity={1}
                      key={option}
                      onPress={() =>
                        toggleValue(
                          "furnishing_type",
                          option,
                          values,
                          setFieldValue
                        )
                      }
                      style={{
                        width:hs(150),
                        padding: ms(8),
                        borderRadius: 5,
                        marginVertical: vs(5),
                        marginHorizontal: vs(5),
                        backgroundColor: values.furnishing_type?.includes(
                          option
                        )
                          ? Colors.light.DarkGreen
                          : "lightgray",

                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: values.furnishing_type?.includes(option)
                            ? "white"
                            : "black",
                            fontFamily: "PopinRegula",
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View>
              <View
                style={{
                  height: vs(1),
                  marginTop: vs(20),

                  backgroundColor: Colors.light.textGray,
                  opacity: 0.2,
                }}
              />
              <View>
                <FormikDropdown
                  onSelect={() => {}}
                  options={[
                    "Studio",
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "10+",
                  ]}
                  title="Minimum Beds"
                  name="minBed"
                  setValue={setFieldValue}
                  placeholder="Beds"
                  value={values.minBed}
                  touched={!!touched.minBed}
                  errors={!!errors.minBed}
                  required
                  errorText={errors.minBed}
                />
              </View>
              <View>
                <FormikDropdown
                  onSelect={() => {}}
                  options={[
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "10+",
                  ]}
                  title="Maximum Beds"
                  placeholder="Beds"
                  name="maxBed"
                  setValue={setFieldValue}
                  value={values.maxBed}
                  touched={!!touched.maxBed}
                  errors={!!errors.maxBed}
                  required
                  errorText={errors.maxBed}
                />
              </View>
            </View>

            <View>
              <View
                style={{
                  height: vs(1),
                  marginTop: vs(20),

                  backgroundColor: Colors.light.textGray,
                  opacity: 0.2,
                }}
              />
              <View>
                <FormikDropdownwithjson
               title={
  type === "rent"
    ? "Minimum Rent"
    : "Minimum Price"
}
                  placeholder="No Selection"
                  value={values.minPrice}
                  touched={!!touched.minPrice}
                  errors={!!errors.minPrice}
                  required
                  errorText={errors.minPrice}
                options={
  type === "rent"
    ? [
        { label: "No selection", value: "" },
        { label: "Below £500", value: "0" },
        { label: "£500", value: "500" },
        { label: "£750", value: "750" },
        { label: "£1,000", value: "1000" },
        { label: "£1,250", value: "1250" },
        { label: "£1,500", value: "1500" },
        { label: "£1,750", value: "1750" },
        { label: "£2,000", value: "2000" },
        { label: "£2,250", value: "2250" },
        { label: "£2,500", value: "2500" },
        { label: "£2,750", value: "2750" },
        { label: "£3,000", value: "3000" },
        { label: "£3,500", value: "3500" },
        { label: "£4,000", value: "4000" },
        { label: "£5,000", value: "5000" },
        { label: "£7,500", value: "7500" },
        { label: "£10,000", value: "10000" },
      ]
    : type === "community"
    ? [
        { label: "No selection", value: "" },
        { label: "Below £100,000", value: "0" },
        { label: "£100,000", value: "100000" },
        { label: "£150,000", value: "150000" },
        { label: "£200,000", value: "200000" },
        { label: "£250,000", value: "250000" },
        { label: "£300,000", value: "300000" },
        { label: "£400,000", value: "400000" },
        { label: "£500,000", value: "500000" },
        { label: "£600,000", value: "600000" },
        { label: "£750,000", value: "750000" },
        { label: "£1,000,000", value: "1000000" },
        { label: "£1,500,000", value: "1500000" },
        { label: "£2,000,000", value: "2000000" },
        { label: "£3,000,000", value: "3000000" },
        { label: "£5,000,000", value: "5000000" },
        { label: "£7,500,000", value: "7500000" },
        { label: "£10,000,000", value: "10000000" },
      ]
    : [
        { label: "No selection", value: "" },
        { label: "Below £50,000", value: "0" },
        { label: "£50,000", value: "50000" },
        { label: "£75,000", value: "75000" },
        { label: "£100,000", value: "100000" },
        { label: "£125,000", value: "125000" },
        { label: "£150,000", value: "150000" },
        { label: "£175,000", value: "175000" },
        { label: "£200,000", value: "200000" },
        { label: "£225,000", value: "225000" },
        { label: "£250,000", value: "250000" },
        { label: "£275,000", value: "275000" },
        { label: "£300,000", value: "300000" },
        { label: "£350,000", value: "350000" },
        { label: "£400,000", value: "400000" },
        { label: "£450,000", value: "450000" },
        { label: "£500,000", value: "500000" },
        { label: "£600,000", value: "600000" },
        { label: "£750,000", value: "750000" },
        { label: "£1,000,000", value: "1000000" },
        { label: "£1,250,000", value: "1250000" },
        { label: "£1,500,000", value: "1500000" },
        { label: "£2,000,000", value: "2000000" },
        { label: "£3,000,000", value: "3000000" },
        { label: "£5,000,000", value: "5000000" },
      ]
}
                  onSelect={(value) => {
                    setFieldValue("minPrice", value);
                  }}
                />
              </View>

              <View>
                <FormikDropdownwithjson
             title={
  type === "rent"
    ? "Maximum Rent"
    : "Maximum Price"
}
                  placeholder="No Selction"
                  value={values.maxPrice}
                  touched={!!touched.maxPrice}
                  errors={!!errors.maxPrice}
                  required
                  errorText={errors.maxPrice}
          options={
  type === "rent"
    ? [
        { label: "No selection", value: "" },
        { label: "£500", value: "500" },
        { label: "£750", value: "750" },
        { label: "£1,000", value: "1000" },
        { label: "£1,250", value: "1250" },
        { label: "£1,500", value: "1500" },
        { label: "£1,750", value: "1750" },
        { label: "£2,000", value: "2000" },
        { label: "£2,250", value: "2250" },
        { label: "£2,500", value: "2500" },
        { label: "£2,750", value: "2750" },
        { label: "£3,000", value: "3000" },
        { label: "£3,500", value: "3500" },
        { label: "£4,000", value: "4000" },
        { label: "£5,000", value: "5000" },
        { label: "£7,500", value: "7500" },
        { label: "£10,000", value: "10000" },
        { label: "Above £10,000", value: "10001" },
      ]
    : type === "community"
    ? [
        { label: "No selection", value: "" },
        { label: "£100,000", value: "100000" },
        { label: "£150,000", value: "150000" },
        { label: "£200,000", value: "200000" },
        { label: "£250,000", value: "250000" },
        { label: "£300,000", value: "300000" },
        { label: "£400,000", value: "400000" },
        { label: "£500,000", value: "500000" },
        { label: "£600,000", value: "600000" },
        { label: "£750,000", value: "750000" },
        { label: "£1,000,000", value: "1000000" },
        { label: "£1,500,000", value: "1500000" },
        { label: "£2,000,000", value: "2000000" },
        { label: "£3,000,000", value: "3000000" },
        { label: "£5,000,000", value: "5000000" },
        { label: "£7,500,000", value: "7500000" },
        { label: "£10,000,000", value: "10000000" },
        { label: "Above £10,000,000", value: "10000001" },
      ]
    : [
        { label: "No selection", value: "" },
        { label: "£50,000", value: "50000" },
        { label: "£75,000", value: "75000" },
        { label: "£100,000", value: "100000" },
        { label: "£125,000", value: "125000" },
        { label: "£150,000", value: "150000" },
        { label: "£175,000", value: "175000" },
        { label: "£200,000", value: "200000" },
        { label: "£225,000", value: "225000" },
        { label: "£250,000", value: "250000" },
        { label: "£275,000", value: "275000" },
        { label: "£300,000", value: "300000" },
        { label: "£350,000", value: "350000" },
        { label: "£400,000", value: "400000" },
        { label: "£450,000", value: "450000" },
        { label: "£500,000", value: "500000" },
        { label: "£600,000", value: "600000" },
        { label: "£750,000", value: "750000" },
        { label: "£1,000,000", value: "1000000" },
        { label: "£1,250,000", value: "1250000" },
        { label: "£1,500,000", value: "1500000" },
        { label: "£2,000,000", value: "2000000" },
        { label: "£3,000,000", value: "3000000" },
        { label: "£5,000,000", value: "5000000" },
        { label: "Above £5,000,000", value: "5000001" },
      ]
}
                  onSelect={(value) => setFieldValue("maxPrice", value)}
                />
              </View>
            </View>
            <View
              style={{
                height: vs(1),
                marginTop: vs(20),

                backgroundColor: Colors.light.textGray,
                opacity: 0.2,
              }}
            />
            <View>
              <Text
                style={{
                  fontWeight: 700,
                  fontFamily: "PopinRegula",
                  fontSize: ms(15),
                  marginVertical: vs(10),

                }}
              >
                Bathrooms
              </Text>

              <View style={styles.counterRow}>
                <TouchableOpacity
                 activeOpacity={1}
                  style={styles.counterBtn}
                  onPress={() => {
                    const current = Number(values.bathrooms || 0);
                    if (current > 0) {
                      setFieldValue("bathrooms", String(current - 1));
                    }
                  }}
                >
                  <Text style={styles.counterText}>−</Text>
                </TouchableOpacity>

                <View style={styles.counterValue}>
                  <Text style={styles.counterNumber}>
                    {values.bathrooms || 0}
                  </Text>
                </View>

                <TouchableOpacity
                 activeOpacity={1}
                  style={styles.counterBtn}
                  onPress={() => {
                    const current = Number(values.bathrooms || 0);
                    setFieldValue("bathrooms", String(current + 1));
                  }}
                >
                  <Text style={styles.counterText}>＋</Text>
                </TouchableOpacity>
              </View>
              <LargeButton
                handleSubmit={() => setFieldValue("bathrooms", "")}
                text="Reset"
              />
              <View
                style={{
                  height: vs(1),
                  marginTop: vs(20),

                  backgroundColor: Colors.light.textGray,
                  opacity: 0.2,
                }}
              />
            </View>
          </>
        )}
        <Text
          style={{
            fontWeight: 700,
            fontFamily: "PopinRegula",
            fontSize: ms(15),
            marginVertical: vs(10),
          }}
        >
          {type === "sale" ? "Tenure" : "Tenancy tenure"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "space-between",
            marginBottom: vs(10),
          }}
        >
          {type === "sale" ? (
            <>
              {[
                "Freehold",
                "Leasehold",
                "Joint ownership",
                "Commonhold",
                "Others",
              ].map((option) => (
                <TouchableOpacity
                 activeOpacity={1}
                  key={option}
                  onPress={() =>
                    toggleValue("tenure", option, values, setFieldValue)
                  }
                  style={{
                    width: "48%",
                    padding: 8,
                    borderRadius: 5,
                    marginVertical: vs(5),
                    backgroundColor: values.tenure?.includes(option)
                      ? Colors.light.DarkGreen
                      : "lightgray",

                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: values.tenure?.includes(option)
                        ? "white"
                        : "black",
                        fontFamily: "PopinRegula",
                    }}
                  >
                    {option === "Commonhold" ? "Under Construction" : option}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              {[
                "Open",
                "Less than 6 months",
                "6 months",
                "1 year",
                "More than 1 year",
              ].map((option) => (
                <TouchableOpacity
                 activeOpacity={1}
                  key={option}
                  onPress={() =>
                    toggleValue("tinency_tenure", option, values, setFieldValue)
                  }
                  style={{
                    width: "48%",
                    padding: 8,
                    borderRadius: 5,
                    marginVertical: vs(5),
                    backgroundColor: values.tinency_tenure?.includes(option)
                      ? Colors.light.DarkGreen
                      : "lightgray",

                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: values.tinency_tenure?.includes(option)
                        ? "white"
                        : "black",
                        fontFamily: "PopinRegula",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
        <LargeButton
  handleSubmit={() => {

    const empty = {
      propertysubType: [],
      propertyCondition: [],
      tenure: [],
      purposeful_property: [],
      furnishing_type: [],
      tinency_tenure: [],
      purposeful_type: [],
      radius: "",
      property_for: type,
      propertyType: "",
      price_type: "",
      max_rent_range: "",
      pet_allowers: "",
      available_on: "",
      minBed: "",
      maxBed: "",
      minPrice: "",
      maxPrice: "",
      bathrooms: "",
      sort: "",
    };

    resetForm({ values: empty });
    setAddress("");
    setCity("");
    setLat(0);
    setLng(0);
    setState("");
    setZip("");
  }}
  text="Reset Values"
/>

      </ScrollView>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  card: {
    position: "absolute",

    top: vs(0),
    bottom: vs(0),
    left: hs(0),
    right: hs(0),
    paddingHorizontal: hs(20),
    backgroundColor: "#fff",
    borderRadius: ms(5),
    paddingBottom: vs(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  Smallcard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: ms(5),
    width: hs(100),
    paddingHorizontal: hs(3),
    paddingVertical: vs(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: vs(20),
  },

  counterBtn: {
    width: hs(40),
    height: hs(40),
    borderRadius: hs(10),
    backgroundColor: Colors.light.DarkGreen,
    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    fontSize: ms(28),
    fontWeight: "600",
    color: "white",
    fontFamily: "PopinRegula",
  },

  counterValue: {
    width: hs(80),
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "PopinRegula",
  },

  counterNumber: {
    fontSize: ms(24),
    fontWeight: "700",
    fontFamily: "PopinRegula",
  },
});
