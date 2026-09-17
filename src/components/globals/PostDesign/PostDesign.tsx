import {
  useAcceptRequestApiMutation,
  useAskvaluationapiMutation,
  useCancelRequestApiMutation,
  useDeleteCommentApiMutation,
  useGetProfilesForConectionQuery,
  useHidePostMutation,
  useLazyGetotherPastWorkQuery,
  useLazyGetPostCommentsApiQuery,
  useLazyUserAgentPastPostsApiQuery,
  useLikePostMutation,
  usePostReplyApiMutation,
  useReportPostMutation,
  useSendRequestMutation,
  useShare_postApiMutation,
  useUnfollowApiMutation,
  useUnlikePostMutation
} from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import Cross from "@assets/CreateProfile/cross.svg";
import Camera from "@assets/Feedimg/camera.svg";
import Comment from "@assets/icons/Comment.svg";
import Like from "@assets/icons/Like.svg";
import Share from "@assets/icons/share.svg";
import ThreeDots from "@assets/icons/threedots.svg";
import Liked from "@assets/icons/ThumbUpRed.svg";
import Delete from "@assets/SideBar/deletbaskit.svg";
import NoImage from "@assets/SideBar/no_images.png";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { AdCardWithoutAnimation } from "@src/AdCardWithoutAnimation";
import CommentInput from "@src/components/globals/CommentInput";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import { formatPrice } from "@utils/PriceFormater";
import { timeAgo } from "@utils/Timeago";
import { ViedioUrlFormat } from "@utils/ViedioUrlFormater";
import { Video } from "expo-av";
import * as Clipboard from 'expo-clipboard';
import { Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import CircleImage from "../CircleImage/CircleImage";
import FollowButton from "../FollowButton";
import { FormikInput } from "../FormictInput";
import ImageSlider from "../ImageSlider";
import LargeButton from "../LaregeButton";
import Loading from "../Loading";
import NewsFeedSingleview from "../NewsFeedSingleview";
import ProfileSingleView from "../ProfileSingleView";
import StarRating from "../StarRating";
import { postDataType } from "./type";
const PostDesign = ({
  data,
  setPage,
  isfetching,
  withCreatePost = false,
  post_id,
  isPostSingle,
  setData,
  hasMore,
  refetch,
}: postDataType) => {

  const user = useAppSelector(userdata);

  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const [hidePostApi, { isLoading: hiding }] = useHidePostMutation();
  const [hiddenPosts, setHiddenPosts] = useState<number[]>([]);
  const [posts, setPosts] = useState<[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
  const [likePost, { isLoading: liking }] = useLikePostMutation();
  const [reportPostApi, { isLoading: reporting }] = useReportPostMutation();
  const [showViedio, setShowViedio] = useState(false);
  const [showPast, setShowpast] = useState(false);
  const [share_postApi, { isLoading: sharing }] = useShare_postApiMutation();
  const [showReport, setShowReport] = useState(false);
  const [showFloor, setShowFloor] = useState(false);
const [expandedPost, setExpandedPost] = useState<string | null>(null);
const [menuPost, setMenuPost] = useState<string | null>(null);
  const [SelectedViedio, setSelectedViedio] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState('');
  const [showMortgage, setShowMortgage] = useState(false);
  const [unlikePost, { isLoading: unliking }] = useUnlikePostMutation();
  const { data: Profiles, isLoading: ProfilesLoading } =
    useGetProfilesForConectionQuery({ id: user.id });
  const isSmallList = Profiles?.profiles?.length <= 3;
  const [reportData, setReportData] = useState<any>(null);
  const [showpostPostData, setShowpostPostData] = useState<any>(null);
  const insets = useSafeAreaInsets();
  const [askEvaluation, { isLoading: askEvaluationLoading }] = useAskvaluationapiMutation();
  const [showConnection, setShowConnection] = useState(false);
  const [scrollable, setscrollable] = useState(true);
  const [showImages, setShowImages] = useState(false);
  const [getComments, { data: comments, isFetching: commentFetching }] =
    useLazyGetPostCommentsApiQuery();

  const [statuse, setStatus] = useState("");
  const [unfollowApi, { isLoading: unfollowing }] = useUnfollowApiMutation();
  const [cancelRequestApi, { isLoading: canceling }] = useCancelRequestApiMutation();
  const [acceptRequestApi, { isLoading: accepting }] = useAcceptRequestApiMutation();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageNo, setImageNo] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [showpost, setShowpost] = useState(false);
  const [pastpage, setpastPage] = useState(1);

  const [reviewModal, setReviewModal] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

const feedData = useMemo(() => {
  return (data ?? []).filter(
    (item) => !hiddenPosts.includes(item.post_id)
  );
}, [data, hiddenPosts]);

const handleRefresh = async () => {
  try {
    setRefreshing(true);

    setPage(1);
    await refetch();
  } finally {
    setRefreshing(false);
  }
};

  const [getotherPastWork, {
    data: othePastdata,
    isLoading: otherWorkLoding,
  }] = useLazyGetotherPastWorkQuery();
  useEffect(() => {
    if (!showpostPostData?.users_id) {
      return;
    }
    getotherPastWork({ user_id: showpostPostData.users_id, work_section: showpostPostData?.connection_type });
  }, [showpostPostData?.users_id]);
  const [lazyUserAgentPastPostsApi, { data: pastData, isLoading: pastLoading }] = useLazyUserAgentPastPostsApiQuery();
  useEffect(() => {
  if (!showpostPostData?.users_id) return;
    lazyUserAgentPastPostsApi({ user_id: showpostPostData?.users_id, page: pastpage, per_page: 10 });
  }, [pastpage, showpostPostData]);
  useEffect(() => {
    if (!pastData?.data) return;

  

    setPosts((prev) =>
      pastpage === 1 ? pastData.data : [...prev, ...pastData.data]
    );
    setInitialLoadDone(true);
  }, [pastData]);
  useEffect(() => {
    if (isPostSingle) {
      setShowpost(true);
      setShowpostPostData({ post_id: post_id });
    }
  }, [isPostSingle]);
  const CommentItem = ({ item }) => {


    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    const [postReply] = usePostReplyApiMutation();
    const [deleteComment] = useDeleteCommentApiMutation();



    const handleReply = async () => {
      if (!replyText.trim()) return;

      await postReply({
        user_id: user?.id,
        creator_id: user?.id,
        comment_id: item.comment_id,
        content: replyText,
      });

      setReplyText("");
      setShowReplyInput(false);
      getComments({ post_id: item.post_id });
    };

    return (
      <View style={styles.commentWrapper}>
        <CircleImage
          Size={38}
          source={{ uri: ImageFormater(item.profile_image) }}
        />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.userName}>{item.name}</Text>

              {user?.id === item.sweetghar_user_id && (
                <TouchableOpacity
                 activeOpacity={1}
                  style={styles.deleteBtn}
                  onPress={() =>
                    deleteComment(item.comment_id)
                      .unwrap()
                      .then(() => {
                        getComments({ post_id: showpostPostData?.post_id });
                       
                      })
                  }
                >
                  <Delete width={14} height={14} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.commentText}>{item.comment}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
             activeOpacity={1}
              onPress={() => setShowReplyInput(!showReplyInput)}
            >
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>

            <Text style={styles.time}>{item.created_date}</Text>
          </View>

          {showReplyInput && (
            <View style={styles.replyInputBox}>
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write a reply..."
                style={styles.replyInput}
              />

              <TouchableOpacity  activeOpacity={1}
               onPress={handleReply} style={styles.sendBtn}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          )}

          {item.replies?.map((reply) => (
            <View key={reply.comment_id} style={styles.replyWrapper}>
              <CircleImage
                Size={28}
                source={{
                  uri: ImageFormater(reply.profile_image),
                }}
              />

              <View style={styles.replyCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.userName}>{reply.name}</Text>


                  {user?.id === reply.sweetghar_user_id && (
                    <TouchableOpacity
                     activeOpacity={1}
                      style={styles.deleteBtn}
                      onPress={() =>
                        deleteComment(reply.comment_id).unwrap().then(() => {
                          getComments({ post_id: showpostPostData?.post_id });
                        })
                      }
                    >
                      <Delete width={12} height={12} />
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.commentText}>{reply.comment}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };
  const reportOptions = [
    "Copyright violation",
    "Scam, fraud or spam",
    "False Information",
    "Voilence, hate or exploitation",
    "Other",
  ];
  const [showShare, setShowShare] = useState(false);
  const handleHidePost = async (item) => {
    try {
      setHiddenPosts((prev) => [...prev, item.post_id]);

      await hidePostApi({
        post_id: item.post_id,
        post_of: item.type,
        user_id: user.id,
      }).unwrap();

      renderToastSuccess("Post hidden successfully");
    } catch (error) {
      renderToastError("Failed to hide post");
      setHiddenPosts((prev) => prev.filter((id) => id !== item.post_id));
    }
  };

  const requestSend = async ({
    sender_type,
    sender_ProfileId,
    reciverProfile,
    statusi,
    sender_data,
  }) => {
    try {
      let status = statusi;
      const formData = new FormData();
      if (status === "Connect" || status === "Cancel Request") {
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

      let result;

      if (status === "Connect") {
        result = await sendRequest(formData).unwrap();
      }
      else if (status === "Unfollow") {
        result = await unfollowApi(formData).unwrap();
      }
      else if (status === "Accept Request") {
        result = await acceptRequestApi(formData).unwrap();
      }
      else if (status === "Cancel Request") {
        result = await cancelRequestApi(formData).unwrap();
      }

      if (result?.success) {
        renderToastSuccess(result.message);

        setData((prevData) =>
          prevData.map((post) => {
            if (
              post.users_id === reciverProfile?.users_id &&
              post.connection_type === reciverProfile?.connection_type
            ) {
              let newStatus = post.connection_status;

              if (status === "Connect") {
                newStatus = "pending";
              } else if (status === "Accept Request") {
                newStatus = "accepted";
              } else if (status === "Unfollow" || status === "Cancel Request") {
                newStatus = "";
              }

              return {
                ...post,
                connection_status: newStatus,
              };
            }
            return post;
          })
        );

        setShowConnection(false);
      } else {
        renderToastError(result?.message || "Something went wrong");
        setShowConnection(false);
      }
    } catch (error) {
      renderToastError(error.message);
    }
  };
  useEffect(() => {
    if(!showpostPostData?.post_id) return
    getComments({ post_id: showpostPostData?.post_id });
  }, [showpostPostData]);
  
  const renderItem = ({ item }) => {
     const itemKey = `${item.post_id}-${item.type}`;

  const expanded = expandedPost === itemKey;
  const menuVisible = menuPost === itemKey;
    const handleLikeToggle = async (item) => {
      try {
        if (item.is_liked) {
          const res = await unlikePost({
            post_id: item.post_id,
            user_id: user.id,
          }).unwrap();
          if (res.success) {
            renderToastSuccess(res.message)
           
           
        setData((prevData) =>
          prevData.map((post) =>
            Number(post.post_id) === Number(item.post_id)
              ? {
                  ...post,
                  is_liked: false,
                  likes: Math.max((post.likes || 1) - 1, 0),
                }
              : post
          )
        );
          } else {
            renderToastError(res.message)
          }

        } else {
          const res = await likePost({
            post_id: item.post_id,
            user_id: user.id,
            creater_id: item.users_id,
          }).unwrap();
          if (res.success) {
            renderToastSuccess(res.message)
           
               setData((prevData) =>
          prevData.map((post) =>
           Number(post.post_id) === Number(item.post_id)
              ? {
                  ...post,
                  is_liked: true,
                  likes: (post.likes || 0) + 1,
                }
              : post
          )
        );
          } else {
            renderToastError(res.message)
          }
        }
      } catch (error) {
        renderToastError("Something went wrong");
      }
    };


    if (item.type === "Shared Connection") {
      return (
        <TouchableOpacity 
         activeOpacity={1}
         className="bg-white" style={styles.card} onPress={() => {
          setShowpostPostData(item);
          setShowpost(true);

        }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row">
              <CircleImage
                source={{ uri: ImageFormater(item.logo) }}
                Size={40}
              />
              <View style={styles.uperSection}>
                <View className="flex-row">
                  <Text style={styles.name}>
                    {(item.business_name || item.name)?.length > 20
                      ? `${(item.business_name || item.name).slice(0, 20)}...`
                      : (item.business_name || item.name)}
                  </Text>
                  {item.connection_type && (
                    <Text style={{ fontFamily: "PopinRegula" }}>
                      {" "}
                      ({item.connection_type})
                    </Text>
                  )}
                </View>
                <Text style={{ fontFamily: "PopinRegula" }}>{item.city}</Text>
              </View>
            </View>
            <TouchableOpacity  activeOpacity={1}
            onPress={() =>  setMenuPost(itemKey)}>
              <ThreeDots />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: vs(20) }}>
            <View className="flex-row justify-between">
              <Text style={{ fontFamily: "PopinRegula" }} className="font-bold">
                Dealing areas
              </Text>
               <View
    style={{
      width: hs(220),
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-end",
    }}
  >
    {item.dealing_areas === "Nationwide" ? (
      
      <View
        style={{
          backgroundColor: "#E8F5E9",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 20,
          margin: 3,
        }}
      >
        <Text
          style={{
            fontFamily: "PopinRegula",
            color: "#2E7D32",
          }}
        >
          Nationwide
        </Text>
      </View>
    ) : (
      item.dealing_city
        ?.split(",")
        .map((city: string, index: number) => (
          <View
            key={index}
            style={{
              backgroundColor: "#F2F2F2",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              margin: 3,
            }}
          >
            <Text style={{ fontFamily: "PopinRegula", fontSize: 12 }}>
              {city.trim()}
            </Text>
          </View>
        ))
    )}
  </View>
            </View>
            <View
              className="flex-row justify-between"
              style={{ marginTop: vs(10) }}
            >
              <Text style={{ fontFamily: "PopinRegula" }} className="font-bold">
                Rating
              </Text>
              <Text style={{ fontFamily: "PopinRegula" }}>
                {item.total_reviews} Review
              </Text>
            </View>
            <View
              className="flex-row items-center"
              style={{ marginTop: vs(10) }}
            >
              <StarRating rating={item.rating} size={20} />
              <Text
                style={{
                  color: Colors.light.DarkGreen,
                  marginLeft: hs(10),
                  fontFamily: "PopinRegula",
                }}
              >
                {item.rating}/5
              </Text>
            </View>
          </View>
          <View
            style={{
              height: vs(1),
              backgroundColor: "black",
              width: "95%",
              marginTop: vs(10),
              marginHorizontal: hs(10),
            }}
          />
          {item.user_id !== user.id && item.users_id !== user.id && (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: vs(10),
    }}
  >
    {/* LEFT BADGE */}
    <View>
      {item.post_type === "Trending" && (
        <View style={styles.trendingBadge}>
          <MaterialIcons
            name="trending-up"
            size={15}
            color="#fff"
          />

          <Text style={styles.badgeText}>
            Trending
          </Text>
        </View>
      )}

      {item.post_type === "Promoted" && (
        <View style={styles.promotedBadge}>
          <MaterialIcons
            name="campaign"
            size={15}
            color="#fff"
          />

          <Text style={styles.badgeText}>
            Promoted
          </Text>
        </View>
      )}
    </View>

    {/* RIGHT FOLLOW BUTTON */}
    <FollowButton
      id={item.receiver_id}
      status={item.connection_status}
      onPress={(status) => {
        setStatus(status);

        if (user.user_type === "Business") {
          setSelectedReceiver(item);

          if (status === "Connect") {
            setShowConnection(true);
          } else {
            requestSend({
              reciverProfile: item,
              sender_ProfileId: "",
              sender_type: "Business",
              statusi: status,
            });
          }
        } else {
          setStatus(status);

          requestSend({
            reciverProfile: item,
            sender_ProfileId: "",
            sender_type: "Private",
            statusi: status,
          });
        }
      }}
    />
  </View>
)}
          {menuVisible && (
            <TouchableOpacity
             activeOpacity={1}
              activeOpacity={1}
              onPress={() => setMenuPost(null)}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "flex-start",
                alignItems: "flex-end",
                paddingTop: vs(40),
                paddingRight: hs(15),
                zIndex: 999,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  width: 160,
                  paddingVertical: 10,
                  elevation: 8,
                }}
              >
                <TouchableOpacity
                 activeOpacity={1}
                  onPress={() => {
                    setMenuPost(null);
                    handleHidePost(item);
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Hide Post
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: "#eee" }} />

                <TouchableOpacity
                 activeOpacity={1}
                  onPress={async () => {
                    setMenuPost(null);
                    setReportData(item);
                    setShowReport(true);
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "red",
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    } else if (item.type === "General Post") {
      return (
        <TouchableOpacity
         activeOpacity={1}
          className="bg-white"
          style={styles.card}
          onPress={() => {
            setShowpostPostData(item);
            setShowpost(true);

          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row">
              <CircleImage
                source={{ uri: ImageFormater(item.logo) }}
                Size={40}
              />
              <View style={styles.uperSection}>
                <View className="flex-row">
                  <Text style={styles.name}>
                    {item.business_name || item.name}
                  </Text>
                  {item.connection_type && (
                    <Text style={{ fontFamily: "PopinRegula", }}> ({item.connection_type})</Text>
                  )}
                </View>
                <Text style={{ fontFamily: "PopinRegula", }}>{timeAgo(item.post_created_date || item.created_date)}</Text>
              </View>
            </View>
            <TouchableOpacity 
             activeOpacity={1}
             onPress={() =>  setMenuPost(itemKey)}>
              <ThreeDots />
            </TouchableOpacity>

          </View>
          <View>
            <Text style={styles.description}>
              {expanded
                ? item.description
                : item.description?.slice(0, 70) +
                (item.description?.length > 70 ? "...." : " ")}
              {item.description?.length > 70 && (
                <Text
                  style={styles.moreText}
                  onPress={() =>   setExpandedPost(expanded ? null : itemKey)}
                >
                  {expanded ? " Show Less" : " Read More"}
                </Text>
              )}
            </Text>
            <View style={{ alignSelf: "center" }}>

              {item.images.length > 0 && (
                <TouchableOpacity
                 activeOpacity={1}
                  onPress={() => {
                    setSelectedImages(item.images || []);
                    setShowImages(true);
                    setscrollable(false);
                  }}
                >
                  <Image
                    source={{ uri: ImageFormater(item.images[0]) }}
                    style={{
                      height: vs(250),
                      width: hs(350),
                      borderRadius: ms(12),
                      resizeMode: "cover",
                    }}
                  />
                </TouchableOpacity>
              )}


              <View
                style={{
                  position: "absolute",
                  bottom: vs(8),
                  left: hs(8),
                  right: hs(8),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                {item.images.length > 0 && (
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                      paddingHorizontal: hs(8),
                      paddingVertical: vs(4),
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: ms(20),
                    }}
                  >
                    <Camera />
                    <Text
                      style={{
                        color: "white",
                        marginLeft: 4,
                        fontWeight: "600",
                        fontFamily: "PopinRegula",
                      }}
                    >
                      {item.images.length}
                    </Text>
                  </View>)}


                {item.post_video && (
                  <TouchableOpacity
                   activeOpacity={1}
                    onPress={() => {
                      setSelectedViedio(ViedioUrlFormat(item.post_video));
                      setShowViedio(true);
                      setscrollable(false);
                    }}
                  >
                    <Video
                      source={{ uri: ViedioUrlFormat(item.post_video) }}
                      style={{
                        width: hs(100),
                        height: vs(100),
                        borderRadius: ms(12),
                      }}
                      resizeMode="cover"
                      shouldPlay
                      isLooping
                      isMuted
                    />
                  </TouchableOpacity>
                )}
              </View>

            </View>

            <View
              className="flex-row justify-between"
              style={{ marginTop: vs(20), marginBottom: vs(10) }}
            >
              <View className="flex-row">
                <View className="flex-row items-center ">
                  <TouchableOpacity
                   activeOpacity={1}
                    disabled={liking || unliking}
                    onPress={() => handleLikeToggle(item)}
                  >
                    {item.is_liked ?
                      <Liked
                        width={28}
                        height={28}
                      />
                      :
                      <Like
                        width={28}
                        height={28}

                      />}
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: Colors.light.DarkGreen,
                      paddingLeft: hs(2),
                      fontFamily: "PopinRegula",
                    }}
                  >
                    {item.likes}
                  </Text>
                </View>
                <View
                  className="flex-row items-center"
                  style={{ paddingLeft: hs(10) }}
                >
                  <TouchableOpacity
                   activeOpacity={1}>
                    <Comment height={28} width={28}/>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: Colors.light.DarkGreen,
                      paddingLeft: hs(2),
                      fontFamily: "PopinRegula",
                    }}
                  >
                    {item.comment_count}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
               activeOpacity={1}
               onPress={() => { setShareData(item); setShowShare(true) }}>
                <Share />
              </TouchableOpacity>
            </View>
            <View>

            </View>
            <CommentInput
              creatorId={item.users_id}
              postId={item.post_id}
              setData={setData}
            />
          </View>
          {menuVisible && (
            <TouchableOpacity
             activeOpacity={1}
              activeOpacity={1}
              onPress={() => setMenuPost(null)}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "flex-start",
                alignItems: "flex-end",
                paddingTop: vs(40),
                paddingRight: hs(15),
                zIndex: 999,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  width: 160,
                  paddingVertical: 10,
                  elevation: 8,
                }}
              >
                <TouchableOpacity
                 activeOpacity={1}
                  onPress={() => {
                    setMenuPost(null);
                    handleHidePost(item);
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Hide Post
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: "#eee" }} />

                <TouchableOpacity
                 activeOpacity={1}
                  onPress={() => {
                    setMenuPost(null);
                    setReportData(item);
                    setShowReport(true);
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "red",
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )
    }
    else if (item?.type === "Advertisement") {
      return (
        <AdCardWithoutAnimation isSqure={true} ad={item} />
      );
    }
    else {
      return (
        <TouchableOpacity
         activeOpacity={1}
          className="bg-white"
          style={styles.card}
          onPress={() => {
            setShowpostPostData(item);
            setShowpost(true);

          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row">
              <CircleImage
                source={{ uri: ImageFormater(item.logo) }}
                Size={40}
              />
              <View style={styles.uperSection}>
                <View className="flex-row">
                  <Text style={styles.name}>
                    {item.business_name || item.name}
                  </Text>
                  {item.connection_type && (
                    <Text style={{ fontFamily: "PopinRegula" }}>
                      {" "}
                      ({item.connection_type})
                    </Text>
                  )}
                </View>
                <Text style={{ fontFamily: "PopinRegula" }}>
                  {timeAgo(item.post_created_date || item.created_date)}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
             activeOpacity={1}
             onPress={() =>  setMenuPost(itemKey)}>
              <ThreeDots />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.description}>
              {expanded
                ? item.description
                : item.description?.slice(0, 70) +
                (item.description?.length > 70 ? "...." : " ")}
              {item.description?.length > 70 && (
                <Text
                  style={styles.moreText}
                  onPress={() =>   setExpandedPost(expanded ? null : itemKey)}
                >
                  {expanded ? " Show Less" : " Read More"}
                </Text>
              )}
            </Text>
            <TouchableOpacity
             activeOpacity={1}
              onPress={() => {
                setSelectedImages(item.images || []);
                setShowImages(true);
                setscrollable(false);
              }}
              style={{ alignSelf: "center" }}
            >
              <Image
                source={
                  item.images && item.images.length > 0
                    ? { uri: ImageFormater(item.images[0]) }
                    : NoImage
                }
                style={{
                  height: vs(250),
                  width: hs(350),
                  borderRadius: ms(12),
                  resizeMode: "cover",
                  backgroundColor: "gray",
                }}
              />

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: hs(350),
                  backgroundColor:item.type === "Shared Community"?"rgba(233, 108, 108, 0.55)":"rgba(0,0,0,0.55)",
                  paddingHorizontal: hs(10),
                  paddingVertical: vs(8),
                  borderBottomLeftRadius: ms(12),
                  borderBottomRightRadius: ms(12),
                }}
                className="flex-row justify-between items-center"
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    width: "65%",
                    fontFamily: "PopinRegula",
                  }}
                >
                
              {
  (item.type === "Shared Community"
    ? item.title
    : item.property_sub_type
  )?.substring(0, 20) +
  (
    (item.type === "Shared Community"
      ? item.title
      : item.property_sub_type
    )?.length > 20
      ? "..."
      : ""
  )
}
                </Text>

                <Text
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontFamily: "PopinRegula",
                  }}
                >
                { item.type === "Shared Community"&&  "starting"} £{formatPrice(item.price)}
                </Text>
              </View>
                            <View
    style={{
      position: "absolute",
      bottom: vs(40),
      left: hs(8),
      backgroundColor:
        item.type === "Shared Community"
          ? "#D80621"
          : item.property_for?.toLowerCase() === "rent"
          ? "#134686"
          :Colors.light.red,
      paddingHorizontal: hs(10),
      paddingVertical: vs(5),
      borderRadius: ms(15),
      zIndex: 10,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: ms(13),
        paddingHorizontal:hs(10),
        fontWeight: "700",
        fontFamily: "PopinRegula",
      }}
    >
      {item.type === "Shared Community"
        ? item.community_type
        : item.property_for?.toLowerCase() === "rent"
        ? "Rent"
        : "Sale"}
    </Text>
  </View>
              <View
                style={{
                  position: "absolute",
                  top: vs(8),
                  left: hs(8),
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  paddingHorizontal: hs(8),
                  paddingVertical: vs(4),
                  borderRadius: ms(20),
                }}
              >
                <Camera />
                <Text
                  style={{
                    color: "white",
                    marginLeft: 4,
                    fontWeight: "600",
                    fontFamily: "PopinRegular",
                  }}
                >
                  {item.images ? item.images.length : 0}
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  top: vs(8),
                  right: hs(8),
                  alignItems: "flex-end",
                  gap: vs(5),
                }}
              >
                {item.post_type === "Trending" && (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.light.DarkGreen,
      paddingHorizontal: hs(9),
      paddingVertical: vs(5),
      borderRadius: ms(15),
    }}
  >
    <MaterialIcons
      name="trending-up"
      size={14}
      color="#fff"
    />

    <Text
      style={{
        color: "#fff",
        fontSize: ms(11),
        fontWeight: "600",
        fontFamily: "PopinRegula",
        marginLeft: hs(3),
      }}
    >
      Trending
    </Text>
  </View>
)}
                {item.saleprice_type === "Reduced Price" && (
                  <Text
                    style={{
                      backgroundColor: "rgba(241,28,28,0.85)",
                      paddingHorizontal: hs(8),
                      paddingVertical: vs(5),
                      color: "white",
                      fontWeight: "600",
                      borderRadius: ms(8),
                      fontFamily: "PopinRegular",
                    }}
                  >
                    Reduced Price
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <View
              className="flex-row justify-between"
              style={{ marginTop: vs(20), marginBottom: vs(10) }}
            >
              <View className="flex-row">
                <View className="flex-row items-center ">
                  <TouchableOpacity
                   activeOpacity={1}
                    disabled={liking || unliking}
                    onPress={() => handleLikeToggle(item)}
                  >
                    {item.is_liked ?
                      <Liked
                        width={28}
                        height={28}
                      />
                      :
                      <Like
                        width={28}
                        height={28}

                      />}
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: Colors.light.DarkGreen,
                      paddingLeft: hs(2),
                      fontFamily: "PopinRegula",
                    }}
                  >
                    {item.likes}
                  </Text>
                </View>
                <View
                  className="flex-row items-center"
                  style={{ paddingLeft: hs(10) }}
                >
                  <TouchableOpacity 
                   activeOpacity={1}>
                    <Comment  heigh={28} width={28}/>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: Colors.light.DarkGreen,
                      paddingLeft: hs(2),
                      fontFamily: "PopinRegula",
                    }}
                  >
                    {item.comment_count}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
               activeOpacity={1}
               onPress={() => { setShowShare(true); setShareData(item) }}>
                <Share />
              </TouchableOpacity>
            </View>
            <View></View>
            <CommentInput
              creatorId={item.users_id}
              postId={item.post_id}

            />
          </View>
          {menuVisible && (
            <TouchableOpacity
             activeOpacity={1}
              activeOpacity={1}
              onPress={() => setMenuPost(null)}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "flex-start",
                alignItems: "flex-end",
                paddingTop: vs(40),
                paddingRight: hs(15),
                zIndex: 999,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  width: 160,
                  paddingVertical: 10,
                  elevation: 8,
                }}
              >
                <TouchableOpacity
                 activeOpacity={1}
                  onPress={() => {
                    setMenuPost(null);
                    handleHidePost(item);
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Hide Post
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: "#eee" }} />

                <TouchableOpacity
                 activeOpacity={1}
                  onPress={() => {
                    setMenuPost(null);
                    setReportData(item);
                    setShowReport(true);
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "red",
                      fontFamily: "PopinRegula",
                    }}
                  >
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{  flex: 1, backgroundColor:"#678e9152"}}>
<FlashList
  style={{
    flex: 1,
    backgroundColor: "#89a8aa10",
  }}

  data={feedData}

  renderItem={renderItem}

  keyExtractor={(item) =>
    `${item.type}-${item.post_id}`
  }

  getItemType={(item) => item.type}

  extraData={{
    expandedPost,
    menuPost,
    hiddenPosts,
  }}

  scrollEnabled={scrollable}

  contentContainerStyle={{
    paddingBottom: vs(90),
  }}

 onEndReachedThreshold={1.5}

