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
import { colors } from "../../ReusableTools/css";
import { i18nStore } from "../../MobX/I18nStore";

const Chat = ({ route }) => {
  const [dataChat, setDataChat] = useState([]);

  const [textMessage, setTextMessage] = useState("");

  const [sending, setSending] = useState(false);

  const { user_id, driver_id, room } = route?.params;

  const { i18n } = i18nStore;

  useEffect(() => {
    if (room) {
      Socket.emit("join_room", room);
    }
    getDataChat();
  }, [room]);

  function getDataChat() {
    if (driver_id) {
      axios
        .get(
          `${process.env.EXPO_PUBLIC_API_URL}chat/chattingHistory?senderId=${user_id._id}&receiverId=${driver_id._id}`
        )
        .then((res) => {
          setDataChat(res.data.chattingHistory);
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

  return (
    <View className="flex-1">
      {dataChat.length > 0 ? (
        <FlatList
          data={dataChat}
          renderItem={DataChat}
          style={{ flex: 1, paddingHorizontal: 8 }}
          inverted
          contentContainerStyle={{ flexDirection: "column-reverse" }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>{i18n.t("chat.loadingChat")}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setTextMessage(text)}
          value={textMessage}
          placeholder="Type a message..."
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
    borderTopWidth: 1,
    borderTopColor: colors.primary,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  sendButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
});
