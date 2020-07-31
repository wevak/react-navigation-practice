import React from "react";
import { Button, View, Text, Image } from "react-native";
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TextInput } from "react-native-gesture-handler";

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require("./cryptostore-client.png")}
    />
  );
}

function HomeScreen({ navigation, route }) {
  const [post, setPost] = React.useState("");
  const [count, setCount] = React.useState(0)

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount(c => c + 1)} title="Update Count" />
      ),
    })
  })
  
  React.useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
      console.log(route.params.post);
      setPost(route.params.post);
    }
  }, [route.params?.post]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details Page"
        onPress={() => navigation.navigate("Details", { itemId: 1 })}
      />
      <Button
        title="Go to Notifications Screen"
        onPress={() => navigation.navigate("Notifications")}
      />
      <Button
        title="Create Post"
        onPress={() =>
          navigation.navigate("Post", { postTitle: "Create a Post" })
        }
      />
      <Text>Count: {count}</Text>
      <Text>Post: {post}</Text>
      <Button
        title="Nested Screen"
        onPress={() =>
          navigation.navigate("Nesting")
        }  
      />
      <Button 
        title="Navigate Modal" 
        onPress={() => navigation.navigate('MyModal')}
      />
    </View>
  );
}

function Article(){
  return <View><Button title="Article" /></View>
}
function Chat({ navigation }){
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => console.log("Chat Focused!"))

    return unsubscribe
  }, [navigation])

  return <View><Button title="Chat" /></View>
}
function Contacts({ navigation }){
  useFocusEffect(
    React.useCallback(() => {
      console.log("Contacts Focused !")

      return () => console.log("Contacts Blurred !")
    }, [])
  )

  return <View><Button title="Contacts" /></View>
}
function Albums(){
  return <View><Button title="Albums" /></View>
}
//Bottom Tab Navigation
const Tab = createBottomTabNavigator();

function NotificationsScreen({ navigation }) {
  return (
    <Tab.Navigator 
      tabBarOptions={{
        activeTintColor: 'steelblue'
      }}
    >
      <Tab.Screen name="Article" component={Article}
        options={{
          tabBarIcon: ({color, size}) => <MaterialCommunityIcons name="notebook" color={color} size={size} />
        }}
      />
      <Tab.Screen name="Chat" component={Chat}
        options={{
          tabBarIcon: ({color, size}) => <MaterialIcons name="chat-bubble" color={color} size={size} />
        }}
      />
      <Tab.Screen name="Contacts" component={Contacts}
        options={{
          tabBarIcon: ({color, size}) => <MaterialIcons name="contacts" color={color} size={size} />
        }}
      />
      <Tab.Screen name="Albums" component={Albums}
        options={{
          tabBarIcon: ({color, size}) => <MaterialIcons name="photo-album" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

function DetailsScreen({ route, navigation }) {
  const { itemId } = route.params;
  const { otherParam } = route.params;
  console.log(route);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details Screen</Text>
      <Button
        title="Go Details Again!"
        onPress={() =>
          navigation.push("Details", {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button
        title="Go Home with Params"
        onPress={() =>
          navigation.navigate("Home", {
            backProp: "Went back to Home Screen with param",
          })
        }
      />
      <Text>
        Route.Params {itemId} {otherParam}
      </Text>
    </View>
  );
}

function PostScreen({ navigation, route }) {
  const [postText, setPostText] = React.useState("");
  console.log(route);

  return (
    <>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{ height: 200, padding: 10, backgroundColor: "white" }}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        title="Done"
        onPress={() => navigation.navigate("Home", { post: postText })}
      />
      <Button
        title="Change title to Create Post"
        onPress={() => navigation.setOptions({ title: "Create Post!" })}
      />
    </>
  );
}

//Nested Stack Navigator
const NestedStack = createStackNavigator();

function Nested() {
  return (
    <NestedStack.Navigator /* screenOptions={{ headerShown: true }} */>
      <NestedStack.Screen name="screen1" component={() => <Button title="Screen 1" />}/>
      <NestedStack.Screen name="screen2" component={() => <Button title="Screen 2" />}/>
    </NestedStack.Navigator>
  )
}

//Modal Screen

function ModalScreen({ navigation }) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 30 }}> Modal Screen! </Text>
      <Button title="Dismiss!" onPress={() => navigation.goBack()} />
    </View>
  )
}

//Stack Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        /* initialRouteName="Home" */ /* screenOptions={{ title: 'Overview' }} For all routes */
        screenOptions={{
          // title: "My Home",
          headerStyle: {
            backgroundColor: "steelblue",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // headerShown: false
        }}
        mode="modal"
        headerMode="none"
      > 
        <Stack.Screen name="Home" component={HomeScreen} /* options={{ headerShown: false}} */ />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ 
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: () => (
              <Button
                onPress={() => alert('This is a button')}
                title="Info"
                color=""
              />
            )
          }}
          initialParams={{ otherParam: "initialParam" }}
        />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen
          name="Post"
          component={PostScreen}
          options={({ route }) => ({ title: route.params.postTitle })}
        />
        <Stack.Screen
          name="Nesting"
          component={Nested}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyModal"
          component={ModalScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
