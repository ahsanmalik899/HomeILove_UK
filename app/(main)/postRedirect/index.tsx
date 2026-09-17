import { userdata } from "@/store/slices/selector/user";
import Loading from "@src/components/globals/Loading";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  View,
} from "react-native";

const index = () => {
    const params = useLocalSearchParams();
    const id = Number(params.post_id);
    const type=params.type as string;
    const profileType= params.profile_type
    const token= params.token
      const user = useAppSelector(userdata);
    useEffect(()=>{
          const publicRoutes = ["forgot", "verify"];

    // User not logged in
    if (!user?.id && !publicRoutes.includes(type)) {
      router.replace("/(auth)/signin");
      return;
    }
      switch(type){
        case "post":
          router.navigate({pathname:"/Home/Feeds/NewsFeed",params:{post_id:id,isPostSingle:"true"}})
          break;
           case "property":
          router.navigate({pathname:"/BuyListing",params:{id:id,type:type,isSingleView:"true"}})
          break;
             case "community":
          router.navigate({pathname:"/CommunitesLising",params:{id:id,type:type,isSingleView:"true"}})
          break;
        case "profile":
          router.navigate({pathname:"/ProfileListings",params:{id:id,type:profileType,isSingleView:"true"}})
          break;
           case "forgot":
          router.navigate({pathname:"/CreateNewpass",params:{token:token}})
          break;
           case "verify":
          router.navigate({pathname:"/(auth)/Account",params:{token:token}})
          break;
      }

    },[params])
  return (
    <View className="bg-white flex-1 pb-4 ">
      <Loading text="Loading..." isLoading={true} />
    </View>
  );
};

export default index;


