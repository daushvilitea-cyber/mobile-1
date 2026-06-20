import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";


import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Minimum 3 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleRegister = async (data: FormData) => {
    try{
      const response = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log(error);
    }
    alert("Registration successful! Please login.");
    router.push("/");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

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

      <Text style={styles.error}>
        {errors.username?.message}
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.error}>
        {errors.email?.message}
      </Text>

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

      <Text style={styles.error}>
        {errors.password?.message}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(handleRegister)}
      >
        <Text style={styles.buttonText}>
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/")}
      >
        <Text style={styles.link}>
          Already have an account? Login
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
    textAlign: "center",
    marginBottom: 40,
  },

  input: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  error: {
    color: "red",
    marginBottom: 12,
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
});