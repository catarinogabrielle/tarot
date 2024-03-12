import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, Pressable, Modal } from 'react-native';
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../contexts/AuthContext';

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

export default function Header() {
    const [cred, setCred] = useState('')
    const [state, setState] = useState(true)
    const [select, setSelect] = useState(false)
    const { premium } = useContext(AuthContext)

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

    const { t, i18n } = useTranslation()

    const changeLanguagePT = async () => {
        i18n.changeLanguage('pt_BR')
        await AsyncStorage.setItem('@Language', JSON.stringify("pt_BR"))
        setSelect(!select)
    }

    const changeLanguageES = async () => {
        i18n.changeLanguage('es_ES')
        await AsyncStorage.setItem('@Language', JSON.stringify("es_ES"))
        setSelect(!select)
    }

    const changeLanguageEN = async () => {
        i18n.changeLanguage('en_US')
        await AsyncStorage.setItem('@Language', JSON.stringify("en_US"))
        setSelect(!select)
    }

    return (
        <>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../../assets/logo_header.png')} />

                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {premium != true && (
                        <View style={styles.contentCred}>
                            <FontAwesome name="credit-card" size={17} color={ColorTheme.Theme} />
                            <Text style={styles.textCred}>{cred}</Text>
                        </View>
                    )}

                    <TouchableOpacity onPress={() => setSelect(!select)} style={styles.contentLang}>
                        {i18n.language == 'es_ES' && (
                            <Image style={styles.flags} source={require('../../assets/espanha.png')} />
                        )}

                        {i18n.language == 'pt_BR' && (
                            <Image style={styles.flags} source={require('../../assets/brasil.png')} />
                        )}

                        {i18n.language == 'en_US' && (
                            <Image style={styles.flags} source={require('../../assets/estados-unidos.png')} />
                        )}
                        <AntDesign name="down" size={11} color={ColorTheme.Preto} />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="none"
                transparent={true}
                visible={select}
                onRequestClose={() => setSelect(!select)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{t('select')}</Text>

                        <Pressable
                            style={i18n.language == 'en_US' ? styles.buttonSelect : styles.button}
                            onPress={changeLanguageEN}>
                            <Text style={styles.text}>{t('en')}</Text>
                            <Image style={styles.flags} source={require('../../assets/estados-unidos.png')} />
                        </Pressable>

                        <Pressable
                            style={i18n.language == 'pt_BR' ? styles.buttonSelect : styles.button}
                            onPress={changeLanguagePT}>
                            <Text style={styles.text}>{t('pt')}</Text>
                            <Image style={styles.flags} source={require('../../assets/brasil.png')} />
                        </Pressable>

                        <Pressable
                            style={i18n.language == 'es_ES' ? styles.buttonSelect : styles.button}
                            onPress={changeLanguageES}>
                            <Text style={styles.text}>{t('es')}</Text>
                            <Image style={styles.flags} source={require('../../assets/espanha.png')} />
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
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
        marginRight: 12,
    },
    textCred: {
        marginLeft: 10,
        color: ColorTheme.Chumbo,
        fontSize: 14,
        fontWeight: 'bold',
    },
    contentLang: {
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
    flags: {
        width: 25,
        height: 20,
        marginRight: 7,
    },
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
    modalText: {
        textAlign: 'center',
        fontSize: 17,
        color: ColorTheme.Chumbo,
        lineHeight: 22,
        marginBottom: 10,
    },
    button: {
        borderRadius: 4,
        padding: 10,
        width: 200,
        elevation: 2,
        backgroundColor: ColorTheme.Branco3,
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonSelect: {
        borderRadius: 4,
        padding: 10,
        width: 200,
        elevation: 2,
        backgroundColor: ColorTheme.Verde2,
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: ColorTheme.Preto,
        fontWeight: '500',
        textAlign: 'center',
        fontSize: 15,
        marginRight: 10,
    }
})