import {
  useDeletePastWorkMutation,
  useDeleteProfileMutation,
  useGetAdvatizementPriceQuery,
  useGetotherPastWorkQuery,
  useGetPriceQuery,
  useGetSingleProfileQuery,
  useGetUserWalletQuery,
  usePromoteProfileMutation,
  useSavePastWorkMutation,
  useShare_profileApiMutation,
  useUpgradeProfileApiMutation,
  useUserAgentPastPostsApiQuery,
} from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import Call from "@assets/Buy/call.svg";
import Cross from "@assets/CreateProfile/cross.svg";
import Delete from "@assets/icons/MypostListing/delet.svg";
import Edit from "@assets/icons/MypostListing/edit.svg";
import Share from "@assets/icons/share.svg";
import NoImage from "@assets/SideBar/no_images.png";
import Paypal from "@assets/SideBar/paypal-icon.svg";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { FormikInput } from "@src/components/globals/FormictInput";
import HeaderWithBack from "@src/components/globals/HeaderWithBack";
import LargeButton from "@src/components/globals/LaregeButton";
import Loading from "@src/components/globals/Loading";
import PapPalPayment from "@src/components/globals/PapPalPayment";
import PastDealsagent from "@src/components/globals/PastDealsagent";
import PostPastWork from "@src/components/globals/PostPastWork";
import PromotionPricingCard from "@src/components/globals/PromotionPricingCard";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { SafeAreaView } from "react-native-safe-area-context";
import RNShare from "react-native-share";
import * as Yup from "yup";

