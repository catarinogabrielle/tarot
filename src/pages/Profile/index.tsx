import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Modal, View, Text, Pressable, ScrollView, Alert } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'expo-dev-client';
import { EvilIcons } from "@expo/vector-icons";

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
    Alert1,
    ContentLoading,
} from './styles';

export default function Profile({ navigation }) {
    const { handleLogin, premium, handlePremiunState } = useContext(AuthContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingBig, setLoadingBig] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisiblePremium, setModalVisiblePremium] = useState(false)
    const [alert, setAlert] = useState(false)
    const [userId, setUserId] = useState('')

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
                setUserId(response.data.data.usuario_id)
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

    async function getUpgradePremium() {

        try {
            await Api.post('/api/index.php?request=users&action=downgrade-premium', {
                user_id: userId
            }).then(response => {
                Alert.alert('Success', 'Your plan has been canceled.');
                tooglePremium()
                setModalVisiblePremium(!modalVisiblePremium)
                navigation.navigate('NewGame')
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
        }
    }

    async function tooglePremium() {
        const value = true
        await handlePremiunState({ value })
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
                                <Alert1>{t('alert')}*</Alert1>
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

                            {premium == true && (
                                <Text onPress={() => setModalVisiblePremium(true)} style={{ textAlign: 'center', marginTop: 20, color: ColorTheme.Theme, fontSize: 15, textDecorationLine: "underline" }}>{t('not_premium')}</Text>
                            )}
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

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisiblePremium}
                onRequestClose={() => setModalVisiblePremium(!modalVisiblePremium)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView2}>
                        <EvilIcons onPress={() => setModalVisiblePremium(!modalVisiblePremium)} style={{ position: 'absolute', right: 10, top: 10 }} name="close" size={24} color={ColorTheme.Vermelho} />
                        <Text style={styles.modalText}>{t('label_not_premium')}</Text>
                        <Pressable
                            style={styles.buttonPremium}
                            onPress={getUpgradePremium}>
                            <Text style={styles.textStyle}>{t('cancel')}</Text>
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
    modalView2: {
        margin: 20,
        backgroundColor: ColorTheme.Branco,
        borderRadius: 4,
        paddingTop: 43,
        paddingBottom: 23,
        paddingLeft: 40,
        paddingRight: 40,
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
    buttonPremium: {
        borderRadius: 4,
        padding: 10,
        elevation: 2,
        backgroundColor: ColorTheme.Theme,
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