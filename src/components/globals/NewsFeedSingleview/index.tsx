import { useDeleteCommentApiMutation, useEditCommentApiMutation, useGetHomeFeedsQuery, useGetPostByIdQuery, useGetPostCommentsApiQuery, useLikePostMutation, usePostReplyApiMutation, useShare_postApiMutation, useUnlikePostMutation } from '@/store/api/user/MainApi';
import { userdata } from '@/store/slices/selector/user';
import CommunitySatatus from "@assets/CreateProfile/construction-house.svg";
import Cross from "@assets/CreateProfile/cross.svg";
import Camera from "@assets/Feedimg/camera.svg";
import Like from "@assets/icons/Like.svg";
import Area from "@assets/icons/MypostListing/area.svg";
import Bed from "@assets/icons/MypostListing/bed.svg";
import Shower from "@assets/icons/MypostListing/shower.svg";
import Share from "@assets/icons/share.svg";
import Liked from "@assets/icons/ThumbUpRed.svg";
import CommunityType from "@assets/SideBar/commercialGreen.svg";
import Delete from "@assets/SideBar/deletbaskit.svg";
import NoImage from "@assets/SideBar/no_images.png";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Colors from '@src/constants/Colors';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { hs, ms, vs } from '@utils/design/design';
import { ImageFormater } from '@utils/ImageFormat';
import { formatPrice } from '@utils/PriceFormater';
import { timeAgo } from '@utils/Timeago';
import { ViedioUrlFormat } from '@utils/ViedioUrlFormater';
import { Video } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import { File, Paths } from "expo-file-system";
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RNShare from "react-native-share";
import { useSelector } from 'react-redux';
import * as yup from "yup";
import AddSingleView from '../AddSingleView';
import CircleImage from '../CircleImage/CircleImage';
import CommentInput from '../CommentInput';
import { FormikInput } from '../FormictInput';
import HeaderWithBack from '../HeaderWithBack';
import ImageSlider from '../ImageSlider';
import LargeButton from '../LaregeButton';
import Loading from '../Loading';

  const CommentItem = ({ item, refetch , scrollRef }) => {
     const user = useSelector(userdata);
     const [deletingId, setDeletingId] = useState<number | null>(null);
 const [editingComment, setEditingComment] = useState(false);
const [editCommentText, setEditCommentText] = useState(item.comment);
const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
const [editReplyText, setEditReplyText] = useState("");
const handleDelete = (
  commentId: number,
  type: "comment" | "reply"
) => {
  Alert.alert(
    type === "comment" ? "Delete Comment" : "Delete Reply",
    type === "comment"
      ? "Are you sure you want to delete this comment? All replies to this comment will also be deleted."
      : "Are you sure you want to delete this reply?",
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
            setDeletingId(commentId);

            const res = await deleteComment(commentId).unwrap();

            if (res?.success) {
              await refetch();

              if (type === "comment") {
                refechfeeds();
              }

              renderToastSuccess(
                res?.message ||
                  `${type === "comment" ? "Comment" : "Reply"} deleted successfully`
              );
            }
          } catch (error) {
            renderToastError(
              `Failed to delete ${type}`
            );
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]
  );
};
const [editComment, { isLoading: editing }] =
  useEditCommentApiMutation();
      const handleEditComment = async () => {
  if (!editCommentText.trim()) return;

  try {
    const res = await editComment({
      comment_id: item.comment_id,
      user_id: user?.id,
      content: editCommentText.trim(),
    }).unwrap();

    if (res.success) {
      setEditingComment(false);
      refetch();
      renderToastSuccess(res.message);
    }
  } catch (error) {
    renderToastError("Failed to update comment");
  }
};
  const handleEditReply = async (reply: any) => {
  if (!editReplyText.trim()) return;

  try {
    const res = await editComment({
      comment_id: reply.comment_id,
      user_id: user?.id,
      content: editReplyText.trim(),
    }).unwrap();

    if (res.success) {
      setEditingReplyId(null);
      setEditReplyText("");
      refetch();

      renderToastSuccess(res.message);
    }
  } catch (error) {
    renderToastError("Failed to update reply");
  }
};
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
       id: user?.id,
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
  <View style={{ flexDirection: "row", gap: 8 }}>

    <TouchableOpacity
     activeOpacity={1}
       style={styles.iconBtn}
      onPress={() => {
        setEditCommentText(item.comment);
        setEditingComment(true);
      }}
    >
     <MaterialIcons
  name="edit"
  size={18}
  color={Colors.light.DarkGreen}
