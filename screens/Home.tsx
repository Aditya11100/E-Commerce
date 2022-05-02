import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ColorPropType,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import store from "../store/store";
import cartStore from "../store/cartStore";
import { COLORS } from "../colors/colors";
import { SafeAreaProvider,useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

interface dataobj {
  category: string;
  count: number;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: {
    count: number;
    rate: number;
  };
  title: string;
}

export default function Home({ navigation }) {
  const [price, setPrice] = useState(0);
  const [text, setText] = useState("Wearable");

  const products = store((state) => state.products);
  const addProducts = store((state) => state.setProducts);

  const cart = cartStore((state) => state.cart);
  const setCart = cartStore((state) => state.setCart);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    let s = 0;
    cart.map((item: dataobj) => {
      s += item?.price * item?.count;
    });
    setPrice(s);
  }, [cart]);

  const apiCall = async () => {
    await axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        addProducts(
          res?.data?.map((item: dataobj) => ({
            ...item,
            count: 0,
          }))
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);

  const onPress = (id: number) => {
    navigation.navigate("Details", { id: id });
  };

  const increment = (data: dataobj) => {
    setCart(
      cart.map((item: dataobj) => {
        if (item?.id === data?.id) {
          return {
            ...data,
            count: item?.count + 1,
          };
        } else {
          return item;
        }
      })
    );
  };

  const decrement = (data: dataobj) => {
    if (data?.count === 1) {
      setCart(cart.filter((item: dataobj) => item?.id !== data?.id));
    } else {
      setCart(
        cart.map((item: dataobj) => {
          if (item?.id === data?.id) {
            return {
              ...data,
              count: item?.count - 1,
            };
          } else {
            return item;
          }
        })
      );
    }
  };

  function HomeScreen() {
    return (
      <View>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginLeft: 55,
              marginRight: 44,
              marginTop:insets.top,
              paddingTop:30
            }}
          >
            <Feather name="menu" size={24} color="#000000" />
            <TextInput style={styles.header} placeholder="Search" />
          </View>
          <Text
            style={{
              fontSize: 32,
              marginTop: 45,
              fontWeight: "bold",
              marginLeft: 50,
              marginRight: 121,
            }}
          >
            Order online collect in store
          </Text>
          <View style={{ flexDirection: "row", marginTop: 46, marginLeft: 54 }}>
            <TouchableOpacity onPress={() => setText("Wearable")}>
              <Text
                style={
                  text === "Wearable"
                    ? styles.activeColor
                    : styles.notActiveColor
                }
              >
                Wearable
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setText("Laptops")}>
              <Text
                style={
                  text === "Laptops"
                    ? styles.activeColor
                    : styles.notActiveColor
                }
              >
                Laptops
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setText("Phones")}>
              <Text
                style={
                  text === "Phones" ? styles.activeColor : styles.notActiveColor
                }
              >
                Phones
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setText("Drones")}>
              <Text
                style={
                  text === "Drones" ? styles.activeColor : styles.notActiveColor
                }
              >
                Drones
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={true}
            style={{ marginTop: 20, paddingLeft: 50 }}
          >
            {products?.map((item: dataobj) => (
              <View
                key={item?.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 20,
                  width: 200,
                  marginHorizontal: 5,
                  paddingVertical: 10,
                  height: 240,
                  marginTop: 100,
                  marginBottom: 20,
                  marginRight: 34,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.37,
                  shadowRadius: 7.49,
                  elevation: 12,
                }}
              >
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => onPress(item?.id)}
                >
                  <Image
                    source={{ uri: item?.image }}
                    style={{
                      position: "absolute",
                      top: -60,
                      height: 140,
                      width: 140,
                      borderRadius: 100,
                      borderWidth: 2,
                    }}
                    resizeMode={"cover"}
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={{ fontSize: 20, marginTop: 110 }}
                  >
                    {item?.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.gray,
                      fontWeight: "bold",
                      marginTop: 4,
                    }}
                  >
                    $ {item?.category}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#7b68ee",
                      fontWeight: "bold",
                      marginTop: 10,
                    }}
                  >
                    $ {item?.price}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text
                style={{
                  color: COLORS.royalblue,
                  fontWeight: 'bold' ,
                  fontSize: 18,
                }}
              >
                see more
              </Text>
              <Feather name="arrow-right" size={24} color={COLORS.royalblue} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  function User() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>User</Text>
      </View>
    );
  }

  function Cart() {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: "space-between",
          marginTop:insets.top,
          paddingTop:15
        }}
      >
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=>navigation.pop()}>
            <Feather name="arrow-left" size={24} color={COLORS.black} />
          </TouchableOpacity>
        <Text style={{fontSize:20,fontWeight:'bold'}}>Basket</Text>
          <TouchableOpacity>
            <Feather name="trash" size={24} color={COLORS.orangered} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {cart?.map((item: dataobj) => (
            <View
              key={item?.id}
              style={{
                flexDirection: "row",
                padding: 5,
                backgroundColor: COLORS.white,
                marginVertical: 10,
                borderRadius: 15,
              }}
            >
              <Image
                source={{ uri: item?.image }}
                style={{ height: 150, width: 110 }}
                resizeMode={"contain"}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 18, width: 220 }}>
                  {item?.title}
                </Text>
                <Text
                  style={{
                    color: COLORS.royalblue,
                    fontSize: 20,
                    marginTop: 10,
                    fontWeight:'bold'
                  }}
                >
                  $ {item?.price}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>Quantity</Text>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      backgroundColor: COLORS.lightskyblue,
                      borderRadius:5
                    }}
                    onPress={() => decrement(item)}
                  >
                    <Feather name="minus" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, marginLeft: 10 }}>
                    {item?.count}
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      backgroundColor: COLORS.lightskyblue,
                      borderRadius:5
                    }}
                    onPress={() => increment(item)}
                  >
                    <Feather name="plus" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20 }}>Total</Text>
            <Text style={{ color: COLORS.royalblue, fontSize: 20,fontWeight:'bold' }}>
              {parseFloat(price.toString()).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              alignItems: "center",
              backgroundColor: COLORS.royalblue,
              borderColor: COLORS.royalblue,
              borderWidth: 1,
              marginVertical: 20,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                paddingVertical: 15,
                fontSize: 18,
              }}
            >
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel:false,
          tabBarStyle: {
            backgroundColor: `#ffffff`,
            opacity: 0.9,
            height: 70,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={24} color="#000000" />
            ),
          }}
        />
        <Tab.Screen
          name="heart"
          component={User}
          options={{
            headerShown: false,
            tabBarLabel: "Heart",
            tabBarIcon: ({ color, size }) => (
              <Feather name="heart" size={24} color="#000000" />
            ),
          }}
        />
        <Tab.Screen
          name="User"
          component={User}
          options={{
            headerShown: false,
            tabBarLabel: "User",
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={24} color="#000000" />
            ),
          }}
        />
        <Tab.Screen
          name="Basket"
          component={Cart}
          options={{
            tabBarStyle: { display: "none" },
            headerShown: false,
            tabBarLabel: "Basket",
            tabBarIcon: ({ color, size }) => (
              <Feather name="shopping-cart" size={24} color="#000000" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    borderColor:COLORS.gray,
    borderWidth: 1,
    width: 235,
    padding: 10,
    borderRadius: 30,
  },
  activeColor: {
    fontSize: 17,
    marginRight: 24,
    color: COLORS.royalblue,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.royalblue,
    paddingBottom:5
  },
  notActiveColor: { fontSize: 17, marginRight: 24, color: COLORS.gray },
});
