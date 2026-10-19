import {
  useGetSinglePostQuery,
  useSendVisistRequestMutation,
  useShareDetailPostApiMutation
} from "@/store/api/user/MainApi";
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
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import CircleImage from "@src/components/globals/CircleImage/CircleImage";
import DatePickerField from "@src/components/globals/DatePickerField";
import { FormikInput } from "@src/components/globals/FormictInput";
import { FormikDropdownwithjson } from "@src/components/globals/FormikDropdownwithjson";
import HeaderWithBack from "@src/components/globals/HeaderWithBack";
import ImageSlider from "@src/components/globals/ImageSlider";
import LargeButton from "@src/components/globals/LaregeButton";
import Loading from "@src/components/globals/Loading";
import StarRating from "@src/components/globals/StarRating";
import TimePickerField from "@src/components/globals/TimePickerField";
import VideoSection from "@src/components/globals/ViedioSection";
import Colors from "@src/constants/Colors";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Formik } from "formik";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNShare from "react-native-share";

import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";


const index = () => {
  const params = useLocalSearchParams();
  const type = params.type as string;
  const id = Number(params.id);

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

  const [imageNo, setImageNo] = useState(0);
  const [sendVisistRequies, { isLoading }] = useSendVisistRequestMutation();
  const { data, isFetching } = useGetSinglePostQuery({ type, id });
  const [showImages, setShowImages] = useState(false);
  const [showFloor, setShowFloor] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const latitude = parseFloat(data?.post?.lat);
  const longitude = parseFloat(data?.post?.lng);
  const [showShare, setShowShare] = useState(false);
  const getSharePostId = () => {
  return type === "community"
    ? data?.post?.post_community_id
    : data?.post?.post_property_id;
};

const getShareUrl = () => {
  const postId = getSharePostId();

  return `https://homeilove.co.uk/postRedirect?post_id=${postId}&&type=${
    type === "community" ? "community" : "property"
  }`;
};

const getShareTitle = () => {
  if (type === "community") {
    return data?.post?.community_title || "Home I Love Community";
  }

  return `${
    data?.post?.bedrooms ? `${data.post.bedrooms} bedroom ` : ""
  }${data?.post?.property_sub_type || "Property"} for ${
    data?.post?.property_for || type
  }`;
};

const getShareImage = () => {
  if (
    Array.isArray(data?.post_images) &&
    data.post_images.length > 0
  ) {
    return data.post_images[0];
  }

  return null;
};

const downloadShareImage = async (
  image: string,
  postId: string | number
) => {
  try {
    if (!image) return null;

    const imageUrl = ImageFormater(image);

    if (!imageUrl) return null;

    const cleanUrl = imageUrl
      .split("?")[0]
      .toLowerCase();

    let extension = "jpg";

    if (cleanUrl.endsWith(".png")) {
      extension = "png";
    } else if (cleanUrl.endsWith(".webp")) {
      extension = "webp";
    } else if (cleanUrl.endsWith(".jpeg")) {
      extension = "jpeg";
    }

    const destination = new File(
      Paths.cache,
      `homeilove-property-${postId}-${Date.now()}.${extension}`
    );

    const downloadedFile =
      await File.downloadFileAsync(
        imageUrl,
        destination
      );

    return downloadedFile.uri;
  } catch (error) {
    console.log(
      "Property share image download error:",
      error
    );

    return null;
  }
};

const openFallbackShare = async (
  options: any
) => {
  try {
    await RNShare.open({
      ...options,
      failOnCancel: false,
    });
  } catch (error) {
    console.log(
      "Share fallback error:",
      error
    );
  }
};

const shareOnSocial = async (
  platform:
    | "whatsapp"
    | "facebook"
    | "twitter"
    | "linkedin"
    | "more"
) => {
  try {
    const postId = getSharePostId();

    if (!postId) {
      renderToastError("Post not found");
      return;
    }

    const postUrl = getShareUrl();
    const title = getShareTitle();

    const location = [
      data?.post?.city,
      data?.post?.state,
    ]
      .filter(Boolean)
      .join(", ");

    const message =
      `${title}` +
      `${location ? `\n${location}` : ""}` +
      `\n\n${postUrl}`;

    const remoteImage = getShareImage();

    const localImage = remoteImage
      ? await downloadShareImage(
          remoteImage,
          postId
        )
      : null;

    const shareOptions: any = {
      title,
      message,

      // image available ho to image share hogi
      // warna direct property/community link
      url: localImage || postUrl,

      failOnCancel: false,

      ...(localImage && {
        type: "image/*",
      }),

      ...(Platform.OS === "android" &&
        localImage && {
          useInternalStorage: true,
        }),
    };

    // MORE
    if (platform === "more") {
      await openFallbackShare(
        shareOptions
      );
      return;
    }

    try {
      // WHATSAPP
      if (platform === "whatsapp") {
        await RNShare.shareSingle({
          ...shareOptions,
          social:
            RNShare.Social.WHATSAPP,
        });

        return;
      }

      // FACEBOOK
      if (platform === "facebook") {
        await RNShare.shareSingle({
          ...shareOptions,
          social:
            RNShare.Social.FACEBOOK,
        });

        return;
      }

      // X / TWITTER - iOS direct
      if (
        platform === "twitter" &&
        Platform.OS === "ios"
      ) {
        await RNShare.shareSingle({
          ...shareOptions,
          social:
            RNShare.Social.TWITTER,
        });

        return;
      }

      // LinkedIn + Android X
      await openFallbackShare(
        shareOptions
      );
    } catch (socialError) {
      console.log(
        `${platform} direct share error:`,
        socialError
      );

      await openFallbackShare(
        shareOptions
      );
    }
  } catch (error: any) {
    console.log(
      "Property social share error:",
      error
    );

    renderToastError(
      error?.message ||
        "Unable to share property"
    );
  }
};
  const showMap = !isNaN(latitude) && !isNaN(longitude);
  const facts = data?.post?.imp_facts ?? data?.post?.facts ?? "";
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
  const calculateMonthlyPayment = (
    totalValue: number,
    downPaymentPercent: number,
    interestRate: number,
    years: number
  ) => {
    const downPayment = (downPaymentPercent / 100) * totalValue;
    const principal = totalValue - downPayment;

    const monthlyRate = interestRate / 12 / 100;
    const months = years * 12;

    if (monthlyRate === 0) return Number((principal / months).toFixed(2));

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Number(monthlyPayment.toFixed(2));
  };

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(0);
  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <HeaderWithBack  onBackpress={()=>{router.navigate("/(main)/Home/(tabs)/Feeds")}}
        />
        <View
          className="flex-1"
          style={{ marginHorizontal: hs(10), paddingVertical: vs(20) }}
        >
          {type === "community" ? (
            <View className="flex-row justify-between">
              <Text style={{ color: "black", fontWeight: "600", flex: 1,fontFamily: "PopinRegula", }}>
                {data?.post?.community_title ?? ""}
              </Text>

              {data?.post?.community_price?.length > 0 && (
                <Text style={{ color: Colors.light.red, fontWeight: "600",fontFamily: "PopinRegula", }}>
                  From £ {data.post.community_price[0]} To £{" "}
                  {
                    data.post.community_price[
                      data.post.community_price.length - 1
                    ]
                  }
                </Text>
              )}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ color: "black", fontWeight: "600", flex: 1 ,fontFamily: "PopinRegula",}}>
                {data?.post?.bedrooms ?? 0} bedrooms{" "}
                {data?.post?.property_sub_type ?? ""} for{" "}
                {data?.post?.property_for ?? ""}
              </Text>

              <Text
                style={{
                  color: Colors.light.red,
                  fontWeight: "600",
                  marginLeft: 8,
                  fontFamily: "PopinRegula",
                }}
              >
                £ {data?.post?.asking_price ?? 0}
                {type === "rent" ? `/${data?.post?.rent_type ?? ""}` : ""}
              </Text>
            </View>
          )}
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
                height: vs(200),
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
              className="flex-row"
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
              paddingVertical: vs(5),
              paddingHorizontal: vs(15),
              marginTop: vs(10),
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
          <View className="flex-row items-center justify-between mt-4">
            <Text
              className="flex-1 mr-2"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{fontFamily: "PopinRegula",}}
            >
              {data?.post?.address}
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity  activeOpacity={1}>
                <Heart />
              </TouchableOpacity >
              <TouchableOpacity   activeOpacity={1} onPress={() => setShowShare(true)}>
                <Share />
              </TouchableOpacity>
            </View>
          </View>
          {type !== "community" && (
            <>
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
                    <Text style={styles.textred}>{data?.post?.home_age}</Text>
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
                    marginBottom: vs(8),
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
                    }}
                  >
                    {item.trim()}
                  </Text>
                </View>
              </View>
            ))}

          <Text style={styles.description}>
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
                style={[styles.heading, { alignSelf: "center" }]}
                className="mb-4"
              >
                {data?.post?.property_titles[index]}
              </Text>

              <View className="flex-row justify-between">
                <Text style={{ color: Colors.light.textGray }}>
                  Property type
                </Text>
                <Text style={{ fontWeight: 600 }}>
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
                <Text style={{ color: Colors.light.textGray }}>
                  Property sub-type
                </Text>
                <Text style={{ fontWeight: 600 }}>
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
                <Text style={{ color: Colors.light.textGray }}>Tenure</Text>
                <Text style={{ fontWeight: 600 }}>
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
                <Text style={{ color: Colors.light.textGray }}>Area</Text>
                <Text style={{ fontWeight: 600 }}>
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
                <Text style={{ color: Colors.light.textGray }}>Bed</Text>
                <Text style={{ fontWeight: 600 }}>
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
                <Text style={{ color: Colors.light.textGray }}>Bath</Text>
                <Text style={{ fontWeight: 600 }}>
                  {data?.post?.bathrooms?.[index]}
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
                      placeholder=""
                      additonalText={"20%"}
                      onChangeText={() => {}}
                      onBlur={() => {}}
                      editable={false}
                      value={
                        data?.post?.asking_price
                          ? Math.round(
                              Number(data.post.asking_price) * 0.2
                            ).toString()
                          : "0"
                      }
                      touched={false}
                      errors={false}
                      required={false}
                      errorText={""}
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
                      value={"5.760%"}
                      touched={false}
                      errors={false}
                      required={false}
                      editable={false}
                      errorText={""}
                    />
                  </View>
                  <View className="flex-1" style={{ marginRight: hs(5) }}>
                    <FormikDropdownwithjson
                      title={"Repayment period"}
                      additonalText="in years"
                      placeholder={"Select Year"}
                      value={""}
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
                        if (data?.post?.asking_price) {
                          const monthly = calculateMonthlyPayment(
                            data?.post?.asking_price,
                            20,
                            5.76,
                            val
                          );
                          setMonthlyPayment(monthly);
                        }
                      }}
                      touched={false}
                      errors={false}
                      errorText={""}
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
                  <Text
                    style={{
                      fontSize: ms(15),
                      fontWeight: 500,
                      marginTop: vs(10),
                      color: "white",
                    }}
                  >
                    £ {monthlyPayment}
                  </Text>
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
        console.log(item.id);
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
           style={[styles.card2, { alignItems: "center" }]}>
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
              <View className="self-center items-center mb-4">
                <Text style={[styles.heading, { color: Colors.light.red }]}>
                  {data?.posted_by?.total_posts}
                </Text>
                <Text style={styles.heading}>Communities</Text>
              </View>
            ) : (
              <View className="flex-row mb-4">
                <View className="items-center" style={{ flex: 1 }}>
                  <Text style={[styles.heading, { color: Colors.light.red }]}>
                    {data?.posted_by?.sale_posts ?? 0}
                  </Text>
                  <Text style={styles.heading}>For Sale</Text>
                </View>

                <VerticalLine />
                <View className="items-center" style={{ flex: 1 }}>
                  <Text style={[styles.heading, { color: Colors.light.red }]}>
                    {data?.posted_by?.rent_posts ?? 0}
                  </Text>
                  <Text style={styles.heading}>For Rent</Text>
                </View>
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
<View
  style={{
    marginBottom: vs(20),
  }}
>
  <Text
    style={{
      fontSize: ms(14),
      fontWeight: "600",
      marginBottom: vs(12),
      fontFamily: "PopinRegula",
    }}
  >
    Share via
  </Text>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}
  >

    {/* WhatsApp */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("whatsapp")
      }
      style={{
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          width: hs(48),
          height: hs(48),
          borderRadius: hs(24),
          backgroundColor: "#25D366",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome
          name="whatsapp"
          size={25}
          color="#fff"
        />
      </View>

      <Text
        style={{
          fontSize: ms(10),
          marginTop: vs(6),
          fontFamily: "PopinRegula",
        }}
      >
        WhatsApp
      </Text>
    </TouchableOpacity>


    {/* Facebook */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("facebook")
      }
      style={{
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          width: hs(48),
          height: hs(48),
          borderRadius: hs(24),
          backgroundColor: "#1877F2",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome
          name="facebook"
          size={24}
          color="#fff"
        />
      </View>

      <Text
        style={{
          fontSize: ms(10),
          marginTop: vs(6),
          fontFamily: "PopinRegula",
        }}
      >
        Facebook
      </Text>
    </TouchableOpacity>


    {/* X */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("twitter")
      }
      style={{
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          width: hs(48),
          height: hs(48),
          borderRadius: hs(24),
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: ms(20),
            fontWeight: "700",
          }}
        >
          X
        </Text>
      </View>

      <Text
        style={{
          fontSize: ms(10),
          marginTop: vs(6),
          fontFamily: "PopinRegula",
        }}
      >
        X
      </Text>
    </TouchableOpacity>


    {/* LinkedIn */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("linkedin")
      }
      style={{
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          width: hs(48),
          height: hs(48),
          borderRadius: hs(24),
          backgroundColor: "#0A66C2",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome
          name="linkedin"
          size={23}
          color="#fff"
        />
      </View>

      <Text
        style={{
          fontSize: ms(10),
          marginTop: vs(6),
          fontFamily: "PopinRegula",
        }}
      >
        LinkedIn
      </Text>
    </TouchableOpacity>


    {/* More */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("more")
      }
      style={{
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          width: hs(48),
          height: hs(48),
          borderRadius: hs(24),
          backgroundColor: "#E5E7EB",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={25}
          color="#374151"
        />
      </View>

      <Text
        style={{
          fontSize: ms(10),
          marginTop: vs(6),
          fontFamily: "PopinRegula",
        }}
      >
        More
      </Text>
    </TouchableOpacity>

  </View>

  <View
    style={{
      height: 1,
      backgroundColor: "#E5E7EB",
      marginTop: vs(18),
    }}
  />
</View>
      <Formik
        initialValues={{
          recepient_email: "",
          message: "",
          link:`https://homeilove.co.uk/postRedirect?post_id=${type==="community"?data?.post?.post_community_id:data?.post?.post_property_id}&&type=${type==="community"?"community":"property"}`,
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
      <Loading isLoading={isFetching} text="Loading..." />
      <Loading isLoading={isLoading} text="Sending..." />
    </>
  );
};

export default index;

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
    fontFamily: "PopinRegula",
  },
  description: {
    marginVertical: vs(10),
    fontWeight: 500,
    fontFamily: "PopinRegula",
  },
  moreText: {
    color: Colors.light.DarkGreen,
    fontWeight: "600",
    fontFamily: "PopinRegula",
  },
  card2: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: vs(15),
    paddingHorizontal: hs(15),
    marginTop: vs(10),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  heading: {
    color: Colors.light.DarkGreen,
    fontSize: ms(15),
    fontWeight: 500,
    marginTop: vs(10),
    fontFamily: "PopinRegula",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
