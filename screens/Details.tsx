import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
  TouchableHighlight,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
} from 'react-native'
import React, { useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import axios from 'axios'
import store from '../store/store'
import cartStore from '../store/cartStore'
import { useState } from 'react'
import { COLORS } from '../colors/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface dataobj {
  category: string
  count: number
  description: string
  id: number
  image: string
  price: number
  rating: {
    count: number
    rate: number
  }
  title: string
}

export default function Details({ navigation }) {
  const [data, setData] = useState<dataobj>({})
  const [loading, setLoading] = useState(true)

  const value = useState(new Animated.Value(0))[0]
  const insets = useSafeAreaInsets()

  const products = store((state) => state.products)
  const addProducts = store((state) => state.setProducts)

  const cart = cartStore((state) => state.cart)
  const setCart = cartStore((state) => state.setCart)

  const bounce = () => {
    Animated.spring(value, {
      toValue: 270,
      duration: 500,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
      useNativeDriver: true,
    }).start()
  }

  const trans = {
    transform: [{ translateY: value }],
  }

  const addCart = async () => {
    const found = await cart.filter((item: dataobj) => item?.id === data?.id)
    if (found.length > 0) {
      setCart(
        cart.map((item: dataobj) => {
          if (item?.id === data?.id) {
            return {
              ...data,
              count: item?.count + 1,
            }
          } else {
            return item
          }
        }),
      )
    } else {
      setCart([...cart, { ...data, count: data?.count + 1 }])
    }
  }

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${navigation.getParam('id')}`)
      .then((res) => {
        setData({ ...res?.data, count: 0 })
        setLoading(false)
      })
      .catch((err) => {
        console.log('err', err)
        Alert.alert('Error', err, [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ])
      })

    return () => {
      setData({})
      setLoading(true)
    }
  }, [])

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    // <View style={{ marginTop: insets.top, paddingTop: 30, flex: 1}}>
    //   <ScrollView contentContainerStyle={{flexGrow:1}}>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         paddingHorizontal: 20,
    //       }}
    //     >
    //       <TouchableHighlight onPress={() => navigation.pop()}>
    //         <Feather name="arrow-left" size={24} color="#000000" />
    //       </TouchableHighlight>
    //       <Feather name="heart" size={24} color="#000000" />
    //     </View>
    //     <View style={{ alignItems: 'center', marginTop: 20 }}>
    //       <Image
    //         source={{ uri: data?.image }}
    //         style={{ height: 250, width: 200 }}
    //       />
    //     </View>
    //     <View
    //       style={{
    //         marginTop: 30,
    //         backgroundColor: '#ffffff',
    //         justifyContent:'space-between',
    //         borderRadius: 25,
    //         paddingHorizontal: 30,
    //         flexGrow: 1
    //       }}
    //     >
    //       <Text>HEllo</Text>
    //       <Text>people</Text>
    //     </View>
    //   </ScrollView>
    // </View>


    <View style={{ marginTop: insets.top, paddingTop: 30, flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
        >
          <TouchableHighlight onPress={() => navigation.pop()}>
            <Feather name="arrow-left" size={24} color="#000000" />
          </TouchableHighlight>
          <Feather name="heart" size={24} color="#000000" />
        </View>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Image
            source={{ uri: data?.image }}
            style={{ height: 250, width: 200 }}
          />
        </View>
        <View
          style={{
            marginTop: 30,
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderRadius: 25,
            paddingHorizontal: 30,
            flex: 1
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 15 }}>
              {data?.title}
            </Text>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 15 }}
            >
              Colors
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
            >
              <View style={styles.border}>
                <View
                  style={{
                    backgroundColor: COLORS.lightskyblue,
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    marginRight: 5,
                  }}
                />
                <Text style={styles.textBorder}>Sky Blue</Text>
              </View>
              <View style={styles.border}>
                <View
                  style={{
                    backgroundColor: '#daa520',
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    marginRight: 5,
                  }}
                />
                <Text style={styles.textBorder}>Rose Gold</Text>
              </View>
              <View style={styles.border}>
                <View
                  style={{
                    backgroundColor: '#008000',
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    marginRight: 5,
                  }}
                />
                <Text style={styles.textBorder}>Green</Text>
              </View>
            </View>
            <Text style={{ color: COLORS.gray, marginTop: 20, fontSize: 15 }}>
              {data?.description}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color: COLORS.royalblue,
                  fontWeight: 'bold',
                  fontSize: 17,
                }}
              >
                Full description{' '}
              </Text>
              <Feather name="arrow-right" size={24} color={COLORS.royalblue} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}
            >
              <Text style={{ fontSize: 18 }}>Total</Text>
              <Text style={{ color: COLORS.royalblue, fontSize: 18 }}>
                ${data?.price}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: COLORS.royalblue,
              borderColor: COLORS.royalblue,
              borderWidth: 1,
              marginVertical: 20,
            }}
            onPress={addCart}
          >
            <Animated.View style={[trans]} onPress={bounce}>
              <Text
                style={{
                  color: COLORS.white,
                  paddingVertical: 15,
                  fontSize: 18,
                }}
              >
                Add to basket
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  textBorder: {
    fontWeight: 'bold',
  },
  border: {
    borderColor: COLORS.black,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