onEndReached={() => {
  if (!isfetching && hasMore && feedData.length > 0) {
    setPage((prev) => prev + 1);
  }
}}

  ListFooterComponent={
    <View
      style={{
        height: vs(70),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isfetching && !refreshing && (
        <ActivityIndicator size="small" />
      )}
    </View>
  }

  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  }
/>
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
          activeOpacity={1}
          onPressOut={() => setShowConnection(false)}
        >
          <View
            style={[
              styles.profileContainer,
              isSmallList ? styles.centerModal : styles.fullModal,
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
      <Loading isLoading={isLoading} text="Sending request..." />
      {
        showViedio && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 9999,
              elevation: 9999,
            }}
          >
            <Video
              source={{ uri: SelectedViedio }}
              style={{
                width: "100%",
                height: "80%",
                borderRadius: ms(16),
                marginBottom: vs(50),
              }}
              resizeMode="contain"
              useNativeControls
              shouldPlay
              isLooping={false}
              isMuted={false}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
            />
            {loading && (
              <ActivityIndicator
                size="large"
                color={Colors.light.DarkGreen}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <TouchableOpacity 
             activeOpacity={1}onPress={() => setShowViedio(false)} style={{ position: 'absolute', backgroundColor: 'white', borderRadius: ms(10), zIndex: 10, top: vs(50), right: hs(10) }}>

              <Cross height={vs(30)} width={vs(30)} />
            </TouchableOpacity>

          </View>
        )
      }
      <Modal visible={showShare} animationType="slide" transparent >
            <SafeAreaView
                                style={{ flex: 1 }}
                                edges={[ "bottom", "left", "right"]}
                              >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}>

        <View
  style={{
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    paddingTop: 20,
    paddingHorizontal: 20,


    paddingBottom: 20 + insets.bottom,

    minHeight: "80%",
  }}
