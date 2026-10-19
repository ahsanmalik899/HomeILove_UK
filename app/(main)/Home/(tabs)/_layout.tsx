
import { useGetUnreadConversationCountQuery } from "@/store/api/user/MainApi";
import { userdata } from "@/store/slices/selector/user";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { socket } from "@src/socket";
import { hs, ms, vs } from "@utils/design/design";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const _layout = () => {
  const user = useAppSelector(userdata);
    const insets = useSafeAreaInsets();
 const {data:count,isLoading}=useGetUnreadConversationCountQuery({user_id:user?.id},{skip:!user?.id})
    const [unreadCount, setUnreadCount] = useState(0);
useEffect(()=>{
setUnreadCount(count?.unread_conversations)
console.log("unread",count?.unread_conversations)
},[count])
useEffect(() => {

    socket.on("unreadConversationCount", ({ count }) => {

        setUnreadCount(count);

    });

    return () => {

        socket.off("unreadConversationCount");

    };

}, []);
  
  
  return (
 <Tabs
  screenOptions={{
    headerShown: false,

    tabBarActiveTintColor: Colors.light.red,
    tabBarInactiveTintColor: Colors.light.DarkGreen,

    tabBarHideOnKeyboard: true,

    tabBarStyle: {
      position: "absolute",

      height: 60,

      backgroundColor: "#FFFFFF",

      borderRadius: hs(22),
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 10,

   
  
      paddingBottom: vs(6),
    },

    tabBarItemStyle: {
      borderRadius: hs(18),
      paddingVertical: vs(3),
    },

    tabBarIconStyle: {
      marginTop: vs(2),
    },

    tabBarLabelStyle: {
      fontSize: ms(10),
      fontWeight: "500",

    },
  }}
>
      <Tabs.Screen
      name="Feeds"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused? Colors.light.red:Colors.light.DarkGreen,
                fontWeight: focused ? "600" : "400",
                fontSize:ms(12),
                fontFamily: "PopinRegula",
              }}
            >
              Home Feed
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home-filled" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Message"
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.light.red,
            fontSize: ms(10),
            fontFamily: "PopinRegula",
          },
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
               color: focused? Colors.light.red:Colors.light.DarkGreen,
                fontWeight: focused ? "600" : "400",
                fontSize:ms(12),
                fontFamily: "PopinRegula",
              }}
            >
              Message
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
       name="Account"
        options={{
           tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused? Colors.light.red:Colors.light.DarkGreen,
                fontWeight: focused ? "600" : "400",
                fontSize:ms(12),
                fontFamily: "PopinRegula",
              }}
            >
              Dashboard
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout