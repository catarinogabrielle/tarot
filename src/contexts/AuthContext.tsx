import React, { useState, createContext, ReactNode, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';

import { Api } from "../services/api";

type AuthContextDatra = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    handleLogin: (credentials: LoginProps) => Promise<void>;
    loadingAuth: boolean;
    premium: boolean
}

type UserProps = {
    message: '',
    usuario_id: string;
    nome: string;
    login: string;
    IMEI: string;
    email: string
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    password: string
}

type LoginProps = {
    value: boolean
}

export const AuthContext = createContext({} as AuthContextDatra)

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({
        message: '',
        usuario_id: '',
        nome: '',
        login: '',
        IMEI: '',
        email: ''
    })

    const [loadingAuth, setLoadingAuth] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    const [premium, setPremium] = useState(false)

    async function premiun() {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        try {
            await Api.post('/api/index.php?request=users&action=return', {
                IMEI: handleStorageIMEI
            }).then(response => {
                const premiumStatus = response.data.data.premium
                if (premiumStatus == 0) {
                    console.log('premium 0')
                    setPremium(false)
                    return;
                } else {
                    setPremium(true)
                    console.log('premium 1')
                }
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
        }
    }

    useEffect(() => {
        premiun()
    }, [])

    async function handleLogin({ value }: LoginProps) {
        setLoadingAuth(true)
        setIsAuthenticated(value)
        setTimeout(() => {
            setLoadingAuth(false)
        }, 1500);
    }

    const { t } = useTranslation()

    async function signIn({ email, password }: SignInProps) {
        setLoadingAuth(true)

        try {
            await Api.post('/api/index.php?request=users&action=return2', {
                email: email,
                senha: password
            }).then(response => {
                const { message } = response.data
                const { usuario_id, nome, login, IMEI, email } = response.data.data
                setUser({
                    message,
                    usuario_id,
                    nome,
                    login,
                    IMEI,
                    email
                })
                setLoadingAuth(false)
                setIsAuthenticated(true)
                const IMEI_user = response.data.data.IMEI
                handleIMEI(IMEI_user)
            }).catch((err) => {
                setLoadingAuth(false)
                Alert.alert(t('alert_title'), t('alert_login'), [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
                console.log('erro', err)
            })
        } catch (err) {
            setLoadingAuth(false)
            console.log('erro', err)
        }
    }

    const handleIMEI = async (IMEI_user) => {
        await AsyncStorage.setItem('@deviceFirst', JSON.stringify("true"))
        await AsyncStorage.removeItem("@deviceStorage")
        await AsyncStorage.removeItem("@deviceStorageDataResponse")
        await AsyncStorage.removeItem("@deviceStorageDate")
        await AsyncStorage.removeItem("@deviceStorageInfo")
        await AsyncStorage.setItem('@IMEI', JSON.stringify(IMEI_user))
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, handleLogin, loadingAuth, premium }}>
            {children}
        </AuthContext.Provider>
    )
}