>

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
                link: `https://homeilove.co.uk/postRedirect?post_id=${shareData?.post_id || shareData?.post_id}&&type=post`,
                post_id: shareData?.post_id,
                post_type: shareData?.type,
                post_image: shareData?.images?.[0] ?? "",
              }}
              validationSchema={yup.object({
                recepient_email: yup
                  .string()
                  .email("Invalid email")
                  .required("Email is required"),
                message: yup
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
                  formData.append("post_type", values.post_type);
                  formData.append("post_img", values.post_image);
                  console.log(formData);
                  const result = await share_postApi(formData).unwrap();
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
      <Modal visible={showReport} animationType="slide" onRequestClose={() => setShowReport(false)} >
          <SafeAreaView
                                style={{ flex: 1 }}
                                edges={[ "bottom", "left", "right"]}
                              >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.modalContainer}>


            <View style={styles.header}>
              <Text style={styles.title}>Report Post</Text>
              <TouchableOpacity 
               activeOpacity={1}onPress={() => setShowReport(false)}>

                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginVertical: vs(10) }} />
            <ScrollView>

              {reportOptions.map((item, index) => (
                <TouchableOpacity
                 activeOpacity={1}
                  key={index}
                  style={styles.option}
                  onPress={() => setSelectedType(item)}
                >
                  <View style={styles.radioCircle}>
                    {selectedType === item && <View style={styles.selectedRb} />}
                  </View>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}


              {selectedType === "Other" && (
                <View style={styles.textAreaContainer}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    maxLength={500}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter description..."
                  />
                  <Text style={styles.remaining}>
                    Characters remaining {500 - description.length}
                  </Text>
                </View>
              )}

            </ScrollView>


            <LargeButton
              text="Send"
              handleSubmit={async () => {

                const formData = new FormData();

                formData.append("post_id", String(reportData.post_id));
                formData.append("report_type", selectedType);
                formData.append("user_id", String(user.id));
                formData.append("description", description || "");

                const result = await reportPostApi(formData).unwrap();
                if (result?.success) {
                   handleHidePost(reportData);
                  renderToastSuccess(result.message);
                  setShowReport(false);
                  setSelectedType("");
                  setDescription("");
                }
                else {
                  renderToastError(result.message);
                }
              }}
            />


          </View>
        </View>
        </SafeAreaView>
        <Loading isLoading={reporting} text="Reporting..." />
      </Modal>
      <Modal visible={showpost} animationType="slide" onRequestClose={() => setShowpost(false)} transparent={true}
        statusBarTranslucent={true}  >
 <SafeAreaView
                                style={{ flex: 1 }}
                                edges={[ "bottom", "left", "right"]}
                              >
        {showpostPostData?.type === "Shared Connection" ? (
          <ProfileSingleView id={showpostPostData?.id} type={showpostPostData?.connection_type} setshowModel={setShowpost} setData={setData} />
        ) : (
          <NewsFeedSingleview post_id={showpostPostData?.post_id} setshowModel={setShowpost} setData={setData} />
        )}
</SafeAreaView>

      </Modal>
      {showImages && (
        <ImageSlider
          imageNo={imageNo}
          images={selectedImages}
          setShowImage={(val: boolean) => {
            setShowImages(val);
            setscrollable(true);
          }}
        />
      )}
    </View>
  );
};

