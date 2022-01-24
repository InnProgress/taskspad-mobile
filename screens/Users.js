import React, { useState, useContext, useEffect } from "react";
import { Link } from "@react-navigation/native";
import { Button, View, TextInput, Text } from "react-native";
import api from "../api";
import UserContext from "../contexts/UserContext";

const Users = () => {
  const [currentUser] = useContext(UserContext);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/users", { params: { query: searchText } })
      .then((response) => {
        if (response.data.error) setError(response.data.error);
        else {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        }
      })
      .catch(() => setError(t("app_server_error")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [users, searchText]);

  const removeUser = (user) => {
    api
      .put("/user", { is_enabled: false, user_id: user.id })
      .then((response) => {
        setUsers((objects) => objects.filter((cuser) => cuser.id !== user.id));
      });
  };

  return (
    <View>
      <View>
        <TextInput
          value={searchText}
          onChangeText={(e) => setSearchText(e)}
          placeholder="Search"
        />
        <Link to={{ screen: "Create user" }}>Create</Link>
      </View>

      <View>
        {error ? (
          <View>Error: {error}</View>
        ) : (
          <>
            {!filteredUsers.length && <Text>Empty</Text>}

            {filteredUsers.map((user) => (
              <View key={user.id}>
                <Text>{user.full_name}</Text>
                <Text>{user.username}</Text>
                {currentUser.userData.role === "SUPER" && (
                  <Button title="Delete" onPress={() => removeUser(user)} />
                )}
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
};

export default Users;
