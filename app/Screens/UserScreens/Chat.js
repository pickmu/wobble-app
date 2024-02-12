import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { Socket } from "../../socket/socket";
import axios from "axios";

const Chat = ({ route }) => {
    const [room, setRoom] = useState(null);
    const [dataChat, setDataChat] = useState([]);
    const [textMessage, setTextMessage] = useState("");

    const { user_id, driver_id } = route?.params;

    console.log()

    async function createRoomOrGetRoomId(contact) {
        console.log(contact);
        await axios
            .get(
                `http://localhost:5000/room/getRoom?senderId=${user_id}&receiverId=${driver_id}`
            )
            .then((res) => {
                if (res.data.roomId != null) {
                    console.log(res);
                    setRoom(res.data.roomId._id);
                    Socket.emit("join_room", res.data.roomId._id);
                } else {
                    axios
                        .post("http://localhost:5000/room/createRoom", {
                            sender: user_id,
                            receiver: driver_id,
                            senderModel: getAuth.role,
                            receiverModel: contact.role,
                        })
                        .then((res) => {
                            se;
                            console.log(res.data);
                            setRoom(res.data.roomId._id);
                            Socket.emit("join_room", res.data.roomId._id);
                        })
                        .catch((erorr) => {
                            console.log(erorr);
                        });
                }
            });
    }

    function getDataChat() {
        if (driver_id) {
            axios
                .get(
                    `http://localhost:5000/chat/chattingHistory?senderId=${user_id}&receiverId=${driver_id}`
                )
                .then((res) => {
                    setDataChat(res.data.chattingHistory);
                });
        }
    }

    useEffect(() => {
        getDataChat();
    }, []);

    useEffect(() => {
        Socket.on("receive_message", (data) => {
            setCurrentChat((list) => [...list, data]);
        });
    }, [Socket]);

    function sendMessage() {
        axios
            .post("http://localhost:5000/chat/createChat", {
                sender: user_id,
                receiver: driver_id,
                content: textMessage,
                senderModel: getIdAuth.role,
                receiverModel: receiver.role,
            })
            .then((res) => {
                setTextMessage("");
                const messageData = {
                    room,
                    name: getIdAuth.first_name,
                    sender: user_id,
                    receiver: driver_id,
                    content: textMessage,
                    senderModel: getIdAuth.role,
                    receiverModel: receiver.role,
                };
                Socket.emit("send_message", messageData);
                setCurrentChat([...currentChat, messageData]);
            });
    }

    return (
        <View>
            <Text>Chat</Text>
        </View>
    );
};

export default Chat;