const Index = () => {
  const user = useAppSelector(userdata);
  const params = useLocalSearchParams();
  const [upgradeProfile, { isLoading: ugradeLoading }] =
    useUpgradeProfileApiMutation();
  const [promoteProfile, { isLoading: promoteLoading }] =
    usePromoteProfileMutation();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [showShare, setShowShare] = useState(false);
  const [posts, setPosts] = useState<[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const Profiletype = params.profileType as string;
  const type = params.type as string;
  const [share_profileApi, { isLoading: sharing }] =
    useShare_profileApiMutation();
  const [timePeriod, setTimeperiod] = useState("");
  const [SelectedAmount, setSelectedAmount] = useState("");
  const id = Number(params.id);
  const [showPastModal, setShowPastModal] = useState(false);
  const [editingPastWork, setEditingPastWork] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderId, setOrderid] = useState("");
  const {
    data: amount,
    isLoading: AmountLoading,
    isFetching,
  } = useGetUserWalletQuery({
    id: user.id,
  });
  const [savePastWork, { isLoading: SavePastLoading }] =
    useSavePastWorkMutation();
  const openPastWorkModal = (pastWork?: any) => {
    setEditingPastWork(pastWork || null);
    setShowPastModal(true);
  };

  const closePastWorkModal = () => {
    setEditingPastWork(null);
    setShowPastModal(false);
  };
  const { data: advertisePrices } = useGetPriceQuery({
    price_type: "Profile",
    profile_type: Profiletype.toLowerCase(),
  });
  const { data: promotionPrices } = useGetAdvatizementPriceQuery({
    type: "Promotion",
  });
  const [showPast, setShowpast] = useState(false);
  const { data, isLoading } = useGetSingleProfileQuery({
    type: Profiletype,
    id,
  });
  const [visible, setvisible] = useState(false);
  const {
    data: othePastdata,
    isLoading: otherWorkLoding,
    refetch: pastRefetch,
  } = useGetotherPastWorkQuery(
    { user_id: user.id, work_section: Profiletype },
    { skip: Profiletype === "agent" }
  );
  const [deleteProfile, { isLoading: deleting }] = useDeleteProfileMutation();
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [upgradeId, setUpgradeId] = useState(0);
  const [isPromotion, setIsPromotion] = useState(false);
  const [showoption, setShowoption] = useState(false);
  const [deletePastWork, { isLoading: deletPastLoading }] =
    useDeletePastWorkMutation();
  const {
    data: pastData,
    isLoading: pastLoading,
    refetch,
  } = useUserAgentPastPostsApiQuery(
    { page, per_page: perPage, user_id: user.id },
    { skip: Profiletype !== "agent" || !user?.id }
  );
  const handleDelete = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete this profile?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProfile({
                profileType: Profiletype,
                profile_id: id,
                users_id: user.id,
              }).unwrap();

              renderToastSuccess("Profile deleted");
              router.back();
            } catch (e) {
              Alert.alert("Error", "Delete failed");
            }
          },
        },
      ]
    );
  };
  const handelSubmit = async (method) => {
    if (isPromotion) {
      console.log("promotion", timePeriod, SelectedAmount);
      try {
        const response = await promoteProfile({
          profile_id: profile?.id,
          profileType: Profiletype,
          days: timePeriod,
          user_id: user.id,
          paymentMethod: method,
          amount: SelectedAmount,
        }).unwrap();
        setShowoption(false);
        renderToastSuccess(response?.message);
      } catch (e) {
        Alert.alert("Error", "Promotion failed");
      }
    } else {
      try {
        const response = await upgradeProfile({
          profile_id: profile?.id,
          profileType: Profiletype,
          days: timePeriod,
          user_id: user.id,
          paymentMethod: method,
          amount: SelectedAmount,
        }).unwrap();
        setShowoption(false);
        renderToastSuccess(response?.message);
      } catch (e) {
        Alert.alert("Error", "Upgrade failed");
      }
    }
  };
  const profile = data?.data;
  const downloadShareImage = async (
  imageUrl: string,
  profileId: string | number
) => {
  try {
    if (!imageUrl) return null;

    const lowerUrl = imageUrl.toLowerCase();

    let extension = "jpg";

    if (lowerUrl.includes(".png")) {
      extension = "png";
    } else if (lowerUrl.includes(".webp")) {
      extension = "webp";
    } else if (lowerUrl.includes(".jpeg")) {
      extension = "jpeg";
    }

    const destination = new File(
      Paths.cache,
      `homeilove-profile-${profileId}-${Date.now()}.${extension}`
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
const shareOnSocial = async (
  platform: "whatsapp" | "facebook" | "twitter" | "linkedin" | "more"
) => {
  try {
    if (!id) {
      renderToastError("Profile not found");
      return;
    }

    const profileType = Profiletype?.toLowerCase();

    const profileUrl =
      `https://homeilove.us/postRedirect?post_id=${id}&&type=profile&&profile_type=${profileType}`;

    const profileTypeLabel =
      profileType
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()) ||
      "Professional";

    const location = [
      profile?.city,
      profile?.state,
    ]
      .filter(Boolean)
      .join(", ");

    const shareText =
      `Property ${profileTypeLabel}` +
      `${profile?.business_name ? ` - ${profile.business_name}` : ""}` +
      `${location ? ` in ${location}` : ""}`;

    const message = `${shareText}\n${profileUrl}`;

    const remoteImage =
      profile?.cover
        ? ImageFormater(profile.cover)
        : profile?.logo
        ? ImageFormater(profile.logo)
        : null;

    let localImage: string | null = null;

    if (remoteImage) {
      localImage = await downloadShareImage(
        remoteImage,
        id
      );
    }

    const shareOptions: any = {
      title: shareText,
      message,
      failOnCancel: false,

      ...(Platform.OS === "android" && {
        useInternalStorage: true,
      }),

      ...(localImage && {
        url: localImage,
        type: "image/*",
      }),
    };

    // WhatsApp
    if (platform === "whatsapp") {
      await RNShare.shareSingle({
        ...shareOptions,
        social: RNShare.Social.WHATSAPP,
      });

      return;
    }

    // Facebook
    if (platform === "facebook") {
      await RNShare.shareSingle({
        ...shareOptions,
        social: RNShare.Social.FACEBOOK,
      });

      return;
    }

    // LinkedIn
    if (platform === "linkedin") {
      if (Platform.OS === "android") {
        await RNShare.shareSingle({
          ...shareOptions,
          social: RNShare.Social.LINKEDIN,
        });
      } else {
        await RNShare.open(shareOptions);
      }

      return;
    }

    // Twitter / X
    if (platform === "twitter") {
      if (Platform.OS === "ios") {
        await RNShare.shareSingle({
          ...shareOptions,
          social: RNShare.Social.TWITTER,
        });
      } else {
        await RNShare.open(shareOptions);
      }

      return;
    }

    // More
    if (platform === "more") {
      await RNShare.open({
        ...shareOptions,
        failOnCancel: false,
      });

      return;
    }
  } catch (error: any) {
    console.log("Profile social share error:", error);

    renderToastError(
      error?.message || "Unable to share profile"
    );
  }
};
  useEffect(() => {
    if (!pastData?.data) return;

    setHasMore(pastData?.has_more);

    setPosts((prev) =>
      page === 1 ? pastData.data : [...prev, ...pastData.data]
    );
    setInitialLoadDone(true);
  }, [pastData]);
  const handleDeletePastWork = (id: number) => {
    Alert.alert("Delete", "Delete this past work?", [
      {
        text: "Cancel",
        style: "cancel",
      },

      {
        text: "Delete",
        style: "destructive",

        onPress: async () => {
          try {
            const formatdata = new FormData();

            formatdata.append("user_past_work_id", id.toString());

            const res = await deletePastWork(formatdata).unwrap();

            if (res?.success) {
              renderToastSuccess("Deleted successfully");

              await pastRefetch(); // safer
            } else {
              renderToastError("Delete failed");
            }
          } catch (error) {
            console.log("Delete error", error);

            renderToastError("Something went wrong");
          }
        },
      },
    ]);
  };
  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View style={{ position: "relative" }}>
          <HeaderWithBack />
          <TouchableOpacity
            style={{
              position: "absolute",
              backgroundColor: "#bdbdbd71",
              borderRadius: hs(50),
              justifyContent: "center",
              alignItems: "center",
              width: hs(40),
              height: hs(40),
              top: vs(100),
              right: hs(10),
              zIndex: 9999,
            }}
            onPress={() => setShowShare(true)}
          >
            <Share />
          </TouchableOpacity>
          <Image
            source={{
              uri: ImageFormater(profile?.cover),
            }}
            defaultSource={NoImage}
            style={styles.cover}
          />
        </View>

        <View style={styles.businessCard}>
          <Text style={[styles.title, { color: "white" }]}>
            {profile?.business_name}
          </Text>

          <Text style={styles.whiteText}>{profile?.address}</Text>

          <Text style={styles.whiteText}>
            {profile?.city}, {profile?.zip}, {profile?.state}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Service for</Text>
          <Text style={styles.text}>{profile?.services}</Text>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
            Dealing Areas
          </Text>

          <Text style={styles.text}>{profile?.dealing_areas}</Text>

          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Call />
              <Text style={styles.text}>{profile?.contact}</Text>
            </View>

            <Text style={styles.text}>{profile?.web}</Text>
          </View>

          <View style={styles.divider} />
          <View className="flex-row justify-between">
            {profile?.post_type === "Normal" ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.light.DarkGreen,
                  paddingHorizontal: hs(10),
                  paddingVertical: vs(10),
                  borderRadius: hs(10),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setShowoption(true);
                  setUpgradeId(profile.id);
                }}
              >
                <Text style={[styles.text, { color: "white" }]}>
                  Upgrade Profile to trending
                </Text>
              </TouchableOpacity>
            ) : profile?.post_type === "Trending" ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.light.DarkGreen,
                  paddingHorizontal: hs(10),
                  paddingVertical: vs(10),
                  borderRadius: hs(10),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setShowoption(true);
                  setUpgradeId(profile.id);
                  setIsPromotion(true);
                }}
              >
                <Text style={[styles.text, { color: "white" }]}>
                  Upgrade Profile to Promoted
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            <View style={styles.row}>
              <TouchableOpacity onPress={handleDelete}>
                <Delete />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.navigate({
                    pathname: "/CreateProfiles",
                    params: {
                      edit: "true",
                      id: id,
                      ProfileType: Profiletype,
                      type: type,
                    },
                  });
                }}
              >
                <Edit />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{ marginHorizontal: hs(20), marginTop: vs(10) }}
          className="flex-row justify-between"
        >
          <TouchableOpacity
            style={{
              borderColor: Colors.light.DarkGreen,
              borderWidth: 2,
              paddingHorizontal: hs(10),
              paddingVertical: vs(10),
              borderRadius: hs(10),
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              setShowpast(!showPast);
            }}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons
                name="briefcase-outline"
                size={hs(20)}
                color={Colors.light.DarkGreen}
              />
              <Text
                style={{
                  color: Colors.light.DarkGreen,
                  fontSize: hs(16),
                  fontWeight: 700,
                }}
              >
                {showPast ? "Hide my past jobs" : "Show my past jobs "}
              </Text>
            </View>
          </TouchableOpacity>
          {Profiletype !== "agent" && (
            <TouchableOpacity
              onPress={() => openPastWorkModal()}
              style={{
                backgroundColor: Colors.light.DarkGreen,
                paddingHorizontal: hs(10),
                paddingVertical: vs(10),
                borderRadius: hs(10),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: 700 }}>
                Add past jobs
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Modal
          visible={showPast}
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setShowpast(false)}
        >
          <SafeAreaView
            style={{ flex: 1 }}
            edges={["bottom", "left", "right"]}
          >
            <HeaderWithBack
              title="Past jobs"
              onBackpress={() => setShowpast(false)}
            />
            {Profiletype === "agent" ? (
              <>
                {posts.length > 0 ? (
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
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>No past deals</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={{ marginTop: vs(15), flex: 1 }}>
                {othePastdata?.data?.length > 0 ? (
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

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => openPastWorkModal(item)}
                style={styles.iconBtn}
              >
                <Edit />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  handleDeletePastWork(item.user_past_work_id)
                }
                style={styles.iconBtn}
              >
                <Delete />
              </TouchableOpacity>
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
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>No past deals</Text>
                  </View>
                )}
              </View>
            )}
          </SafeAreaView>
        </Modal>

        <PostPastWork
          closeModal={closePastWorkModal}
          savePastWork={savePastWork}
          type={Profiletype}
          visible={showPastModal}
          refetch={pastRefetch}
          editData={editingPastWork}
          key={editingPastWork?.user_past_work_id || "new"}
          isLoading={SavePastLoading}
        />
      </ScrollView>
      <Loading
        isLoading={isLoading || deleting || SavePastLoading || deletPastLoading}
        text="Loading.."
      />
      <Modal visible={showoption} animationType="fade" transparent={true} onRequestClose={()=>setShowoption(false)}>
        <SafeAreaView
          style={{ flex: 1 }}
          edges={[ "bottom", "left", "right"]}
        >
          <ScrollView>
            <HeaderWithBack onBackpress={()=>setShowoption(false)}/>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(31, 31, 31, 0.5)", // semi-transparent background
                justifyContent: "center",
                paddingHorizontal: hs(5),
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: ms(10),
                  padding: hs(5),
                }}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: hs(10),
                    right: hs(10),
                    zIndex: 10,
                  }}
                  onPress={() => setShowoption(false)}
                >
                  <Text style={{ fontSize: ms(20), fontWeight: "bold" }}>
                    ×
                  </Text>
                </TouchableOpacity>

                {isPromotion ? (
                  <PromotionPricingCard
                    setprice={setSelectedAmount}
                    setSelectedtimeprd={setTimeperiod}
                    promotionPrices={promotionPrices}
                  />
                ) : (
                  <View className="flex-1">
                   <FlashList
  data={advertisePrices?.data ?? []}
  keyExtractor={(item) => item.id.toString()}
  extraData={timePeriod}
  ListHeaderComponent={
    <View
      className="flex-row justify-between items-center"
      style={{
        borderBottomWidth: 1,
        borderColor: Colors.light.textGray,
        borderRadius: ms(5),
        paddingHorizontal: hs(10),
        paddingVertical: vs(10),
      }}
    >
      <Text style={{ fontFamily: "PopinRegula" }}>
        Advertise Time
      </Text>

      <Text style={{ fontFamily: "PopinRegula" }}>
        Price
      </Text>
    </View>
  }
  renderItem={({ item: valueitem }) => (
    <View
      className="flex-row justify-between items-center"
      style={{
        paddingHorizontal: hs(10),
        paddingVertical: vs(10),
      }}
    >
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            setTimeperiod(valueitem.life);
            setSelectedAmount(valueitem.price);
          }}
        >
          <MaterialIcons
            size={20}
            color={Colors.light.DarkGreen}
            name={
              timePeriod === valueitem.life
                ? "radio-button-checked"
                : "radio-button-unchecked"
            }
          />
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: hs(10),
            fontFamily: "PopinRegula",
          }}
        >
          For {valueitem.life} Days
        </Text>
      </View>

      <Text style={{ fontFamily: "PopinRegula" }}>
        ${valueitem.price}
      </Text>
    </View>
  )}
