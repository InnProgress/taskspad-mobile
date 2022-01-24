import React, { useState, useEffect } from "react";
import { View, Button, TextInput, Text } from "react-native";
import api from "../api";

const defaultFormData = { role: "WORKER" };

const roleOptions = [
  { value: "WORKER", label: "Worker" },
  { value: "ADMIN", label: "Admin" },
];

const CreateUser = ({ show, disableModal, setUsers }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(defaultFormData);
  }, [show, setFormData]);

  const createUser = () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    api
      .post("/user", {
        ...formData,
      })
      .then((response) => {
        setSaving(false);
        if (response.data.error) setError(response.data.error);
        else {
          setUsers((users) => [
            ...users,
            { id: response.data.data, ...formData },
          ]);
          disableModal();
        }
      })
      .catch(() => {
        setSaving(false);
      });
  };

  return (
    <View>
      Create user:
      <TextInput
        onTextInput={(e) =>
          setFormData((formData) => ({ ...formData, full_name: e }))
        }
        value={formData.full_name}
        placeholder="Fullname"
        required={true}
      />
      <TextInput
        onTextInput={(e) =>
          setFormData((formData) => ({ ...formData, email: e }))
        }
        value={formData.email}
        placeholder="Email"
        required={true}
      />
      <TextInput
        onTextInput={(e) =>
          setFormData((formData) => ({ ...formData, password: e }))
        }
        value={formData.password}
        placeholder="Password"
        secureTextEntry={true}
        required={true}
      />
      <TextInput
        onTextInput={(e) =>
          setFormData((formData) => ({ ...formData, phone_number: e }))
        }
        value={formData.phone_number}
        placeholder="Phone number"
        required={true}
      />
      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={roleOptions}
      />
      {Boolean(error) && <Text>Error: {error}</Text>}
      <Button title="Create" onPress={createUser} />
    </View>
  );
};

export default CreateUser;
