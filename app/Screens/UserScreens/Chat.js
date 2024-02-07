import { View, Text } from "react-native";

const Chat = ({ route }) => {
  const { user_id, driver_id } = route?.params;

  return (
    <View>
      <Text>Chat</Text>
    </View>
  );
};

export default Chat;
