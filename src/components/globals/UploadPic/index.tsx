import Cross from "@assets/CreateProfile/cross.svg";
import Colors from "@src/constants/Colors";
import { hs, ms, vs } from "@utils/design/design";
import { ImageFormater } from "@utils/ImageFormat";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UploadPic } from "./type";
/* ================= HELPERS ================= */

const normalizeImages = (val: any) => {
  if (!val) return [];

  const arr = Array.isArray(val) ? val : [val];

  return arr
    .map((item) => {
      // ✅ Existing image from backend (string)
      if (typeof item === "string") {
        return { uri: ImageFormater(item) };
      }

      // ✅ Picked image (local file)
      if (typeof item === "object" && item.uri) {
        return item;
      }

      return null;
    })
    .filter(Boolean);
};


/* =========================================== */

const index = ({
  text1,
  text2,
  text3,
  additionalText,
  Logo,
  setValue,
  name,
  border,
  value,
  withCircule = false,
  limt,
  UploadComponenet,
}: UploadPic) => {
  const images = normalizeImages(value);

  /* ================= PICK IMAGE ================= */

const pickImage = async () => {
  try {
    const remaining = limt - images.length;

    if (remaining <= 0) {
      alert(`You can upload only ${limt} image${limt > 1 ? "s" : ""}`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: limt > 1,
      selectionLimit: limt > 1 ? remaining : 1,

      // Initial compression from picker
      quality: 0.8,
    });

    if (result.canceled) return;

    const files = await Promise.all(
      result.assets.map(async (asset, index) => {
        // Create manipulator
        const context = ImageManipulator.ImageManipulator.manipulate(asset.uri);

        // Resize only if image is very large
        if (asset.width && asset.width > 1200) {
          context.resize({
            width: 1200,
            height: null,
          });
        }

        const renderedImage = await context.renderAsync();

        // Final compression
        const compressedImage = await renderedImage.saveAsync({
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
        });

        return {
          uri: compressedImage.uri,
          name: `image-${Date.now()}-${index}.jpg`,
          type: "image/jpeg",
        };
      })
    );

    if (limt === 1) {
      setValue(name, files[0]);
    } else {
      setValue(name, [...images, ...files]);
    }
  } catch (error) {
    console.log("Image Pick/Compression Error:", error);
    alert("Something went wrong while processing image");
  }
};




  return (
    <View style={{ marginBottom: vs(20) }}>
      {/* ---------- LABEL ---------- */}
      {text1&&(
           <View className="flex-row">
        <Text style={{ fontSize: ms(15), fontWeight: "700",fontFamily: "PopinRegula", }}>
          {text1}
          <Text style={{ color: Colors.light.red,fontFamily: "PopinRegula", }}>{text2}</Text>
          {text3}
        </Text>
        {additionalText && <Text style={{fontFamily: "PopinRegula",}}>{` (${additionalText})`}</Text>}
      </View>
      )}
   

      {/* ---------- CONTAINER ---------- */}
      <View
        style={{
          marginTop:vs( UploadComponenet?0:10),
          backgroundColor: "white",
          borderWidth: border ? 0.5 : 0,
          borderColor: Colors.light.textGray,
          borderRadius: ms(10),
          paddingVertical: vs(5),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* ---------- PREVIEW ---------- */}
        {images.length > 0 && (
          <View className="flex-row flex-wrap gap-2 justify-center">
            {images.map((img, index) => (
              <View key={index} className="relative">
                <TouchableOpacity
                  onPress={() => {
                    if (limt === 1) {
                      setValue(name, null);
                    } else {
                      const updated = images.filter((_, i) => i !== index);
                      setValue(name, updated);
                    }
                  }}
                  className="absolute right-0 top-0 z-10 bg-white"
                  style={{ borderRadius: ms(12) }}
                >
                  <Cross />
                </TouchableOpacity>

                <Image
                  source={{ uri: img.uri }}

                  style={UploadComponenet?{width: hs(80),
                    height:  hs(60),
                    borderRadius: hs(5),}:{
                    width: limt === 1 ? hs(200) : hs(100),
                    height: limt === 1 ? hs(250) : hs(100),
                    borderRadius: hs(8),
                  }}
                />
              </View>
            ))}
          </View>
        )}

        {/* ---------- ADD BUTTON ---------- */}
        {images.length < limt && (

          <TouchableOpacity onPress={pickImage}>
            {UploadComponenet?(<UploadComponenet/>):(
               <View
              style={[
                withCircule
                  ? {
                      borderWidth: 1,
                      paddingHorizontal: hs(50),
                      paddingVertical: vs(50),
                      borderRadius: ms(80),
                      borderColor: Colors.light.lightGray,
                    }
                  : { paddingVertical: vs(40) },
              ]}
            >
              <Logo />
            </View>
            )}
           
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
