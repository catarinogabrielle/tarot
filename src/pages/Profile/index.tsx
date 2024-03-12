import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Modal, View, Text, Pressable, ScrollView } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'expo-dev-client';

import { useTranslation } from 'react-i18next';

import { Api } from "../../services/api"
import Header from '../../components/Header';

import { AuthContext } from '../../contexts/AuthContext';

import Colors from '../../../constants/Colors';
const ColorTheme = Colors['Theme'];

import {
    Container,
    Content,
    Title,
    ContentInput,
    Input,
    Button,
    TextButton,
    ButtonSign,
    TextButtonSign,
    Alert,
    ContentLoading,
} from './styles';

export default function Profile() {
    const { handleLogin } = useContext(AuthContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingBig, setLoadingBig] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState(false)

    async function handleUser() {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        setLoading(false)
        if (name == '') {
            setAlert(true)
            setLoading(true)
        } else {
            if (name !== '') {
                await AsyncStorage.setItem('@deviceStorageInfo', JSON.stringify(name))
            }
            try {
                await Api.post('/api/index.php?request=users', {
                    nome: name,
                    email: email,
                    login: user,
                    IMEI: handleStorageIMEI,
                    senha: password
                }).then(response => {
                    setMsg(response.data.message)
                    getDeviceItemData()
                    setLoading(true)
                    setModalVisible(true)
                    setAlert(false)
                }).catch((err) => {
                    console.log('erro', err)
                    setLoading(true)
                })
            } catch (err) {
                console.log('error', err)
                setLoading(true)
            }
        }
    }

    async function getDeviceItemData() {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        const storageName = await AsyncStorage.getItem('@deviceStorageInfo')
        let handleStorageName = JSON.parse(storageName || '{}')

        try {
            await Api.post('/api/index.php?request=users&action=return', {
                IMEI: handleStorageIMEI
            }).then(async response => {
                setEmail(response.data.data.email)
                setUser(response.data.data.login)
                if (response.data.data.nome !== '') {
                    setName(response.data.data.nome)
                    await AsyncStorage.setItem('@deviceStorageInfo', JSON.stringify(response.data.data.nome))
                } else {
                    setName(handleStorageName)
                }
                setLoadingBig(false)
            }).catch((err) => {
                console.log('erro', err)
                setLoadingBig(false)
            })
        } catch (err) {
            console.log('erro', err)
            setLoadingBig(false)
        }
    }

    useEffect(() => {
        getDeviceItemData()
    }, [])

    const { t } = useTranslation()

    async function toogleLogin() {
        const value = false
        await handleLogin({ value })
    }

    return (
        <>
            <Container>
                <Header />

                <Content>
                    <Title>{t('title_profile')}</Title>

                    <ScrollView>
                        <ContentInput>
                            {alert && (
                                <Alert>{t('alert')}*</Alert>
                            )}
                            <Input
                                value={name}
                                onChangeText={(text: React.SetStateAction<string>) => setName(text)}
                                placeholderTextColor={ColorTheme.Cinza_escuro}
                                placeholder={t('name')}
                            />

                            <Input
                                value={email}
                                onChangeText={(text: React.SetStateAction<string>) => setEmail(text)}
                                placeholderTextColor={ColorTheme.Cinza_escuro}
                                placeholder={t('email')}
                            />

                            <Input
                                value={user}
                                onChangeText={(text: React.SetStateAction<string>) => setUser(text)}
                                placeholderTextColor={ColorTheme.Cinza_escuro}
                                placeholder={t('user')}
                            />

                            <Input
                                value={password}
                                onChangeText={(text: React.SetStateAction<string>) => setPassword(text)}
                                placeholderTextColor={ColorTheme.Cinza_escuro}
                                placeholder={t('password')}
                            />

                            <Button onPress={handleUser}>
                                {loading ? (
                                    <TextButton>{t('btn_save')}</TextButton>
                                ) : (
                                    <ActivityIndicator size="small" color={ColorTheme.Branco} />
                                )}
                            </Button>

                            <ButtonSign onPress={() => toogleLogin()}>
                                <TextButtonSign>Login</TextButtonSign>
                            </ButtonSign>
                        </ContentInput>
                    </ScrollView>
                </Content>

                {loadingBig && (
                    <ContentLoading>
                        <ActivityIndicator style={{ marginTop: '60%', transform: [{ scaleX: 2 }, { scaleY: 2 }] }} size="large" color={ColorTheme.Theme} />
                    </ContentLoading>
                )}
            </Container>

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{msg}</Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>{t('btn_back')}</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        margin: 20,
        backgroundColor: ColorTheme.Branco,
        borderRadius: 4,
        paddingHorizontal: 23,
        paddingVertical: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 4,
        padding: 10,
        width: 100,
        elevation: 2,
        backgroundColor: ColorTheme.Verde,
        marginTop: 30,
    },
    modalText: {
        textAlign: 'center',
        fontSize: 17,
        color: ColorTheme.Chumbo,
        lineHeight: 22,
    },
    textStyle: {
        color: ColorTheme.Branco,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    }
})