/>
    </TouchableOpacity>

    <TouchableOpacity
     activeOpacity={1}
       style={styles.iconBtn}
     onPress={() =>
    handleDelete(item.comment_id, "comment")
  }
    >
      <Delete width={18} height={18} />
    </TouchableOpacity>

  </View>
)}
             </View>
 
         {editingComment ? (
  <View style={styles.editBox}>
    <TextInput
      value={editCommentText}
      onChangeText={setEditCommentText}
      style={styles.editInput}
      autoFocus
      multiline
    />

    <View style={styles.editActions}>
      <TouchableOpacity
       activeOpacity={1}
        onPress={() => {
          setEditingComment(false);
          setEditCommentText(item.comment);
        }}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
       activeOpacity={1}
        onPress={handleEditComment}
        disabled={editing}
      >
        <Text style={styles.saveText}>
          {editing ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
) : (
  <Text style={styles.commentText}>
    {item.comment}
  </Text>
)}
           </View>
 
           <View style={styles.actionRow}>
             <TouchableOpacity
              activeOpacity={1}
               onPress={() => setShowReplyInput(!showReplyInput)}
             >
               <Text style={styles.actionText}>Reply</Text>
             </TouchableOpacity>
 
             <Text style={styles.time}>{timeAgo(item.created_date)}</Text>
           </View>
 
           {showReplyInput && (
             <View style={styles.replyInputBox}>
             <TextInput
  value={replyText}
  onChangeText={setReplyText}
  placeholder="Write a reply..."
  style={styles.replyInput}
  autoFocus
  onFocus={() => {
    setTimeout(() => {
      scrollRef?.current?.scrollToEnd({
        animated: true,
      });
    }, 300);
  }}
/>
 
               <TouchableOpacity 
                activeOpacity={1}
                onPress={handleReply} style={styles.sendBtn}>
                 <Text style={styles.sendText}>Send</Text>
               </TouchableOpacity>
             </View>
           )}
 
         {item.replies?.map((reply) => (
  <View
    key={reply.comment_id}
    style={styles.replyWrapper}
  >
    <CircleImage
      Size={28}
      source={{
        uri: ImageFormater(reply.profile_image),
      }}
    />

    <View style={styles.replyCard}>

      <View style={styles.commentHeader}>
        <Text style={styles.userName}>
          {reply.name}
        </Text>

        {user?.id === reply.sweetghar_user_id && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
             activeOpacity={1}
              style={styles.iconBtn}
              onPress={() => {
                setEditingReplyId(reply.comment_id);
                setEditReplyText(reply.comment);
              }}
            >
                  <MaterialIcons
  name="edit"
  size={18}
  color={Colors.light.DarkGreen}
/>
            </TouchableOpacity>

            <TouchableOpacity
             activeOpacity={1}
              style={styles.iconBtn}
               onPress={() =>
    handleDelete(item.comment_id, "comment")
  }
            >
              <Delete width={18} height={18} />
            </TouchableOpacity>

          </View>
        )}

      </View>

      {editingReplyId === reply.comment_id ? (
        <View style={styles.editBox}>

          <TextInput
            value={editReplyText}
            onChangeText={setEditReplyText}
            style={styles.editInput}
            autoFocus
            multiline
          />

          <View style={styles.editActions}>

            <TouchableOpacity
             activeOpacity={1}
              onPress={() => {
                setEditingReplyId(null);
                setEditReplyText("");
              }}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
             activeOpacity={1}
              onPress={() => handleEditReply(reply)}
            >
              <Text style={styles.saveText}>
                Save
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      ) : (
        <Text style={styles.commentText}>
          {reply.comment}
        </Text>
      )}

    </View>
  </View>
))}
         </View>
       </View>
     );
   };
