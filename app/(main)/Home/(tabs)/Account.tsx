import { userdata } from "@/store/slices/selector/user";
import CircleImage from "@src/components/globals/CircleImage/CircleImage";
import HomeCard from "@src/components/globals/HomeCard";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { ms } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const Account = () => {
  const user = useAppSelector(userdata);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <CircleImage
          source={{ uri: ImageFormater(user?.logo) }}
          Size={70}
        />

        <Text
          style={{
            marginTop: 5,
            color: Colors.light.DarkGreen,
            fontWeight: "600",
            fontSize: ms(16),
            fontFamily: "PopinRegula",
          }}
        >
          {user?.name}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {user?.user_type === "Business" && (
            <HomeCard
              title="Business Profiles"
              onpress={() => router.navigate("/(main)/BusenessProfiles")}
            />
          )}

          <HomeCard
            title="Your Ads"
            onpress={() => router.navigate("/(main)/YouAds")}
          />

          <HomeCard
            title="Inquiries"
            onpress={() => router.navigate("/(main)/Inquires")}
          />

          <HomeCard
            title="Buy Credit"
            onpress={() => router.navigate("/BuyCredit")}
          />

          <HomeCard
            title="Advertise"
            onpress={() => router.navigate("/Advertise")}
          />

          <HomeCard
            title="Your Promotions"
            onpress={() => router.navigate("/YourPromotions")}
          />

          <HomeCard
            title="Set Alerts"
            onpress={() => router.navigate("/SetAlerts")}
          />

          <HomeCard
            title="Reviews"
            onpress={() => router.navigate("/Reviews")}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Account;