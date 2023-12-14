import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

export default function Header() {
    const [cred, setCred] = useState('')
    const [state, setState] = useState(true)

    async function getDeviceItemStorage() {
        const storageInfo = await AsyncStorage.getItem('@deviceStorage')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')

        if (storageInfo == null) {
            setCred('0')
        } else {
            setCred(hasDeviceStorage)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setState(!state)
        }, 5000)

        getDeviceItemStorage()
    }, [state])

    return (
        <View style={styles.header}>
            <Image style={styles.logo} source={require('../../assets/logo_header.png')} />

            <View style={styles.contentCred}>
                <FontAwesome name="credit-card" size={17} color={ColorTheme.Theme} />
                <Text style={styles.textCred}>{cred}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 13,
        backgroundColor: ColorTheme.Theme,
    },
    logo: {
        width: 160,
        height: 45,
    },
    contentCred: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ColorTheme.Branco,
        paddingLeft: 12,
        paddingRight: 13,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: ColorTheme.Branco2,
        borderRadius: 30,
    },
    textCred: {
        marginLeft: 10,
        color: ColorTheme.Chumbo,
        fontSize: 14,
        fontWeight: 'bold',
    }
})