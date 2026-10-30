import {
  useAskvaluationapiMutation,
  useGetotherPastWorkQuery,
  useGetProfilesForConectionQuery,
  useGetSingleProfileQuery,
  useSaveItemApiMutation,
  useShare_profileApiMutation,
  useUnsaveItemApiMutation,
  useUserAgentPastPostsApiQuery,
  useWriteReviewApiMutation,
} from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import Call from "@assets/Buy/call.svg";
import Cross from "@assets/CreateProfile/cross.svg";
import RedHeart from "@assets/CreateProfile/heart-red.svg";
import Heart from "@assets/icons/heart.svg";
import Share from "@assets/icons/share.svg";
import NoImage from "@assets/SideBar/no_images.png";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { AdressInput } from "@src/components/globals/AddressInput";
import CircleImage from "@src/components/globals/CircleImage/CircleImage";
import { FormikInput } from "@src/components/globals/FormictInput";
import { FormikDropdownwithjson } from "@src/components/globals/FormikDropdownwithjson";
import HeaderWithBack from "@src/components/globals/HeaderWithBack";
import LargeButton from "@src/components/globals/LaregeButton";
import Loading from "@src/components/globals/Loading";
import PastDealsagent from "@src/components/globals/PastDealsagent";
import SetRating from "@src/components/globals/SetRating";
import StarRating from "@src/components/globals/StarRating";
import VideoSection from "@src/components/globals/ViedioSection";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";

import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const Index = () => {
  const user = useAppSelector(userdata);
  const params = useLocalSearchParams();
  const type = params.type as string;
  const id = Number(params.id);
const user_id = Number(user?.id);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [review, setReview] = useState("");
  const [postrating, setpostRating] = useState(0);
  const [showConnection, setShowConnection] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPast, setShowpast] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [askEvaluation, { isLoading: askEvaluationLoading }] = useAskvaluationapiMutation();
  const ReviewSchema = Yup.object().shape({
    review: Yup.string()
      .required("Review is required")
      .max(5000, "Maximum 5000 characters"),

    sender_profile_type: Yup.string().required("Please select profile"),

    sender_profile_id: Yup.string().nullable(),

    imp_facts: Yup.string(),
  });
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [posts, setPosts] = useState<[]>([]);
  const [hasMore, setHasMore] = useState(true);
console.log("user:", user);
console.log("user?.id:", user?.id);
console.log("skip:", !user?.id);
 
