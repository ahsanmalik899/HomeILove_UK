
import { useAcceptRequestApiMutation, useAskvaluationapiMutation, useCancelRequestApiMutation, useCheckReviewApiQuery, useGetotherPastWorkQuery, useGetProfileReviewsQuery, useGetProfilesForConectionQuery, useGetSingleProfileQuery, useLazyGetRandomAdQuery, useSaveItemApiMutation, useSendRequestMutation, useShare_profileApiMutation, useUnfollowApiMutation, useUnsaveItemApiMutation, useUserAgentPastPostsApiQuery, useWriteReviewApiMutation } from '@/store/api/user/MainApi';
import { userdata } from '@/store/slices/selector/user';
import Call from "@assets/Buy/call.svg";
import Cross from "@assets/CreateProfile/cross.svg";
import RedHeart from "@assets/CreateProfile/heart-red.svg";
import Heart from "@assets/icons/heart.svg";
import Share from "@assets/icons/share.svg";
import NoImage from "@assets/SideBar/no_images.png";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Colors from '@src/constants/Colors';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { hs, ms, vs } from '@utils/design/design';
import { ImageFormater } from '@utils/ImageFormat';
import { makeCall } from '@utils/makeCall';
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import { router } from 'expo-router';
import * as WebBrowser from "expo-web-browser";
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RNShare from "react-native-share";
import * as Yup from 'yup';
import { AdressInput } from '../AddressInput';
import CircleImage from '../CircleImage/CircleImage';
import FollowButton from '../FollowButton';
import { FormikInput } from '../FormictInput';
import { FormikDropdownwithjson } from '../FormikDropdownwithjson';
import HeaderWithBack from '../HeaderWithBack';
import LargeButton from '../LaregeButton';
import Loading from '../Loading';
import PastDealsagent from '../PastDealsagent';
import SavedItems from '../SavedItems';
import SetRating from '../SetRating';
import StarRating from '../StarRating';
import VideoSection from '../ViedioSection';
const ProfileSingleView = ({ type, id, setshowModel,setData ,  onSavedChange}: { type: string,  onSavedChange?: (isSaved: boolean) => void, id: string,  setData?: React.Dispatch<React.SetStateAction<any[]>>,setshowModel: (val: boolean) => void }) => {
  const user = useAppSelector(userdata);
   const {data:reviewData,isfetching}=useCheckReviewApiQuery({receiver_profile_id:id,sender_id:user?.id,profile_type:type})
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [review, setReview] = useState("");
  const [postrating, setpostRating] = useState(0);
  useEffect(()=>{
setpostRating(Number(reviewData?.data?.rating)||0)
  },[reviewData])
  const [isSaved,setIsSaved]=useState(false);
  const [expanded, setExpanded] = useState(false);
    const [statuse, setStatus] = useState("");
      const [showConnection, setShowConnection] = useState(false);
  const [showPast, setShowpast] = useState(false);
    const [unfollowApi, { isLoading: unfollowing }] = useUnfollowApiMutation();
    const [cancelRequestApi, { isLoading: canceling }] = useCancelRequestApiMutation();
    const [acceptRequestApi, { isLoading: accepting }] = useAcceptRequestApiMutation();
  const [showShare, setShowShare] = useState(false);
  const [askEvaluation, { isLoading: askEvaluationLoading }] = useAskvaluationapiMutation();
 // ADD BELOW:
// const profile = data?.data;

const downloadShareImage = async (
  imageUrl: string,
  profileId: string | number
) => {
  try {
    if (!imageUrl) return null;

    const cleanUrl = imageUrl.split("?")[0].toLowerCase();

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
      `sweetghar-profile-${profileId}-${Date.now()}.${extension}`
    );

    const downloadedFile = await File.downloadFileAsync(
      imageUrl,
      destination
    );

    return downloadedFile.uri;
  } catch (error) {
    console.log("Profile image download error:", error);
    return null;
  }
};


const getProfileTypeLabel = () => {
  const normalizedType =
    type?.toLowerCase()?.trim() || "";

  const labels: Record<string, string> = {
    agent: "Property Agent",
    builder: "Builder",
    mortgage: "Mortgage Advisor",
    investor: "Investor",
    painter: "Painter",
    plumber: "Plumber",
    electrician: "Electrician",
    decor: "Interior Decorator",
    material_supplier: "Material Supplier",
  };

  return (
    labels[normalizedType] ||
    normalizedType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Professional"
  );
};


const buildProfileShareContent = () => {
  const profileType =
    type?.toLowerCase()?.trim() || "";

  const profileUrl =
    `https://sweetghar.com/postRedirect?post_id=${id}&&type=profile&&profile_type=${profileType}`;

  const profileTypeLabel =
    getProfileTypeLabel();

  const businessName =
    profile?.business_name || "";

  const location =
    [
      profile?.city,
      profile?.state,
    ]
      .filter(Boolean)
      .join(", ");

  const shareText =
    `${profileTypeLabel}` +
    `${businessName ? ` - ${businessName}` : ""}` +
    `${location ? ` in ${location}` : ""}`;

  return {
    profileUrl,
    shareText,
    message: `${shareText}\n${profileUrl}`,
  };
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
      "Fallback share error:",
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
    if (!id) {
      renderToastError("Profile not found");
      return;
    }

    const {
      profileUrl,
      shareText,
      message,
    } = buildProfileShareContent();

    const remoteImage =
      profile?.cover
        ? ImageFormater(profile.cover)
        : profile?.logo
        ? ImageFormater(profile.logo)
        : null;

    const localImage =
      remoteImage
        ? await downloadShareImage(
            remoteImage,
            id
          )
        : null;

    const shareOptions: any = {
      title: shareText,
      message,
      url: localImage || profileUrl,
      failOnCancel: false,

      ...(localImage && {
        type: "image/*",
      }),

      ...(Platform.OS === "android" &&
        localImage && {
          useInternalStorage: true,
        }),
    };

    try {
      if (platform === "whatsapp") {
        await RNShare.shareSingle({
          ...shareOptions,
          social:
            RNShare.Social.WHATSAPP,
        });

        return;
      }

      if (platform === "facebook") {
        await RNShare.shareSingle({
          ...shareOptions,
          social:
            RNShare.Social.FACEBOOK,
        });

        return;
      }

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
if (platform === "more") {
  await openFallbackShare(
    shareOptions
  );

  return;
}
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
      "Profile social share error:",
      error
    );

    renderToastError(
      error?.message ||
        "Unable to share profile"
    );
  }
};
  const ReviewSchema = Yup.object().shape({
    review: Yup.string()
      .required("Review is required")
      .max(5000, "Maximum 5000 characters"),

    sender_profile_type: Yup.string().required("Please select profile"),

    sender_profile_id: Yup.string().nullable(),

    imp_facts: Yup.string(),
  });
       const [saveItemApi] = useSaveItemApiMutation();
          const [unsaveItemApi] = useUnsaveItemApiMutation();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
   const [sendRequest,{isLoading:senddingRequest}] = useSendRequestMutation();
  const [posts, setPosts] = useState<[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading,refetch:refetchProfile } = useGetSingleProfileQuery({ type: type?.toLocaleLowerCase(), id: id,user_id:user?.id });
  const [share_profileApi, { isLoading: sharing }] = useShare_profileApiMutation();
  const profile = data?.data;
  const {
  data: allReviewsData,
  isLoading: reviewsLoading,
  refetch: refetchReviews,
} = useGetProfileReviewsQuery(
  {
    receiver_profile_id: id,
    receiver_profile_type: type,
  },
  {
    skip: !id || !type,
  }
);

