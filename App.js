import { useState, useEffect } from "react";
import { View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import UserContext from "./contexts/UserContext";
import Users from "./screens/Users";
import CreateUser from "./screens/CreateUser";
import Tools from "./screens/Tools";
import Login from "./screens/Login";

const Tab = createBottomTabNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const user = useState({ authorized: false, userData: {} });
  // const tasks = useState({ list: [], additionalOffset: 0 });

  const fetchUser = async () => {
    if (user[0].userData?.id) return;
    const token = await AsyncStorage.getItem("@token");
    if (!token) return setLoading(false);

    setLoading(true);
    api
      .get("/user")
      .then(async (response) => {
        if (!response.data.error)
          user[1]({ authorized: true, userData: response.data.data });
        else await AsyncStorage.removeItem("@token");
      })
      .catch(() => setServerError(true))
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    user[1]({ authorized: false, userData: null });
    await AsyncStorage.removeItem("@token");
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user[0]]);

  if (serverError) {
    throw new Error("Server error");
  }

  if (loading) return <View>Loading</View>;

  return (
    <UserContext.Provider value={user}>
      <NavigationContainer>
        <Tab.Navigator>
          {user[0].authorized ? (
            <>
              <Tab.Screen name="Users" component={Users} />
              <Tab.Screen name="Create user" component={CreateUser} />
              <Tab.Screen name="Tools" component={Tools} />
            </>
          ) : (
            <Tab.Screen name="Login" component={Login} />
          )}
        </Tab.Navigator>
      </NavigationContainer>
      {user[0].authorized && <Button onPress={logout} title="Logout" />}
    </UserContext.Provider>
  );
}

export default App;
