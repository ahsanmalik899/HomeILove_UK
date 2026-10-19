import { useSaveItemApiMutation, useUnsaveItemApiMutation } from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import Call from "@assets/Buy/call.svg";
import Mail from "@assets/Buy/email-open.svg";
import CommunitySatatus from "@assets/CreateProfile/construction-house.svg";
import RedHeart from "@assets/CreateProfile/heart-red.svg";
import Camera from "@assets/Feedimg/camera.svg";
import UnSelecteHeart from "@assets/Feedimg/unselected_heart.svg";
import CommunityType from "@assets/SideBar/commercialGreen.svg";
import NoImage from "@assets/SideBar/no_images.png";
import { FlashList } from "@shopify/flash-list";
import { AdCardWithoutAnimation } from "@src/AdCardWithoutAnimation";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import { makeCall } from "@utils/makeCall";
import { formatPrice } from "@utils/PriceFormater";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AddSingleView from "../AddSingleView";
import CircleImage from "../CircleImage/CircleImage";
import ImageSlider from "../ImageSlider";
import { postDataType } from "./type";
const CommunityListItem = ({
  item,
  type,
  user,
  setSingleView,
  setSinglePost,
  setSelectedImages,
  setShowImages,
  setscrollable,
  setImageNo,
  saveItemApi,
  unsaveItemApi,
    isSaved,
  onSavedChange,
}: any) => {
  const [expanded, setExpanded] = useState(false);

  const itemId =
    item?.data?.post_community_id ||
    item?.data?.post_property_id ||
    item?.data?.id;

  const itemKey = `community-${itemId}`;
  const openslider = (index: number) => {
    setSelectedImages(item?.data?.images || []);
    setShowImages(true);
    setscrollable(false);
    setImageNo(index);
  };

 const toggleSave = async () => {
  const nextSavedValue = !isSaved;

  try {
    if (isSaved) {
      await unsaveItemApi({
        saved_id: itemId,
        user_id: user.id,
        type: "community",
      }).unwrap();
    } else {
      await saveItemApi({
        saved_id: itemId,
        user_id: user.id,
        type: "community",
      }).unwrap();
    }

    onSavedChange(nextSavedValue);
  } catch (error) {
    console.log("Error saving/unsaving community:", error);
  }
};

  const facts = item?.imp_facts ?? item?.facts ?? "";

  if (item?.type !== "post") {
    return <AdCardWithoutAnimation ad={item?.data} />;
  }

  return (
  <>
    <TouchableOpacity
     activeOpacity={1}
  onPress={() => {
  setSinglePost({
    type,
    id: itemId,
    itemKey,
  });

  setSingleView(true);
}}
  >
          <View className="bg-white" style={styles.card}>
            <View
              className="flex-row justify-between items-center"
              style={{
                backgroundColor:
                  item?.data?.post_type === "Trending"
                    ? Colors.light.LightGreen
                    : Colors.light.lightGray,
                paddingHorizontal: hs(10),
                paddingVertical: vs(10),
                borderRadius: ms(10),
                marginBottom: item?.data?.post_type === "Trending" ? vs(10) : vs(10),
              }}
            >
              <Text
                style={{
                  color:
                    item?.data?.post_type === "Trending"
                      ? Colors.light.DarkGreen
                      : "black",
                  fontWeight: 700,
                  fontSize:ms(18),
                  fontFamily: "PopinRegula",
                }}
              >
               From £ {formatPrice(item?.data?.price1)}
              
              </Text>
              {item?.data?.post_type === "Trending" && (
                <Text
                  style={{ fontWeight: 600, color: Colors.light.DarkGreen,fontFamily: "PopinRegula", }}
                >
                  Trending
                </Text>
              )}
            </View>

            <Text style={{ color: "black",fontWeight:700,fontFamily: "PopinRegula", }}>
              {item?.data?.community_title}
            </Text>
            <Text style={{ color: Colors.light.textGray, marginTop: vs(5),fontFamily: "PopinRegula", }}>
              {item?.data?.address}
            </Text>
             <View
                                style={{
                                  height: vs(1),
                                  marginTop: vs(5),
                                  
                                  backgroundColor: Colors.light.textGray,
                                  opacity: 0.2,
                                }}
                              />
            <View>
              
              <View style={{marginTop:vs(5)}}>
             {item?.data?.post_type === "Trending" && facts && (
  facts
    .split(",",4)
    .filter(Boolean)
    .map((fact, index) => (
      <View
        key={index}
        style={[
          {
           
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: vs(3),
          },
        ]}
      >
        <View className="flex-row gap-3 items-center">
          <RedHeart height={vs(10)} width={vs(10)} />
          <Text
            style={{
              color: Colors.light.DarkGreen,
              fontWeight: "500",
              fontFamily: "PopinRegula",
              width: hs(250),
            }}
          >
            {fact.trim()}
          </Text>
        </View>
      </View>
    ))
)}</View>

              <Text style={styles.description}>
                {expanded
                  ? item?.data?.community_details
                  : item?.data?.community_details?.slice(0, 70) +
                    (item?.data?.community_details?.length > 70 ? "..." : "")}

                {item?.data?.community_details?.length > 70 && (
                  <Text
                    style={styles.moreText}
                    onPress={() => setExpanded(expanded ? false : true)}
                  >
                    {expanded ? " Show Less" : " Read More"}
                  </Text>
                )}
              </Text>

              <TouchableOpacity
               activeOpacity={1}
                onPress={() => {
                  setSelectedImages(item?.data?.images || []);
                  setShowImages(true);
                  setscrollable(false);
                }}
              >
                <Image
                  source={
                    item?.data?.images && item?.data?.images.length > 0
                      ? { uri: ImageFormater(item?.data?.images[0]) }
                      : NoImage
                  }
                  style={{
                    height: vs(200),
                    width: hs(350),
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
                    right: hs(10),
                    alignItems: "center",
                  }}
                  className="flex-row justify-between"
                >
                  <View className="flex-row items-center">
                    <Camera />
                    <Text style={{ color: "white", fontWeight: 600 ,fontFamily: "PopinRegula",}}>
                      {" "}
                      {item?.data?.images ? item?.data?.images.length : 0}
                    </Text>
                  </View>
                  {item?.data?.saleprice_type === "Reduced Price" && (
                    <Text
                      style={{
                        backgroundColor: "rgba(241, 28, 28, 0.41)",
                        paddingHorizontal: hs(8),
                        paddingVertical: vs(8),
                        color: "white",
                        fontWeight: 600,
                        borderRadius: ms(10),
                        fontFamily: "PopinRegula",
                      }}
                    >
                      {item?.data?.saleprice_type}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: vs(5),
                    right: hs(10),
                    left: hs(10),
                    alignItems: "center",
                  }}
                  className="flex-row justify-between"
                >
                  {item?.data?.property_condition === "Newly build" && (
                    <Text
                      style={{
                        backgroundColor: "rgba(241, 28, 28, 0.41)",
                        paddingHorizontal: hs(8),
                        paddingVertical: vs(8),
                        color: "white",
                        fontWeight: 600,
                        borderRadius: ms(10),
                        fontFamily: "PopinRegula",
                      }}
                    >
                      {item?.data?.property_condition}
                    </Text>
                  )}
                  <TouchableOpacity
                   activeOpacity={1}
                                     style={{ marginLeft: "auto" }}
                                     onPress={toggleSave}
                                   >
                                     { isSaved ? (
                                       <RedHeart />
                                     ) : (
                                       <UnSelecteHeart />
                                     )}
                                   </TouchableOpacity>
                </View>
              </TouchableOpacity>
              {item?.data?.post_type==="Trending"&&(
                <View className="flex-1">
               <FlashList
  data={item?.data?.images || []}
  horizontal
  style={{ flex: 1 }}
  keyExtractor={(image, index) => `${image}-${index}`}
  showsHorizontalScrollIndicator={false}
  renderItem={({ item: image, index }) => (
    <TouchableOpacity
     activeOpacity={1}
      className="mt-4 mr-2"
      onPress={() => {
        openslider(index);
      }}
    >
      <Image
        source={{ uri: ImageFormater(image) }}
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
              )}
             
              <View
                className=" bg-white flex-row  justify-between"
                style={{
                  elevation: 5,
                  borderRadius: 8,
                  paddingRight: hs(20),
                  paddingVertical: vs(10),
                  paddingHorizontal: vs(15),
                  marginTop: vs(10),
                }}
              >
                <>
                  <View className="flex-row items-center">
                                       <CommunityType />
                                       <Text style={{ marginLeft: vs(5),fontFamily: "PopinRegula", }}>
                                         {item?.data?.community_type}
                                       </Text>
                                     </View>
                                     <View className="flex-row items-center">
                                       <CommunitySatatus />
                                       <Text style={{ marginLeft: vs(5),fontFamily: "PopinRegula", }}>
                                         {item?.data?.community_status}
                                       </Text>
                                     </View>
                </>
              </View>

              <View
                className="flex-row justify-between"
                style={{
                 backgroundColor: "#ff007b1f",
                  borderRadius: 8,
                  paddingRight: hs(20),
                  paddingVertical: vs(5),
                  paddingHorizontal: hs(10),
                  marginTop: vs(8),
                 
                }}
              >
                <TouchableOpacity
                 activeOpacity={1}
                  onPress={()=>{
                    console.log(type)
                                                router.navigate({
                                                  pathname:"/ChatScreen",
                                                  params:{
                                                    userId:item.data?.user_id,
                                                   name:item.data?.posted_by?.business_name,
                                                     title: type === "community"
                                          ? item.data?.community_title
                                          : `${item.data?.bedrooms ?? 0} bedrooms ${
                                              item.data?.property_sub_type ?? ""
                                            } for ${item.data?.property_for ?? ""}`,
                                      receiver_post_id:  type === "community"
                                                    ? item.data?.post_community_id
                                                    : item.data?.post_property_id,
                                                    type:type==="community"?"":"property"
                                                  }
                                                })
                                              }}>
                  <Mail />
                </TouchableOpacity>
                <TouchableOpacity
                 activeOpacity={1}
                  onPress={()=>{
                                  makeCall(item?.data?.posted_by.contact||item?.data?.posted_by.mobile)
                                }}>
                  <Call />
                </TouchableOpacity>

                <CircleImage
                  source={{ uri: ImageFormater(item?.data?.posted_by.logo) }}
                  Size={40}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
  );
};
const YourAdsPostDesign = ({
  data,
  setPage,
  isfetching,
  setposts,
  type,
  hasmore,
  initialLoadDone,
  isSingleView,
  post_id,
  refetch,
  post_type,
}: postDataType) => {
  const [showImages, setShowImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const[singleView,setSingleView]=useState(false);
  const user = useAppSelector(userdata);
  const listRef = useRef<any>(null);
  const [imageNo, setImageNo] = useState(0);
  const insets = useSafeAreaInsets();
  const[singlePost,setSinglePost]=useState<any>(null);
  const [scrollable, setscrollable] = useState(true);
    const [saveItemApi] = useSaveItemApiMutation();
    const [unsaveItemApi] = useUnsaveItemApiMutation();
    const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});
useEffect(() => {
  if (isSingleView && post_id) {
    setSinglePost({
      type: post_type,
      id: post_id,
      itemKey: `community-${post_id}`,
    });

    setSingleView(true);
  }
}, [isSingleView, post_type, post_id]);
const renderItem = ({ item, index }: any) => {
  const itemId =
    item?.data?.post_community_id ||
    item?.data?.post_property_id ||
    item?.data?.id;

  const itemKey = `community-${itemId ?? index}`;

  const isSaved =
    savedItems[itemKey] ??
    item?.data?.is_saved ??
    false;

  return (
    <CommunityListItem
      item={item}
      type={type}
      user={user}
      setSingleView={setSingleView}
      setSinglePost={setSinglePost}
      setSelectedImages={setSelectedImages}
      setShowImages={setShowImages}
      setscrollable={setscrollable}
      setImageNo={setImageNo}
      saveItemApi={saveItemApi}
      unsaveItemApi={unsaveItemApi}
      isSaved={isSaved}
      onSavedChange={(nextSavedValue: boolean) => {
        setSavedItems((prev) => ({
          ...prev,
          [itemKey]: nextSavedValue,
        }));
      }}
    />
  );
};
  return (
    <View style={{ flex: 1}}>
        {!initialLoadDone ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : data.length > 0 ? (
          <View className="flex-1">
         <FlashList
  data={data}
  scrollEnabled={scrollable}
  ref={listRef}
  renderItem={renderItem}
    extraData={savedItems}
keyExtractor={(item, index) =>
  item?.type === "post"
    ? `community-${item?.data?.post_community_id ?? index}`
    : `ad-${item?.data?.advertisement_id ?? index}`
}
  onEndReachedThreshold={0.8}
  onEndReached={() => {
    if (!isfetching && hasmore) {
      setPage((prev) => prev + 1);
    }
  }}
  ListFooterComponent={
    isfetching ? <ActivityIndicator size="small" /> : null
  }
  refreshControl={
    <RefreshControl
      refreshing={isfetching}
      onRefresh={() => {
        setPage(1);
        refetch();
      }}
    />
  }
/>
          </View>
        ) : (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontFamily: "PopinRegular",
            }}
          >
            No Data Found
          </Text>
        )}
  
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
        <Modal visible={singleView} animationType="slide" onRequestClose={() => setSingleView(false)} transparent={true}
          statusBarTranslucent={true}  >
                 <SafeAreaView
                                                                                  style={{ flex: 1 }}
                                                                                  edges={[ "bottom", "left", "right"]}
                                                                                >
<AddSingleView
  id={singlePost?.id}
  type={singlePost?.type}
  setshowModel={setSingleView}
  onSavedChange={(nextSavedValue) => {
    const itemKey =
      singlePost?.itemKey ||
      (singlePost?.id
        ? `community-${singlePost.id}`
        : null);

    if (!itemKey) return;

    setSavedItems((prev) => ({
      ...prev,
      [itemKey]: nextSavedValue,
    }));
  }}
/>
          </SafeAreaView>
        </Modal>
      </View>
  );
};

export default YourAdsPostDesign;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: hs(10),
    marginVertical: vs(10),
    paddingHorizontal: hs(10),
    paddingVertical: vs(10),
    borderRadius: ms(20),
    elevation: 5,
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
    fontWeight: 500,
    color:Colors.light.textGray,
    fontSize:ms(15),
    fontFamily: '',
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
});
