import ActiveRent from "@assets/icons/PostProperty/active-rent.svg";
import ActiveSale from "@assets/icons/PostProperty/active-sale.svg";
import RentIcon from "@assets/icons/PostProperty/non-active-rent.svg";
import SaleIcon from "@assets/icons/PostProperty/non-active-sale.svg";
import Colors from "@src/constants/Colors";
import { hs, ms, vs } from "@utils/design/design";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RentAndSaleProps } from "./type";
const index = ({ onPress, value,errorText,edit=false }: RentAndSaleProps) => {
  return (
    <>
    <View className="flex-row justify-between">
      {(!edit || value === "sale")&&(
      <TouchableOpacity
       activeOpacity={1} className="items-center"
        style={[value === "sale" ? styles.activeButton : styles.Button]}
        onPress={()=>onPress('sale')}
      >
        {value === "sale" ? <ActiveSale /> : <SaleIcon />}
        <Text style={[value === "sale" ? styles.TextActive : styles.Text]}>For Sale</Text>
      </TouchableOpacity>)}
{(!edit || value === "rent")&&(
      <TouchableOpacity
       activeOpacity={1}
      className="items-center"
        style={[value === "rent" ? styles.activeButton : styles.Button]}
       onPress={()=>onPress('rent')}
      >
        {value === "rent" ? <ActiveRent /> : <RentIcon />}
        <Text style={[value === "rent" ? styles.TextActive : styles.Text]}>For Rent</Text>
      </TouchableOpacity>)}
    </View>
     { errorText && (
                      <Text
                        style={{ color: Colors.light.red, marginTop: vs(5),fontFamily: "PopinRegula", }}
                      >
                        {errorText}
                      </Text>
                    )}
                    </>
  );
};

export default index;

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: Colors.light.DarkGreen,
    width: hs(150),
    paddingVertical: vs(5),
    borderRadius:8,
  },
  Button: {
    borderWidth: ms(0.5),
    width: hs(150),
    paddingVertical: vs(5),
    borderColor:Colors.light.textGray,
    borderRadius:8,
  },

  TextActive: {
    fontWeight: 500,
    color: "white",
    marginTop:vs(5),
    fontFamily: "PopinRegula",
  },
  Text: {
    fontWeight: 400,
     marginTop:vs(5),
     fontFamily: "PopinRegula",
  },
});
