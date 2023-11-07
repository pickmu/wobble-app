import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { i18nStore } from "../../MobX/I18nStore";
import * as ImagePicker from "expo-image-picker";
import { authStore } from "../../MobX/AuthStore";
import { FieldsetInput } from "../../ReusableTools/FieldsetInput";
import { Button } from "../../ReusableTools/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import axios from "axios";

const EditProfile = () => {
  const { i18n } = i18nStore;
  const { userInfo } = authStore;

  const [saving, setSaving] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [data, setData] = useState({
    first_name: userInfo?.first_name,
    last_name: userInfo?.last_name,
    email: userInfo?.email,
    phone: userInfo?.phone_number,
    password: "",
  });

  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    image: "",
  });

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();

  const inputFields = [
    {
      label: `${i18n.t("signUpUser.input.first_name.label")}`,
      placeholder: `${i18n.t("signUpUser.input.first_name.placeholder")}`,
      value: data.first_name,
      key: "first_name",
      error: error.first_name,
      ref: firstNameRef,
      onSubmitEditing: () => lastNameRef.current.focus(),
    },
    {
      label: `${i18n.t("signUpUser.input.last_name.label")}`,
      placeholder: `${i18n.t("signUpUser.input.last_name.placeholder")}`,
      value: data.last_name,
      key: "last_name",
      error: error.last_name,
      ref: lastNameRef,
      onSubmitEditing: () => emailRef.current.focus(),
    },
    {
      label: `${i18n.t("signUpUser.input.email.label")}`,
      placeholder: `${i18n.t("signUpUser.input.email.placeholder")}`,
      value: data.email,
      key: "email",
      error: error.email,
      ref: emailRef,
      onSubmitEditing: () => phoneRef.current.focus(),
    },
    {
      label: `${i18n.t("signUpUser.input.phone.label")}`,
      placeholder: `${i18n.t("signUpUser.input.phone.placeholder")}`,
      value: data.phone,
      key: "phone",
      error: error.phone,
      keyboardType: "numeric",
      ref: phoneRef,
      onSubmitEditing: () => passwordRef.current.focus(),
    },
    {
      label: `${i18n.t("signUpUser.input.password.label")}`,
      placeholder: `${i18n.t("signUpUser.input.password.placeholder")}`,
      secureTextEntry: true,
      value: data.password,
      key: "password",
      error: error.password,
      ref: passwordRef,
      onSubmitEditing: () => handleEdit(),
    },
  ];

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      title: "Select an image",
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setImageData(result.assets);
    }
  };

  const handleEdit = async () => {
    const hasChanges =
      data.first_name === userInfo.first_name ||
      data.last_name === userInfo.last_name ||
      data.email === userInfo.email ||
      data.phone === userInfo.phone;

    if (hasChanges) {
      return Toast.show({
        type: "info",
        text1: `${i18n.t("toast.info.noChanges")}`,
      });
    }

    const emptyFields = [];

    if (!data.first_name) {
      setError((prevErrors) => ({
        ...prevErrors,
        first_name: `${i18n.t("signUpUser.error.first_name.empty")}`,
      }));
      emptyFields.push("First Name");
    } else if (data.first_name.length < 3) {
      setError((prevErrors) => ({
        ...prevErrors,
        first_name: `${i18n.t("signUpUser.error.first_name.length")}`,
      }));
      emptyFields.push("First Name");
    }

    if (!data.last_name) {
      setError((prevErrors) => ({
        ...prevErrors,
        last_name: `${i18n.t("signUpUser.error.last_name.empty")}`,
      }));
      emptyFields.push("Last Name");
    } else if (data.last_name.length < 3) {
      setError((prevErrors) => ({
        ...prevErrors,
        last_name: `${i18n.t("signUpUser.error.last_name.length")}`,
      }));
      emptyFields.push("First Name");
    }

    if (!data.email) {
      setError((prevErrors) => ({
        ...prevErrors,
        email: `${i18n.t("signUpUser.error.email.empty")}`,
      }));
      emptyFields.push("Email");
    } else if (data.email.trim() !== "") {
      const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(data.email)) {
        setError((prevErrors) => ({
          ...prevErrors,
          email: `${i18n.t("signUpUser.error.email.invalid")}`,
        }));
        emptyFields.push("Email");
      }
    }

    if (!data.phone) {
      setError((prevErrors) => ({
        ...prevErrors,
        phone: `${i18n.t("signUpUser.error.phone.empty")}`,
      }));
      emptyFields.push("Phone Number");
    } else if (data.phone.trim() !== "") {
      const phoneRegex = /^(70|71|76|78|79|81|03)[0-9]{6}$/;
      if (!phoneRegex.test(data.phone)) {
        setError((prevErrors) => ({
          ...prevErrors,
          phone: `${i18n.t("signUpUser.error.phone.invalid")}`,
        }));
        emptyFields.push("Phone Number");
      }
    }

    if (emptyFields.length > 0) {
      Toast.show({
        type: "error",
        text1: `${i18n.t("toast.error.submissionFailedTitle")}`,
        text2: `${i18n.t("toast.error.submissionFailedSubTitle")}`,
      });
      setSubmitting(false);
      return;
    }

    try {
      setSaving(true);

      const requestData = new FormData();

      requestData.append("first_name", data.first_name.trim());
      requestData.append("last_name", data.last_name.trim());
      requestData.append("email", data.email.trim());
      requestData.append("phone", data.phone.trim());
      requestData.append("password", data.password.trim());

      if (imageData) {
        requestData.append(`image`, {
          uri: imageData.uri,
          type: "image/jpeg",
        });
      }

      const resp = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}user/updateUser/${userInfo?._id}`,
        requestData
      );

      setSaving(false);

      Toast.show({
        type: "success",
        text1: `${i18n.t("editProfile.dataSaved")}`,
      });
    } catch (error) {
      console.log("handel submit sign up error", error);
      Toast.show({
        type: "error",
        text1: error.message,
      });
      setSaving(false);
    }
  };

  const handleInputChange = (label, value) => {
    setData((prevData) => ({
      ...prevData,
      [label]: value,
    }));

    setError((prevErrors) => ({
      ...prevErrors,
      [label]: "", // Clear the error when the user starts typing again
    }));
  };
  console.log(`${process.env.EXPO_PUBLIC_API_URL}${userInfo?.image}`);
  console.log(``);
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
    >
      <View className="m-4">
        <View className="flex-row items-center gap-5 mb-3">
          {userInfo?.image || imageData ? (
            <View>
              <Image
                source={{
                  uri:
                    `${process.env.EXPO_PUBLIC_API_URL}${userInfo.image}` ||
                    imageData?.uri,
                }}
                style={styles.image}
              />
            </View>
          ) : (
            <FontAwesome name="user-circle-o" size={100} color="gray" />
          )}

          <TouchableOpacity onPress={handleSelectImage}>
            <Text className="text-lg">
              {userInfo.image
                ? `${i18n.t("editProfile.editPhoto")}`
                : `${i18n.t("editProfile.addPhoto")}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="">
          {inputFields.map((input, index) => {
            return (
              <FieldsetInput
                key={index}
                label={input.label}
                placeholder={input.placeholder}
                ref={input.ref}
                value={input.value}
                onChangeText={(value) => handleInputChange(input.key, value)}
                secureTextEntry={input.secureTextEntry}
                keyboardType={input.keyboardType}
                error={input.error}
                onSubmitEditing={input.onSubmitEditing}
                returnKeyType={input.returnKeyType}
              />
            );
          })}
        </View>

        <Button
          text={
            saving
              ? `${i18n.t("editProfile.saving")}`
              : `${i18n.t("editProfile.save")}`
          }
          onPress={handleEdit}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
