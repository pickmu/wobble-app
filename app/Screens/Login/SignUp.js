import React, { useState, useRef } from "react";
import { FieldsetInput } from "../../ReusableTools/FieldsetInput";
import { Button } from "../../ReusableTools/Button";
import Toast from "react-native-toast-message";
import { i18nStore } from "../../MobX/I18nStore";
import axios from "axios";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUp = () => {
  const { i18n } = i18nStore;

  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    image: "",
  });

  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    image: "",
  });

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
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
      onSubmitEditing: () => userNameRef.current.focus(),
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
      onSubmitEditing: () => confirmPasswordRef.current.focus(),
    },
    {
      label: `${i18n.t("signUpUser.input.confirm_password.label")}`,
      placeholder: `${i18n.t("signUpUser.input.confirm_password.placeholder")}`,
      secureTextEntry: true,
      value: data.confirm_password,
      key: "confirm_password",
      error: error.confirm_password,
      ref: confirmPasswordRef,
      onSubmitEditing: () => handleSubmit(),
      returnKeyType: "done",
    },
  ];

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

  const handleSubmit = () => {
    try {
      setSubmitting(true);

      if (
        !data.first_name &&
        !data.last_name &&
        !data.email &&
        !data.password &&
        !data.confirm_password &&
        !data.phone
      ) {
        Toast.show({
          type: "error",
          text1: `${i18n.t("toast.error.emptyFields")}`,
        });
        setSubmitting(false);
        return;
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

      if (!data.password) {
        setError((prevErrors) => ({
          ...prevErrors,
          password: `${i18n.t("signUpUser.error.password.emtpy")}`,
        }));

        emptyFields.push("Password");
      } else if (data.password.trim() !== "") {
        // Validate password format
        const passwordRegex = /^(?=.*[A-Za-z\d]).{8,}$/;
        if (!passwordRegex.test(data.password)) {
          setError((prevErrors) => ({
            ...prevErrors,
            password: `${i18n.t("signUpUser.error.password.invalid")}`,
          }));
          emptyFields.push("Password");
        }
      }

      if (data.password !== data.confirm_password) {
        setError((prevErrors) => ({
          ...prevErrors,
          confirm_password: `${i18n.t(
            "signUpUser.error.confirm_password.notMatch"
          )}`,
        }));
        emptyFields.push("Confirm Password");
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

      const requestData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      const resp = axios.post("", requestData);

      setSubmitting(false);
    } catch (error) {
      console.log("handel submit sign up error", error);
      Toast.show({
        type: "error",
        text1: error.message,
      });
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      className="my-4"
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
    >
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
      <Button text={"Sign Up"} onPress={handleSubmit} />
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
