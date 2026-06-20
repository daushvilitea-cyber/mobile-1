import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useFocusEffect(
  useCallback(() => {
    loadCart();
  }, [])
);

  const loadCart = async () => {
    const data = await AsyncStorage.getItem("cart");

    if (data) {
      setCart(JSON.parse(data));
    }
  };
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const increaseQuantity = (id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity < 10
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );

    setCart(updatedCart);

    AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const decreaseQuantity = (id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );

    setCart(updatedCart);

    AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);

    AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  if (cart.length === 0) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>

      <Text style={styles.emptyTitle}>
        Your Cart is Empty
      </Text>

      <Text style={styles.emptyText}>
        Add products from Products page
      </Text>
    </View>
  );
}

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.price}>${item.price}</Text>

              <View style={styles.quantityRow}>
                <TouchableOpacity onPress={()=>decreaseQuantity(item.id)}>
                  <Text style={styles.qtyButton}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity onPress={()=> increaseQuantity(item.id)}>
                  <Text style={styles.qtyButton}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={()=> removeItem(item.id)}>
                <Text style={styles.removeText}>
                  Remove
                </Text>

              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 100,
  },

  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    fontSize: 18,
    color: "#3B82F6",
    marginTop: 5,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyButton: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 12,
  },

  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  buyButton: {
    backgroundColor: "#3B82F6",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },

  buyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  removeText: {
    color: "red",
    marginTop: 20,
    fontWeight: 600,
  },
  total:{
    fontSize:28,
    fontWeight:"bold",
    marginTop:20,
  },
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},

emptyIcon: {
  fontSize: 80,
},

emptyTitle: {
  fontSize: 24,
  fontWeight: "700",
  marginTop: 20,
},

emptyText: {
  fontSize: 16,
  color: "gray",
  marginTop: 10,
  textAlign: "center",
},
});
