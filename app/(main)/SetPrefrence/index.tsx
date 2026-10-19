import {
  useDeleteCommunityPreferencesApiMutation,
  useDeleteConnectionPreferencesApiMutation,
  useDeletePropertyPreferencesApiMutation,
  useGetCommunityPrefQuery,
  useGetConnectionPrefQuery,
  useGetPropertyPrefQuery,
  useSetCommunityPrefrenceMutation,
  useSetConectionPrefrenceMutation,
  useSetPropertyPrefrenceMutation,
} from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import { MaterialIcons } from "@expo/vector-icons";
import { DealingAreaswithRadius } from "@src/components/globals/DealinAreaswithRadius";
import { FormikDropdown } from "@src/components/globals/FormikDropdown/indes";
import { FormikDropdownwithjson } from "@src/components/globals/FormikDropdownwithjson";
import HeaderWithBack from "@src/components/globals/HeaderWithBack";
import Loading from "@src/components/globals/Loading";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
const index = () => {
  const user = useAppSelector(userdata);
  const [ResetProperty, { isLoading: resetPropertyLoading }] =
    useDeletePropertyPreferencesApiMutation();
  const [ResetCommunity, { isLoading: resetCommunityLoading }] =
    useDeleteCommunityPreferencesApiMutation();
  useDeletePropertyPreferencesApiMutation();
  const [ResetConnection, { isLoading: resetConnectionLoading }] =
    useDeleteConnectionPreferencesApiMutation();
  const { type } = useLocalSearchParams();
  const [setPropertyPrefrence, { isLoading: PropertyLoading }] =
    useSetPropertyPrefrenceMutation();
  const [setCommunityPrefrence, { isLoading: CommunityLoading }] =
    useSetCommunityPrefrenceMutation();
  const [setConnectionPrefrence, { isLoading: ConnectionLoading }] =
    useSetConectionPrefrenceMutation();
  const {
    data,
    refetch: refetchConnectionPreference,
    isFetching: conectioLoading,
  } = useGetConnectionPrefQuery(
    {
      id: user.id,
      type: "",
    },
    {
      skip: type !== "Connection",
    }
  );

  const {
    data: communityData,
    refetch: refetchCommunityPreference,
    isFetching: communityprefLoading,
  } = useGetCommunityPrefQuery(
    {
      id: user.id,
      type: "",
    },
    {
      skip: type !== "Community",
    }
  );
  const {
    data: propertyData,
    refetch: refetchPropertyPreference,
    isFetching: propertyprefLoading,
  } = useGetPropertyPrefQuery(
    {
      id: user.id,
      type: "",
    },
    {
      skip: type !== "Property",
    }
  );

  const toggleStatus = (
    currentvalue: string,
    value: string,
    setFieldValue: (name: string, value: string) => void,
    name: string
  ) => {
    const current = value ? value.split(",") : [];

    if (current.includes(currentvalue)) {
      const updated = current.filter((item) => item !== currentvalue);
      setFieldValue(name, updated.join(","));
    } else {
      setFieldValue(name, [...current, currentvalue].join(","));
    }
  };

  const propertyPrefrenceSchema = Yup.object().shape({
    location: Yup.string().nullable(),
    user_id: Yup.string().nullable(),
    property_for: Yup.string().nullable(),
     radius: Yup.string().nullable(),
    property_type: Yup.string().nullable(),
    property_condition: Yup.string().nullable(),
    min_price: Yup.number()
      .typeError("Minimum price must be a number")
      .nullable(),

    max_price: Yup.number()
      .typeError("Maximum price must be a number")
      .nullable()
      .min(Yup.ref("min_price"), "Max rent must be greater than min price"),
    min_rent: Yup.number()
      .typeError("Minimum rent must be a number")
      .nullable(),

    max_rent: Yup.number()
      .typeError("Maximum rent must be a number")
      .nullable()
      .min(Yup.ref("min_rent"), "Max rent must be greater than min rent"),
    min_size: Yup.number()
      .typeError("Minimum size must be a number")
      .nullable(),

    max_size: Yup.number()
      .typeError("Maximum size must be a number")
      .nullable()
      .min(Yup.ref("min_size"), "Max size must be greater than size rent"),
    min_lot_size: Yup.number()
      .typeError("Minimum lot size must be a number")
      .nullable(),

    max_lot_size: Yup.number()
      .typeError("Maximum lot size must be a number")
      .nullable()
      .min(
        Yup.ref("min_lot_size"),
        "Max lot size must be greater than min lot size"
      ),

    min_age: Yup.number().typeError("Minimum age must be a number").nullable(),

    max_age: Yup.number()
      .typeError("Maximum age must be a number")
      .nullable()
      .min(Yup.ref("min_age"), "Max rent age be greater than min age"),
  });
  const communityPreferenceSchema = Yup.object().shape({
    location: Yup.string().nullable(),
    zip: Yup.string().nullable(),
    state: Yup.string().nullable(),

    community_type: Yup.string().nullable(),
    community_status: Yup.string().nullable(),
    radius: Yup.string().nullable(),
    min_price: Yup.number()
      .typeError("Minimum price must be a number")
      .nullable(),

    max_price: Yup.number()
      .typeError("Maximum price must be a number")
      .nullable()
      .min(Yup.ref("min_price"), "Max rent must be greater than min price"),
  });
  const connectionPreferenceSchema = Yup.object().shape({
    user_id: Yup.string().nullable(),
    location: Yup.string().nullable(),
    user_type: Yup.string().nullable(),
    radius: Yup.string().nullable(),
  });

  switch (type) {
    case "Property":
      return (
        <ScrollView className="flex-1 bg-white">
          <View>
            <HeaderWithBack title="Set Your Property Preferences" />
            <View style={styles.card}>
              <Formik
                enableReinitialize
                initialValues={{
                  user_id: user.id,

                  location: propertyData?.data?.location || "",
                     zip:propertyData?.data?.zip|| "",
                  state:propertyData?.data?.state || "",
                  radius:propertyData?.data?.radius||"",
                  
                  property_for: propertyData?.data?.property_for || "",
                  property_type: propertyData?.data?.property_type || "",
                  property_condition:
                    propertyData?.data?.property_condition || "",

                  min_price: propertyData?.data?.min_price
                    ? String(propertyData.data.min_price)
                    : "",

                  max_price: propertyData?.data?.max_price
                    ? String(propertyData.data.max_price)
                    : "",

                  min_rent: propertyData?.data?.min_rent
                    ? String(propertyData.data.min_rent)
                    : "",

                  max_rent: propertyData?.data?.max_rent
                    ? String(propertyData.data.max_rent)
                    : "",

                  min_size: propertyData?.data?.min_size
                    ? String(propertyData.data.min_size)
                    : "",

                  max_size: propertyData?.data?.max_size
                    ? String(propertyData.data.max_size)
                    : "",

                  min_lot_size: propertyData?.data?.min_lot_size
                    ? String(propertyData.data.min_lot_size)
                    : "",

                  max_lot_size: propertyData?.data?.max_lot_size
                    ? String(propertyData.data.max_lot_size)
                    : "",

                  min_age: propertyData?.data?.min_age
                    ? String(propertyData.data.min_age)
                    : "",

                  max_age: propertyData?.data?.max_age
                    ? String(propertyData.data.max_age)
                    : "",
                }}
                onSubmit={async (values) => {
                  try {
                    console.log(values)
                    const result = await setPropertyPrefrence(values);

                    if (result?.data?.success) {
                      renderToastSuccess(result.data.message);
                      router.back();
                    } else {
                      renderToastError(
                        result?.data?.message || "Something went wrong"
                      );
                    }
                  } catch (error) {
                    renderToastError("Server error");
                  }
                }}
                validationSchema={propertyPrefrenceSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                  resetForm,
                }) => (
                  <>
                       <DealingAreaswithRadius
                      city="dealing_city"
                      onSelect={() => {}}
                      state="state"
                      title="Locations"
                      value={values.location}
                      touched={!!touched.location}
                      errors={!!errors.location}
                      name="location"
                      zip="zip"
                      setValue={setFieldValue}
                      errorText={errors.location}
                      placeholder="Please enter City, State or Zip code"
                       radius="radius"
                      radiusValue={values.radius}
                    />
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <Text
                      style={{
                        width: hs(250),
                        fontWeight: 700,
                        marginTop: vs(10),
                        fontFamily: "PopinRegula",
                      }}
                    >
                      Property for
                    </Text>
                    <View
                      className="flex-row flex-wrap"
                      style={{ marginTop: vs(10), marginBottom: vs(20) }}
                    >
                      {/*  Sale */}
                      <View className="flex-row items-center">
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Sale",
                              values.property_for,
                              setFieldValue,
                              "property_for"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.property_for?.includes("Sale")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Sale
                        </Text>
                      </View>

                      {/* Rent */}
                      <View
                        className="flex-row items-center"
                        style={{ marginLeft: hs(20) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Rent",
                              values.property_for,
                              setFieldValue,
                              "property_for"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.property_for?.includes("Rent")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Rent
                        </Text>
                      </View>
                    </View>
                    {touched.property_for && errors.property_for && (
                      <Text
                        style={{
                          color: Colors.light.red,
                          fontFamily: "PopinRegula",
                        }}
                      >
                        {errors.property_for}
                      </Text>
                    )}
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <View className="flex-1">
                      <FormikDropdown
                        title="Property Type"
                        placeholder="Property Type"
                        value={values.property_type}
                        touched={!!touched.property_type}
                        errors={!!errors.property_type}
                        required
                        multipleFields
                        name="property_type"
                        setValue={setFieldValue}
                        errorText={errors.property_type}
                        options={["House", "Commercial", "Farms/Lands"]}
                        onSelect={() => {}}
                      />
                    </View>
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <View className="flex-1">
                      <FormikDropdown
                        title="Property Conditions"
                        placeholder="Property Conditions"
                        value={values.property_condition}
                        touched={!!touched.property_condition}
                        errors={!!errors.property_condition}
                        required
                        multipleFields
                        errorText={errors.property_condition}
                        options={[
                          "Newly build",
                          "Total Re-build",
                          "Partial Re-build",
                          "Good condition",
                          "Moderate",
                          "Need Repairs",
                        ]}
                        onSelect={() => {}}
                        setValue={setFieldValue}
                        name="property_condition"
                      />
                    </View>

                    {values.property_for.includes("Sale") ||
                      (values.property_for.includes("Rent") && (
                        <>
                          <View
                            style={{
                              height: vs(1),
                              marginTop: vs(20),
                              marginBottom: vs(10),
                              backgroundColor: Colors.light.textGray,
                              opacity: 0.2,
                            }}
                          />
                          <Text
                            style={{
                              fontWeight: 500,
                              fontFamily: "PopinRegula",
                            }}
                          >
                            Price Range{" "}
                          </Text>
                        </>
                      ))}

                    {values.property_for.includes("Sale") && (
                      <View className="flex-row justify-between items-start gap-3">
                        <View className="flex-1">
                          <FormikDropdownwithjson
                            title="Minimun price"
                            placeholder="No Selection"
                            value={values.min_price}
                            touched={!!touched.min_price}
                            errors={!!errors.min_price}
                            required
                            errorText={errors.min_price}
                           options={[
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
]}
                            onSelect={(value) => {
                              setFieldValue("min_price", value);
                            }}
                          />
                        </View>

                        <View className="flex-1">
                          <FormikDropdownwithjson
                            title="Maximun price"
                            placeholder="No Selction"
                            value={values.max_price}
                            touched={!!touched.max_price}
                            errors={!!errors.max_price}
                            required
                            errorText={errors.max_price}
                          options={[
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
]}
                            onSelect={(value) =>
                              setFieldValue("max_price", value)
                            }
                          />
                        </View>
                      </View>
                    )}

                    {values.property_for.includes("Rent") && (
                      <View className="flex-row justify-between items-start gap-3">
                        <View className="flex-1">
                          <FormikDropdownwithjson
                            title="Minimun rent"
                            placeholder="No Selection"
                            value={values.min_rent}
                            touched={!!touched.min_rent}
                            errors={!!errors.min_rent}
                            required
                            errorText={errors.min_rent}
                           options={[
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
]}
                            onSelect={(value) => {
                              setFieldValue("min_rent", value);
                            }}
                          />
                        </View>

                        <View className="flex-1">
                          <FormikDropdownwithjson
                            title="Maximun rent"
                            placeholder="No Selction"
                            value={values.max_rent}
                            touched={!!touched.max_rent}
                            errors={!!errors.max_rent}
                            required
                            errorText={errors.max_rent}
                           options={[
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
]}
                            onSelect={(value) =>
                              setFieldValue("max_rent", value)
                            }
                          />
                        </View>
                      </View>
                    )}

                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <Text
                      style={{ fontWeight: 500, fontFamily: "PopinRegula" }}
                    >
                      Property size (sqft)
                    </Text>
                    <View className="flex-row justify-between items-start gap-3">
                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Minimun"
                          placeholder="No Selection"
                          value={values.min_size}
                          touched={!!touched.min_size}
                          errors={!!errors.min_size}
                          required
                          errorText={errors.min_size}
                          options={[
                            { label: "No selection", value: "" },
                            { label: "less than 100", value: "0" },
                            { label: "100 sqft", value: "100" },
                            { label: "200 sqft", value: "200" },
                            { label: "300 sqft", value: "300" },
                            { label: "400 sqft", value: "400" },
                            { label: "500 sqft", value: "500" },
                            { label: "600 sqft", value: "600" },
                            { label: "700 sqft", value: "700" },
                            { label: "800 sqft", value: "800" },
                            { label: "900 sqft", value: "900" },
                            { label: "1000 sqft", value: "1000" },
                            { label: "1500 sqft", value: "1500" },
                            { label: "2000 sqft", value: "2000" },
                          ]}
                          onSelect={(value) => {
                            setFieldValue("min_size", value);
                          }}
                        />
                      </View>

                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Maximun"
                          placeholder="No Selction"
                          value={values.max_size}
                          touched={!!touched.max_size}
                          errors={!!errors.max_size}
                          required
                          errorText={errors.max_size}
                          options={[
                            { label: "200 sqft", value: "200" },
                            { label: "300 sqft", value: "300" },
                            { label: "400 sqft", value: "400" },
                            { label: "500 sqft", value: "500" },
                            { label: "600 sqft", value: "600" },
                            { label: "700 sqft", value: "700" },
                            { label: "800 sqft", value: "800" },
                            { label: "900 sqft", value: "900" },
                            { label: "1000 sqft", value: "1000" },
                            { label: "1500 sqft", value: "1500" },
                            { label: "2000 sqft", value: "2000" },
                            { label: "more than 2000 sqft", value: "2000+" },
                          ]}
                          onSelect={(value) => setFieldValue("max_size", value)}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <Text
                      style={{ fontWeight: 500, fontFamily: "PopinRegula" }}
                    >
                      Lot size (acres)
                    </Text>

                    <View className="flex-row justify-between items-start gap-3">
                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Minimun"
                          placeholder="No Selection"
                          value={values.min_lot_size}
                          touched={!!touched.min_lot_size}
                          errors={!!errors.min_lot_size}
                          required
                          errorText={errors.min_lot_size}
                          options={[
                            { label: "No selection", value: "" },
                            { label: "less than 1 acre", value: "0" },
                            { label: "1 acre", value: "1" },
                            { label: "2 acres", value: "2" },
                            { label: "3 acres", value: "3" },
                            { label: "4 acres", value: "4" },
                            { label: "5 acres", value: "5" },
                          ]}
                          onSelect={(value) => {
                            setFieldValue("min_lot_size", value);
                          }}
                        />
                      </View>

                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Maximun"
                          placeholder="No Selction"
                          value={values.max_lot_size}
                          touched={!!touched.max_lot_size}
                          errors={!!errors.max_lot_size}
                          required
                          errorText={errors.max_lot_size}
                          options={[
                            { label: "No selection", value: "" },
                            { label: "less than 1 acre", value: "0" },
                            { label: "1 acre", value: "1" },
                            { label: "2 acres", value: "2" },
                            { label: "3 acres", value: "3" },
                            { label: "4 acres", value: "4" },
                            { label: "5 acres", value: "5" },
                            { label: "more than 5 acres", value: "5+" },
                          ]}
                          onSelect={(value) =>
                            setFieldValue("max_lot_size", value)
                          }
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <Text
                      style={{ fontWeight: 500, fontFamily: "PopinRegula" }}
                    >
                      Home age
                    </Text>
                    <View className="flex-row justify-between items-start gap-3">
                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Minimun"
                          placeholder="No Selection"
                          value={values.min_age}
                          touched={!!touched.min_age}
                          errors={!!errors.min_age}
                          required
                          errorText={errors.min_age}
                          openDirection="TOP"
                          options={[
                            { label: "No selection", value: "" },
                            { label: "5 yrs", value: "5" },
                            { label: "10 yrs", value: "10" },
                            { label: "15 yrs", value: "15" },
                            { label: "20 yrs", value: "20" },
                            { label: "25 yrs", value: "25" },
                            { label: "30 yrs", value: "30" },
                            { label: "40 yrs", value: "40" },
                            { label: "50 yrs", value: "50" },
                          ]}
                          onSelect={(value) => {
                            setFieldValue("min_age", value);
                          }}
                        />
                      </View>

                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Maximun"
                          placeholder="No Selction"
                          value={values.max_age}
                          touched={!!touched.max_age}
                          errors={!!errors.max_age}
                          required
                          openDirection="TOP"
                          errorText={errors.max_age}
                          options={[
                            { label: "No selection", value: "" },
                            { label: "5 yrs", value: "5" },
                            { label: "10 yrs", value: "10" },
                            { label: "15 yrs", value: "15" },
                            { label: "20 yrs", value: "20" },
                            { label: "25 yrs", value: "25" },
                            { label: "30 yrs", value: "30" },
                            { label: "40 yrs", value: "40" },
                            { label: "50 yrs", value: "50" },
                            { label: "more than 50 yrs", value: "50+" },
                          ]}
                          onSelect={(value) => setFieldValue("max_age", value)}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <View className="flex-row justify-between">
                      <TouchableOpacity
                       activeOpacity={1}
                        style={{
                          backgroundColor: Colors.light.lightGray,
                          borderRadius: ms(10),
                          paddingHorizontal: hs(10),
                          paddingVertical: vs(10),
                          width: hs(120),
                          alignItems: "center",
                        }}
                        onPress={async () => {
                          const formatdata = new FormData();
                          formatdata.append("user_id", user.id.toString());
                          try {
                            const result = await ResetProperty(
                              formatdata
                            ).unwrap();

                            if (result?.success) {
                              renderToastSuccess(result?.message);
                              resetForm();
                              refetchPropertyPreference();
                            } else {
                              renderToastError(result?.message);
                            }
                          } catch (error) {
                            renderToastError(error?.data?.message);
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.light.DarkGreen,
                            fontWeight: 700,
                            fontFamily: "PopinRegula",
                          }}
                        >
                          Reset all filters
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                       activeOpacity={1}
                        onPress={() => handleSubmit()}
                        style={{
                          backgroundColor: Colors.light.red,
                          borderRadius: ms(10),
                          paddingHorizontal: hs(20),
                          paddingVertical: vs(10),
                          width: hs(170),
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: ms(16),
                            fontWeight: 700,
                            fontFamily: "PopinRegula",
                          }}
                        >
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
          <Loading text="Prefrence setting" isLoading={PropertyLoading} />
          <Loading text="Loading..." isLoading={propertyprefLoading} />
          <Loading isLoading={resetPropertyLoading} text="Loading..." />
        </ScrollView>
      );
      break;
    case "Community":
      return (
        <ScrollView className="flex-1 bg-white">
          <View>
            <HeaderWithBack title="Set Your Community Preferences" />
            <View style={styles.card}>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  user_id: user.id,

                  location: communityData?.data?.location || "",
                  zip:communityData?.data?.zip|| "",
                  state:communityData?.data?.state || "",
                  radius:communityData?.data?.radius||"",

                  community_type: communityData?.data?.community_type || "",
                  community_status: communityData?.data?.community_status || "",

                  min_price: communityData?.data?.min_price
                    ? String(communityData.data.min_price)
                    : "",

                  max_price: communityData?.data?.max_price
                    ? String(communityData.data.max_price)
                    : "",
                }}
                onSubmit={async (values) => {
                  try {
                    const result = await setCommunityPrefrence(values);

                    if (result?.data?.success) {
                      renderToastSuccess(result.data.message);
                      router.back();
                    } else {
                      renderToastError(
                        result?.data?.message || "Something went wrong"
                      );
                    }
                  } catch (error) {
                    renderToastError("Server error");
                  }
                }}
                validationSchema={communityPreferenceSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  resetForm,
                  values,
                  errors,
                  touched,
                }) => (
                  <>
                               <DealingAreaswithRadius
                      city="dealing_city"
                      onSelect={() => {}}
                      state="state"
                      title="Locations"
                      value={values.location}
                      touched={!!touched.location}
                      errors={!!errors.location}
                      name="location"
                      zip="zip"
                      setValue={setFieldValue}
                      errorText={errors.location}
                      placeholder="Please enter City, State or Zip code"
                       radius="radius"
                      radiusValue={values.radius}
                    />
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <Text
                      style={{
                        width: hs(250),
                        fontWeight: 700,
                        marginTop: vs(10),
                        fontFamily: "PopinRegula",
                      }}
                    >
                      Community type
                    </Text>
                    <View
                      className="flex-row flex-wrap"
                      style={{ marginTop: vs(10), marginBottom: vs(20) }}
                    >
                      {/*  Residential */}
                      <View className="flex-row items-center">
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Residential",
                              values.community_type,
                              setFieldValue,
                              "community_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.community_type?.includes("Residential")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Residential
                        </Text>
                      </View>

                      {/* Commercial */}
                      <View
                        className="flex-row items-center"
                        style={{ marginLeft: hs(20) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Commercial",
                              values.community_type,
                              setFieldValue,
                              "community_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.community_type?.includes("Commercial")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Commercial
                        </Text>
                      </View>

                      {/*  Mix */}
                      <View
                        className="flex-row items-center"
                        style={{ marginLeft: hs(20) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Mix",
                              values.community_type,
                              setFieldValue,
                              "community_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.community_type?.includes("Mix")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Mix
                        </Text>
                      </View>
                    </View>
                    {touched.community_type && errors.community_type && (
                      <Text
                        style={{
                          color: Colors.light.red,
                          fontFamily: "PopinRegula",
                        }}
                      >
                        {errors.community_type}
                      </Text>
                    )}
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <Text
                      style={{
                        width: hs(250),
                        fontWeight: 700,
                        marginTop: vs(10),
                        fontFamily: "PopinRegula",
                      }}
                    >
                      Development Stage
                    </Text>

                    <View
                      className="flex-row flex-wrap"
                      style={{ marginTop: vs(10), marginBottom: vs(20) }}
                    >
                      {/* Completed */}
                      <View className="flex-row items-center">
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Completed",
                              values.community_status,
                              setFieldValue,
                              "community_status"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.community_status?.includes("Completed")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Completed
                        </Text>
                      </View>

                      {/* Constructed */}
                      <View
                        className="flex-row items-center"
                        style={{ marginLeft: hs(20) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Constructed",
                              values.community_status,
                              setFieldValue,
                              "community_status"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.community_status?.includes("Constructed")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Constructed
                        </Text>
                      </View>

                      {/* Inplanning */}
                      <View
                        className="flex-row items-center"
                        style={{ marginLeft: hs(20) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "Inplanning",
                              values.community_status,
                              setFieldValue,
                              "community_status"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.community_status?.includes("Inplanning")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Inplanning
                        </Text>
                      </View>
                    </View>

                    {/* Error */}
                    {touched.community_status && errors.community_status && (
                      <Text
                        style={{
                          color: Colors.light.red,
                          fontFamily: "PopinRegula",
                        }}
                      >
                        {errors.community_status}
                      </Text>
                    )}

                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <Text
                      style={{ fontWeight: 500, fontFamily: "PopinRegula" }}
                    >
                      Price Range
                    </Text>
                    <View className="flex-row justify-between items-start gap-3">
                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Minimun"
                          placeholder="No Selection"
                          value={values.min_price}
                          touched={!!touched.min_price}
                          errors={!!errors.min_price}
                          required
                          openDirection="TOP"
                          errorText={errors.min_price}
                        options={[
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
]}
                          onSelect={(value) => {
                            setFieldValue("min_price", value);
                          }}
                        />
                      </View>

                      <View className="flex-1">
                        <FormikDropdownwithjson
                          title="Maximun"
                          placeholder="No Selction"
                          value={values.max_price}
                          touched={!!touched.max_price}
                          errors={!!errors.max_price}
                          required
                          openDirection="TOP"
                          errorText={errors.max_price}
                         options={[
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
]}
                          onSelect={(value) =>
                            setFieldValue("max_price", value)
                          }
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <View className="flex-row justify-between">
                      <TouchableOpacity
                       activeOpacity={1}
                        style={{
                          backgroundColor: Colors.light.lightGray,
                          borderRadius: ms(10),
                          paddingHorizontal: hs(10),
                          paddingVertical: vs(10),
                          width: ms(120),
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.light.DarkGreen,
                            fontWeight: 700,
                            fontFamily: "PopinRegula",
                          }}
                          onPress={async () => {
                            const formatdata = new FormData();
                            formatdata.append("user_id", user.id.toString());
                            try {
                              const result = await ResetCommunity(
                                formatdata
                              ).unwrap();

                              if (result?.success) {
                                renderToastSuccess(result?.message);
                                resetForm();
                                refetchCommunityPreference();
                              } else {
                                renderToastError(result?.message);
                              }
                            } catch (error) {
                              renderToastError(error?.data?.message);
                            }
                          }}
                        >
                          Reset all filters
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                       activeOpacity={1}
                        onPress={() => {
                          handleSubmit();
                          console.log(errors);
                        }}
                        style={{
                          backgroundColor: Colors.light.red,
                          borderRadius: ms(10),
                          paddingHorizontal: hs(20),
                          paddingVertical: vs(10),
                          width: hs(180),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: ms(16),
                            fontWeight: 700,
                            fontFamily: "PopinRegula",
                          }}
                        >
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
          <Loading isLoading={CommunityLoading} text="Setting Prefrence" />
          <Loading isLoading={communityprefLoading} text="Loading" />
          <Loading isLoading={resetCommunityLoading} text="Loading..." />
        </ScrollView>
      );
      break;
    case "Connection":
      return (
        <ScrollView className="flex-1 bg-white">
          <View>
            <HeaderWithBack title="Set Your Connection Preferences" />
            <View style={styles.card}>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  location: data?.data?.location ?? "",
                  user_type: data?.data?.user_type ?? "",
                  user_id: user.id,
                     zip:data?.zip|| "",
                  state:data?.state || "",
                  radius:data?.radius||"",
                  dealing_city:data?.dealing_city||"",
                }}
                onSubmit={async (values) => {
                  try {
                        console.log("Form Values:", values);
                    const result = await setConnectionPrefrence(values);

                    if (result?.data?.success) {
                      renderToastSuccess(result.data.message);
                      router.back();
                    } else {
                      renderToastError(
                        result?.data?.message || "Something went wrong"
                      );
                    }
                  } catch (error) {
                    renderToastError("Server error");
                  }
                }}
                validationSchema={connectionPreferenceSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                  resetForm,
                }) => (
                  <>
                    <DealingAreaswithRadius
                      city="dealing_city"
                      onSelect={() => {}}
                      state="state"
                      title="Locations"
                      value={values.location}
                      touched={!!touched.location}
                      errors={!!errors.location}
                      name="location"
                      zip="zip"
                      setValue={setFieldValue}
                      errorText={errors.location}
                      placeholder="Please enter City, State or Zip code"
                      radius="radius"
                      radiusValue={values.radius}
                    />
                    <Text
                      style={{
                        width: hs(250),
                        marginTop: vs(20),
                        fontWeight: 700,
                        fontSize: ms(14),
                        fontFamily: "PopinRegula",
                      }}
                    >
                      Connection Type
                    </Text>
                    <View
                      className=" "
                      style={{ marginTop: vs(10), marginBottom: vs(20) }}
                    >
                      {/*  Electricians */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "electrician",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("electrician")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Electricians
                        </Text>
                      </View>

                      {/* Builder */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "builder",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("builder")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Builder
                        </Text>
                      </View>

                      {/*  Property agents */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "agent",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("agent")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Property agents
                        </Text>
                      </View>
                      {/*  Plumbers */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "plumber",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("plumber")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Plumbers
                        </Text>
                      </View>
                      {/*  Mortgage */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "mortgage",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("mortgage")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Mortgage Advisors
                        </Text>
                      </View>
                      {/*  Decors */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "decor",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("decor")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Decors
                        </Text>
                      </View>
                      {/*  Painters */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "painter",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("painter")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Painters
                        </Text>
                      </View>
                      {/*  Investors */}
                      <View
                        className="flex-row items-center"
                        style={{ marginVertical: vs(5) }}
                      >
                        <TouchableOpacity
                         activeOpacity={1}
                          onPress={() =>
                            toggleStatus(
                              "investor",
                              values.user_type,
                              setFieldValue,
                              "user_type"
                            )
                          }
                        >
                          <MaterialIcons
                            size={25}
                            color={Colors.light.DarkGreen}
                            name={
                              values.user_type?.includes("investor")
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: hs(5),
                            fontSize: ms(15),
                            fontFamily: "PopinRegula",
                          }}
                        >
                          {" "}
                          Investors
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: vs(1),
                        marginTop: vs(20),
                        marginBottom: vs(10),
                        backgroundColor: Colors.light.textGray,
                        opacity: 0.2,
                      }}
                    />
                    <View className="flex-row justify-between">
                      <TouchableOpacity
                       activeOpacity={1}
                        style={{
                          backgroundColor: Colors.light.lightGray,
                          borderRadius: ms(10),
                          paddingHorizontal: hs(10),
                          paddingVertical: vs(10),
                          width: ms(120),
                        }}
                        onPress={async () => {
                          const formatdata = new FormData();
                          formatdata.append("user_id", user.id.toString());
                          try {
                            const result = await ResetConnection(
                              formatdata
                            ).unwrap();

                            if (result?.success) {
                              renderToastSuccess(result?.message);
                              resetForm();
                              refetchConnectionPreference();
                            } else {
                              renderToastError(result?.message);
                            }
                          } catch (error) {
                            renderToastError(error?.data?.message);
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.light.DarkGreen,
                            fontWeight: 700,
                            fontFamily: "PopinRegula",
                          }}
                        >
                          Reset all filters
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                       activeOpacity={1}
                        onPress={() => {
                          handleSubmit();
                          console.log(errors);
                        }}
                        style={{
                          backgroundColor: Colors.light.red,
                          borderRadius: ms(10),
                          paddingHorizontal: hs(20),
                          paddingVertical: vs(10),
                          width: hs(180),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: ms(16),
                            fontWeight: 700,
                            fontFamily: "PopinRegula",
                          }}
                        >
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
          <Loading isLoading={ConnectionLoading} text="Setting Prefrence ..." />
          <Loading isLoading={conectioLoading} text="Loading..." />
          <Loading isLoading={resetConnectionLoading} text="Loading..." />
        </ScrollView>
      );
      break;
  }
};

export default index;
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginTop: vs(20),
    elevation: 5,
    marginHorizontal: hs(10),
    borderRadius: ms(20),
    paddingHorizontal: hs(10),
    paddingVertical: vs(20),
    marginBottom: vs(10),
  },
});
