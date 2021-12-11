import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CometChatUserListWithMessages, CometChatMessages } from '../cometchat-pro-react-native-ui-kit';

import Context from '../context';

const Conversations = () => {
  const Stack = createNativeStackNavigator();

  const { cometChat } = useContext(Context);

  if (!cometChat) {
    return;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"UserListWithMessages"}>
        <Stack.Screen name="UserListWithMessages" component={CometChatUserListWithMessages} />
        <Stack.Screen name="CometChatMessages" component={CometChatMessages} />
    </Stack.Navigator>
  );
};

export default Conversations;