export default PostDesign;

const styles = StyleSheet.create({

  card: {
    marginHorizontal: hs(10),
    marginVertical: vs(10),
    paddingHorizontal: hs(15),
    paddingVertical: vs(15),
    borderRadius: ms(20),
    elevation: 3,
  },
  name: {
    fontWeight: "bold",
    fontFamily: "PopinRegula",
  },
  uperSection: {
    marginLeft: hs(10),
  },
  description: {
    marginVertical: vs(10),
    fontFamily: "PopinRegula",
  },
  moreText: {
    color: Colors.light.DarkGreen,
    fontWeight: "600",
    fontFamily: "PopinRegula",
  },



  text: {
    fontFamily: "PopinRegula",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(12),
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  logo: {
    width: hs(50),
    height: vs(50),
    borderRadius: ms(25),
  },

  businessName: {
    fontSize: ms(16),
    fontWeight: "600",
    color: "#000",
    fontFamily: "PopinRegula",
  },

  profileType: {
    fontSize: ms(13),
    color: "#777",
    marginTop: vs(2),
    fontFamily: "PopinRegula",
  },

  title: {
    fontSize: ms(18),
    fontFamily: "PopinSemiBold",
    marginBottom: vs(10)
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  profileContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: ms(16),
    padding: hs(16),
  },

  centerModal: {
    maxHeight: "50%",
  },


  fullModal: {
    height: "80%",
  },

  modalContainer: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: ms(12),
    maxHeight: "90%",

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  close: {
    fontSize: ms(20),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: vs(10),
  },
  radioCircle: {
    height: vs(20),
    width: hs(20),
    borderRadius: ms(10),
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: hs(10),
  },



  selectedRb: {
    width: hs(10),
    height: vs(10),
    borderRadius: 5,
    backgroundColor: "#444",
  },
  optionText: {
    fontSize: ms(14),
  },
  textAreaContainer: {
    marginVertical: vs(10),
  },
  label: {
    fontSize: ms(14),
    marginBottom: vs(5),
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: ms(8),
    padding: 10,
    height: vs(100),
    textAlignVertical: "top",
  },
  remaining: {
    fontSize: ms(12),
    marginTop: vs(5),
    color: "#888",
  },
  button: {
    backgroundColor: "#ff4d6d",
    padding: 12,
    borderRadius: ms(10),
    alignItems: "center",
    marginTop: vs(15),
  },



  time: {
    fontSize: ms(11),
    color: "#999",
    fontFamily: "PopinRegula",
  },

  deleteBtn: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#FFECEC",
  },

  replyWrapper: {
    flexDirection: "row",
    marginTop: vs(10),
    marginLeft: hs(25),
    alignItems: "flex-start",
  },

  replyInputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(8),
    backgroundColor: "#F1F3F5",
    borderRadius: 25,
    paddingHorizontal: hs(12),
  },

  replyInput: {
    flex: 1,
    paddingVertical: vs(8),
    fontFamily: "PopinRegula",
  },

  sendBtn: {
    backgroundColor: Colors.light.red,
    paddingHorizontal: hs(14),
    paddingVertical: vs(6),
    borderRadius: 20,
  },

  sendText: {
    color: "white",
    fontWeight: "600",
    fontSize: ms(12),
    fontFamily: "PopinRegula",
  },
  action: {
    fontSize: ms(12),
    color: Colors.light.textGray,
    fontWeight: "500",
    fontFamily: "PopinRegula",
  },

  commentWrapper: {
    flexDirection: "row",
    marginBottom: vs(18),
    marginHorizontal: hs(20),
  },

  commentCard: {
    backgroundColor: "#F4F6F8",
    padding: ms(12),
    borderRadius: 14,
  },

  replyCard: {
    backgroundColor: "#FAFAFA",
    padding: ms(10),
    borderRadius: 12,
    flex: 1,
  },

  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(3),
  },

  userName: {
    fontWeight: "600",
    fontSize: ms(13),
    color: "#222",
    fontFamily: "PopinRegula",
  },

  commentText: {
    fontSize: ms(13),
    color: "#444",
    lineHeight: 18,
    fontFamily: "PopinRegula",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(5),
    gap: 15,
  },

  actionText: {
    fontSize: ms(12),
    color: Colors.light.textGray,
    fontWeight: "600",
    fontFamily: "PopinRegula",
  },
  cover: {
    height: vs(250),
    width: "100%",
    borderBottomLeftRadius: ms(20),
    borderBottomRightRadius: ms(20),
    resizeMode: "cover",
    backgroundColor: "gray",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
trendingBadge: {
  flexDirection: "row",
  alignItems: "center",
  gap: hs(4),
  backgroundColor: Colors.light.DarkGreen,
  paddingHorizontal: hs(10),
  paddingVertical: vs(5),
  borderRadius: ms(20),
},

promotedBadge: {
  flexDirection: "row",
  alignItems: "center",
  gap: hs(4),
backgroundColor: "#356fce",
  paddingHorizontal: hs(10),
  paddingVertical: vs(5),
  borderRadius: ms(20),
},

badgeText: {
  color: "#fff",
  fontSize: ms(11),
  fontWeight: "600",
  fontFamily: "PopinRegula",
},








































});
