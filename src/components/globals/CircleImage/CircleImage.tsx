import { Image, ImageSourcePropType } from "react-native";

type CircleImageProps = {
  source:  ImageSourcePropType|null|undefined;
  Size: number;
};
const CircleImage = ({ source, Size }: CircleImageProps) => {

  return (
    <Image
      style={{
        height: Size,
        width: Size,
        borderRadius: Size/2,
        resizeMode: "contain",
        backgroundColor: "black",
      }}
      source={   source
          ? source
          : require("@assets/icons/private-user.png") 
      }
    />
  );
};

export default CircleImage;