const allReviews = allReviewsData?.reviews || [];
  const [connectionStatus, setConnectionStatus] = useState("");

useEffect(() => {
  setConnectionStatus(profile?.connection_status ?? "");
}, [profile?.connection_status]);
  const { data: Profiles, isLoading: ProfilesLoading } =
    useGetProfilesForConectionQuery({ id: user.id });
  const {
    data: othePastdata,
    isLoading: otherWorkLoding,
    refetch: pastRefetch,
  } = useGetotherPastWorkQuery(
    { user_id: profile?.users_id, work_section: type.toLocaleLowerCase() },
    { skip: !profile?.users_id || type.toLocaleLowerCase() === "agent" || profile?.post_type === "Normal" }
  );

  const {
    data: pastData,
    isLoading: pastLoading,
    refetch,
  } = useUserAgentPastPostsApiQuery(
    { page, per_page: perPage, user_id: profile?.users_id },
    { skip: !profile?.users_id || type.toLocaleLowerCase() !== "agent" || profile?.post_type === "Normal" }
  );
  useEffect(() => {
    if (!pastData?.data) return;

    setHasMore(pastData?.has_more);

    setPosts((prev) =>
      page === 1 ? pastData.data : [...prev, ...pastData.data]
    );
    setInitialLoadDone(true);
  }, [pastData]);
  
  useEffect(() => {
    if (data?.is_saved !== undefined) {
      setIsSaved(data?.is_saved);
    }
  }, [data?.is_saved]);
  const [writeReview,{isLoading:sendingReview}] = useWriteReviewApiMutation();
  const latitude = Number(profile?.user_lat);
  const [showSaved, setShowSaved] = useState(false);
  const longitude = Number(profile?.user_lng);
  const showMap = !isNaN(latitude) && !isNaN(longitude);
  const [showMortgage, setShowMortgage] = useState(false);
  const rating = Number(profile?.rating || 0);
  const [getRandomAd, { data: randomAdData, isFetching: randomAdFetching }] = useLazyGetRandomAdQuery();
  const totalReviews = profile?.total_reviews || 0;
    const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
