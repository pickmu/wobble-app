import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { Socket } from "../../socket/socket";
import axios from "axios";
import { StyleSheet } from "react-native";
import { colors, fonts } from "../../ReusableTools/css";
import Loading from "../../ReusableTools/Loading";
import { GiftedChat } from "react-native-gifted-chat";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Chat = ({ route }) => {
  const [dataChat, setDataChat] = useState([]);

  const [loadingChat, setLoadingChat] = useState(false);

  const { user_id, driver_id, room } = route?.params;

  useEffect(() => {
    if (room) {
      Socket.emit("join_room", room);
    }
    getDataChat();
  }, [room]);

  async function getDataChat() {
    if (user_id) {
      setLoadingChat(true);

      await axios
        .get(
          `${process.env.EXPO_PUBLIC_API_URL}chat/chattingHistory?senderId=${user_id._id}&receiverId=${driver_id._id}`
        )
        .then((res) => {
          const formattedMessages = res.data.chattingHistory.map((msg) => ({
            _id: msg._id,
            text: msg.content,
            createdAt: new Date(msg.createdAt),
            user: {
              _id: msg.sender._id,
              name: `${msg.sender.first_name} ${msg.sender.last_name}`,
              avatar: `${process.env.EXPO_PUBLIC_API_URL}${msg.sender.image}`,
            },
          }));

          setDataChat(formattedMessages);
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

  async function onSend(newMessages) {
    setDataChat((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    await axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}chat/createChat`, {
        sender: user_id._id,
        receiver: driver_id._id,
        content: newMessages[0].text,
        senderModel: user_id.role,
        receiverModel: driver_id.role,
      })
      .then((res) => {
        const messageData = {
          room,
          name: user_id.first_name,
          sender: user_id._id,
          receiver: driver_id._id,
          content: newMessages[0].text,
          senderModel: user_id.role,
          receiverModel: driver_id.role,
        };

        Socket.emit("send_message", messageData);
      })
      .catch((erorr) => {
        console.log(erorr);
      });
  }

  if (loadingChat) {
    return <Loading />;
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1">
        <View style={styles.driverData}>
          <Text className="text-[20px]">
            {user_id.first_name} {user_id.last_name}
          </Text>
        </View>

        <GiftedChat
          messages={dataChat}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: driver_id?._id,
          }}
          isKeyboardInternallyHandled={true}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  message: {
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
  userBackground: {
    backgroundColor: "gray",
  },
  otherBackground: {
    backgroundColor: colors.primary,
  },
  userMessage: {
    justifyContent: "flex-start",
  },
  otherMessage: {
    justifyContent: "flex-end",
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