export default function NewsFeedSingleview({ post_id,setshowModel,setAlreadyLiked,setData }: { post_id: number,setshowModel:(val:boolean)=>void, setData:(data:[])=>void,setAlreadyLiked?:(val:boolean)=>void }) {
    const user = useSelector(userdata);
    const scrollRef = useRef<ScrollView>(null);
      const { data, isFetching, refetch } = useGetPostByIdQuery({ post_id:post_id,userid:user?.id });
    const [showShare, setShowShare] = useState(false);
    const formatPdfUrl = (file: string) => {
        return ImageFormater(file);
    };

    const insets = useSafeAreaInsets();
     const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
  const showListener = Keyboard.addListener("keyboardDidShow", (event) => {
    setKeyboardHeight(event.endCoordinates.height);
  });

  const hideListener = Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardHeight(0);
  });

  return () => {
    showListener.remove();
    hideListener.remove();
  };
}, []);
      const [likePost, { isLoading: liking }] = useLikePostMutation();
      const [unlikePost, { isLoading: unliking }] = useUnlikePostMutation();
   const [share_postApi, { isLoading: sharing }] = useShare_postApiMutation();
       // useShare_postApiMutation ke neeche add karo

const downloadShareImage = async (
  imageUrl: string,
  postId: string | number
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
      `homeilove-uk-share-${postId}-${Date.now()}.${extension}`
    );

    const downloadedFile = await File.downloadFileAsync(
      imageUrl,
      destination
    );

    return downloadedFile.uri;
  } catch (error) {
    console.log("Share image download error:", error);
    return null;
  }
};


const buildShareContent = () => {
  const postUrl =
    `https://www.homeilove.co.uk/postRedirect?post_id=${post_id}&&type=post`;

  let shareText = "";

  if (data?.type === "community") {
    const communityTitle =
      data?.post?.community_title || "Community";

    const location =
      [data?.post?.city, data?.post?.state]
        .filter(Boolean)
        .join(", ") ||
      data?.post?.address ||
      "";

    const startingPrice =
      data?.post?.community_price?.length > 0
        ? data.post.community_price[0]
        : null;

    shareText =
      `${communityTitle}` +
      `${location ? ` in ${location}` : ""}` +
      `${
        startingPrice
          ? ` - From £${formatPrice(startingPrice)}`
          : ""
      }`;
  }

  else if (data?.type === "general") {
    const description =
      String(data?.post?.description || "").trim();

    shareText =
      description.length > 150
        ? `${description.slice(0, 150)}...`
        : description || "Check out this post on Home I Love";
  }

  else {
    const bedroomCount =
      Number(data?.post?.bedrooms ?? 0);

    const bedroomLabel =
      bedroomCount > 0
        ? `${bedroomCount} Bedroom `
        : "";

    const propertyType =
      data?.post?.property_sub_type || "Property";

    const propertyFor =
      data?.post?.property_for?.toLowerCase() === "rent"
        ? "Rent"
        : "Sale";

    const location =
      [data?.post?.city, data?.post?.state]
        .filter(Boolean)
        .join(", ") ||
      data?.post?.address ||
      "";

    const price =
      Number(
        String(data?.post?.asking_price ?? 0)
          .replace(/,/g, "")
      );

    const rentType =
      propertyFor === "Rent" && data?.post?.rent_type
        ? `/${data.post.rent_type}`
        : "";

    shareText =
      `${bedroomLabel}${propertyType} for ${propertyFor}` +
      `${location ? ` in ${location}` : ""}` +
      `${
        price > 0
          ? ` - £${formatPrice(price)}${rentType}`
          : ""
      }`;
  }

  return {
    shareText,
    postUrl,
    message: `${shareText}\n${postUrl}`,
  };
};


const openFallbackShare = async (options: any) => {
  try {
    await RNShare.open({
      ...options,
      failOnCancel: false,
    });
  } catch (error) {
    console.log("Fallback share error:", error);
  }
};


