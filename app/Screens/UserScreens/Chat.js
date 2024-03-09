import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { Socket } from "../../socket/socket";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { colors, fonts } from "../../ReusableTools/css";
import { i18nStore } from "../../MobX/I18nStore";
import Loading from "../../ReusableTools/Loading";

const Chat = ({ route }) => {
  const [dataChat, setDataChat] = useState([]);

  const [textMessage, setTextMessage] = useState("");

  const [loadingChat, setLoadingChat] = useState(false);

  const [sending, setSending] = useState(false);

  const { user_id, driver_id, room } = route?.params;

  const { i18n } = i18nStore;

  useEffect(() => {
    if (room) {
      Socket.emit("join_room", room);
    }
    getDataChat();
  }, [room]);

  async function getDataChat() {
    if (driver_id) {
      setLoadingChat(true);

      await axios
        .get(
          `${process.env.EXPO_PUBLIC_API_URL}chat/chattingHistory?senderId=${user_id._id}&receiverId=${driver_id._id}`
        )
        .then((res) => {
          setDataChat(res.data.chattingHistory);
          setLoadingChat(false);
        })
        .catch(() => {
          console.log("cant find chat");
        });
    }
  }

  useEffect(() => {
    Socket.on("receive_message", (data) => {
      setDataChat((list) => [...list, data]);
    });
  }, [Socket]);

  async function sendMessage() {
    setSending(true);

    await axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}chat/createChat`, {
        sender: user_id._id,
        receiver: driver_id._id,
        content: textMessage,
        senderModel: user_id.role,
        receiverModel: driver_id.role,
      })
      .then((res) => {
        setTextMessage("");
        const messageData = {
          room,
          name: user_id.first_name,
          sender: user_id._id,
          receiver: driver_id._id,
          content: textMessage,
          senderModel: user_id.role,
          receiverModel: driver_id.role,
        };
        Socket.emit("send_message", messageData);

        setDataChat([...dataChat, messageData]);

        setSending(false);
      })
      .catch((erorr) => {
        console.log(erorr);
      });
  }

  const DataChat = ({ item }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.senderModel === "User"
            ? styles.userMessage
            : styles.otherMessage,
        ]}
      >
        <View style={styles.message}>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  if (loadingChat) {
    return <Loading />;
  }

  return (
    <View className="flex-1">
      <View style={styles.driverData}>
        <Text className="text-[20px]">
          {driver_id.first_name} {driver_id.last_name}
        </Text>
      </View>

      <FlatList
        data={dataChat}
        renderItem={DataChat}
        style={{ flex: 1, paddingHorizontal: 8 }}
        inverted
        contentContainerStyle={{ flexDirection: "column-reverse" }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setTextMessage(text)}
          value={textMessage}
          placeholder={i18n.t("chat.type")}
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text className="text-white">
            {sending ? i18n.t("chat.sending") : i18n.t("chat.send")}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  message: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 10,
    maxWidth: "100%",
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  messageText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  sendButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  driverData: {
    backgroundColor: colors.lightBlue,
    marginTop: 10,
    padding: 5,
    fontFamily: fonts.regular,
  },
});
