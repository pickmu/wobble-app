import { View, Text, Button, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { Socket } from "../../socket/socket";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

const Chat = ({ route }) => {
    const [dataChat, setDataChat] = useState([]);
    const [textMessage, setTextMessage] = useState("");
    const [currentChat, setCurrentChat] = useState([]);

    const { user_id, driver_id ,room } = route?.params;


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
            setCurrentChat((list) => [...list, data]);
        });
    }, [Socket]);

    function sendMessage() {
        axios
            .post(`${process.env.EXPO_PUBLIC_API_URL}chat/createChat`, {
                sender: user_id._id,
                receiver: driver_id._id,
                content: textMessage,
                senderModel: user_id.role,
                receiverModel: driver_id.role,
            })
            .then((res) => {
                console.log(res);
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
                setCurrentChat([...currentChat, messageData]);
            })
            .catch((erorr) => {
                console.log(erorr);
            });
    }

    return (
        <View className="h-full relative ">
            <View className="flex flex-col p-2">
                <ScrollView>
                    {dataChat.map((message, index) => (
                        <View
                            key={index}
                            style={[
                                styles.messageContainer,
                                message.senderModel === "User"
                                    ? styles.userMessage
                                    : styles.otherMessage,
                            ]}
                        >
                            <View style={styles.message}>
                                <Text style={styles.messageText}>
                                    {message.content}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {currentChat.map((message , index) => (
                        <View
                            key={index}
                            style={[
                                styles.messageContainer,
                                message.senderModel === "User"
                                    ? styles.userMessage
                                    : styles.otherMessage,
                            ]}
                        >
                            <View style={styles.messageReciver} className="mt-2 ">
                                <Text className="text-white">
                                    {message.content}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View className="p-2 pr-5 pl-5 pb-10 bottom-0 absolute w-full bg-Primary flex-row items-center">
                <TextInput
                    className="bg-white w-5/6 p-3 rounded-md"
                    onChangeText={(text) => setTextMessage(text)}
                ></TextInput>
                <Pressable
                    className="ml-3 p-3 bg-white rounded-lg"
                    onPress={sendMessage}
                >
                    <Text> Send</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    message: {
        backgroundColor: "gray",
        paddingVertical: 10, // Use numeric value for padding
        paddingHorizontal: 10, // Use numeric value for padding
        maxWidth: "100%", // Use percentage value for maximum width
        alignSelf: "flex-start", // Align the message to the start (left) of the container
        borderRadius: "10px",
    },
    messageReciver: {
        backgroundColor: "blue",
        paddingVertical: 10, // Use numeric value for padding
        paddingHorizontal: 10, // Use numeric value for padding
        maxWidth: "100%", // Use percentage value for maximum width
        alignSelf: "flex-start", // Align the message to the start (left) of the container
        borderRadius: "10px",
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
});
