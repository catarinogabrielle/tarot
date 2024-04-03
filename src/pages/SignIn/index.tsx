import React, { useState, useContext } from "react";
import { Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from '../../../constants/Colors';
const ColorTheme = Colors['Theme'];

import { useTranslation } from 'react-i18next';

import {
    Container,
    ContentBack,
    TextBack,
    Logo,
    ContentInput,
    Input,
    Button,
    TextButton,
    BtnSign,
    Sign,
    Text,
} from './styles';

import { AuthContext } from '../../contexts/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
    const { signIn, handleLogin, handlePremiunState } = useContext(AuthContext)

    const [email, setEmai] = useState('')
    const [password, setPassword] = useState('')

    const { t } = useTranslation()

    async function login() {
        if (email === '' || password === '') {
            Alert.alert(t('alert_title'), t('alert_signIn'), [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return;
        }
        await signIn({ email, password })
    }

    async function toogleNewGame() {
        const value = true
        await handleLogin({ value })
        await AsyncStorage.setItem('@deviceFirst', JSON.stringify("true"))
        await AsyncStorage.removeItem("@deviceStorage")
        await AsyncStorage.removeItem("@deviceStorageDataResponse")
        await AsyncStorage.removeItem("@deviceStorageDate")
        await AsyncStorage.removeItem("@deviceStorageInfo")
        await AsyncStorage.removeItem("@IMEI")
        await handlePremiunState({ value })
    }

    async function toogleBack() {
        const value = true
        await handleLogin({ value })
    }

    return (
        <ScrollView>
            <Container>
                <ContentBack>
                    <Ionicons onPress={() => toogleBack()} name="arrow-back-sharp" size={25} color={ColorTheme.Theme} />
                    <TextBack onPress={() => toogleBack()}>{t('btn_back')}</TextBack>
                </ContentBack>
                <Logo source={require('../../assets/logo.png')} />

                <ContentInput>
                    <Input
                        value={email}
                        onChangeText={(text: React.SetStateAction<string>) => setEmai(text)}
                        placeholderTextColor={ColorTheme.Cinza_escuro}
                        placeholder={t('email')}
                    />

                    <Input
                        value={password}
                        onChangeText={(text: React.SetStateAction<string>) => setPassword(text)}
                        placeholderTextColor={ColorTheme.Cinza_escuro}
                        placeholder={t('password_signin')}
                    />

                    <Button onPress={login}>
                        <TextButton>{t('access')}</TextButton>
                    </Button>

                    <BtnSign onPress={() => toogleNewGame()}>
                        <Sign>{t('label_signIn_1')} <Text>{t('label_signIn_2')}</Text></Sign>
                    </BtnSign>
                </ContentInput>
            </Container>
        </ScrollView>
    )
}