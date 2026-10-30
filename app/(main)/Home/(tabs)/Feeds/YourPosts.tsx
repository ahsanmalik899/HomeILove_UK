import { useDeleteGeneralPostMutation, useGetYourpostQuery, useLikePostMutation, useShare_postApiMutation, useUnlikePostMutation } from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import Cross from "@assets/CreateProfile/cross.svg";
import Camera from "@assets/Feedimg/camera.svg";
import Comment from "@assets/icons/Comment.svg";
import Like from "@assets/icons/Like.svg";
import Share from "@assets/icons/share.svg";
import ThreeDots from "@assets/icons/threedots.svg";
import Liked from "@assets/icons/ThumbUpRed.svg";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import CircleImage from "@src/components/globals/CircleImage/CircleImage";
import CommentInput from "@src/components/globals/CommentInput";
import CreatePost from "@src/components/globals/CreatePost/createPost";
import { FormikInput } from "@src/components/globals/FormictInput";
import ImageSlider from "@src/components/globals/ImageSlider";
import LargeButton from "@src/components/globals/LaregeButton";
import Loading from "@src/components/globals/Loading";
import NewsFeedSingleview from "@src/components/globals/NewsFeedSingleview";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import { ViedioUrlFormat } from "@utils/ViedioUrlFormater";
import { Video } from "expo-av";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNShare from "react-native-share";
import * as yup from "yup";

