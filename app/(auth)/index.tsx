import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

type FormData = {
  username: string;
  password: string;
};

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (data: FormData) => {
    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.token) {
        if (rememberMe) {
          await AsyncStorage.setItem("token", result.token);
        }
        await AsyncStorage.setItem("token", result.token);

        Alert.alert("Success", "Login successful");

        router.replace("/(tabs)");
      } 
     
      else {
        Alert.alert("Error", "Invalid username or password");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.error}>{errors.username?.message}</Text>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.error}>{errors.password?.message}</Text>

     <TouchableOpacity style={styles.rememberMe} onPress={() => setRememberMe(!rememberMe)}>
      <Text style={styles.rememberCheck}>
    {rememberMe ? "☑" : "☐"} Remember Me
  </Text>
 

     </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(handleLogin)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/register")}
      >
        <Text style={styles.link}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8F9FB",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,
    textAlign: "center",
  },

  input: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  error: {
    color: "red",
    marginBottom: 10,
  },

  button: {
    height: 55,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#3B82F6",
  },

  rememberMe: {
    marginTop: 20,
  },

  rememberCheck: {
    fontSize: 18,
    color: "#3B82F6",
  },
});