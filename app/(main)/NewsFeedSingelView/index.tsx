import {
  useDeleteCommentApiMutation,
  useGetHomeFeedsQuery,
  useGetPostByIdQuery,
  useGetPostCommentsApiQuery,
  usePostReplyApiMutation,
  useShare_postApiMutation
} from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import CommunitySatatus from "@assets/CreateProfile/construction-house.svg";
import Cross from "@assets/CreateProfile/cross.svg";
import Camera from "@assets/Feedimg/camera.svg";
import Heart from "@assets/icons/heart.svg";
import Area from "@assets/icons/MypostListing/area.svg";
import Bed from "@assets/icons/MypostListing/bed.svg";
import Shower from "@assets/icons/MypostListing/shower.svg";
import Share from "@assets/icons/share.svg";
import CommunityType from "@assets/SideBar/commercialGreen.svg";
import Delete from "@assets/SideBar/deletbaskit.svg";
import NoImage from "@assets/SideBar/no_images.png";
import { FlashList } from "@shopify/flash-list";
import CircleImage from "@src/components/globals/CircleImage/CircleImage";
import { FormikInput } from "@src/components/globals/FormictInput";
import HeaderWithBack from "@src/components/globals/HeaderWithBack";
import ImageSlider from "@src/components/globals/ImageSlider";
import LargeButton from "@src/components/globals/LaregeButton";
import Loading from "@src/components/globals/Loading";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import { formatPrice } from "@utils/PriceFormater";
import { ViedioUrlFormat } from "@utils/ViedioUrlFormater";
import { Video } from "expo-av";
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import * as yup from "yup";
const index = () => {
  const user=useAppSelector(userdata);
  const params = useLocalSearchParams();
  const type = params.type as string;
  const id = Number(params.id);
  const post_id = Number(params.post_id);
  const [showShare,setShowShare]=useState(false);
  const formatPdfUrl = (file: string) => {
    return ImageFormater(file);
  };
  const [share_postApi, { isLoading: sharing }] = useShare_postApiMutation();
 const [loading,setLoading]=useState(false);
  const CommentItem = ({ item, refetch }) => {
    const user = useSelector(userdata);

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    const [postReply] = usePostReplyApiMutation();
    const [deleteComment] = useDeleteCommentApiMutation();

    const {
      data,
      isFetching,
      refetch: refechfeeds,
      isError,
      error,
    } = useGetHomeFeedsQuery({
      id: user.id,
      type: "All",
      page: 1,
      limit: 10,
    });

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
      refetch();
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
                        refetch();
                        refechfeeds();
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

              <TouchableOpacity 
               activeOpacity={1}
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

                  {/* ✅ REPLY DELETE */}
                  {user?.id === reply.sweetghar_user_id && (
                    <TouchableOpacity
                     activeOpacity={1}
                      style={styles.deleteBtn}
                      onPress={() =>
                        deleteComment(reply.comment_id).unwrap().then(refetch)
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

  const [imageNo, setImageNo] = useState(0);
  const { data, isFetching, refetch } = useGetPostByIdQuery({ post_id:post_id,userid:user?.id  });
  const { data: comments, isFetching: commentFetching } =
    useGetPostCommentsApiQuery({ post_id: post_id },  {
    skip: !post_id,
  });
  const [showImages, setShowImages] = useState(false);
  const [showFloor, setShowFloor] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <HeaderWithBack onBackpress={()=>{router.navigate("/Home/Feeds/NewsFeed")}}/>
        <View
          className="flex-1"
          style={{ marginHorizontal: hs(10), paddingVertical: vs(20) }}
        >
          <View className="flex-row gap-3 mb-3">
            <CircleImage
              Size={40}
              source={{ uri: ImageFormater(data?.posted_by?.logo) }}
            />
            <Text style={[styles.heading, { color: Colors.light.red }]}>
              {data?.posted_by?.business_name}
            </Text>
            {data?.type!=="general" && (
            <TouchableOpacity
             activeOpacity={1}
              onPress={() =>
                router.push({
                  pathname: "/AddSingleView",
                  params: {
                    id: data?.post?.post_property_id||data?.post?.post_community_id,
                    type: data?.type,
              
                  },
                })
              }
            >
              <Text style={styles.fullDetailText}>See Full Details</Text>
            </TouchableOpacity>)}
          </View>
          {data?.type!=="general" && (
            <>
          {data?.type === "community" ? (
            <View className="flex-row justify-between">
              <Text style={{ color: "black", fontWeight: "600", flex: 1 }}>
                {data?.post?.community_title ?? ""}
              </Text>

              {data?.post?.community_price?.length > 0 && (
                <Text style={{ color: Colors.light.red, fontWeight: "600" }}>
                  From £ {formatPrice(data?.post?.community_price[0])} To £{" "}
                  {formatPrice(
                    data?.post?.community_price[
                      data?.post?.community_price?.length - 1
                    ])
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
              <Text style={{ color: "black", fontWeight: "600", flex: 1 }}>
                {data?.post?.bedrooms ?? 0} bedrooms{" "}
                {data?.post?.property_sub_type ?? ""} for{" "}
                {data?.post?.property_for ?? ""}
              </Text>

              <Text
                style={{
                  color: Colors.light.red,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                £ {formatPrice(data?.post?.asking_price ?? 0)}
                {data?.type === "rent" ? `/${data?.post?.rent_type ?? ""}` : ""}
              </Text>
            </View>
          )}
          </>)}
          
          {data?.type==="general" ?(
            <Text style={styles.description}>
              {data?.post?.description}
            </Text>
          ):(
            <Text style={styles.description}>
            {expanded
              ? data?.type === "community"
                ? data?.post?.community_details
                : data?.post?.property_details
              : data?.type === "community"
              ? data?.post.community_details?.slice(0, 300) +
                (data?.post?.community_details?.length > 300 ? "...." : "")
              : data?.post?.property_details?.slice(0, 300) +
                (data?.post?.property_details?.length > 300 ? "...." : "")}

            {(data?.type === "community"
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
                data?.post_images && data?.post_images?.length > 0
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
            {data?.type !== "community" && data?.floor_images?.length > 0 && (
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
                <Text style={{ color: "white", fontWeight: 600 }}>
                  Floor Images{" "}
                  {data?.floor_images ? data?.floor_images?.length : 0}
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
              <Text style={{ color: "white", fontWeight: 600 }}>
                {data?.post_images ? data?.post_images?.length : 0}
              </Text>
            </View>
          </TouchableOpacity>
          <View className="flex-1">
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
</View>
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
            {data?.type !== "general" && (<>
            {data?.type === "community" ? (
              <>
                <View className="flex-row items-center">
                  <CommunityType />
                  <Text style={{ marginLeft: vs(5) }}>
                    {data?.post.community_type}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <CommunitySatatus />
                  <Text style={{ marginLeft: vs(5) }}>
                    {data?.post?.community_status}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row items-center">
                  <Bed />
                  <Text style={{ marginLeft: vs(5) }}>
                    {data?.post?.bedrooms}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Shower />
                  <Text style={{ marginLeft: vs(5) }}>
                    {data?.post?.bathrooms}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Area />
                  <Text style={{ marginLeft: vs(5) }}>
                    {data?.post?.land_area} sqft
                  </Text>
                </View>
              </>
            )}
            </>
            )}
          </View>
          <View className="flex-row items-center justify-between mt-4">
            <Text
              className="flex-1 mr-2"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {data?.post?.address}
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity  activeOpacity={1} activeOpacity={1}>
                <Heart />
              </TouchableOpacity>
             <TouchableOpacity onPress={()=>{setShowShare(true)}}>
                <Share />
              </TouchableOpacity>
            </View>
          </View>
        </View>
            {data?.post?.post_video && (
                                    <View
                          style={{
                           height:vs(400),
                           width:"95%",
                           backgroundColor:Colors.light.lightGray,
                           borderRadius:ms(10),
                           marginHorizontal:hs(10),
                          }}
                        >
                          <Video
                        source={{ uri: ViedioUrlFormat(data?.post?.post_video) }}
                        style={{
                          width: "100%",
                          height: "90%",  
                          borderRadius: ms(16),
                          marginBottom:vs(50),
                        }}
                        resizeMode="contain"
                        useNativeControls  
                        shouldPlay ={false}        
                        
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
                              
                                   
                            </View>
                                  )}
        <View style={{ marginTop: vs(20),flex:1 }}>
          <Text style={styles.heading}>
            Comments ({comments?.data?.length || 0})
          </Text>

        <FlashList
  data={comments?.data || []}
  keyExtractor={(item) => item.comment_id.toString()}
  renderItem={({ item }) => (
    <CommentItem item={item} refetch={refetch} />
  )}
/>
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

        <TouchableOpacity  activeOpacity={1} onPress={() => setShowShare(false)}>
          <Cross height={vs(24)} width={vs(24)} />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={{
          recepient_email: "",
          message: "",
          link:`https://www.homeilove.co.uk/postRedirect?post_id=${post_id}`,
          post_id:post_id,
          post_type:data?.type,
          post_image:data?.post_images?.[0]?? "",
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
        onSubmit={async(values) => {
          try {
            const formData = new FormData();
            formData.append("email", values.recepient_email);
            formData.append("message", values.message);
            formData.append("link", values.link);
            formData.append("post_id", post_id.toString());
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
    </>
  );
};

export default index;

const styles = StyleSheet.create({
  textred: {
    color: Colors.light.red,
    fontFamily: "PopinRegula",
  },
  description: {
    marginVertical: vs(10),
    fontWeight: 500,
    fontFamily: "PopinRegula",
  },
  fullDetailText: {
    color: Colors.light.red,
    fontSize: ms(13),
    fontWeight: "600",
    marginTop: vs(6),
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
    fontSize: ms(16),
    fontWeight: "600",
    color: Colors.light.DarkGreen,
    marginBottom: vs(15),
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
});