const requestSend = async ({
  sender_type,
  sender_ProfileId,
  reciverProfile,
  statusi,
  sender_data,
}: {
  sender_type: string;
  sender_ProfileId: string;
  reciverProfile: any;
  statusi: string;
  sender_data:any;
}) => {
  try {
    const formData = new FormData();

    // Connect / Cancel Request
     if (statusi === "Connect" || statusi === "Cancel Request") {
        formData.append("sender_id", String(user?.id ?? ""));
        formData.append("receiver_id", String(reciverProfile?.users_id ?? ""));
        formData.append("sender_profile_id", String(sender_ProfileId ?? ""));
        formData.append("sender_profile_type", String(sender_type ?? ""));
        formData.append("receiver_profile_id", String(reciverProfile?.id ?? ""));
         formData.append("rcr_logo", String(reciverProfile?.logo ?? ""));
          formData.append("rcr_name", String(reciverProfile?.business_name ?? ""));
        formData.append(
          "receiver_profile_type",
          String(reciverProfile?.connection_type ?? "")
        );
        formData.append("sndr_logo", String(sender_data?.logo ?? ""));
        formData.append("sndr_name", String(sender_data?.business_name ?? ""));
      }
      else {
        formData.append("sender_id", String(reciverProfile?.sender_id ?? ""));
        formData.append("receiver_id", String(reciverProfile?.receiver_id ?? ""));
        formData.append("sender_profile_id", String(reciverProfile?.sender_profile_id ?? ""));
        formData.append("sender_profile_type", String(reciverProfile?.sender_profile_type ?? ""));
        formData.append("receiver_profile_id", String(reciverProfile?.receiver_profile_id ?? ""));
        formData.append(
          "receiver_profile_type",
          String(reciverProfile?.receiver_profile_type ?? "")
        );
      }
  formData._parts?.forEach((p) => console.log(p[0], p[1]));
    let result: any;
 console.log(formData)
    switch (statusi) {
      case "Connect":
        result = await sendRequest(formData).unwrap();
        break;

      case "Accept Request":
        result = await acceptRequestApi(formData).unwrap();
        break;

      case "Cancel Request":
        result = await cancelRequestApi(formData).unwrap();
        break;

      case "Unfollow":
        result = await unfollowApi(formData).unwrap();
        break;
    }

    if (result?.success) {
      refetchProfile();
      if(setData){
    setData((prevData) => {
  console.log("All Posts:", prevData);

  return prevData.map((post) => {
    console.log("post", post);
    console.log("reciverProfile", reciverProfile);

    if (
      post.users_id === reciverProfile?.users_id &&
    post.connection_type?.toLowerCase() ===reciverProfile?.type?.toLowerCase()
    ) {


      let newStatus = post.connection_status;

      if (statusi === "Connect") {
        newStatus = "pending";
       
      } else if (statusi === "Accept Request") {
        newStatus = "accepted";
       
      } else if (
        statusi === "Unfollow" ||
        statusi === "Cancel Request"
      ) {
        newStatus = "";
        
      }

      return {
        ...post,
        connection_status: newStatus,
      };
    }

    return post;
  });
});}
  

      renderToastSuccess(result?.message);

      // Update local connection status
      let updatedStatus = "";

      switch (statusi) {
        case "Connect":
          updatedStatus = "pending";
          break;

        case "Accept Request":
          updatedStatus = "accepted";
          break;

        case "Cancel Request":
        case "Unfollow":
          updatedStatus = "";
          break;
      }

     
setConnectionStatus(updatedStatus);
setShowConnection(false);
    } else {
      renderToastError(result?.message || "Something went wrong");
    }
  } catch (error: any) {
    console.log("REQUEST ERROR", error);

    renderToastError(
      error?.data?.message ||
        error?.message ||
        "Something went wrong"
    );
  }
};
const submitReview = async (values: {
  review: any;
  imp_facts: any;
  sender_profile_type: any;
  sender_profile_id?: any;
}) => {
  if (postrating < 1) {
    renderToastError("Please select at least one star");
    return;
  }

  try {
    const body = {
      sender_id: user.id,
      sender_profile_id: values.sender_profile_id,
      sender_profile_type: values.sender_profile_type,

      receiver_id: profile.users_id,
      receiver_profile_id: profile.id,
      receiver_profile_type: profile.type,

      review: values.review,
      imp_facts: values.imp_facts,
      rating: postrating,
    };

    const res = await writeReview(body).unwrap();

    if (res.success) {
      renderToastSuccess(res.message);
      setReviewModal(false);
    } else {
      renderToastError(
        res.message || "Review submission failed"
      );
    }
  } catch (error: any) {
    renderToastError(
      error?.data?.message ||
        error?.error ||
        "Review submission failed"
    );
  }
};
 const toggleSave = async () => {
  const nextSavedValue = !isSaved;

  try {
    if (isSaved) {
      await unsaveItemApi({
        saved_id: id,
        user_id: user.id,
        type: type.toLowerCase(),
      }).unwrap();
    } else {
      await saveItemApi({
        saved_id: id,
        user_id: user.id,
        type: type.toLowerCase(),
      }).unwrap();
    }

    // Single view ka heart update
    setIsSaved(nextSavedValue);

    // Profile listing ka local cache update
    onSavedChange?.(nextSavedValue);
  } catch (error) {
    console.log("Error saving/unsaving profile:", error);
  }
};

  useEffect(() => {
    const maintenanceTypes = ['electrician', 'plumber', 'decor', 'painter', 'builder'];

    const normalizedType = type?.toLowerCase();

    const onPage = maintenanceTypes.includes(normalizedType)
      ? 'maintenance_single'
      : `${normalizedType}_single`;

    getRandomAd({ on_page: onPage });
  }, [type]);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // scale in
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
  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-2deg", "2deg"],
  });
