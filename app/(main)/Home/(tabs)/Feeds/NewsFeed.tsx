import { useGetHomeFeedsQuery } from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import PostDesign from "@src/components/globals/PostDesign/PostDesign";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { db } from "@src/utils/firebse";
import { vs } from "@utils/design/design";
import * as Application from 'expo-application';
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewsFeeds = () => {
  const [page, setPage] = useState(1);
   const { post_id ,isPostSingle} = useLocalSearchParams();
  const limit = 10;
  const [Posts, setPosts] = useState<[]>([]);
  const user = useAppSelector(userdata);
  const [visible,setVisible]=useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
  const checkForUpdate = async () => {
    try {
      const currentVersion = Application.nativeApplicationVersion;
  
      const docRef = doc(db, "AppVersion", "version");
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        console.log("No version document found");
        return;
      }
  
      const latestVersion = docSnap.data()?.version;
  
      console.log("Current:", currentVersion);
      console.log("Latest:", latestVersion);
  
      if (currentVersion !== latestVersion) {
       
  
        setTimeout(() => {
        setVisible(true)
        }, 500);
      }
    } catch (error) {
      console.log("Version check error:", error);
    }
  };
  
    checkForUpdate();
  }, []);
  const filter = [
    { id: 1, name: "All" },
     { id: 2, name: "Sale" },
     { id: 3, name: "Rent" },
    { id: 4, name: "Community" },
    { id: 5, name: "Agents" },
    { id: 6, name: "Builders" },
    { id: 7, name: "Mortgages" },
    { id: 8, name: "Electricians" },
    { id: 9, name: "Decor" },
    { id: 10, name: "Plumbers" },
    { id: 11, name: "Painters" },
    { id: 12, name: "Investors" },
  ];

  const renderFilterItem = ({ item }) => {
    const isActive = selectedFilter === item.name;

    return (
      <View style={{paddingVertical:vs(20)}}>
      <TouchableOpacity
       activeOpacity={1}
       onPress={() => {
  if (selectedFilter === item.name) return;

  setPosts([]);
  setPage(1);
    setHasMore(true);
  setSelectedFilter(item.name);
}}
        style={[styles.filterChip, isActive && styles.filterChipActive]}
      >
        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
      </View>
    );
  };

  const { data, isFetching, refetch, isError, error } = useGetHomeFeedsQuery({
    id: user.id,
    type: selectedFilter,
    page,
    limit,
  });
useEffect(() => {
  const newPosts = data?.data?.feed;

  if (!newPosts) return;

  setHasMore(newPosts.length > 0);

  setPosts((prev) => {
    if (page === 1) {
      return newPosts;
    }

    const existingKeys = new Set(
      prev.map((item: any) => `${item.type}-${item.post_id}`)
    );

    const uniquePosts = newPosts.filter(
      (item: any) =>
        !existingKeys.has(`${item.type}-${item.post_id}`)
    );

    return [...prev, ...uniquePosts];
  });
}, [data, page]);
  return (
    <View className="bg-white flex-1">
      <View style={styles.filterContainer}>
       

        <FlatList
          data={filter}
          renderItem={renderFilterItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <PostDesign data={Posts} hasMore={hasMore} isfetching={isFetching} setPage={setPage} refetch={refetch} setData={setPosts} isPostSingle={isPostSingle=="true"?true:false} post_id={post_id?.toString()} />
        <Modal
  visible={visible}
  animationType="slide"
  transparent
  onRequestClose={() => setVisible(false)}
>
   <SafeAreaView
                                          style={{ flex: 1 }}
                                          edges={[ "bottom", "left", "right"]}
                                        >
  <View style={styles.overlay}>
    <View style={styles.sheetContainer}>

      <Text style={{ fontSize: 45 }}>⬆️</Text>

      <Text style={styles.title}>Update Available</Text>

      <Text style={styles.desc}>
        A new version of the app is available. Please update to continue using all features.
      </Text>

      <View style={styles.btnRow}>

        <TouchableOpacity
         activeOpacity={1}
          style={[styles.btn, { backgroundColor: Colors.light.DarkGreen}]}
          onPress={() => setVisible(false)}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Later
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
         activeOpacity={1}
          style={[styles.btn, { backgroundColor: Colors.light.red }]}
        onPress={() => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/idYOUR_APP_ID" 
        : "https://play.google.com/store/apps/details?id=com.revnosoft.homeilove.uk";

    Linking.openURL(url);
  }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Update
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  </View>
  </SafeAreaView>
</Modal>

    </View>
  );
};
const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor:  "#F4F0F0",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  sortText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginLeft: 16,
    marginBottom: 8,
    fontFamily: "PopinRegula",
  },

  filterList: {
    paddingHorizontal: 12,
  },

  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 8,
    marginVertical:vs(5),
  },

  filterChipActive: {
    backgroundColor: Colors.light.red,
      marginVertical:vs(5),
  },
  filterText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    fontFamily: "PopinRegula",
  },

  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "PopinRegula",
  },
   sheetContainer: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  alignItems: "center",


  maxHeight: "35%",
},
overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "flex-end",
},
title: {
  fontSize: 18,
  fontWeight: "700",
  marginTop: 10,
},

desc: {
  textAlign: "center",
  marginTop: 10,
  color: "#666",
},

btnRow: {
  flexDirection: "row",
  marginTop: 20,
  gap: 10,
},

btn: {
  paddingVertical: 10,
  paddingHorizontal: 25,
  borderRadius: 10,
},
});

export default NewsFeeds;
