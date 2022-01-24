import React, { useState, useContext } from "react";
import { View, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken } from "../api";
import UserContext from "../contexts/UserContext";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});

  const [, setUser] = useContext(UserContext);

  const login = (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    setResponse({});

    api
      .post(
        "/login",
        { username, password },
        {
          headers: {
            token:
              "dGVzdC5hY2NvdW50QHN1cnasdfh2cZleXBhbC5jb206dG9rZW4tQUFfSHZYWDBBMVkxWDExMTEzWlYzdasdlopqklasjExY1hYOWRlLTlmNDAtMzQ5MGZkNDWY5",
          },
        }
      )
      .then(async (response) => {
        if (response.data.error) {
          setResponse({
            success: false,
            message: response.data.error,
          });
        } else {
          await AsyncStorage.setItem("@token", response.data.data.accessToken);
          setAuthToken(response.data.data.accessToken);
          setUser({
            authorized: true,
            userData: { username, password },
          });
          navigation.navigate("Users");
        }
      })
      .catch(() => setResponse({ success: false, message: "Unknown error" }))
      .finally(() => setLoading(false));
  };

  return (
    <form>
      <h1>Please sign in</h1>

      <View>
        <TextInput
          onChangeText={(e) => setUsername(e)}
          value={username}
          placeholder="Username"
          required={true}
        />
      </View>

      <View>
        <TextInput
          onChangeText={(e) => setPassword(e)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          required={true}
        />
      </View>

      {Boolean(response.message) && <View>Error: {response.message}</View>}

      <Button onPress={login} title="Sign in" />
    </form>
  );
};

export default Login;
