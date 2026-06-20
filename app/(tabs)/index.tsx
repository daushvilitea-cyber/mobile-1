import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet,  TouchableOpacity} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}
export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(
    ()=> {
        fetch("https://fakestoreapi.com/products")
        .then (response => response.json())
        .then (data => setProducts(data))
        .catch (error => console.error("Error fetching products:", error));
    },[]
  )

  return (
    <View style={styles.container}>
      <Text>Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push({pathname: `/details/[id]/`, params: {id: item.id.toString()}})}>
            <Image source={{ uri: item.image }} style={styles.image} contentFit="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
          
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#F5F7FA",
  paddingHorizontal: 16,
  paddingTop: 12,
},

listContent: {
  paddingBottom: 20,
},

card: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  alignItems: "center",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  elevation: 3,
},

image: {
  width: 100,
  height: 100,
  marginBottom: 12,
 

},

title: {
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
  marginBottom: 8,
},

price: {
  fontSize: 18,
  fontWeight: "700",
  color: "#3B82F6",
},})