const insets = useSafeAreaInsets();
  return (
    <>
      <ScrollView className="flex-1 bg-white">
        {/* Cover */}
        <View style={{ position: "relative" }}>
          <HeaderWithBack onBackpress={() => setshowModel(false)} isSavedItem onpressSave={()=>setShowSaved(true)} />
          {randomAdData?.data?.ad_link && (
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
              if (randomAdData?.data?.ad_link) {
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
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </Animated.View>)}
          <Image
            source={{
              uri: ImageFormater(profile?.cover),
            }}
            defaultSource={NoImage}
            style={styles.cover}
          
          />
        </View>

        {/* Business Info */}
        <View style={styles.businessCard}>
          <Text style={[styles.title, { color: "white" }]}>
            {profile?.business_name}
          </Text>

          <Text style={styles.whiteText}>{profile?.address}</Text>

          <Text style={styles.whiteText}>
            {profile?.city}, {profile?.zip}, {profile?.state}
          </Text>
        </View>

        {/* Services */}
        <View style={styles.card}>
          {profile?.material ? (
    <>
      <Text style={styles.sectionTitle}>Material Supplies</Text>
      <Text style={styles.text}>{profile.material}</Text>
    </>
  ) : profile?.services || profile?.agent_for ? (
    <>
      <Text style={styles.sectionTitle}>Services For</Text>
      <Text style={styles.text}>
        {profile?.services || profile?.agent_for}
      </Text>
    </>
  ) : null}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
            Dealing Areas
          </Text>

          <Text style={styles.text}>{profile?.dealing_areas}</Text>

          {/* Contact */}
          <View style={styles.rowBetween}>
            <TouchableOpacity  activeOpacity={1}
            style={styles.row} onPress={()=>{
              makeCall(profile?.contact)
            }}>
              <Call height={hs(20)} width={hs(20)} />
              <Text style={styles.text}>{profile?.contact}</Text>
            </TouchableOpacity>


          </View>
          <View  className="mt-2" >
          <TouchableOpacity  activeOpacity={1}
          style={styles.row} onPress={ ()=>{const finalUrl = profile?.web?.startsWith("https")
                  ? profile?.web
                  : `https://${profile?.web}`;
                WebBrowser.openBrowserAsync(finalUrl);}}>
            <Ionicons name="globe-outline" size={hs(20)} color={Colors.light.DarkGreen} />
            <Text style={styles.text}>{profile?.web}</Text>
            </TouchableOpacity>
            </View>
          {/* Divider */}
          <View style={styles.divider} />

    <View className='flex-row justify-between'>
          <View className='flex-row justify-end gap-3' style={styles.row}>
         <TouchableOpacity  activeOpacity={1}
          onPress={()=>toggleSave()} >
               { isSaved ? (
                                                     <RedHeart />
                                                   ) : (
              <Heart />
                                                   )}
            </TouchableOpacity>
            <TouchableOpacity  activeOpacity={1}
            onPress={() => setShowShare(true)}>
              <Share />
            </TouchableOpacity>
          </View>
          {profile?.users_id!==user.id&&(
           <FollowButton
                          id={profile?.receiver_id}
                      status={connectionStatus}
                          isLoading={senddingRequest||accepting||canceling||unfollowing}
                          onPress={(status) => {
          
                            setStatus(status)
          
                            if (user.user_type === "Business") {
                              setSelectedReceiver(profile);
          
          
                              if (status === "Connect") {
                                setShowConnection(true);
                              }
                              else {
                                requestSend({
                                  reciverProfile: profile,
                                  sender_ProfileId: "",
                                  sender_type: "Business",
                                  statusi: status,
                                  sender_data:user,
                                });
                              }
                            } else {
                              setStatus(status)
                              requestSend({
                                reciverProfile: profile,
                                sender_ProfileId: "",
                                sender_type: "Private",
                                statusi: status,
                                sender_data:user,
                              });
          
                            }
                          }
          
          
          
                          }
                        />)}
          </View>
        </View>

        {/* About */}
        <View style={{ marginHorizontal: hs(10) }}>
          <Text style={styles.aboutTitle}>
            ABOUT{" "}
           
          </Text>
          <Text style={[styles.aboutTitle,{ color: Colors.light.red,marginTop:hs(0) }]}>
            {profile?.business_name}
          </Text>
          <Text style={styles.description}>
            {expanded
              ? profile?.remarks
              : profile?.remarks?.slice(0, 90) +
              (profile?.remarks?.length > 90 ? "..." : "")}

            {profile?.remarks?.length > 90 && (
              <Text
                style={styles.moreText}
                onPress={() => setExpanded(!expanded)}
              >
                {expanded ? " Show Less" : " Read More"}
              </Text>
            )}
          </Text>
          <View style={{ backgroundColor: Colors.light.lightGray, padding: hs(10), borderRadius: hs(10), marginVertical: hs(10), gap: hs(10) }}>
            <Text style={{ color: Colors.light.textGray, fontSize: hs(16), fontWeight: 'bold', textAlign: 'center' }}>Ads by</Text>
             <Text style={{ color: Colors.light.red,fontSize: hs(16), fontWeight: 'bold', textAlign: 'center' }}>{profile?.business_name}</Text>
            <View style={styles.row}>
              <TouchableOpacity  activeOpacity={1}
               style={{ flex: 1, alignItems: 'center',backgroundColor:"white",paddingVertical:hs(20),borderRadius:hs(10),marginHorizontal:hs(20) }} onPress={()=>router.push({pathname:"/MyPostListing",params:{id:profile.users_id.toString(),type:"rent",profile_type:type,name:profile?.business_name}})}>
                <Text style={{ color: Colors.light.textGray, fontSize: hs(14), fontWeight: 'bold' }}>Rent ads</Text>
                <Text style={{ color: Colors.light.textGray, fontSize: hs(13) }}>{profile?.rent_posts}</Text>
              </TouchableOpacity>
              <View style={{ width: hs(1), height: hs(50), backgroundColor: Colors.light.textGray }} />
              <TouchableOpacity 
               activeOpacity={1}
               style={{ flex: 1, alignItems: 'center',backgroundColor:"white",paddingVertical:hs(20),borderRadius:hs(10),marginHorizontal:hs(20) }}
              
              onPress={()=>router.push({pathname:"/MyPostListing",params:{id:profile.users_id.toString(),type:"sale",profile_type:type,name:profile?.business_name}})}>  
                <Text style={{ color: Colors.light.textGray, fontSize: hs(14), fontWeight: 'bold' }}>Sale ads</Text>
                <Text style={{ color: Colors.light.textGray, fontSize: hs(13) }}>{profile?.sale_posts}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Map */}
          {showMap && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
          )}

          <VideoSection url={profile?.youtube_link} />
          {profile?.advisory_service === "Yes"||profile?.valuation_for && (
            <>
              <TouchableOpacity
               activeOpacity={1}
                onPress={() => setShowMortgage(!showMortgage)}
                style={{
                  backgroundColor: Colors.light.LightGreen,
                  padding: hs(10),
                  borderRadius: hs(10),
                  marginVertical: hs(10),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >

                <Text style={{
                  color: Colors.light.textGray,
                  fontSize: hs(16),
                  fontWeight: 'bold'
                }}>
                  Ask for FREE
                </Text>

                <Ionicons
                  name={showMortgage ? "chevron-up" : "chevron-down"}
                  size={22}
                  color={Colors.light.textGray}
                />

              </TouchableOpacity>
              {showMortgage && <View style={styles.mortgageCard}>
                <Text style={styles.mortgageTitle}>
                  Ask for FREE home <Text style={{ color: Colors.light.red, fontWeight: 'bold' }}>{type?.toLocaleUpperCase()}</Text> advice from
                  <Text style={styles.mortgageCompany}>
                    {" "}{profile?.business_name}
                  </Text>
                </Text>



                <Formik
                  initialValues={{
                    address: "",
                    city: "",
                    state: "",
                    zip: "",
                    lat: 0,
                    lng: 0,
                    advice_for: "Home purchase",
                    name: "",
                    email: "",
                    contact: "",
                    message: "",
                  }}
                  onSubmit={(values, { resetForm }) => {
                    const payload = {
                      ...values,
                      agent_email: profile?.email,
                      agent_name: profile?.business_name,
                      agent_cover: profile?.logo,
                    };

                    askEvaluation(payload)
                      .unwrap()
                      .then((res) => {
                        renderToastSuccess(res.message || "Request sent successfully");
                        resetForm();
                      })
                      .catch((err) => {
                        renderToastError(err?.data?.message || "Something went wrong");
                      });
                  }}
                >
                  {({
                    handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm
                  }) => (
                    <>
                      <AdressInput
                        city={"city"}
                        zip={"zip"}
                        state={"state"}
                        lat={"lat"}
                        long={"lng"}
                        latValue={values.lat}
                        longValue={values.lng}
                        name="address"
                        setValue={setFieldValue}
                        onSelect={() => { }}
                        title="Property Location"
                        placeholder="Enter complete address or street"
                        value={values.address}
                        touched={!!touched.address}
                        errors={!!errors.address}
                        required
                        withmap={false}
                        errorText={errors.address} />
                      {(type.toLocaleLowerCase() === "agent" || type.toLocaleLowerCase() === "mortgage")  && (
                          <FormikDropdownwithjson
                            title={"I need advice on?"}
                            key={values.advice_for}
                            setValue={setFieldValue}
                            required
                            placeholder="Select"
                            value={values.advice_for}
                            options={type.toLocaleLowerCase() === "mortgage"
                              ? [
                                {
                                  label: "Home purchase property",
                                  value: "Home purchase",
                                },
                                { label: "Refinance", value: "Refinance" },
                                {
                                  label: "Home equity",
                                  value: "Home equity",
                                },
                                { label: "Others", value: "Others" },
                              ]
                              : type.toLocaleLowerCase() === "agent"
                                ? [
                                  {
                                    label: "Selling property",
                                    value: "Selling property",
                                  },
                                  {
                                    label: "Buying property",
                                    value: "Buying property",
                                  },
                                  {
                                    label: "Letting property",
                                    value: "Letting property",
                                  },
                                  { label: "others", value: "others" },
                                ]
                                : []}
                            name="advice_for"
                            onSelect={() => { }} />
                        )}
                      <View style={styles.dottedDivider} />

                      <FormikInput
                        title="Name"
                        placeholder="Please enter name"
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        touched={!!touched.name}
                        errors={!!errors.name}
                        errorText={errors.name}
                        required={false} />

                      <FormikInput
                        title="Email"
                        placeholder="Please enter email"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        touched={!!touched.email}
                        errors={!!errors.email}
                        errorText={errors.email}
                        required={false} />

                      <FormikInput
                        title="Contact"
                        placeholder="Please enter contact"
                        onChangeText={handleChange("contact")}
                        onBlur={handleBlur("contact")}
                        value={values.contact}
                        touched={!!touched.contact}
                        errors={!!errors.contact}
                        errorText={errors.contact}
                        required={false} />

                      <FormikInput
                        title="Message"
                        placeholder="Write your message"
                        multiline
                        onChangeText={handleChange("message")}
                        onBlur={handleBlur("message")}
                        value={values.message}
                        touched={!!touched.message}
                        errors={!!errors.message}
                        errorText={errors.message}
                        required={false} />

                      <TouchableOpacity
                       activeOpacity={1}
                        style={styles.mortgageBtn}
                        onPress={() => handleSubmit()}
                      >
                        <Text style={styles.mortgageBtnText}>Send</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Formik>



              </View>}</>
          )}

          {(profile?.post_type==="Trending"||profile?.post_type==="Promoted") && (
            <>
              {posts?.length > 0 && (
                <TouchableOpacity
                 activeOpacity={1}
                  onPress={() => setShowpast(!showPast)}
                  style={{
                    backgroundColor: Colors.light.LightGreen,
                    padding: hs(12),
                    borderRadius: hs(10),
                    marginVertical: hs(10),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >

                  <Text style={{
                    color: Colors.light.textGray,
                    fontSize: hs(16),
                    fontWeight: 'bold'
                  }}>
                    {showPast
                      ? "Hide  past deals (jobs)"
                      : "Show  past deals (jobs)"}
                  </Text>

                  <Ionicons
                    name={showPast ? "chevron-up" : "chevron-down"}
                    size={22}
                    color={Colors.light.textGray}
                  />

                </TouchableOpacity>)}
              {showPast && type.toLocaleLowerCase() === "agent" && (
                <View>
                  <PastDealsagent
                    data={posts}
                    hasmore={hasMore}
                    isfetching={pastLoading}
                    setPage={setPage}
                    type={type.toLocaleLowerCase()}
                    setpost={setPosts}
                    refetch={refetch}
                    initialLoadDone={initialLoadDone}
                  />
                </View>
              )}
              {showPast && type.toLocaleLowerCase() !== "agent" && (
                <View style={{ marginTop: vs(15),flex:1 }}>
                <FlashList
  data={othePastdata?.data || []}
  keyExtractor={(item: any) =>
    item.user_past_work_id.toString()
  }
  renderItem={({ item }: any) => {
    const firstImage = item.images?.length
      ? ImageFormater(item.images[0])
      : null;

    return (
      <View style={styles.pastCard}>
        <Image
          source={firstImage ? { uri: firstImage } : NoImage}
          style={styles.fullImage}
        />

        <View style={styles.pastContent}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.pastTitle}>
                {item.property_type}
              </Text>

              <Text style={styles.pastText}>
                {item.property_sub_type}
              </Text>
            </View>
          </View>

          <Text style={styles.pastText}>
            Beds : {item.beds}
          </Text>

          <Text style={styles.pastText}>
            {item.city} , {item.state}
          </Text>

          <Text style={styles.pastDesc}>
            {item.job_description}
          </Text>
        </View>
      </View>
    );
  }}
/>
                </View>
              )}
            </>
          )}

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>
              Rating <Text style={{ color: Colors.light.DarkGreen }}>&</Text>{" "}
              Reviews
            </Text>

          <TouchableOpacity
  activeOpacity={0.8}
  style={styles.ratingBox}
  onPress={() => setShowReviewsModal(true)}
>
  <StarRating rating={rating} size={26} />

  <Text style={styles.ratingValue}>
    {rating.toFixed(1)}
  </Text>

  <Text style={styles.reviewCount}>
    {totalReviews} Reviews
  </Text>


</TouchableOpacity>

            <TouchableOpacity
             activeOpacity={1}
              style={styles.reviewBtn}
              onPress={() => setReviewModal(true)}
            >
              <Text style={styles.reviewBtnText}>
  {reviewData?.review_exists ? "Amend Review" : "Write a Review"}
</Text>
            </TouchableOpacity>

          
          </View>
        </View>
        <Loading isLoading={isLoading} text="Loading.." />
      </ScrollView>


      <TouchableOpacity
       activeOpacity={1}
        style={[styles.stickyBottomBtn,{   
      bottom:  insets.bottom,
    }]}
        onPress={() => {
          router.navigate({
            pathname: "/ChatScreen",
            params: {
              userId: profile?.users_id,
              name: profile?.business_name,
              title:profile?.business_name,
              receiver_post_id:profile?.id,
                      type:profile.type.toLowerCase()
            },
          });
        }}
      >
        <View style={styles.agentContainer}>
          <CircleImage
            Size={40}
            source={{
              uri: ImageFormater(profile?.logo),
            }}
          />
     <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Message to{" "}
  {profile?.business_name?.length > 18
    ? profile?.business_name.slice(0, 18) + "..."
    : profile?.business_name}
</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={reviewModal} transparent animationType="fade">
               <SafeAreaView
                                                         style={{ flex: 1 }}
                                                         edges={[ "bottom", "left", "right"]}
                                                       >
        <ScrollView style={{width:"100%"}}>
          <Formik
            initialValues={{
              review: reviewData?.data?.review||"",
              imp_facts:reviewData?.data?.imp_facts|| "",
              sender_profile_type: reviewData?.data?.sender_profile_type||"",
              sender_profile_id: "",
            }}
            validationSchema={ReviewSchema}
           onSubmit={async (values) => { submitReview(values);

 

}}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Write Review</Text>

                  <SetRating
                    rating={postrating}
                    setRating={setpostRating}
                    size={30}
                  />

                  <FormikInput
                    title="More Description"
                    placeholder="Write here (Upto 5000 characters)"
                    onChangeText={handleChange("review")}
                    onBlur={handleBlur("review")}
                    value={values.review}
                    touched={!!touched.review}
                    errors={!!errors.review}
                    errorText={errors.review}
                    multiline
                    required={false}
                  />

                  <FormikInput
                    placeholder=" important facts or your experience about "
                    onChangeText={handleChange("imp_facts")}
                    onBlur={handleBlur("imp_facts")}
                    value={values.imp_facts}
                    mulipleFields
                    name="imp_facts"
                    setValue={setFieldValue}
                    title={""}
                    touched={!!touched.imp_facts}
                    errors={!!errors}
                    required={false}
                    errorText={errors.imp_facts}
                  />

                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                      Select Profile
                    </Text>

                    {Profiles?.profiles?.map((item, index) => {
                   const selected =
  values.sender_profile_type ===
  (item.profile_type === "Business" || item.profile_type === "Private"
    ? item.profile_type
    : item.profile_type.toLowerCase());

                      return (
                        <TouchableOpacity
                         activeOpacity={1}
                          key={index}
                          style={[
                            styles.profileCard,
                            selected && {
                              borderColor: Colors.light.DarkGreen,
                              borderWidth: 2,
                            },
                          ]}
                          onPress={() => {
                            setFieldValue(
  "sender_profile_type",
  item.profile_type === "Business" || item.profile_type === "Private"
    ? item.profile_type
    : item.profile_type.toLowerCase()
);
                            setFieldValue("sender_profile_id", item.profile_id);
                          }}
                        >
                          <CircleImage
                            Size={50}
                            source={{
                              uri: ImageFormater(item.logo),
                            }}
                          />

                          <View style={{ marginLeft: 12 }}>
                            <Text style={styles.businessName}>
                              {item.business_name}
                            </Text>

                            <Text style={styles.profileType}>
                              {item.profile_type}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}

                    {touched.sender_profile_type &&
                      errors.sender_profile_type && (
                        <Text
                          style={{
                            color: "red",
                            marginTop: 5,
                          }}
                        >
                          {errors.sender_profile_type}
                        </Text>
                      )}
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                     activeOpacity={1}
                      onPress={() => {
                        setReviewModal(false);
                      }}
                      style={styles.cancelBtn}
                    >
                      <Text style={{fontWeight:"700"}}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                     activeOpacity={1}
                      onPress={handleSubmit}
                      style={styles.submitBtn}
                    >
                      <Text style={{ color: "white",fontWeight:"700" }}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
        </SafeAreaView>
          <Loading isLoading={sendingReview} text='Loading...'/>
      </Modal>
    <Modal
  visible={showShare}
  animationType="slide"
  transparent
  statusBarTranslucent
  onRequestClose={() => setShowShare(false)}
>
  <SafeAreaView
    style={{ flex: 1 }}
    edges={["top", "bottom", "left", "right"]}
  >
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: ms(20),
          borderTopRightRadius: ms(20),
          paddingHorizontal: hs(20),
          paddingTop: vs(12),
          paddingBottom: vs(15),
          maxHeight: "85%",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: vs(15),
          }}
        >
          <Text
            style={{
              fontSize: ms(18),
              fontWeight: "600",
              fontFamily: "PopinRegula",
            }}
          >
            Share Profile
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowShare(false)}
            style={{
              width: hs(38),
              height: hs(38),
              borderRadius: hs(19),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cross height={vs(22)} width={vs(22)} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: vs(10),
          }}
        >


<View style={{ marginBottom: 20 }}>
  <Text
    style={{
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 12,
      fontFamily: "PopinRegula",
    }}
  >
    Share via
  </Text>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("whatsapp")
      }
      style={{
        alignItems: "center",
        width: "20%",
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: "#25D366",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome
          name="whatsapp"
          size={27}
          color="#fff"
        />
      </View>

      <Text
        style={{
          fontSize: 11,
          marginTop: 6,
          fontFamily: "PopinRegula",
        }}
      >
        WhatsApp
      </Text>
    </TouchableOpacity>


    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("facebook")
      }
      style={{
        alignItems: "center",
        width: "20%",
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: "#1877F2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome
          name="facebook"
          size={26}
          color="#fff"
        />
      </View>

      <Text
        style={{
          fontSize: 11,
          marginTop: 6,
          fontFamily: "PopinRegula",
        }}
      >
        Facebook
      </Text>
    </TouchableOpacity>


    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("twitter")
      }
      style={{
        alignItems: "center",
        width: "20%",
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: "700",
          }}
        >
          X
        </Text>
      </View>

      <Text
        style={{
          fontSize: 11,
          marginTop: 6,
          fontFamily: "PopinRegula",
        }}
      >
        X
      </Text>
    </TouchableOpacity>


    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        shareOnSocial("linkedin")
      }
      style={{
        alignItems: "center",
        width: "20%",
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: "#0A66C2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome
          name="linkedin"
          size={25}
          color="#fff"
        />
      </View>

      <Text
        style={{
          fontSize: 11,
          marginTop: 6,
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
    width: "20%",
  }}
>
  <View
    style={{
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: "#E5E7EB",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#D1D5DB",
    }}
  >
    <Ionicons
      name="ellipsis-horizontal"
      size={26}
      color="#374151"
    />
  </View>

  <Text
    style={{
      fontSize: 11,
      marginTop: 6,
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
      backgroundColor: "#e5e7eb",
      marginTop: 20,
      marginBottom: 5,
    }}
  />
</View>
            <Formik
              initialValues={{
                recepient_email: "",
                message: "",
                link: `https://sweetghar.com/postRedirect?post_id=${id}&&type=${"profile"}&&profile_type=${type}`,
                post_id: id,
                type: type.toLocaleLowerCase(),
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
              onSubmit={async (values) => {
                try {
                  const formData = new FormData();
                  formData.append("email", values.recepient_email);
                  formData.append("message", values.message);
                  formData.append("link", values.link);
                  formData.append("post_id", values.post_id);
                  formData.append("type", "profile");
                  formData.append("profile_type", type.toLocaleLowerCase());
                  console.log(formData);
                  const result = await share_profileApi(formData).unwrap();
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
                    errorText={errors.recepient_email} title={"Email"} required={true} />


                  <FormikInput
                    name="message"
                    placeholder="Write your message..."
                    value={values.message}
                    onChangeText={handleChange("message")}
                    onBlur={handleBlur("message")}
                    multiline
                    touched={!!touched.message}
                    errors={!!errors.message}
                    errorText={errors.message} title={"Message"} required={true} />

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
  </ScrollView>
          </View>
        </View>
        </SafeAreaView>
      
        <Loading isLoading={sharing} text="Sharing..." />
      </Modal>
                 <Modal visible={showSaved} onRequestClose={() => setShowSaved(false)} animationType="slide"  statusBarTranslucent>
                   <SafeAreaView
                                                         style={{ flex: 1 }}
                                                         edges={[ "bottom", "left", "right"]}
                                                       >
              <SavedItems setShowSaved={setShowSaved} />
              </SafeAreaView>
            </Modal>
                 <Modal
                    visible={showConnection}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowConnection(false)}
                  >
                     <SafeAreaView
                                                         style={{ flex: 1 }}
                                                         edges={[ "bottom", "left", "right"]}
                                                       >
                    <TouchableOpacity
                     activeOpacity={1}
                      style={styles.overlay}
                     
                      onPressOut={() => setShowConnection(false)}
                    >
                      <View
                        style={[
                          styles.profileContainer,
                         styles.fullModal,
                        ]}
                      >
                        <Text style={styles.title}>Connect As</Text>
            
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={{ flexGrow: 1 }}
                        >
                          {Profiles?.profiles?.map((item, index) => (
                            <TouchableOpacity
                             activeOpacity={1}
                              key={index}
                              style={styles.profileCard}
                              onPress={() => {
                                console.log(item)
                                requestSend({
                                  reciverProfile: selectedReceiver,
                                  sender_ProfileId: item.profile_id,
                                  sender_type: item.profile_type,
                                  statusi: statuse,
                                  sender_data:item,
                                });
            
                                setShowConnection(false);
                              }}
                            >
                              <CircleImage
                                Size={50}
                                source={{ uri: ImageFormater(item.logo) }}
                              />
            
                              <View style={{ marginLeft: 12 }}>
                                <Text style={styles.businessName}>
                                  {item.business_name}
                                </Text>
            
                                <Text style={styles.profileType}>
                                  {item.profile_type}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableOpacity>
                    </SafeAreaView>
                  </Modal>
                  <Modal
  visible={showReviewsModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowReviewsModal(false)}
>
  <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.reviewsOverlay}>

      <View style={styles.reviewsModalContainer}>

        {/* Header */}
        <View style={styles.reviewsHeader}>

          <View>
            <Text style={styles.reviewsTitle}>
              Ratings & Reviews
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <StarRating rating={rating} size={18} />

              <Text
                style={{
                  marginLeft: 8,
                  fontFamily: "PopinRegula",
                  fontWeight: "600",
                }}
              >
                {rating.toFixed(1)} ({totalReviews} Reviews)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowReviewsModal(false)}
          >
            <Ionicons
              name="close"
              size={28}
              color={Colors.light.textGray}
            />
          </TouchableOpacity>

        </View>

        <View style={styles.divider} />

        {/* Reviews */}
        {reviewsLoading ? (

          <Loading
            isLoading={true}
            text="Loading reviews..."
          />

        ) : allReviews.length === 0 ? (

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "PopinRegula",
                color: Colors.light.textGray,
              }}
            >
              No reviews yet
            </Text>
          </View>

        ) : (

          <FlatList
            data={allReviews}
            keyExtractor={(item: any, index) =>
              item.id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: vs(30),
            }}
            renderItem={({ item }: any) => (

              <View style={styles.singleReviewCard}>

                {/* Reviewer */}
                <View style={styles.reviewUserRow}>

                  <CircleImage
                    Size={45}
                    source={{
                      uri: ImageFormater(item?.reviewer_logo),
                    }}
                  />

                  <View
                    style={{
                      flex: 1,
                      marginLeft: hs(10),
                    }}
                  >
                    <Text style={styles.reviewerName}>
                      {item?.reviewer_name || "User"}
                    </Text>

                    <Text style={styles.reviewerType}>
                      {item?.sender_profile_type}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <StarRating
                      rating={Number(item?.rating || 0)}
                      size={16}
                    />

                    <Text style={styles.singleRating}>
                      {Number(item?.rating || 0).toFixed(1)}
                    </Text>
                  </View>

                </View>

                {/* Comment */}
                {item?.review ? (
                  <View style={{ marginTop: vs(12) }}>

                    <Text style={styles.reviewLabel}>
                      Review
                    </Text>

                    <Text style={styles.reviewText}>
                      {item.review}
                    </Text>

                  </View>
                ) : null}

                {/* Important facts */}
                {item?.imp_facts ? (
                  <View
                    style={{
                      marginTop: vs(10),
                    }}
                  >
                    <Text style={styles.reviewLabel}>
                      Experience
                    </Text>

                    <Text style={styles.reviewText}>
                      {item.imp_facts}
                    </Text>
                  </View>
                ) : null}

              </View>

            )}
          />

        )}

      </View>

    </View>
  </SafeAreaView>
</Modal>
                  <Loading isLoading={askEvaluationLoading} text='Loading..'/>
                
    </>
  );
};

export default ProfileSingleView;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewsOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "flex-end",
},

reviewsModalContainer: {
  backgroundColor: "#fff",
  borderTopLeftRadius: hs(20),
  borderTopRightRadius: hs(20),
  paddingHorizontal: hs(20),
  paddingTop: vs(20),
  height: "80%",
},

reviewsHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

reviewsTitle: {
  fontSize: ms(20),
  fontWeight: "700",
  fontFamily: "PopinRegula",
  color: Colors.light.textGray,
},

singleReviewCard: {
  backgroundColor: "#fff",
  borderRadius: hs(12),
  padding: hs(15),
  marginVertical: vs(8),
  borderWidth: 1,
  borderColor: "#E5E5E5",
},

reviewUserRow: {
  flexDirection: "row",
  alignItems: "center",
},

reviewerName: {
  fontSize: ms(15),
  fontWeight: "700",
  fontFamily: "PopinRegula",
  color: Colors.light.textGray,
},

reviewerType: {
  fontSize: ms(12),
  fontFamily: "PopinRegula",
  color: "#777",
  marginTop: 2,
},

singleRating: {
  fontSize: ms(12),
  fontWeight: "600",
  fontFamily: "PopinRegula",
  marginTop: 3,
},

reviewLabel: {
  fontSize: ms(13),
  fontWeight: "700",
  fontFamily: "PopinRegula",
  color: Colors.light.DarkGreen,
},

reviewText: {
  fontSize: ms(13),
  fontFamily: "PopinRegula",
  color: Colors.light.textGray,
  marginTop: vs(4),
  lineHeight: ms(20),
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
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    height: 100,
    marginTop: 10,
  },
  profileType: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
    fontFamily: "PopinRegula",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cancelBtn: {
    padding: 10,
  },

  submitBtn: {
    backgroundColor: Colors.light.DarkGreen,
    padding: 10,
    borderRadius: 8,
  },
  cover: {
    height: vs(250),
    width: "100%",
    borderBottomLeftRadius: ms(0),
    borderBottomRightRadius: ms(0),
    resizeMode: "cover",
    backgroundColor: "gray",
  },

  businessCard: {
    marginHorizontal: hs(10),
    padding: 15,
    backgroundColor: Colors.light.DarkGreen,
    borderRadius: 15,
    marginTop: vs(20),
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "PopinRegula",
  },

  whiteText: {
    color: "white",
    marginTop: 4,
    fontFamily: "PopinRegula",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    fontFamily: "PopinRegula",
  },

  text: {
    fontFamily: "PopinRegula",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },

  aboutTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.DarkGreen,
    marginTop: 20,
    fontFamily: "PopinRegula",
  },

  description: {
    marginVertical: 10,
    fontFamily: "PopinRegula",
    fontSize:ms(15),
  },

  moreText: {
    color: Colors.light.DarkGreen,
    fontWeight: "600",
  },

  map: {
    height: vs(250),
    width: "100%",
    marginTop: vs(10),
    marginBottom: vs(20),
  },
  profileContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  ratingContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    elevation: 3,
    marginBottom: hs(70)
  },

  ratingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.red,
    marginBottom: 15,
  },

  ratingBox: {
    alignItems: "center",
  },

  ratingValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 8,
    color: Colors.light.DarkGreen,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 10000,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  reviewCount: {
    fontSize: 14,
    color: "#777",
  },

  reviewBtn: {
    marginTop: 15,
    backgroundColor: Colors.light.DarkGreen,
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: "center",
  },

  reviewBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  dealText: {
    marginTop: 18,
    color: "#666",
  },

  businessName: {
    fontWeight: "700",
    color: Colors.light.red,
  },
  mortgageCard: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },

  mortgageTitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    fontFamily: "PopinRegula",
  },

  mortgageCompany: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.red,
    marginBottom: 15,
  },
 centerModal: {
    maxHeight: "50%",
  },


  fullModal: {
    height: "80%",
  },
  mortgageBtn: {
    backgroundColor: Colors.light.DarkGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  mortgageBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  stickyBottomBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: hs(10),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.light.red,
    paddingVertical: vs(10),
  },

  agentContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: hs(20),
    gap: hs(10),
  },

  dottedDivider: {
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: Colors.light.DarkGreen,
    marginVertical: 15,
  },
  pastCard: {
    backgroundColor: "white",
    marginHorizontal: hs(15),
    marginBottom: vs(15),
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
  },

  fullImage: {
    width: "100%",
    height: vs(180),
    resizeMode: "cover",
  },

  pastContent: {
    padding: 12,
  },

  pastTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "PopinRegula",
  },

  pastText: {
    fontSize: 13,
    marginTop: 3,
    fontFamily: "PopinRegula",
  },

  pastDesc: {
    fontSize: 13,
    marginTop: 6,
    color: "gray",
    fontFamily: "PopinRegula",
  },
});