const YourPosts = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [Posts, setPosts] = useState<[]>([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deletePost, { isLoading: deleting }] = useDeleteGeneralPostMutation();
  const [likePost, { isLoading: liking }] = useLikePostMutation();
  const [unlikePost, { isLoading: unliking }] = useUnlikePostMutation();
  const [showImages, setShowImages] = useState(false);
const [shareData, setShareData] = useState<any>(null);
    const [share_postApi, { isLoading: sharing }] = useShare_postApiMutation();
  const [showViedio, setShowViedio] = useState(false);
   const [showpostPostData,setShowpostPostData]=useState<any>(null);
  const [SelectedViedio, setSelectedViedio] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [scrollable, setscrollable] = useState(true);
  const user = useAppSelector(userdata);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
const [menuPost, setMenuPost] = useState<number | null>(null);
    const [showpost,setShowpost]=useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShare,setShowShare]=useState(false);
  const renderItem = ({ item }) => {
  const expanded = expandedPost === item.id;
  const menuVisible = menuPost === item.id;

  const alreadyLiked = item.is_liked;
  const likeCount = item.likes;






 const handleLikeToggle = async (item) => {
  try {
    if (item.is_liked) {
      const res = await unlikePost({
        post_id: item.id,
        user_id: user.id,
      }).unwrap();

      if (res.success) {
        renderToastSuccess(res.message);

        setPosts((prev) =>
          prev.map((post: any) =>
            post.id === item.id
              ? {
                  ...post,
                  is_liked: false,
                  likes: Math.max((post.likes || 1) - 1, 0),
                }
              : post
          )
        );
      } else {
        renderToastError(res.message);
      }
    } else {
      const res = await likePost({
        post_id: item.id,
        user_id: user.id,
        creater_id: item.post_creater_id,
      }).unwrap();

      if (res.success) {
        renderToastSuccess(res.message);

        setPosts((prev) =>
          prev.map((post: any) =>
            post.id === item.id
              ? {
                  ...post,
                  is_liked: true,
                  likes: (post.likes || 0) + 1,
                }
              : post
          )
        );
      } else {
        renderToastError(res.message);
      }
    }
  } catch (error) {
    renderToastError("Something went wrong");
  }
};
    const Images = item.post_images
      ? item.post_images.split(',').filter(img => img.trim() !== '')
      : [];

    return (
      <TouchableOpacity
       activeOpacity={1}
        className="bg-white"
        style={styles.card}
        onPress={() => {
          setShowpostPostData({ post_id: item.id });
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
              <Text style={{ fontFamily: "PopinRegula", }}>{item.post_created_date || item.created_date}</Text>
            </View>
          </View>
         <TouchableOpacity  activeOpacity={1}
         onPress={() => setMenuPost(item.id)}>
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
              onPress={() =>
  setExpandedPost(expanded ? null : item.id)
}
              >
                {expanded ? " Show Less" : " Read More"}
              </Text>
            )}
          </Text>
          <View style={{ alignSelf: "center" }}>

            {Images.length > 0 && (
              <TouchableOpacity
               activeOpacity={1}
                onPress={() => {
                  setSelectedImages(Images || []);
                  setShowImages(true);
                  setscrollable(false);
                }}
              >
                <Image
                  source={{ uri: ImageFormater(Images[0]) }}
                  style={{
                    height: vs(200),
                    width: hs(350),
                    borderRadius: ms(12),
                    resizeMode: "cover",
                  }}
                />
              </TouchableOpacity>
            )}

            {/* Overlay Container */}
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
              {/* LEFT SIDE - Camera Count */}
              {Images.length > 0 && (
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
                    {Images.length}
                  </Text>
                </View>)}

              {/* RIGHT SIDE - Auto Playing Muted Video */}
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
                  {alreadyLiked ?
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
                  {likeCount}
                </Text>
              </View>
              <View
                className="flex-row items-center"
                style={{ paddingLeft: hs(10) }}
              >
                <TouchableOpacity
                 activeOpacity={1}>
                  <Comment heigh={28} width={28}/>
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
                onPress={()=>{setShareData(item);setShowShare(true)}}>
              <Share />
            </TouchableOpacity>
          </View>
          <View>

          </View>
          <CommentInput postId={item.id} creatorId={item.post_creater_id} />
        </View>
        {menuVisible && (
          <TouchableOpacity
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
  setSelectedPost(item);
  setShowEditModal(true);
  setMenuPost(null);
}}
                style={{ paddingVertical: 12, paddingHorizontal: 15 }}
              >
                <Text style={{ fontSize: 15, fontWeight: "500", fontFamily: "PopinRegula", }}>
                  Edit
                </Text>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: "#eee" }} />

              <TouchableOpacity
               activeOpacity={1}
                style={{ paddingVertical: 12, paddingHorizontal: 15 }}
                onPress={() => {
                  setMenuPost(null);

                  Alert.alert(
                    "Delete Post",
                    "Are you sure you want to delete this post?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: async () => {
                          try {
                            const res = await deletePost({
                              post_id: item.id,
                              user_id: user.id,
                            }).unwrap();

                            if (res.success) {
                              renderToastSuccess(res.message);
                              setPosts((prev) => prev.filter((post) => post.id !== item.id));
                            } else {
                              renderToastError(res.message);
                            }
                          } catch (error) {
                            renderToastError("Something went wrong");
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "500", color: "red", fontFamily: "PopinRegula", }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const { data, isFetching, refetch, isError, error } = useGetYourpostQuery({
    userid: user.id,
    page,
  });
  const buildPostShareContent = () => {
  const postUrl =
    `https://www.homeilove.co.uk/NewsFeedSingelView?post_id=${shareData?.id}`;

  const description =
    shareData?.description?.trim() ||
    "Check out this post on Home I Love";

  const shortDescription =
    description.length > 150
      ? `${description.slice(0, 150)}...`
      : description;

  return {
    postUrl,
    title:
      shareData?.business_name ||
      shareData?.name ||
      "Home I Love",
    message:
      `${shortDescription}\n\n${postUrl}`,
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
    if (!shareData?.id) {
      renderToastError("Post not found");
      return;
    }

    const {
      postUrl,
      title,
      message,
    } = buildPostShareContent();

    const postImage =
      getPostImage(shareData);

    const localImage =
      postImage
        ? await downloadShareImage(
            postImage,
            shareData.id
          )
        : null;

    const shareOptions: any = {
      title,
      message,
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


    if (platform === "more") {
      await openFallbackShare(
        shareOptions
      );
      return;
    }


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


      // LinkedIn + Android X
      // system share sheet gives better fallback
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
      "Post share error:",
      error
    );

    renderToastError(
      error?.message ||
      "Unable to share post"
    );
  }
};
  const getPostImage = (post: any) => {
  if (!post) return null;

  if (Array.isArray(post.post_images) && post.post_images.length > 0) {
    return post.post_images[0];
  }

  if (typeof post.post_images === "string") {
    const firstImage = post.post_images
      .split(",")
      .map((img: string) => img.trim())
      .filter(Boolean)[0];

    return firstImage || null;
  }

  if (Array.isArray(post.images) && post.images.length > 0) {
    return post.images[0];
  }

  return post.post_image || post.image || null;
};


const downloadShareImage = async (
  imageUrl: string,
  postId: string | number
) => {
  try {
    if (!imageUrl) return null;

    const formattedUrl = ImageFormater(imageUrl);

    const cleanUrl = formattedUrl
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
      `homeilove-post-${postId}-${Date.now()}.${extension}`
    );

    const downloadedFile =
      await File.downloadFileAsync(
        formattedUrl,
        destination
      );

    return downloadedFile.uri;

  } catch (error) {
    console.log(
      "Share image download error:",
      error
    );

    return null;
  }
};
  useEffect(() => {
    if (!data?.data?.posts) return;

    setPosts((prev) => {
      if (page === 1) {
        return data?.data?.posts;
      } else {
        return [...prev, ...data?.data?.posts];
      }
    });
  }, [data]);

  return (
    <View className="flex-1">
<FlashList
  style={{
    flex: 1,
    backgroundColor: Colors.light.listingBackground,
  }}
  contentContainerStyle={{
    paddingBottom: vs(100),
  }}
  data={Posts}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  scrollEnabled={scrollable}
  onEndReachedThreshold={1}
  onEndReached={() => {
    if (!isFetching && data?.data?.posts?.length > 9) {
      setPage((prev) => prev + 1);
    }
  }}
  ListFooterComponent={
    isFetching ? <ActivityIndicator size="small" /> : null
  }
  ListHeaderComponent={<CreatePost />}
  refreshControl={
    <RefreshControl
      refreshing={isFetching}
      onRefresh={() => {
        if (page === 1) {
          refetch();
        } else {
          setPage(1);
        }
      }}
    />
  }
/>
      {showImages && (
        <ImageSlider

          images={selectedImages}
          setShowImage={(val: boolean) => {
            setShowImages(val);
            setscrollable(true);
          }}
        />
      )}
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
             activeOpacity={1}
             onPress={() => {   setShowViedio(false);
    setscrollable(true);
    setSelectedViedio("")} } style={{ position: 'absolute', backgroundColor: 'white', borderRadius: ms(10), zIndex: 10, top: vs(50), right: hs(10) }}>
              <Cross height={vs(30)} width={vs(30)} />
            </TouchableOpacity>

          </View>
        )
      }

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: "100%" }}
      >
         <SafeAreaView
                                                  style={{ flex: 1 }}
                                                  edges={[ "bottom", "left", "right"]}
                                                >
        <View style={{ height: "100%", width: "100%", backgroundColor: 'rgba(255, 255, 255, 0.6)', alignContent: "center", justifyContent: "center" }}>
          <CreatePost edit={true} item={selectedPost} />
        </View>
        </SafeAreaView>
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
            Share Post
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
            <Cross
              height={vs(22)}
              width={vs(22)}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: vs(20),
          }}
        >
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
          marginTop: vs(6),
          fontSize: ms(10),
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
          marginTop: vs(6),
          fontSize: ms(10),
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
          marginTop: vs(6),
          fontSize: ms(10),
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
          marginTop: vs(6),
          fontSize: ms(10),
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
          marginTop: vs(6),
          fontSize: ms(10),
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
          link:`https://www.homeilove.co.uk/NewsFeedSingelView?post_id=${shareData?.id}`,
          post_id:shareData?.id,
          post_type:shareData?.type,
          post_image: getPostImage(shareData) ?? "",
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
</ScrollView>
    </View>
  </View>
  <Loading isLoading={sharing} text="Sharing..."/>
  </SafeAreaView>
  
</Modal>
<Modal visible={showpost} animationType="slide" onRequestClose={() => setShowpost(false)} transparent={true}
  statusBarTranslucent={true}  >
            <SafeAreaView
                                                              style={{ flex: 1 }}
                                                              edges={[ "bottom", "left", "right"]}
                                                            >
<NewsFeedSingleview post_id={showpostPostData?.post_id} setshowModel={setShowpost}/>
</SafeAreaView>
</Modal>
    </View>
  );
};

export default YourPosts;
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
});