const { data, isLoading } = useGetSingleProfileQuery(
  {
    type,
    id,
    user_id: Number(user?.id),
  },
  {
    skip: !user?.id,
  }
);

  const [share_profileApi, { isLoading: sharing }] = useShare_profileApiMutation();
  const profile = data?.data;
     const [saveItemApi] = useSaveItemApiMutation();
        const [unsaveItemApi] = useUnsaveItemApiMutation();
  const { data: Profiles, isLoading: ProfilesLoading } =
    useGetProfilesForConectionQuery({ id: user?.id });
  const {
    data: othePastdata,
    isLoading: otherWorkLoding,
    refetch: pastRefetch,
  } = useGetotherPastWorkQuery(
    { user_id: profile?.users_id, work_section: type },
    { skip: !profile?.users_id || type === "agent" || profile?.post_type !== "Trending"||type===null }
  );

  const {
    data: pastData,
    isLoading: pastLoading,
    refetch,
  } = useUserAgentPastPostsApiQuery(
    { page, per_page: perPage, user_id: profile?.users_id },
    { skip: !profile?.users_id || type !== "agent" || profile?.post_type !== "Trending"||type===null|| !user?.id, }
  );
  useEffect(() => {
    if (!pastData?.data) return;

    setHasMore(pastData?.has_more);

    setPosts((prev) =>
      page === 1 ? pastData.data : [...prev, ...pastData.data]
    );
    setInitialLoadDone(true);
  }, [pastData]);
  const [writeReview] = useWriteReviewApiMutation();
  const latitude = Number(profile?.user_lat);
  const longitude = Number(profile?.user_lng);
  const showMap = !isNaN(latitude) && !isNaN(longitude);
  const [showMortgage, setShowMortgage] = useState(false);
  const rating = Number(profile?.rating || 0);
  const totalReviews = profile?.total_reviews || 0;
  const submitReview = async (values: {
    review: any;
    imp_facts: any;
    sender_profile_type: any;
    sender_profile_id?: any;
  }) => {
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

      // API returned success
      if (res.success) {
        renderToastSuccess(res.message);
      } else {
        // This shouldn't happen with unwrap(), but just in case
        renderToastError(res.message || "Review submission failed");
      }
    } catch (error) {
      // RTK Query unwrap throws here for 4xx/5xx responses
      const errorMsg =
        error?.data?.message || // your backend message
        error?.error || // fallback
        "Review submission failed";

      renderToastError(errorMsg);
    } finally {
      setReview(false);
    }
  };
    const [isSaved,setIsSaved]=useState(profile?.is_saved ?? false);

        const toggleSave = async () => {
     
      try {
        if (isSaved) {
          await unsaveItemApi({
            saved_id: item?.data?.id,
            user_id: user.id,
            type: item?.data?.type,
          }).unwrap();
        } else {
          await saveItemApi({
            saved_id: item?.data?.id,
            user_id: user.id,
            type: item?.data?.type,
          }).unwrap();
        }
      } catch (error) {
        console.log("Error saving/unsaving item:", error);

      } finally {
        setIsSaved((prev) => !prev);
      }
    };


  return (
    <>
      <ScrollView className="flex-1 bg-white">
        {/* Cover */}
        <View style={{ position: "relative" }}>
          <HeaderWithBack onBackpress={() => router.navigate("/Home/Feeds/NewsFeed")} />
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
          <Text style={styles.sectionTitle}>Service for</Text>
          <Text style={styles.text}>{profile?.services}</Text>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
            Dealing Areas
          </Text>

          <Text style={styles.text}>{profile?.dealing_areas}</Text>

          {/* Contact */}
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Call />
              <Text style={styles.text}>{profile?.contact}</Text>
            </View>

            <Text style={styles.text}>{profile?.web}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Actions */}
          <View style={styles.row}    >
            <TouchableOpacity
             activeOpacity={1}
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
        </View>

        {/* About */}
        <View style={{ marginHorizontal: hs(10) }}>
          <Text style={styles.aboutTitle}>
            ABOUT{" "}
            <Text style={{ color: Colors.light.red }}>
              {profile?.business_name}
            </Text>
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
            <Text style={{ color: Colors.light.textGray, fontSize: hs(16), fontWeight: 'bold', textAlign: 'center' }}>Total post by <Text style={{ color: Colors.light.red }}>{profile?.business_name}</Text></Text>
            <View style={styles.row}>
              <TouchableOpacity  activeOpacity={1} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: Colors.light.textGray, fontSize: hs(14), fontWeight: 'bold' }}>Rent post</Text>
                <Text style={{ color: Colors.light.textGray, fontSize: hs(13) }}>{profile?.rent_posts}</Text>
              </TouchableOpacity>
              <View style={{ width: hs(1), height: hs(50), backgroundColor: Colors.light.textGray }} />
              <TouchableOpacity  activeOpacity={1} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: Colors.light.textGray, fontSize: hs(14), fontWeight: 'bold' }}>Sale post</Text>
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
          {profile?.advisory_service === "Yes" && (
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
                      {type === "agent" ||
                        (type === "mortgage" && (
                          <FormikDropdownwithjson
                            title={"I need advice on?"}
                            key={values.advice_for}
                            setValue={setFieldValue}
                            required
                            placeholder="Select"
                            value={values.advice_for}
                            options={type === "mortgage"
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
                              : type === "agent"
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
                        ))}
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

          {profile?.post_type && (
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
              {showPast && type === "agent" && (
                <View>
                  <PastDealsagent
                    data={posts}
                    hasmore={hasMore}
                    isfetching={pastLoading}
                    setPage={setPage}
                    type={type}
                    setpost={setPosts}
                    refetch={refetch}
                    initialLoadDone={initialLoadDone}
                  />
                </View>
              )}
              {showPast && type !== "agent" && (
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

            <View style={styles.ratingBox}>
              <StarRating rating={rating} size={26} />

              <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>

              <Text style={styles.reviewCount}>{totalReviews} Reviews</Text>
            </View>

            <TouchableOpacity
             activeOpacity={1}
              style={styles.reviewBtn}
              onPress={() => setReviewModal(true)}
            >
              <Text style={styles.reviewBtnText}>Write a Review</Text>
            </TouchableOpacity>

          
          </View>
        </View>
        <Loading isLoading={isLoading} text="Loading.." />
      </ScrollView>


      <TouchableOpacity
       activeOpacity={1}
        style={styles.stickyBottomBtn}
        onPress={() => {
          router.navigate({
            pathname: "/ChatScreen",
            params: {
              userId: profile?.users_id,
              name: profile?.business_name,
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
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Send Message to {profile?.business_name}
          </Text>
        </View>
      </TouchableOpacity>
      <Modal visible={reviewModal} transparent animationType="fade">
        <SafeAreaView
                                      style={{ flex: 1 }}
                                      edges={[ "bottom", "left", "right"]}
                                    >
        <ScrollView>
          <Formik
            initialValues={{
              review: "",
              imp_facts: "",
              sender_profile_type: "",
              sender_profile_id: "",
            }}
            validationSchema={ReviewSchema}
            onSubmit={(values) => submitReview(values)}
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
                        values.sender_profile_type === item.profile_type;

                      return (
                        <TouchableOpacity
                         activeOpacity={1}
                          key={index}
                          style={[
                            styles.profileCard,
                            selected && {
                              borderColor: "#0F9D58",
                              borderWidth: 2,
                            },
                          ]}
                          onPress={() => {
                            setFieldValue(
                              "sender_profile_type",
                              item.profile_type
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
                      <Text>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                     activeOpacity={1}
                      onPress={handleSubmit}
                      style={styles.submitBtn}
                    >
                      <Text style={{ color: "white" }}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
        </SafeAreaView>
      </Modal>
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
                link: `https://www.homeilove.co.uk/postRedirect?post_id=${id}&&type=${"profile"}&&profile_type=${type}`,
                post_id: id.toString(),
                type: type,
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
                  formData.append("profile_type", type);
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
        <Loading isLoading={sharing} text="Sharing..." />
      </Modal>
    </>
  );
};

export default Index;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
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
    borderBottomLeftRadius: ms(20),
    borderBottomRightRadius: ms(20),
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
  },

  moreText: {
    color: Colors.light.DarkGreen,
    fontWeight: "600",
  },

  map: {
    height: vs(250),
    width: "100%",
    marginVertical: 10,
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
    backgroundColor: Colors.light.red,
    paddingVertical: 10,
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
    backgroundColor: Colors.light.DarkGreen,
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
