import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

const loadCart = async () => {
  const data = await AsyncStorage.getItem("cart");

  if (data) {
    setCart(JSON.parse(data));
  }
};
const total = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

return (
  <View style={styles.container}>
    <FlatList
      data={cart}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>{item.title}</Text>

          <Text>
            ${item.price} x {item.quantity}
          </Text>
        </View>
      )}
    />

    <Text style={styles.total}>
      Total: ${total.toFixed(2)}
    </Text>
  </View>
);}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  card: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
  },

  total: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
  },
});