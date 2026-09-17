import {
  useCalculateLoanApiMutation,
  useGetLoanInterestRateQuery,
  useGetSinglePostQuery,
  useLazyGetRandomAdQuery,
  useSaveItemApiMutation,
  useSendVisistRequestMutation,
  useShareDetailPostApiMutation,
  useUnsaveItemApiMutation
} from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import CommunitySatatus from "@assets/CreateProfile/construction-house.svg";
import Cross from "@assets/CreateProfile/cross.svg";
import RedHeart from "@assets/CreateProfile/heart-red.svg";
import Camera from "@assets/Feedimg/camera.svg";
import Heart from "@assets/icons/heart.svg";
import Area from "@assets/icons/MypostListing/area.svg";
import Bed from "@assets/icons/MypostListing/bed.svg";
import Shower from "@assets/icons/MypostListing/shower.svg";
import Share from "@assets/icons/share.svg";
import VerticalLine from "@assets/icons/verticalLine.svg";
import CommunityType from "@assets/SideBar/commercialGreen.svg";
import NoImage from "@assets/SideBar/no_images.png";
import { Ionicons } from "@expo/vector-icons";
import CircleImage from "@src/components/globals/CircleImage/CircleImage";
import DatePickerField from "@src/components/globals/DatePickerField";
import { FormikInput } from "@src/components/globals/FormictInput";
import HeaderWithBack from "@src/components/globals/HeaderWithBack";
import ImageSlider from "@src/components/globals/ImageSlider";
import LargeButton from "@src/components/globals/LaregeButton";
import Loading from "@src/components/globals/Loading";
import StarRating from "@src/components/globals/StarRating";
import TimePickerField from "@src/components/globals/TimePickerField";
import VideoSection from "@src/components/globals/ViedioSection";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import { formatPrice } from "@utils/PriceFormater";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FlashList } from "@shopify/flash-list";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { FormikDropdownwithjson } from "../FormikDropdownwithjson";
import ProfileSingleView from "../ProfileSingleView";
import SavedItems from "../SavedItems";

export default function AddSingleView({id,type,setshowModel,  onSavedChange,}: {id:number,type:string,setshowModel:(val:boolean)=>void,  onSavedChange?: (isSaved: boolean) => void;}) {


  const formatPdfUrl = (file: string) => {
    return ImageFormater(file);
  };

  const openPDF = async (url: string) => {
    const googleViewer = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url
    )}`;
    await WebBrowser.openBrowserAsync(googleViewer, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  };
 const user = useAppSelector(userdata);

  const [imageNo, setImageNo] = useState(0);
  const [ getRandomAd, { data: randomAdData, isFetching: randomAdFetching }] = useLazyGetRandomAdQuery();
  const [sendVisistRequies, { isLoading }] = useSendVisistRequestMutation();
    const [profileData, setprofileData] = useState(null);
    const [showSaved, setShowSaved] = useState(false);
  const [singleView, setSingleView] = useState(false);
    const [isSaved,setIsSaved]=useState(false);
  useEffect(() => {
    getRandomAd({on_page:type+'_single'})
  }, [type]);
  const { data, isFetching } = useGetSinglePostQuery({ type, id,user_id:user?.id });
  const [showImages, setShowImages] = useState(false);
  const [showFloor, setShowFloor] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const latitude = parseFloat(data?.post?.lat);
  const longitude = parseFloat(data?.post?.lng);
  const [showShare, setShowShare] = useState(false);
  const showMap = !isNaN(latitude) && !isNaN(longitude);
  const facts = data?.post?.imp_facts ?? data?.post?.facts ?? "";
     const [calculateLoanApi, { isLoading: calculatingLoan }] =
  useCalculateLoanApiMutation();
     const [saveItemApi] = useSaveItemApiMutation();
            const [unsaveItemApi] = useUnsaveItemApiMutation();
    const [shareDetailPostApi, { isLoading: sharing }] = useShareDetailPostApiMutation();
  const visitAdSchema = Yup.object().shape({
    visitor_email: Yup.string()
      .email("Enter a valid email address")
      .required("Visitor email is required"),

    receiver_email: Yup.string()
      .email("Enter a valid email address")
      .required("Receiver email is required"),

    visitor_name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),

    visitor_contact: Yup.string()
      .min(7, "Contact number is too short")
      .max(20, "Contact number is too long")
      .required("Contact number is required"),

    visitor_message: Yup.string()
      .max(500, "Message cannot exceed 500 characters")
      .nullable(),

    visit_date: Yup.date().required("Visit date is required"),

    visit_time: Yup.string().required("Visit time is required"),

    post_id: Yup.number()
      .typeError("Invalid post")
      .required("Post ID is required"),

    type: Yup.string().nullable(),

    ad_type: Yup.string().oneOf(["sale", "rent"]).nullable(),

    link: Yup.string().url("Invalid link").nullable(),
  });
const handleLoanCalculation = async (
  yearValue?: number,
  downPaymentValue?: string
) => {
  try {
    const propertyValue = Number(
      String(data?.post?.asking_price ?? 0).replace(/,/g, "")
    );

    const finalYear = Number(yearValue ?? selectedYear);

    const finalDownPayment = Number(
      String(downPaymentValue ?? downPayment)
        .replace(/,/g, "")
        .trim()
    );

    if (!propertyValue || propertyValue <= 0) {
      renderToastError("Invalid property value");
      return;
    }

    if (!finalDownPayment || finalDownPayment < 0) {
      renderToastError("Please enter a valid down payment");
      return;
    }

    if (finalDownPayment >= propertyValue) {
      renderToastError(
        "Down payment must be less than property value"
      );
      return;
    }

    if (!finalYear || finalYear < 1) {
      renderToastError("Please select repayment period");
      return;
    }

    const response = await calculateLoanApi({
      property_value: propertyValue,
      down_payment: finalDownPayment,
      year: finalYear,
    }).unwrap();

    console.log("LOAN RESPONSE:", response);

    if (response?.success) {
      setMonthlyPayment(
        Number(response?.data?.monthly_payment ?? 0)
      );
    } else {
      renderToastError(
        response?.message || "Unable to calculate mortgage"
      );
    }
  } catch (error: any) {
    console.log("LOAN ERROR:", error);

    renderToastError(
      error?.data?.message ||
        error?.message ||
        "Unable to calculate mortgage"
    );
  }
};
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
const rotateAnim = useRef(new Animated.Value(0)).current;
const toggleSave = async () => {
  const nextSavedValue = !isSaved;

  try {
    if (isSaved) {
      await unsaveItemApi({
        saved_id: id,
        user_id: user.id,
        type,
      }).unwrap();
    } else {
      await saveItemApi({
        saved_id: id,
        user_id: user.id,
        type,
      }).unwrap();
    }

    // Single view update
    setIsSaved(nextSavedValue);

    // Parent listing cache update
    onSavedChange?.(nextSavedValue);
  } catch (error) {
    console.log("Error saving/unsaving item:", error);
  }
};
useEffect(() => {
  Animated.timing(scaleAnim, {
    toValue: 1,
    duration: 500,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  }).start();
  Animated.loop(
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
 useEffect(() => {
    if (data?.is_saved !== undefined) {
      setIsSaved(data?.is_saved);
    }
  }, [data?.is_saved]);
const rotate = rotateAnim.interpolate({
  inputRange: [-1, 1],
  outputRange: ["-2deg", "2deg"],
});
 const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
 const [downPayment, setDownPayment] = useState("");
 const {
  data: interestRateData,
  isFetching: interestRateLoading,
} = useGetLoanInterestRateQuery();
const [selectedYear, setSelectedYear] = useState<number | string>("");
const [loanData, setLoanData] = useState<any>(null);
const interestRate =
  Number(interestRateData?.data?.interest_rate ?? 0);
  return (
    <>
      <ScrollView className="flex-1 bg-white"   keyboardShouldPersistTaps="handled">
        <HeaderWithBack  onBackpress={()=>{setshowModel(false)}}  isSavedItem onpressSave={()=>setShowSaved(true)}
        />
        {randomAdData?.data?.ad_link&&(
      <Animated.View
  style={[
    styles.adCard,
    {
      transform: [
        { scale: scaleAnim },
        { rotateZ: rotate },
      ],
    },
  ]}
><TouchableOpacity 
 activeOpacity={1}
 onPress={() => {
  if(randomAdData?.data?.ad_link){
    const finalUrl = randomAdData.data.ad_link.startsWith("https")
      ? randomAdData.data.ad_link
      : `https://${randomAdData.data.ad_link}`;
    WebBrowser.openBrowserAsync(finalUrl);
  }
}}>
  <Image
    source={{
      uri: ImageFormater(randomAdData?.data?.ad_image),
    }}
    style={styles.adImage}
    resizeMode="contain"
  />
  </TouchableOpacity>
