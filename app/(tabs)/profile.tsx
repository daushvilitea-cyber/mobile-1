import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {router} from "expo-router"
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

export default function Profile() {
  const [image, setImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadImage();
    fetchUser();
  }, []);

  const loadImage = async () => {
    const savedImage = await AsyncStorage.getItem("profileImage");

    if (savedImage) {
      setImage(savedImage);
    }
  };
  const fetchUser = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/users/1");
      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setImage(uri);

      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  const removePhoto = async () => {
    setImage(null);

    await AsyncStorage.removeItem("profileImage");
  };
  const logout =() => {
    router.replace("/(auth)")
  }

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>👤</Text>
        </View>
      )}

      <Text style={styles.name}>
        {user?.name?.firstname} {user?.name?.lastname}
      </Text>

      <Text style={styles.info}>{user?.email}</Text>
      <Text style={styles.link} onPress={pickImage}>
        Change photo
      </Text>

      <Text style={styles.link} onPress={removePhoto}>
        Remove photo
      </Text>

      <Text style={styles.logout} onPress={logout}>
        Logout
      </Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  placeholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 60,
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 25,
    color: "#111827",
  },

  info: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 40,
  },

  changePhoto: {
    fontSize: 17,
    color: "#3B82F6",
    textDecorationLine: "underline",
    marginBottom: 16,
  },

  removePhoto: {
    fontSize: 17,
    color: "#EF4444",
    textDecorationLine: "underline",
    marginBottom: 30,
  },

  logout: {
    fontSize: 18,
    color: "#EF4444",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  link: {
    fontSize: 17,
    color: "#3B82F6",
    textDecorationLine: "underline",
    marginBottom: 15,
  },
});