const shareOnSocial = async (
  platform: "whatsapp" | "facebook" | "twitter" | "linkedin"    | "more"
) => {
  try {
    if (!post_id) {
      renderToastError("Post not found");
      return;
    }

    const { shareText, message, postUrl } =
      buildShareContent();

    const remoteImage =
      data?.post_images?.length > 0
        ? ImageFormater(data.post_images[0])
        : null;

    const localImage =
      remoteImage
        ? await downloadShareImage(remoteImage, post_id)
        : null;

    const shareOptions: any = {
      title: shareText,
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

    try {
      if (platform === "whatsapp") {
        await RNShare.shareSingle({
          ...shareOptions,
          social: RNShare.Social.WHATSAPP,
        });

        return;
      }

      if (platform === "facebook") {
        await RNShare.shareSingle({
          ...shareOptions,
          social: RNShare.Social.FACEBOOK,
        });

        return;
      }

      if (
        platform === "twitter" &&
        Platform.OS === "ios"
      ) {
        await RNShare.shareSingle({
          ...shareOptions,
          social: RNShare.Social.TWITTER,
        });

        return;
      }
if (platform === "more") {
  await openFallbackShare(
    shareOptions
  );

  return;
}
      await openFallbackShare(shareOptions);

    } catch (socialError) {
      console.log(
        `${platform} direct share error:`,
        socialError
      );

      await openFallbackShare(shareOptions);
    }

  } catch (error: any) {
    console.log("Social share error:", error);

    renderToastError(
      error?.message || "Unable to share post"
    );
  }
};
  const [loading,setLoading]=useState(false);
  const [singleView, setSingleView] = useState(false);
     const [singlePost, setSinglePost] = useState<any>(null);
      
  
      
      const handleLikeToggle = async () => {
     
           try {
             if (data?.post?.is_liked) {
               const res = await unlikePost({
                 post_id: data?.post_id,
                 user_id: user.id,
               }).unwrap();
               if (res.success) {
                 renderToastSuccess(res.message)
    setData((prevData) =>
  prevData.map((post) =>
    Number(post.post_id) === Number(data?.post_id)
      ? {
          ...post,
          is_liked: false,
          likes: Math.max((data?.post?.likes || 1) - 1, 0),
        }
      : post
  )
);    
               } else {
                 renderToastError(res.message)
               }
     
             } else {
               const res = await likePost({
               post_id: data?.post_id,
                 user_id: user.id,
                 creater_id: data?.post?.user_id,
               }).unwrap();
               if (res.success) {
                 renderToastSuccess(res.message)
setData((prevData) =>
  prevData.map((post) => {


    if (Number(post.post_id) === Number(data?.post_id)) {


      return {
        ...post,
        is_liked: true,
        likes: (data?.post?.likes || 0) + 1,
      };
    }

    return post;
  })
);
               } else {
                 renderToastError(res.message)
               }
             }
           } catch (error) {
             renderToastError("Something went wrong");
           }
         };
 
 
   const [imageNo, setImageNo] = useState(0);
 
   const { data: comments, isFetching: commentFetching ,  refetch: refetchComments,} =
     useGetPostCommentsApiQuery({ post_id: post_id },  {
    skip: !post_id,
  });
   const [showImages, setShowImages] = useState(false);
   const [showFloor, setShowFloor] = useState(false);
   const [expanded, setExpanded] = useState(false);
        return (
     <>
     <ScrollView
  ref={scrollRef}
  className="flex-1 bg-white mb-6"
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{
    paddingBottom:
      keyboardHeight > 0
        ? keyboardHeight + vs(120)
        : vs(100),
  }}
>
         <HeaderWithBack onBackpress={()=>{setshowModel(false)}}/>
         <View
           className="flex-1"
           style={{ marginHorizontal: hs(10), paddingVertical: vs(20) }}
         >
           <View className="flex-row gap-3 mb-3">
             <CircleImage
               Size={40}
               source={{ uri: ImageFormater(data?.posted_by?.logo) }}
             />
                    <Text
                       style={[styles.heading, { color: Colors.light.red }]}
                    numberOfLines={1}
                          ellipsizeMode="tail"
                               >
                   {data?.posted_by?.business_name?.length > 20
                      ? data?.posted_by?.business_name?.slice(0, 20) + "..."
                   : data?.posted_by?.business_name}
                      </Text>
             {data?.type!=="general" && (
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                          <TouchableOpacity
                           activeOpacity={1}
                            onPress={() => setSingleView(true)}>
                   <Text style={styles.fullDetailText}>See Full Details</Text>
                    </TouchableOpacity>
                </View>)}
           </View>
           {data?.type!=="general" && (
             <View
                   className="flex-row justify-between items-center"
                              style={{
                                backgroundColor:
                                 Colors.light.lightGray,
                                paddingHorizontal: hs(10),
                                paddingVertical: vs(10),
                                borderRadius: ms(10),
                                marginBottom:  vs(10),
                              }}>
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
           </View>)}
           
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
           <View className='flex-1'>
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
                   <View className="flex-row items-center ">
                  <TouchableOpacity
                   activeOpacity={1}
                    disabled={liking || unliking}
                    onPress={() => handleLikeToggle()}
                  >
                    {data?.post?.is_liked ?
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
                    {data?.post?.likes}
                  </Text>
                </View>
              <TouchableOpacity  activeOpacity={1}
              onPress={()=>{setShowShare(true)}}>
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
           <Text style={[styles.heading,{marginLeft:hs(10)}]}>
             Comments ({comments?.data?.length || 0})
           </Text>
 
         <FlashList
         style={{flex:1}}
  data={comments?.data || []}
  keyExtractor={(item) => item.comment_id.toString()}
  renderItem={({ item }) => (
<CommentItem
  item={item}
  refetch={refetchComments}
  scrollRef={scrollRef}
/>
  )}
   ListFooterComponent={
    <View style={{ height: vs(100) }} />
  }
    ListEmptyComponent={
    !commentFetching ? (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: vs(35),
        }}
      >
        <Text
          style={{
            fontSize: ms(14),
            color: Colors.light.textGray,
            fontFamily: "PopinRegula",
          }}
        >
          No comments yet
        </Text>
      </View>
    ) : null
  }