</Animated.View>)}
        <View
          className="flex-1"
          style={{ marginHorizontal: hs(10), paddingVertical: vs(5) }}
        >
          <View style={{backgroundColor:Colors.light.LightGreen,paddingHorizontal: hs(5),borderRadius:ms(10),height:vs(50),justifyContent:"center"}}>
             {type === "community" ? (
            <>
             {data?.post?.community_price?.length > 0 && (
                <Text style={{ color: Colors.light.red,  fontWeight: 700,
                  fontSize:ms(18),fontFamily: "PopinRegula", }}>
                  From C$ {formatPrice(data.post.community_price[0])} To C${" "}
                  {
                    formatPrice(
                    data.post.community_price[
                      data.post.community_price.length - 1
                    ])
                  }
                </Text>
                
              )}</>):( 
                <Text
                style={{
                  color: Colors.light.red,
                   fontWeight: 700,
                                    fontSize:ms(18),
                  marginLeft: 8,
                  fontFamily: "PopinRegula",
                }}
              >
                C$ {formatPrice(data?.post?.asking_price ?? 0)}
                {type === "rent" ? `/${data?.post?.rent_type ?? ""}` : ""}
              </Text>)}
</View>
          <TouchableOpacity
           activeOpacity={1}
            className="mt-4"
            onPress={() => {
              setShowImages(true);
            }}
          >
            <Image
              source={
                data?.post_images && data?.post_images.length > 0
                  ? { uri: ImageFormater(data?.post_images[0]) }
                  : NoImage
              }
              style={{
                height: vs(300),
                width: "100%",
                borderRadius: ms(10),
                resizeMode: "cover",
                alignSelf: "center",
                backgroundColor: "gray",
              }}
            />
            
            {type !== "community" && data?.floor_images.length > 0 && (
              <TouchableOpacity
               activeOpacity={1}
                style={{
                  position: "absolute",
                  bottom: vs(5),
                  right: hs(10),
                  paddingHorizontal: hs(8),
                  paddingVertical: vs(8),
                  borderRadius: ms(10),
                  alignItems: "center",
                  backgroundColor: "rgba(29, 29, 29, 0.27)",
                }}
                className="flex-row"
                onPress={() => setShowFloor(true)}
              >
                <Text style={{ color: "white", fontWeight: 600,fontFamily: "PopinRegula", }}>
                  Floor Images{" "}
                  {data?.floor_images ? data?.floor_images.length : 0}
                </Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                position: "absolute",
                bottom: vs(5),
                left: hs(10),
                alignItems: "center",
              }}
              className="flex-row,flex-1"
            >
              <Camera />
              <Text style={{ color: "white", fontWeight: 600,fontFamily: "PopinRegula", }}>
                {data?.post_images ? data?.post_images.length : 0}
              </Text>
            </View>
          </TouchableOpacity>
        <FlashList
  data={data?.post_images || []}
  horizontal
  style={{ flex: 1 }}
  keyExtractor={(item, index) => `${item}-${index}`}
  showsHorizontalScrollIndicator={false}
  renderItem={({ item, index }) => (
    <TouchableOpacity
     activeOpacity={1}
      className="mt-4 mr-2"
      onPress={() => {
        setImageNo(index);
        setShowImages(true);
      }}
    >
      <Image
        source={{ uri: ImageFormater(item) }}
        style={{
          height: vs(80),
          width: vs(80),
          borderRadius: ms(10),
          resizeMode: "cover",
          backgroundColor: "gray",
        }}
      />
    </TouchableOpacity>
  )}
