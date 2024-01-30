import Toast from "react-native-toast-message";

export const showToast = (type, label1, label2) => {
  return Toast.show({
    type: type,
    text1: label1,
    text2: label2 || "",
  });
};