/>
  
         </View>
       </ScrollView>
 <View
  style={{
    position: "absolute",

    bottom:
      keyboardHeight > 0
        ? keyboardHeight+vs(45)
        :  insets.bottom,

    left: 0,
    right: 0,

    backgroundColor: "#fff",

    paddingHorizontal: hs(10),
    paddingTop: vs(8),
    paddingBottom: keyboardHeight > 0 ? vs(10) : vs(8),

    borderTopWidth: 1,
    borderColor: "#eee",

    zIndex: 100,
    elevation: 10,
  }}
>
  <CommentInput
    creatorId={data?.post?.user_id || data?.posted_by?.id}
    postId={post_id}
    setData={setData}
  />
</View>
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
      {/* Bottom Sheet */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: ms(20),
          borderTopRightRadius: ms(20),

          paddingHorizontal: hs(20),
          paddingTop: vs(12),
          paddingBottom: vs(20),

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
            <Cross height={vs(22)} width={vs(22)} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
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
      onPress={() => shareOnSocial("whatsapp")}
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
      onPress={() => shareOnSocial("facebook")}
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
      onPress={() => shareOnSocial("twitter")}
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
      onPress={() => shareOnSocial("linkedin")}
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
           link:`https://www.homeilove.co.uk/postRedirect?post_id=${post_id}&&type=post`,
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
 </ScrollView>
     </View>
   </View>
   </SafeAreaView>
   <Loading isLoading={sharing} text="Sharing..."/>
 </Modal>
   <Modal visible={singleView} animationType="slide" onRequestClose={() => {    setSingleView(false);
     setSinglePost(null);
   }} transparent={true}
                 statusBarTranslucent={true}  >
                   <SafeAreaView
                                                                                                                        style={{ flex: 1 }}
                                                                                                                        edges={[ "bottom", "left", "right"]}
                                                                                                                      >
                 <AddSingleView id={ data?.post?.post_property_id||data?.post?.post_community_id} type={data?.type} setshowModel={setSingleView} />
                 </SafeAreaView>
               </Modal>
       <Loading isLoading={isFetching} text="Loading..." />
     </>
   );
 };

 
 const styles = StyleSheet.create({
   textred: {
     color: Colors.light.red,
     fontFamily: "PopinRegula",
   },
   description: {
     marginVertical: vs(10),
     fontWeight: 500,
     fontFamily: "PopinRegula",
     fontSize:ms(15),
   },
   fullDetailText: {
     color: Colors.light.DarkGreen,
     fontSize: ms(14),
     fontWeight: "700",

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
 editBox: {
  marginTop: vs(5),
},

editInput: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: ms(10),
  paddingHorizontal: hs(10),
  paddingVertical: vs(7),
  fontFamily: "PopinRegula",
  fontSize: ms(13),
},

editActions: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 15,
  marginTop: vs(6),
},

cancelText: {
  color: "#777",
  fontSize: ms(12),
  fontWeight: "600",
},

saveText: {
  color: Colors.light.DarkGreen,
  fontSize: ms(12),
  fontWeight: "700",
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
 actionIcons: {
  flexDirection: "row",
  alignItems: "center",
  gap: hs(6),
},

iconBtn: {
  width: ms(30),
  height: ms(30),
  alignItems: "center",
  justifyContent: "center",
  borderRadius: ms(15),
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
 