/>
          <View
            className=" bg-white flex-row  justify-between"
            style={{
              elevation: 5,
              borderRadius: 8,
              paddingRight: hs(20),
              paddingVertical: vs(10),
              paddingHorizontal: vs(15),
              marginTop: vs(10),
              marginBottom: vs(10),
            }}
          >
            {type === "community" ? (
              <>
                <View className="flex-row items-center">
                  <CommunityType />
                  <Text style={{ marginLeft: vs(5),fontFamily: "PopinRegula", }}>
                    {data?.post.community_type}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <CommunitySatatus />
                  <Text style={{ marginLeft: vs(5),fontFamily: "PopinRegula", }}>
                    {data?.post?.community_status}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row items-center">
                  <Bed />
                  <Text style={{ marginLeft: vs(5),fontFamily: "PopinRegula", }}>
                    {data?.post?.bedrooms}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Shower />
                  <Text style={{ marginLeft: vs(5),fontFamily: "PopinRegula",}}>
                    {data?.post?.bathrooms}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Area />
                  <Text style={{ marginLeft: vs(5),fontFamily: "PopinRegula", }}>
                    {data?.post?.land_area} sqft
                  </Text>
                </View>
              </>
            )}
          </View>
           {type === "community" ? (
            <View className="flex-row justify-between mt-3">
              <Text style={{ color: "black",  fontWeight: 700,
                  fontSize:ms(18), flex: 1,fontFamily: "PopinRegula", }}>
                {data?.post?.community_title ?? ""}
              </Text>

            
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
              className="mt-3"
            >
              <Text style={{ color: "black",  fontWeight: 700,
                                fontSize:ms(18), flex: 1 ,fontFamily: "PopinRegula",}}>
                {data?.post?.bedrooms ?? 0} bedrooms{" "}
                {data?.post?.property_sub_type ?? ""} for{" "}
                {data?.post?.property_for ?? ""}
              </Text>

             
            </View>
          )}
          <View className="flex-row items-center justify-between mt-1">
            <Text
              className="flex-1 mr-2"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{fontFamily: "PopinRegula",}}
            >
              {data?.post?.address}
            </Text>

            <View className="flex-row ">
                 <TouchableOpacity
                  activeOpacity={1}
                   onPress={()=>toggleSave()} >
                            { isSaved ? (
                                                                  <RedHeart />
                                                                ) : (
                           <Heart />
                                                                )}
                         </TouchableOpacity>
              <TouchableOpacity 
               activeOpacity={1}
               onPress={() => setShowShare(true)}>
                <Share />
              </TouchableOpacity>
            </View>
          </View>
          {type !== "community" && (
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
              <Text style={styles.heading}>KEY PROPERTY FACTS</Text>
              <View>
                <View className="flex-row justify-between">
                  {type === "rent" ? (
                    <Text style={styles.card}>
                      Tenancy tenure:{" "}
                      <Text style={styles.textred}>
                        {data?.post?.tenancy_tenure}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.card}>
                      Ownership:{" "}
                      <Text style={styles.textred}>{data?.post?.tenure}</Text>
                    </Text>
                  )}

                  <Text style={styles.card}>
                    Condition:{" "}
                    <Text style={styles.textred}>
                      {data?.post?.property_condition}
                    </Text>
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text style={styles.card}>
                    Reception:{" "}
                    <Text style={styles.textred}>{data?.post?.reception}</Text>
                  </Text>
                  <Text style={styles.card}>
                    Home age:{" "}
                    <Text style={styles.textred}>{data?.post?.home_age} year</Text>
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text style={styles.card}>
                    {type === "rent" ? (
                      <>
                        Pet allowed:{" "}
                        <Text style={styles.textred}>
                          {data?.post?.pet_allowers}
                        </Text>
                      </>
                    ) : (
                      <>
                        Monthly HOA Fee:{" "}
                        <Text style={styles.textred}>
                          {data?.post?.house_charges}
                        </Text>
                      </>
                    )}
                  </Text>

                  <Text style={styles.card}>
                    Purpose:{" "}
                    <Text style={styles.textred}>{data?.post?.purpose}</Text>
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: type === "rent" ? "flex-start" : "center",
                    alignItems: "center",
                    flexDirection: type === "rent" ? "row" : "column",
                    gap: 20, // spacing between texts when in a row
                  }}
                >
                  <Text style={styles.card}>
                    Lot Size (Acres):{" "}
                    <Text style={styles.textred}>{data?.post?.lot_size}</Text>
                  </Text>

                  {type === "rent" && (
                    <Text style={styles.card}>
                      Furnishing Type:{" "}
                      <Text style={styles.textred}>
                        {data?.post?.furnishing_type}
                      </Text>
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}
          <View className="mt-5">
          {facts
            .split(",")
            .filter(Boolean)
            .map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card2,
                  {
                    
                    padding: ms(8),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: vs(5),
                  },
                ]}
              >
                <View className="flex-row gap-3 items-center">
                  <RedHeart />
                  <Text
                    style={{
                      color: Colors.light.DarkGreen,
                      fontSize: ms(15),
                      fontWeight: "500",
                      width: hs(250),
                      paddingVertical: vs(5),
                    }}
                  >
                    {item.trim()}
                  </Text>
                </View>
              </View>
            ))}
  </View>
          <Text style={[styles.description,{lineHeight:20}]} >
            {expanded
              ? type === "community"
                ? data?.post?.community_details
                : data?.post?.property_details
              : type === "community"
              ? data?.post.community_details?.slice(0, 300) +
                (data?.post?.community_details?.length > 300 ? "...." : "")
              : data?.post?.property_details?.slice(0, 300) +
                (data?.post?.property_details?.length > 300 ? "...." : "")}

            {(type === "Community"
              ? data?.post?.community_details?.length
              : data?.post?.property_details?.length) > 300 && (
              <Text
                style={styles.moreText}
                onPress={() => setExpanded(!expanded)}
              >
                {expanded ? " Show Less" : " Read More"}
              </Text>
            )}
          </Text>
          {data?.post?.expected_delivery && (
            <View>
              <View
                style={{
                  height: vs(1),
                  marginTop: vs(20),
                  marginBottom: vs(10),
                  backgroundColor: Colors.light.textGray,
                  opacity: 0.2,
                }}
              />
              <Text style={styles.heading}>Completion date</Text>
              <Text
                style={[
                  styles.card2,
                  {
                    backgroundColor: Colors.light.red,
                    color: "white",
                    textAlign: "center",
                    fontFamily: "PopinRegula",
                  },
                ]}
              >
                {data?.post?.expected_delivery}
              </Text>
            </View>
          )}
          {data?.post?.property_titles?.map((_, index) => (
            <View key={index} style={styles.card2}>
              <Text
                style={[styles.heading, {fontFamily: "PopinRegula", alignSelf: "center",width: "100%", backgroundColor:Colors.light.lightGray,padding:vs(15),textAlign:"center",fontFamily:"PopinBold",borderRadius:ms(5) }]}
                className="mb-4"
              >
                {data?.post?.property_titles[index]}
              </Text>

              <View className="flex-row justify-between">
                <Text style={{ fontFamily: "PopinRegula",color: Colors.light.textGray }}>
                  Property type
                </Text>
                <Text style={{ fontFamily: "PopinRegula",fontWeight: 600 }}>
                  {data?.post?.property_types[index]}
                </Text>
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
                <Text style={{ fontFamily: "PopinRegula",color: Colors.light.textGray }}>
                  Property sub-type
                </Text>
                <Text style={{ fontFamily: "PopinRegula",fontWeight: 600 }}>
                  {data?.post?.property_sub_types[index]}
                </Text>
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
                <Text style={{ fontFamily: "PopinRegula",color: Colors.light.textGray }}>Tenure</Text>
                <Text style={{fontFamily: "PopinRegula", fontWeight: 600 }}>
                  {data?.post?.tenures[index]}
                </Text>
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
                <Text style={{fontFamily: "PopinRegula", color: Colors.light.textGray }}>Area</Text>
                <Text style={{ fontFamily: "PopinRegula",fontWeight: 600 }}>
                  {data?.post?.land_areas[index]}
                </Text>
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
                <Text style={{ color: Colors.light.textGray,fontFamily: "PopinRegula" }}>Bed</Text>
                <Text style={{ fontWeight: 600,fontFamily: "PopinRegula" }}>
                  {data?.post?.bedrooms[index]}
                </Text>
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
                <Text style={{ color: Colors.light.textGray,fontFamily: "PopinRegula" }}>Bath</Text>
                <Text style={{ fontWeight: 600,fontFamily: "PopinRegula" }}>
                  {data?.post?.bathrooms?.[index]}
                </Text>
              </View>
                 <View
                style={{
                  height: vs(1),
                  marginTop: vs(20),
                  marginBottom:vs(5),
                  backgroundColor: Colors.light.textGray,
                  opacity: 0.2,
                }}
              />
                 <View className="flex-row justify-between" style={{backgroundColor:"#F4F0F0",padding:vs(10),borderRadius:ms(10)}}>
                <Text style={{ color: Colors.light.textGray,fontWeight:"700",fontFamily: "PopinRegula" }}>Price</Text>
                <Text style={{ fontWeight: 700 ,fontFamily: "PopinRegula"}}>
                  {formatPrice(data?.post?.community_price?.[index])}
                </Text>
              </View>
            </View>
          ))}
          {type === "community" && (
            <>
              <View style={styles.card2}>
                <Text
                  style={[
                    styles.heading,
                    { alignSelf: "center", marginBottom: vs(5) },
                  ]}
                >
                  Floor Plan
                </Text>
                <TouchableOpacity
                 activeOpacity={1}
                  className="mt-4"
                  onPress={() => {
                    setShowFloor(true);
                  }}
                >
                  <Image
                    source={
                      data?.floor_images && data?.floor_images.length > 0
                        ? { uri: ImageFormater(data?.floor_images[0]) }
                        : NoImage
                    }
                    style={{
                      height: vs(200),
                      width: "100%",
                      borderRadius: ms(10),
                      resizeMode: "cover",
                      alignSelf: "center",
                      backgroundColor: "gray",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: vs(5),
                      left: hs(10),
                      alignItems: "center",
                    }}
                    className="flex-row"
                  >
                    <Camera />
                    <Text style={{ color: "white", fontWeight: 600 }}>
                      {data?.post_images ? data?.floor_images.length : 0}
                    </Text>
                  </View>
                </TouchableOpacity>
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
            </>
          )}
          {data?.post?.video_link && (
            <>
              <Text style={styles.heading}>Virtual tour of property</Text>
              <View
                style={{
                  width: "100%",
                  height: vs(300),
                  borderRadius: ms(12),
                  overflow: "hidden",
                  marginVertical: vs(10),
                }}
              >
                <VideoSection url={data?.post?.video_link} />
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
            </>
          )}

          {data?.brochures?.length > 0 && (
            <>
              <Text style={styles.heading}>Brochure</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              >
                {data.brochures.map((file: string, index: number) => (
                  <TouchableOpacity
                   activeOpacity={1}
                    key={index}
                    onPress={() => openPDF(formatPdfUrl(file))}
                    style={{
                      flex: 1,
                      marginHorizontal: 5,
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: "#f2f2f2",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={36}
                      color="#E53935"
                    />
                    <Text
                      style={{ fontSize: 12, color: "#555", marginTop: 5 }}
                      numberOfLines={1}
                    >
                      {decodeURIComponent(file)}
                    </Text>
                  </TouchableOpacity>
                ))}
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
            </>
          )}

          {type === "rent" && (
            <View>
              <View
                style={{
                  height: vs(1),
                  marginTop: vs(20),
                  marginBottom: vs(10),
                  backgroundColor: Colors.light.textGray,
                  opacity: 0.2,
                }}
              />
              <Text style={styles.heading}>Fees & Conditions</Text>
              <Text>{data?.post?.fees_conditions}</Text>
              <Text
                style={{
                  borderRadius: ms(10),

                  paddingVertical: vs(15),
                  paddingHorizontal: vs(5),
                  marginTop: vs(10),
                  fontSize: ms(12),
                  fontWeight: 500,
                  textAlign: "center",
                  backgroundColor: Colors.light.lightGray,
                }}
              >
                Property available:{" "}
                <Text style={styles.textred}>{data?.post?.available_on}</Text>
              </Text>
            </View>
          )}

          {showMap && (
            <MapView
              style={{ height: vs(250), width: "100%", marginTop: vs(10) }}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude,
                  longitude,
                }}
              />
            </MapView>
          )}
          {type === "sale" && (
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
              <Text style={styles.heading}>MORTGAGE CALCULATION</Text>
              <View style={styles.card2}>
                <View className="flex-row justify-between">
                  <View className="flex-1" style={{ marginRight: hs(5) }}>
                    <FormikInput
                      title="Property value"
                      placeholder=""
                      onChangeText={() => {}}
                      onBlur={() => {}}
                      value={(data?.post?.asking_price ?? 0).toString()}
                      touched={false}
                      errors={false}
                      required={false}
                      editable={false}
                      errorText={""}
                    />
                  </View>
                  <View className="flex-1" style={{ marginRight: hs(5) }}>
                   <FormikInput
  title="Down Payment"
  placeholder="Enter down payment"
  onChangeText={(text) => {
    const cleanValue = text.replace(/[^0-9.]/g, "");

    setDownPayment(cleanValue);

    if (selectedYear && cleanValue) {
      handleLoanCalculation(
        Number(selectedYear),
        cleanValue
      );
    }
  }}
  onBlur={() => {}}
  editable={true}
  value={downPayment}
  touched={false}
  errors={false}
  required={true}
  errorText=""
  keyboardType="numeric"
/>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-1" style={{ marginRight: hs(5) }}>
                <FormikInput
  title="Interest Rate"
  placeholder=""
  onChangeText={() => {}}
  onBlur={() => {}}
  value={
    interestRateLoading
      ? "Loading..."
      : `${interestRate.toFixed(2)}%`
  }
  touched={false}
  errors={false}
  required={false}
  editable={false}
  errorText=""
/>
                  </View>
                  <View className="flex-1" style={{ marginRight: hs(5) }}>
   <FormikDropdownwithjson
  title="Repayment period"
  placeholder="Select Year"
  value={selectedYear}
    options={[
                        { label: "1 year", value: 1 },
                        { label: "2 years", value: 2 },
                        { label: "3 years", value: 3 },
                        { label: "4 years", value: 4 },
                        { label: "5 years", value: 5 },
                        { label: "6 years", value: 6 },
                        { label: "7 years", value: 7 },
                        { label: "8 years", value: 8 },
                        { label: "9 years", value: 9 },
                        { label: "10 years", value: 10 },
                        { label: "11 years", value: 11 },
                        { label: "12 years", value: 12 },
                        { label: "13 years", value: 13 },
                        { label: "14 years", value: 14 },
                        { label: "15 years", value: 15 },
                        { label: "16 years", value: 16 },
                        { label: "17 years", value: 17 },
                        { label: "18 years", value: 18 },
                        { label: "19 years", value: 19 },
                        { label: "20 years", value: 20 },
                        { label: "21 years", value: 21 },
                        { label: "22 years", value: 22 },
                        { label: "23 years", value: 23 },
                        { label: "24 years", value: 24 },
                        { label: "25 years", value: 25 },
                        { label: "26 years", value: 26 },
                        { label: "27 years", value: 27 },
                        { label: "28 years", value: 28 },
                        { label: "29 years", value: 29 },
                        { label: "30 years", value: 30 },
                        { label: "31 years", value: 31 },
                        { label: "32 years", value: 32 },
                        { label: "33 years", value: 33 },
                        { label: "34 years", value: 34 },
                        { label: "35 years", value: 35 },
                        { label: "36 years", value: 36 },
                        { label: "37 years", value: 37 },
                        { label: "38 years", value: 38 },
                        { label: "39 years", value: 39 },
                        { label: "40 years", value: 40 },
                      ]}
  onSelect={(val) => {
    const year = Number(val);

    setSelectedYear(year);

    if (!downPayment) {
      renderToastError("Please enter down payment first");
      return;
    }

    handleLoanCalculation(year, downPayment);
  }}
  touched={false}
  errors={false}
  errorText=""
  required={false}
/>
                  </View>
                </View>
                <View
                  className="flex-row justify-between mb-4 items-center justify-center"
                  style={[
                    styles.card2,
                    {
                      backgroundColor: Colors.light.red,
                      paddingBottom: vs(20),
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: ms(15),
                      fontWeight: 500,
                      marginTop: vs(10),
                      color: "white",
                    }}
                  >
                    Monthly repayments
                  </Text>
{calculatingLoan ? (
  <Text
    style={{
      fontSize: ms(14),
      fontWeight: "500",
      color: "white",
      marginTop: vs(10),
    }}
  >
    Calculating...
  </Text>
) : (
  <Text
    style={{
      fontSize: ms(15),
      fontWeight: "500",
      color: "white",
      marginTop: vs(10),
    }}
  >
    C$ {formatPrice(monthlyPayment)}
  </Text>
)}
                </View>
                <Text className="mt-4">
                  * These results are for a repayment mortgage and are intended
                  as a guide only. Make sure you obtain accurate figures from
                  your broker/lender before committing to any mortgage. The
                  tool, its content and its output are not intended as financial
                  or professional advice nor as an application, offer,
                  solicitation or advertisement as to any loan or loan features,
                  and should not be your primary source of information about
                  mortgage possibilities for you.
                </Text>
              </View>

              <Text style={styles.heading}>Mortgage experts</Text>
              <View className="flex-1">
            <FlashList
  data={data?.mortgage_experts ?? []}
  horizontal
  style={{ flex: 1 }}
  keyExtractor={(item) => item.id.toString()}
  showsHorizontalScrollIndicator={false}
  renderItem={({ item }) => (
    <TouchableOpacity
     activeOpacity={1}
      style={[
        styles.card2,
        {
          marginHorizontal: hs(5),
          width: hs(110),
          marginBottom: vs(10),
          paddingHorizontal: hs(2),
          alignItems: "center",
          height: vs(180),
          flexDirection: "column",
          justifyContent: "space-between",
        },
      ]}
      onPress={() => {
        setprofileData({
          type: "mortgage",
          id: item.id,
        });
        setSingleView(true);
      }}
    >
      <CircleImage
        source={{ uri: ImageFormater(item.logo) }}
        Size={60}
      />

      <Text className="font-bold mt-4 text-center">
        {item.business_name}
      </Text>

      <Text
        className="text-center"
        style={{
          fontSize: ms(10),
          color: Colors.light.textGray,
        }}
      >
        {item.city} {item.zip}
      </Text>

      <View style={{ marginTop: vs(5), alignSelf: "center" }}>
        <StarRating size={15} rating={item.rating ?? 0} />
      </View>
    </TouchableOpacity>
  )}
/>
              </View>
            </>
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
          
          {data?.post.property_visit && data?.post.property_visit === "Yes" && (
            <>
            <Text style={styles.heading}>VISIT PROPERTY IN PERSON</Text>
            <Formik
              initialValues={{
                visitor_email: "",
                receiver_email: data?.posted_by?.email,
                visitor_name: "",
                visitor_contact: "",
                visitor_message: "",
                visit_date: "",
                visit_time: "",
                post_id:
                  type === "community"
                    ? data?.post?.post_community_id
                    : data?.post?.post_property_id,
                type: type,
                ad_type: "sale",
                link: "",
              }}
              onSubmit={async (values) => {
                try {
                  const formData = new FormData();

                  Object.entries(values).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== "") {
                      formData.append(key, String(value));
                    }
                  });

                  const result = await sendVisistRequies(formData).unwrap();

                  console.log("Request sent successfully:", result);
                } catch (error) {
                  console.log("Error sending request:", error);
                }
              }}
              validationSchema={visitAdSchema}
            >
              {({
                handleBlur,
                handleChange,
                handleReset,
                handleSubmit,
                setFieldValue,
                errors,
                values,
                touched,
              }) => (
                <>
                  <View style={[styles.card2, { paddingHorizontal: hs(0) }]}>
                    <Text className="text-center font-bold">
                      Please fill details to book in person visit to property
                    </Text>
                    <View style={{ paddingHorizontal: hs(15) }}>
                      <FormikInput
                        title="Name"
                        placeholder="Enter name"
                        onChangeText={handleChange("visitor_name")}
                        onBlur={handleBlur("visitor_name")}
                        value={values.visitor_name}
                        touched={!!touched.visitor_name}
                        errors={!!errors.visitor_name}
                        required
                        errorText={errors.visitor_name}
                      />
                      <FormikInput
                        title="Email"
                        placeholder="Please enter email"
                        onChangeText={handleChange("visitor_email")}
                        onBlur={handleBlur("visitor_email")}
                        value={values.visitor_email}
                        touched={!!touched.visitor_email}
                        errors={!!errors.visitor_email}
                        required
                        errorText={errors.visitor_email}
                      />
                      <FormikInput
                        title="Phone"
                        placeholder="Please enter phone"
                        onChangeText={handleChange("visitor_contact")}
                        onBlur={handleBlur("visitor_contact")}
                        value={values.visitor_contact}
                        touched={!!touched.visitor_contact}
                        errors={!!errors.visitor_contact}
                        required
                        errorText={errors.visitor_contact}
                      />
                      <FormikInput
                        title="Message"
                        placeholder="Message....."
                        onChangeText={handleChange("visitor_message")}
                        onBlur={handleBlur("visitor_message")}
                        value={values.visitor_message}
                        touched={!!touched.visitor_message}
                        errors={!!errors.visitor_message}
                        multiline
                        required
                        errorText={errors.visitor_message}
                      />
                      <DatePickerField
                        errorText={errors.visit_date}
                        name="visit_date"
                        required
                        value={values.visit_date}
                        editable
                        setValue={setFieldValue}
                        title="Visit date"
                        placeholder="mm/dd/yyyy"
                        touched={!!touched}
                        errors={!!errors}
                      />
                      <TimePickerField
                        errorText={errors.visit_time}
                        name="visit_time"
                        required={false}
                        value={values.visit_time}
                        editable
                        setValue={setFieldValue}
                        title="Time for viewing"
                        placeholder="dd/mm/yy"
                        touched={!!touched}
                        errors={!!errors}
                      />
                      <LargeButton
                        handleSubmit={() => {
                          handleSubmit();
                          console.log(errors);
                        }}
                        text="Submit"
                      />
                    </View>
                  </View>
                </>
              )}
            </Formik>
            </>
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

          <TouchableOpacity 
           activeOpacity={1}
           style={[styles.card2, { alignItems: "center" }]} onPress={()=>{setprofileData({type:data?.posted_by_type,id:data?.posted_by?.id});setSingleView(true);}}>
            <CircleImage
              Size={80}
              source={{ uri: ImageFormater(data?.posted_by?.logo) }}
            />
            <Text style={[styles.heading, { color: Colors.light.red }]}>
              {data?.posted_by?.business_name}
            </Text>
            <Text
              style={{
                color: "black",
                fontWeight: 600,
                marginVertical: vs(10),
              }}
            >
              {data?.posted_by?.city},{data?.posted_by?.zip}
            </Text>
            <View>
              <StarRating size={20} rating={data?.posted_by?.rating} />
            </View>
            {type === "community" ? (
             <TouchableOpacity
              activeOpacity={1} onPress={()=>{router.navigate({pathname:"/MyPostListing",params:{id:data?.post?.user_id?.toString(),type:"community",profile_type:data?.posted_by_type,name:data?.posted_by?.business_name}})}} className="items-center" style={{ flex: 1 }}>

                <Text style={[styles.heading, { color: Colors.light.red }]}>
                  {data?.posted_by?.total_posts}
                </Text>
                <Text style={styles.heading}>Communities</Text>
 </TouchableOpacity>
            ) : (
              <View className="flex-row mb-4">
                <TouchableOpacity
                 activeOpacity={1}onPress={()=>{router.navigate({pathname:"/MyPostListing",params:{id:data?.post?.user_id?.toString(),type:"sale",profile_type:data?.posted_by_type,name:data?.posted_by?.business_name}})}} className="items-center" style={{ flex: 1 }}>

                  <Text style={[styles.heading, { color: Colors.light.red }]}>
                    {data?.posted_by?.sale_posts ?? 0}
                  </Text>
                  <Text style={styles.heading}>For Sale</Text>
                </TouchableOpacity>

                <VerticalLine />
                <TouchableOpacity 
                 activeOpacity={1}
                onPress={()=>{router.navigate({pathname:"/MyPostListing",params:{id:data?.post?.user_id?.toString(),type:"rent",name:data?.posted_by?.business_name}})}} className="items-center" style={{ flex: 1 }}>
                  <Text style={[styles.heading, { color: Colors.light.red }]}>
                    {data?.posted_by?.rent_posts ?? 0}
                  </Text>
                  <Text style={styles.heading}>For Rent</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
             activeOpacity={1}
              style={{
                backgroundColor: Colors.light.DarkGreen,
                paddingHorizontal: hs(15),
                paddingVertical: vs(15),
                width: "100%",
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={()=>{
                router.navigate({
                  pathname:"/ChatScreen",
                  params:{
                    userId:data?.post?.user_id,
                   name:data?.posted_by?.business_name,
                     title: type === "community"
          ? data?.post?.community_title
          : `${data?.post?.bedrooms ?? 0} bedrooms ${
              data?.post?.property_sub_type ?? ""
            } for ${data?.post?.property_for ?? ""}`,
      receiver_post_id:  type === "community"
                    ? data?.post?.post_community_id
                    : data?.post?.post_property_id,
                    type:type==="community"?"community":"property"
                  }
                })
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Send Message
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showImages && (
        <ImageSlider
          imageNo={imageNo}
          images={data?.post_images}
          setShowImage={(val: boolean) => {
            setShowImages(val);
          }}
        />
      )}

      {showFloor && (
        <ImageSlider
          imageNo={imageNo}
          images={data?.floor_images}
          setShowImage={(val: boolean) => {
            setShowFloor(val);
          }}
        />
      )}
             <Modal visible={showShare} animationType="slide" transparent>
               <SafeAreaView
                                                                      style={{ flex: 1 }}
                                                                      edges={[ "bottom", "left", "right"]}
                                                                    >
  <View style={{
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  }}>

    <View style={{
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      minHeight: "80%",
    }}>

      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
      }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Share Post
        </Text>

        <TouchableOpacity 
         activeOpacity={1}
         onPress={() => setShowShare(false)}>
          <Cross height={vs(24)} width={vs(24)} />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={{
          recepient_email: "",
          message: "",
          link:`https://homeilove.ca/postRedirect?post_id=${type==="community"?data?.post?.post_community_id:data?.post?.post_property_id}&&type=${type==="community"?"community":"property"}`,
          post_id:type==="community"?data?.post?.post_community_id:data?.post?.post_property_id,
          type:type,
        }}
        validationSchema={Yup.object({
          recepient_email: Yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
          message: Yup
            .string()
            .required("Message is required")
        })}
        onSubmit={async(values) => {
          try {
            const formData = new FormData();
            formData.append("email", values.recepient_email);
            formData.append("message", values.message);
            formData.append("link", values.link);
            formData.append("post_id", values.post_id);
            formData.append("type", values.type);
            console.log(formData);
            const result = await shareDetailPostApi(formData).unwrap();
            if (result?.success) {
              renderToastSuccess(result.message);
              setShowShare(false);
            }
          } catch (error) {
            renderToastError("Failed to share post");
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors
        }) => (

          <View style={{ flex: 1 }}>

         
            <FormikInput
                    name="recepient_email"
                    placeholder="Recipient Email"
                    value={values.recepient_email}
                    onChangeText={handleChange("recepient_email")}
                    onBlur={handleBlur("recepient_email")}
                    touched={!!touched.recepient_email}
                    errors={!!errors.recepient_email}
                    errorText={errors.recepient_email} title={"Email"} required={true}            />

           
            <FormikInput
                    name="message"
                    placeholder="Write your message..."
                    value={values.message}
                    onChangeText={handleChange("message")}
                    onBlur={handleBlur("message")}
                    multiline
                    touched={!!touched.message}
                    errors={!!errors.message}
                    errorText={errors.message} title={"Message"} required={true}            />

            <View style={{
              backgroundColor: "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              marginTop: 10,
              marginBottom: 20
            }}>
              <Text style={{ fontWeight: "600" }}>
                Sharing this post
              </Text>
              <Text style={{ color: "#666", fontSize: 12 }}>
                Property / Community link will be sent
              </Text>
            </View>  
     <View
  style={{
    backgroundColor: "#f5f6f8",
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  }}
>
  {/* Label */}
  <Text
    style={{
      fontSize: 13,
      color: "#6b7280",
      marginBottom: 6,
      fontFamily: "PopinRegula",
    }}
  >
    Shareable Link
  </Text>

  {/* Input Row */}
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    }}
  >
    <TextInput
      editable={false}
      value={values.link}
      numberOfLines={1}
      style={{
        flex: 1,
        fontSize: 12,
        color: "#374151",
        fontFamily: "PopinRegula",
      }}
      ellipsizeMode="middle"
    />

    {/* Copy Button */}
    <TouchableOpacity
     activeOpacity={1}
      onPress={async () => {
        await Clipboard.setStringAsync(values.link);
        renderToastSuccess("Link copied");
      }}
      style={{
        backgroundColor: "#0f766e",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: 8,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 12,
          fontWeight: "600",
          fontFamily: "PopinRegula",
        }}
      >
        Copy
      </Text>
    </TouchableOpacity>
  </View>
</View>
        
            <LargeButton
              text="Send"
              handleSubmit={handleSubmit}
            />

          </View>

        )}
      </Formik>

    </View>
  </View>
  </SafeAreaView>
  <Loading isLoading={sharing} text="Sharing..."/>
</Modal>
  <Modal
            visible={singleView}
            animationType="slide"
            onRequestClose={() => setSingleView(false)}
            transparent={true}
            statusBarTranslucent={true}
          >
              <SafeAreaView
                                                                      style={{ flex: 1 }}
                                                                      edges={[ "bottom", "left", "right"]}
                                                                    >
     <ProfileSingleView id={profileData?.id} type={profileData?.type} setshowModel={setSingleView}/>
     </SafeAreaView>
          </Modal>
           <Modal visible={showSaved} onRequestClose={() => setShowSaved(false)} animationType="slide"  statusBarTranslucent>
             <SafeAreaView
                                                                      style={{ flex: 1 }}
                                                                      edges={[ "bottom", "left", "right"]}
                                                                    >
                        <SavedItems setShowSaved={setShowSaved} />
                        </SafeAreaView>
                      </Modal>
      <Loading isLoading={isFetching} text="Loading..." />
      <Loading isLoading={isLoading} text="Sending..." />
    </>
  );
};



const styles = StyleSheet.create({
  card: {
    borderRadius: ms(10),
    width: hs(170),
    paddingVertical: vs(15),
    paddingHorizontal: vs(5),
    marginTop: vs(10),
    fontSize: ms(12),
    fontWeight: 500,
    textAlign: "center",
    backgroundColor: Colors.light.lightGray,
  },
  textred: {
    color: Colors.light.red,
    fontWeight:700,
    fontFamily: "PopinRegula",
  },
  description: {
    marginVertical: vs(10),
    fontWeight: 500,
    fontFamily: "PopinRegula",
    textAlign:"justify",
    paddingHorizontal:hs(5),
 
  },
    adCard: {
    width: "100%",
    height: vs(100),
    marginVertical: vs(10),
    borderRadius: ms(16),
    overflow: "hidden",
    backgroundColor: "transparent",
    elevation: 0,
  },

  adImage: {
    width: "100%",
    height: "100%",
  },
  moreText: {
    color: Colors.light.DarkGreen,
    fontWeight: "600",
    fontFamily: "PopinRegula",
  },
  card2: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: vs(10),
    paddingHorizontal: hs(15),
    marginTop: vs(10),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    boxShadow:'0.2px 0.2px 0.2px 0.2px rgba(0, 0, 0, 0.1)',
  },

  heading: {
    color: Colors.light.DarkGreen,
    fontSize: ms(15),
    fontWeight: 700,
    marginTop: vs(10),
    fontFamily: "PopinRegula",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
