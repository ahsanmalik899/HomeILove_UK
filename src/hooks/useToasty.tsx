import * as Burnt from "burnt";
import { Platform, ToastAndroid } from "react-native";

export const renderToastSuccess = (title: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(title, ToastAndroid.SHORT);
    return;
  }

  Burnt.toast({
    title,
    preset: "done",
    haptic: "success",
    duration: 2,
    from: "bottom",
    shouldDismissByDrag: true,
  });
};

export const renderToastError = (title: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(title, ToastAndroid.SHORT);
    return;
  }

  Burnt.toast({
    title,
    preset: "error",
    haptic: "error",
    duration: 2,
    from: "bottom",
    shouldDismissByDrag: true,
  });
};

export const renderAlertSuccess = (
  title: string,
  message?: string
) => {
  return Burnt.alert({
    title,
    message,
    preset: "done",
    duration: 2,
    shouldDismissByTap: true,
  });
};

export const renderAlertError = (
  title: string,
  message?: string
) => {
  return Burnt.alert({
    title,
    message,
    preset: "error",
    duration: 2,
    shouldDismissByTap: true,
  });
};