/>
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
                  style={{
                    fontSize: ms(15),
                    fontWeight: "600",
                    fontFamily: "PopinRegula",
                  }}
                >
                  Select your payment method
                </Text>
                <View style={styles.card} className="items-center">
                  <Text
                    style={{
                      fontSize: ms(15),
                      fontWeight: "600",
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Your Homeilove account balance
                  </Text>
                  {AmountLoading || isFetching ? (
                    <ActivityIndicator size="small" color={Colors.light.red} />
                  ) : (
                    <Text
                      style={{
                        marginVertical: vs(10),
                        color: Colors.light.red,
                        fontSize: ms(15),
                        fontWeight: "600",
                        fontFamily: "PopinRegula",
                      }}
                    >
                      {amount.amount}
                    </Text>
                  )}
                  <Text
                    className="text-center mb-5"
                    style={{
                      color: Colors.light.textGray,
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Have more ads to post then buy bundle and get extra
                    discount. You’ can use credit any time means no expiry!
                  </Text>
                  <LargeButton
                    text="Add Credits"
                    handleSubmit={() => router.push("/BuyCredit")}
                  />
                </View>

                <View style={styles.card2}>
                  <Text style={styles.title}>Pay and Ad post Atomaticlly</Text>

                  <TouchableOpacity
                    className="mb-4"
                    style={styles.paypalMainButton}
                    onPress={async () => {
                      if (!SelectedAmount) {
                        renderToastError("Please select bundle first");
                        return;
                      }
                      setvisible(true);
                    }}
                  >
                    <View style={styles.paypalContent}>
                      <Paypal />
                      <Text style={styles.paypalText}>
                        Pay with PayPal or Debit/Credit Card
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <LargeButton
                    handleSubmit={() => {
                      if (!SelectedAmount) {
                        renderToastError("Please select bundle first");
                        return;
                      }
                      if (amount.amount >= Number(SelectedAmount)) {
                        setPaymentMethod("Wallet");
                        handelSubmit("Wallet");
                      } else {
                        renderToastError(
                          "You don't have enough amount in wallet, please recharge"
                        );
                      }
                    }}
                    text="Pay with wallet"
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        <Loading isLoading={ugradeLoading || promoteLoading} text="Loading.." />
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
    edges={["bottom", "left", "right"]}
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
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,

          // IMPORTANT
          height: "85%",

          paddingTop: vs(18),
          paddingHorizontal: hs(20),
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
              fontSize: 18,
              fontWeight: "600",
              fontFamily: "PopinRegula",
            }}
          >
            Share Profile
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowShare(false)}
          >
            <Cross height={vs(24)} width={vs(24)} />
          </TouchableOpacity>
        </View>

        {/* IMPORTANT: everything below header scrollable */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          contentContainerStyle={{
            paddingBottom: vs(50),
          }}
        >
          {/* Social Share */}
          <View style={{ marginBottom: vs(20) }}>
            <Text
              style={{
                fontSize: 14,
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
                onPress={() => shareOnSocial("whatsapp")}
                style={{
                  flex: 1,
                  alignItems: "center",
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
                    fontSize: 10,
                    marginTop: 6,
                    fontFamily: "PopinRegula",
                  }}
                >
                  WhatsApp
                </Text>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => shareOnSocial("facebook")}
                style={{
                  flex: 1,
                  alignItems: "center",
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
                    fontSize: 10,
                    marginTop: 6,
                    fontFamily: "PopinRegula",
                  }}
                >
                  Facebook
                </Text>
              </TouchableOpacity>

              {/* X */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => shareOnSocial("twitter")}
                style={{
                  flex: 1,
                  alignItems: "center",
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
                    fontSize: 10,
                    marginTop: 6,
                    fontFamily: "PopinRegula",
                  }}
                >
                  Twitter
                </Text>
              </TouchableOpacity>

              {/* LinkedIn */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => shareOnSocial("linkedin")}
                style={{
                  flex: 1,
                  alignItems: "center",
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
                    fontSize: 10,
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
                onPress={() => shareOnSocial("more")}
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: "#6B7280",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={28}
                    color="#fff"
                  />
                </View>

                <Text
                  style={{
                    fontSize: 10,
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
                marginTop: vs(20),
                marginBottom: vs(10),
              }}
            />
          </View>

          {/* Email Share */}
          <Formik
            initialValues={{
              recepient_email: "",
              message: "",
              link: `https://homeilove.us/postRedirect?post_id=${id}&&type=profile&&profile_type=${Profiletype}`,
              post_id: id,
              type: Profiletype,
            }}
            validationSchema={Yup.object({
              recepient_email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),

              message: Yup.string()
                .required("Message is required"),
            })}
            onSubmit={async (values) => {
              try {
                const formData = new FormData();

                formData.append(
                  "email",
                  values.recepient_email
                );

                formData.append(
                  "message",
                  values.message
                );

                formData.append(
                  "link",
                  values.link
                );

                formData.append(
                  "post_id",
                  values.post_id.toString()
                );

                formData.append(
                  "type",
                  "profile"
                );

                formData.append(
                  "profile_type",
                  Profiletype
                );

                const result =
                  await share_profileApi(
                    formData
                  ).unwrap();

                if (result?.success) {
                  renderToastSuccess(
                    result.message
                  );

                  setShowShare(false);
                }
              } catch (error) {
                console.log(
                  "Share profile error:",
                  error
                );

                renderToastError(
                  "Failed to share profile"
                );
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              // IMPORTANT:
              // yahan flex:1 mat lagana
              <View>
                <FormikInput
                  name="recepient_email"
                  placeholder="Recipient Email"
                  value={values.recepient_email}
                  onChangeText={handleChange(
                    "recepient_email"
                  )}
                  onBlur={handleBlur(
                    "recepient_email"
                  )}
                  touched={
                    !!touched.recepient_email
                  }
                  errors={
                    !!errors.recepient_email
                  }
                  errorText={
                    errors.recepient_email
                  }
                  title="Email"
                  required
                />

                <FormikInput
                  name="message"
                  placeholder="Write your message..."
                  value={values.message}
                  onChangeText={handleChange(
                    "message"
                  )}
                  onBlur={handleBlur(
                    "message"
                  )}
                  multiline
                  touched={!!touched.message}
                  errors={!!errors.message}
                  errorText={errors.message}
                  title="Message"
                  required
                />

                {/* Info */}
                <View
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: 12,
                    borderRadius: 10,
                    marginTop: vs(10),
                    marginBottom: vs(20),
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Sharing this profile
                  </Text>

                  <Text
                    style={{
                      color: "#666",
                      fontSize: 12,
                      marginTop: 3,
                    }}
                  >
                    Profile link will be sent
                  </Text>
                </View>

                {/* Shareable Link */}
                <View
                  style={{
                    backgroundColor: "#f5f6f8",
                    borderRadius: 12,
                    padding: 12,
                    marginTop: vs(5),
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#6b7280",
                      marginBottom: 6,
                      fontFamily:
                        "PopinRegula",
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
                        fontFamily:
                          "PopinRegula",
                      }}
                      ellipsizeMode="middle"
                    />

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={async () => {
                        await Clipboard.setStringAsync(
                          values.link
                        );

                        renderToastSuccess(
                          "Link copied"
                        );
                      }}
                      style={{
                        backgroundColor:
                          "#0f766e",
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
                          fontFamily:
                            "PopinRegula",
                        }}
                      >
                        Copy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Send */}
                <View
                  style={{
                    marginTop: vs(20),
                    marginBottom: vs(30),
                  }}
                >
                  <LargeButton
                    text="Send"
                    handleSubmit={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  </SafeAreaView>

  <Loading
    isLoading={sharing}
    text="Sharing..."
  />
</Modal>
      <PapPalPayment
        amount={SelectedAmount}
        onPress={(order_id, setApproveUrl) => {
          try {
            setPaymentMethod("Paypal");
            setOrderid(order_id);
            handelSubmit("Paypal");
            setvisible(false);
            setApproveUrl(null);
          } catch {
            renderToastError("Some thing went rong");
          }
        }}
        setVisible={setvisible}
        visible={visible}
      />
    </>
  );
};

export default Index;
const styles = StyleSheet.create({
  cover: {
    height: vs(250),
    width: "100%",
    borderBottomLeftRadius: ms(20),
    borderBottomRightRadius: ms(20),
    resizeMode: "cover",
    backgroundColor: "gray",
  },
  paypalMainButton: {
    backgroundColor: Colors.light.Yellow,
    borderRadius: ms(8),
    height: vs(48),
    justifyContent: "center",
    alignItems: "center",
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

  iconBtn: {
    marginLeft: 10,
  },
  paypalContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  paypalText: {
    marginLeft: hs(10),
    fontSize: ms(14),
    fontWeight: "600",
    color: "#003087",
    fontFamily: "PopinRegula",
  },
  card2: {
    marginVertical: vs(20),
    backgroundColor: "white",
    borderRadius: ms(8),
    elevation: 5,
    paddingVertical: vs(10),
    paddingHorizontal: hs(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
});
