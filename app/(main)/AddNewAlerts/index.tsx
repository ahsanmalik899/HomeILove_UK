import {
  useGetUserAlertsEditQuery,
  useSaveAllertsMutation
} from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import { AdressInput } from "@src/components/globals/AddressInput";
import { FormikDropdown } from "@src/components/globals/FormikDropdown/indes";
import { FormikDropdownwithjson } from "@src/components/globals/FormikDropdownwithjson";
import HeaderWithBack from "@src/components/globals/HeaderWithBack";
import LargeButton from "@src/components/globals/LaregeButton";
import Loading from "@src/components/globals/Loading";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms } from "@utils/design/design";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import * as Yup from "yup";
const index = () => {
  const user = useAppSelector(userdata);
  const params = useLocalSearchParams();
  const editmode = params?.edit;
  const [setAllert, { isLoading }] = useSaveAllertsMutation();
  const { data, isFetching } = useGetUserAlertsEditQuery({ id: params?.id, type: "" },{skip:!params?.id||!editmode});
  const AddAlertSchema = Yup.object().shape({
    alert_id: Yup.number().nullable(),
    address: Yup.string().nullable(),
    lat: Yup.number().nullable(),
    lng: Yup.number().nullable(),
    city: Yup.string().nullable(),
    state: Yup.string().nullable(),
    zip_code: Yup.string().nullable(),
    radius: Yup.number().nullable(),

    alert_for: Yup.string().required("Alert for is required"),

    // Conditional community_type
    community_type: Yup.string().when(["alert_for"], ([alert_for], schema) =>
      alert_for === "community"
        ? schema.required("Community type is required")
        : schema.nullable()
    ),

    // Conditional property_type
    property_type: Yup.string().when(["alert_for"], ([alert_for], schema) =>
      alert_for === "sale" || alert_for === "rent"
        ? schema.required("Property type is required")
        : schema.nullable()
    ),

    // Conditional property_subtype
    property_subtype: Yup.string().when(["alert_for"], ([alert_for], schema) =>
      alert_for === "sale" || alert_for === "rent"
        ? schema.required("Property sub-type is required")
        : schema.nullable()
    ),

    min_price: Yup.number()
      .typeError("Please enter a valid minimum price")
      .min(0, "Minimum price cannot be negative")
      .nullable(),

    max_price: Yup.number()
      .typeError("Please enter a valid maximum price")
      .min(
        Yup.ref("min_price"),
        "Maximum price must be greater than minimum price"
      )
      .nullable(),

    beds: Yup.number()
      .typeError("Please enter a valid number of beds")
      .min(0, "Beds cannot be negative")
      .nullable(),
  });

  return (
    <ScrollView>
      <View className="flex-1 bg-white">
        <HeaderWithBack title="Add Alerts" />
        <View style={{ marginHorizontal: hs(20) }}>
          <Text style={{ fontSize: ms(20), fontWeight: 600,fontFamily: "PopinRegula", }}>
            Create<Text style={{ color: Colors.light.red,fontFamily: "PopinRegula", }}> Alert </Text>for
            your home move
          </Text>
          <Formik
          enableReinitialize={true}
            initialValues={{
              user_id: user.id,
              address: data?.data?.[0]?.address || "",
              lat: data?.data?.[0]?.latitude || "",
              lng: data?.data?.[0]?.longitude || "",
              city: data?.data?.[0]?.city || "",
              state: data?.data?.[0]?.state || "",
              zip_code: data?.data?.[0]?.zip || "",
              radius:Number( data?.data?.[0]?.radius) || "",

              alert_for: data?.data?.[0]?.alert_for || "",
              property_type: data?.data?.[0]?.property_type || "",
              property_subtype: data?.data?.[0]?.property_subtype || "",
              community_type: data?.data?.[0]?.community_type || "",

              min_price: data?.data?.[0]?.min_price || "",
              max_price: data?.data?.[0]?.max_price || "",
              beds: data?.data?.[0]?.beds.toString() || "",
              alert_id: data?.data?.[0]?.alert_id || null,
            }}
            validationSchema={AddAlertSchema}
            onSubmit={async (values) => {
              try {
                const formData = new FormData();

                Object.keys(values).forEach((key) => {
                  let value = values[key as keyof typeof values];
                  if (value === null || value === undefined) value = "";
                  if (Array.isArray(value)) value = value.join(",");
                  formData.append(key, String(value));
                });
                formData.append("edit", editmode?"1":"0");
                if(editmode){
                  formData.append("alert_id", params?.id.toString() || "");
                }
                const result = await setAllert(formData);

                if (result?.data?.success) {
                  router.replace("/SetAlerts");
                  renderToastSuccess(
                    result.data?.message || "Alert created successfully"
                  );
                } else {
                  renderToastError(
                    result?.data?.message || "Something went wrong"
                  );
                }
              } catch (error) {
                console.error("Alert submission error:", error);
                renderToastError("An unexpected error occurred");
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <>
                <View className="flex-row justify-between items-start gap-3">
                  <View className="flex-1">
                    <AdressInput
                      city={"city"}
                      zip={"zip_code"}
                      state={"state"}
                      lat={"lat"}
                      long={"lng"}
                      withmap={false}
                      latValue={Number(values.lat)}
                      longValue={Number(values.lng)}
                      name="address"
                      setValue={setFieldValue}
                      onSelect={() => {}}
                      title="Property Location"
                      placeholder="Enter complete address or street"
                      value={values.address}
                      touched={!!touched.address}
                      errors={!!errors.address}
                      required={false}
                      errorText={errors.address}
                    />
                  </View>

                  <View className="flex-1">
                    <FormikDropdownwithjson
                      title={"Radius"}
                      placeholder={"Radius (miles)"}
                      required={false}
                      value={values.radius}
                      options={[
                        { label: "1 mile", value: 1 },
                        { label: "5 miles", value: 5 },
                        { label: "10 miles", value: 10 },
                        { label: "20 miles", value: 20 },
                        { label: "30 miles", value: 30 },
                        { label: "40 miles", value: 40 },
                        { label: "50 miles", value: 50 },
                      ]}
                      name="radius"
                      touched={!!touched.radius}
                      errors={!!errors.radius}
                      errorText={errors.radius}
                      onSelect={() => {}}
                      setValue={setFieldValue}
                    />
                  </View>
                </View>
                <FormikDropdownwithjson
                  title="Alert For"
                  placeholder="Select Type"
                  value={values.alert_for}
                  touched={!!touched.alert_for}
                  errors={!!errors.alert_for}
                  required
                  errorText={errors.alert_for}
                  options={[
                    { label: "Buy", value: "sale" },
                    { label: "Rent", value: "rent" },
                    { label: "Community", value: "community" },
                  ]}
                  name="alert_for"
                  setValue={setFieldValue}
                  onSelect={(val) => {
                            if (val === "community") {
      setFieldValue("property_type", "");
      setFieldValue("property_subtype", "");
       setFieldValue("beds", 0);
    } else {
      setFieldValue("community_type", "");
    }
                  }}
                />
                {values.alert_for && values.alert_for === "community" && (
                  <FormikDropdownwithjson
                    title="Community Type"
                    placeholder="Select Type"
                    value={values.community_type}
                    touched={!!touched.community_type}
                    errors={!!errors.community_type}
                    required
                    errorText={errors.community_type}
                    options={[
                      { label: "Residential", value: "House" },
                      { label: "Commercial", value: "Commercials" },
                      { label: "Mix", value: "Farms/Lands" },
                    ]}
                    name="community_type"
                    setValue={setFieldValue}
                    onSelect={() => {}}
                  />
                )}
                {values.alert_for && values.alert_for !== "community" && (
                  <View className="flex-row justify-between items-start gap-3">
                    <View className="flex-1">
                      <FormikDropdown
                        key={"propertytype"}
                        onSelect={(value) => {
                          setFieldValue("property_type", value);
                          setFieldValue("property_subtype", "");
                     
                        }}
                        options={["House", "Commercial", "Farms/Lands"]}
                        title="Property Type "
                        placeholder="Select"
                        value={values.property_type}
                        touched={!!touched}
                        errors={!!errors}
                        required
                        errorText={errors.property_type}
                      />
                    </View>
                    <View className="flex-1 ">
                      <FormikDropdown
                        title={"Sub-type"}
                        key={values.property_type}
                        setValue={setFieldValue}
                        touched={!!touched}
                        errors={!!errors}
                        errorText={errors.property_subtype}
                        placeholder="Property sub type"
                        value={values.property_subtype}
                        required
                        options={
                          values.property_type === "House"
                            ? [
                                "Detached house",
                                "Semi-detached house",
                                "Town house Condo",
                                "Bungalow Co-op",
                                "Flats/ Apartments Condop",
                                "Penthouse",
                                "Park homes",
                                "Others",
                              ]
                            : values.property_type === "Commercial"
                            ? [
                                "office",
                                "office workspace",
                                "Retail properties",
                                "Leisure / Hospitality",
                                "Others",
                              ]
                            : [
                                "Land",
                                "Commercial development",
                                "Industrial development",
                                "Residential development",
                                "Farms",
                              ]
                        }
                        name="property_subtype"
                        onSelect={() => {}}
                      />
                    </View>
                  </View>
                )}
                <View className="flex-row justify-between items-start gap-3">
                  <View className="flex-1">
                    <FormikDropdownwithjson
                      title={values.alert_for==="rent"?"Minimun rent":"Minimum price"}
                      placeholder="No Selection"
                      value={values.min_price}
                      touched={!!touched.min_price}
                      errors={!!errors.min_price}
                      required={false}
                      errorText={errors.min_price}
                      options={[
                        { label: "No selection", value: "" },
                        { label: "below £ 50,000", value: 0 },
                        { label: "£ 50,000", value: 50000 },
                        { label: "£ 70,000", value: 70000 },
                        { label: "£ 100,000", value: 100000 },
                        { label: "£ 120,000", value: 120000 },
                        { label: "£ 150,000", value: 150000 },
                        { label: "£ 175,000", value: 175000 },
                        { label: "£ 200,000", value: 200000 },
                        { label: "£ 250,000", value: 250000 },
                        { label: "£ 300,000", value: 300000 },
                        { label: "£ 350,000", value: 350000 },
                        { label: "£ 400,000", value: 400000 },
                        { label: "£ 500,000", value: 500000 },
                        { label: "£ 600,000", value: 600000 },
                        { label: "£ 700,000", value: 700000 },
                        { label: "£ 900,000", value: 900000 },
                        { label: "£ 1,000,000", value: 1000000 },
                        { label: "£ 1,200,000", value: 1200000 },
                        { label: "£ 1,500,000", value: 1500000 },
                        { label: "£ 2,000,000", value: 2000000 },
                        { label: "£ 3,000,000", value: 3000000 },
                      ]}
                      onSelect={(value) => {
                        setFieldValue("min_price", value);
                      }}
                    />
                  </View>

                  <View className="flex-1">
                    <FormikDropdownwithjson
                      title={values.alert_for==="rent"?"Maximun rent":"Maximun price"}
                      placeholder="No Selction"
                      value={values.max_price}
                      touched={!!touched.max_price}
                      errors={!!errors.max_price}
                      required={false}
                      errorText={errors.max_price}
                      options={[
                        { value: "", label: "No selection" },
                        { value: 50000, label: "£ 50,000" },
                        { value: 70000, label: "£ 70,000" },
                        { value: 100000, label: "£ 100,000" },
                        { value: 120000, label: "£ 120,000" },
                        { value: 150000, label: "£ 150,000" },
                        { value: 175000, label: "£ 175,000" },
                        { value: 200000, label: "£ 200,000" },
                        { value: 250000, label: "£ 250,000" },
                        { value: 300000, label: "£ 300,000" },
                        { value: 350000, label: "£ 350,000" },
                        { value: 400000, label: "£ 400,000" },
                        { value: 500000, label: "£ 500,000" },
                        { value: 600000, label: "£ 600,000" },
                        { value: 700000, label: "£ 700,000" },
                        { value: 900000, label: "£ 900,000" },
                        { value: 1000000, label: "£ 1,000,000" },
                        { value: 1200000, label: "£ 1,200,000" },
                        { value: 1500000, label: "£ 1,500,000" },
                        { value: 2000000, label: "£ 2,000,000" },
                        { value: 3000000, label: "£ 3,000,000" },
                        { value: 3000001, label: "Above £ 3,000,000" },
                      ]}
                      onSelect={(value) => setFieldValue("max_price", value)}
                    />
                  </View>
                </View>
{values.alert_for!=="community"&&(
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
                  title="Beds"
                  name="beds"
                  setValue={setFieldValue}
                  placeholder="Beds"
                  value={values.beds}
                  touched={!!touched.beds}
                  errors={!!errors.beds}
                  required={false}
                  errorText={errors.beds}
                />)}
                <View className="my-4 flex-bottom">
                  <LargeButton
                    handleSubmit={() => {
                      handleSubmit();
                      console.log(errors);
                    }}
                    text="Create alert"
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
      <Loading isLoading={isLoading} text="Updateing Alerts..." />
      <Loading isLoading={isFetching} text="Loading..." />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
