import React, { useEffect, useState, useContext } from "react";
import * as Notifications from 'expo-notifications';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EvilIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'expo-dev-client';
import { AuthContext } from '../../contexts/AuthContext';

import { useTranslation } from 'react-i18next';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
})

import Header from '../../components/Header';
import { Api } from "../../services/api"

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

import {
    Container,
    Content,
    TitleIn,
    Description,
    ContentCard,
    ImgIn,
    ContentInfo,
    TitleCard,
    TextCard,
    ContainerResponse,
    ContentTextResponse,
    TextIn,
    ContentResponse,
    NameLetter,
    TextLetter,
    DescriptionLetter,
    LetterResponse,
    LetterResponse2,
    ContentLoading,
    Button,
    TextButton,
} from './styles';

import { useInterstitialAd } from 'react-native-google-mobile-ads';

const adUnitId = '/92206805/app-astrosytarot/interstitial';

export default function YourGame({ navigation }) {
    const [response, setResponse] = useState(false)
    const [idCard, setIdCard] = useState('')
    const [games, setGames] = useState([])
    const [loadingBig, setLoadingBig] = useState(true)
    const [dataLen, setDataLen] = useState(true)
    const { premium } = useContext(AuthContext)

    const handleCallNotifications = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
            },
            trigger: { seconds: 2 },
        })
    }

    async function getUserData() {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        if (storageIMEI !== null) {
            try {
                await Api.post('/api/index.php?request=users&action=return', {
                    IMEI: handleStorageIMEI
                }).then(response => {
                    const USER_ID = response.data
                    getGamesData(USER_ID)
                }).catch((err) => {
                    console.log('erro', err)
                    setLoadingBig(false)
                    setDataLen(false)
                })
            } catch (err) {
                console.log('erro', err)
            }
        } else {
            setLoadingBig(false)
            setDataLen(false)
        }
    }

    async function getGamesData(USER_ID) {
        const id = USER_ID.data.usuario_id

        try {
            await Api.post('/api/index.php?request=questions&action=return', {
                user_id: id
            }).then(response => {
                if (response.data.message == 'Sem dados para esse usuário.') {
                    setLoadingBig(false)
                    setDataLen(false)
                } else {
                    setGames(response.data)
                    setLoadingBig(false)
                }
            }).catch((err) => {
                console.log('erro', err)
                setLoadingBig(false)
            })
        } catch (err) {
            console.log('erro', err)
            setLoadingBig(false)
        }
    }

    const [effect, setEffect] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setEffect(!effect)
        }, 5000)

        getUserData()
    }, [effect])

    async function deviceItemStorage() {
        const storageInfo = await AsyncStorage.getItem('@deviceStorage')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')
        const value = 1

        if (storageInfo == null) {
            await AsyncStorage.setItem('@deviceStorage', JSON.stringify(value))
        } else {
            await AsyncStorage.setItem('@deviceStorage', JSON.stringify(value + hasDeviceStorage))
        }
    }

    const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    })

    useEffect(() => {
        load()
    }, [load])

    useEffect(() => {
        if (isClosed) {
            deviceItemStorage()
            setResponse(false)
            navigation.navigate('YourGame')
        }
    }, [isClosed, navigation])

    const { t } = useTranslation()

    function handleGameLatters() {
        return (
            <ContainerResponse>
                {games?.map(item => {
                    if (item?.pergunta_id === idCard)
                        return (
                            <ScrollView key={item.pergunta_id} style={styles.scroll}>
                                <ContentResponse>
                                    <TouchableOpacity onPress={() => setResponse(false)} style={{ display: 'flex', width: '97%', alignItems: 'flex-end' }}>
                                        <EvilIcons name="close" size={24} color={ColorTheme.Theme} />
                                    </TouchableOpacity>

                                    {item.pergunta !== 'conselhododia' && (
                                        <NameLetter style={{ fontWeight: 'bold', color: ColorTheme.Theme, textDecorationLine: 'underline' }}>{item.pergunta}</NameLetter>
                                    )}

                                    {item?.cartas?.map(i => i?.nome).length == '1' ? (
                                        <>
                                            <NameLetter style={{ fontWeight: 'bold' }}>{item?.cartas?.map(i => i?.nome)}</NameLetter>
                                            <NameLetter>{item?.cartas?.map(i => i.tipo)}</NameLetter>
                                            <DescriptionLetter>{item?.cartas?.map(i => i?.descricao)}</DescriptionLetter>
                                        </>
                                    ) : (
                                        <>
                                            <NameLetter style={{ fontWeight: 'bold' }}>{item?.cartas?.map(i => i.nome)[0]}</NameLetter>
                                            <NameLetter>{item?.cartas?.map(i => i.tipo)[0]}</NameLetter>
                                            <DescriptionLetter style={{ fontSize: 15 }}>{item?.cartas?.map(i => i?.descricao)[0]}</DescriptionLetter>

                                            <NameLetter style={{ fontWeight: 'bold', marginTop: 20 }}>{item?.cartas?.map(i => i.nome)[1]}</NameLetter>
                                            <NameLetter>{item?.cartas?.map(i => i.tipo)[1]}</NameLetter>
                                            <DescriptionLetter style={{ fontSize: 15 }}>{item?.cartas?.map(i => i?.descricao)[1]}</DescriptionLetter>
                                        </>
                                    )}
                                    <ContentTextResponse>
                                        <TextIn>{t('remember')}</TextIn>
                                    </ContentTextResponse>

                                    {item?.cartas?.map(i => i?.imagem_url).length == '1' ? (
                                        <View style={styles.flex}>
                                            <LetterResponse source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${item?.cartas?.map(i => i?.imagem_url)}`) }} />
                                        </View>
                                    ) : (
                                        <View style={styles.flex2}>
                                            <LetterResponse2 source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${item?.cartas?.map(i => i?.imagem_url)[0]}`) }} />
                                            <LetterResponse2 source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${item?.cartas?.map(i => i?.imagem_url)[1]}`) }} />
                                        </View >
                                    )}

                                    <TextLetter>{item?.resposta}</TextLetter>

                                    {premium != true && (
                                        <>
                                            {isClosed == false && (
                                                <Button onPress={() => {
                                                    if (isLoaded) {
                                                        show()
                                                    } else {
                                                        setResponse(false)
                                                        navigation.navigate('YourGame')
                                                    }
                                                }}>
                                                    <TextButton>{t('one_credit')}</TextButton>
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </ContentResponse>
                            </ScrollView >
                        )
                })}
            </ContainerResponse>
        )
    }

    function toJSONLocal(date) {
        var local = new Date(date)
        return local.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3')
    }

    return (
        <Container>
            {response == false ? (
                <>
                    <Header />

                    <ScrollView style={styles.scroll}>
                        <Content>
                            {games.length !== 0 ? (
                                <>
                                    <TitleIn>{t('title_your_games')}</TitleIn>

                                    {games?.map(item => (
                                        <ContentCard key={item?.pergunta_id} onPress={() => {
                                            setIdCard(item?.pergunta_id)
                                            setResponse(true)
                                        }}>
                                            <ImgIn source={require('../../assets/carta.png')} />
                                            <ContentInfo>
                                                {item?.cartas?.map(i => i?.imagem_url).length == '1' ? (
                                                    <>
                                                        {item.pergunta == 'conselhododia' ? (
                                                            <TitleCard>{t('label_title_day')}</TitleCard>
                                                        ) : (
                                                            <TitleCard>{t('label_title_specific')}</TitleCard>
                                                        )}
                                                    </>
                                                ) : (
                                                    <TitleCard>Tarot de Casal</TitleCard>
                                                )}

                                                <TextCard>{t('data')} <Text style={styles.TextStrong}>{toJSONLocal(item?.data_pergunta)}</Text></TextCard>
                                                <TextCard>{t('letter')}: {item?.cartas?.map(i => i?.nome)[0]} ; {item?.cartas?.map(i => i?.nome)[1]}</TextCard>
                                            </ContentInfo>
                                        </ContentCard>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <TitleIn>{t('text_games_old')}</TitleIn>

                                    {dataLen == false && (
                                        <Description>{t('error')}</Description>
                                    )}
                                </>
                            )}
                        </Content>
                    </ScrollView>
                </>
            ) : (
                <>
                    {handleGameLatters()}
                </>
            )}

            {loadingBig && (
                <ContentLoading>
                    <ActivityIndicator style={{ marginTop: '60%', transform: [{ scaleX: 2 }, { scaleY: 2 }] }} size="large" color={ColorTheme.Theme} />
                </ContentLoading>
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: ColorTheme.Branco,
    },
    TextStrong: {
        fontWeight: 'bold',
    },
    flex: {
        display: "flex",
        alignItems: 'center',
        width: '100%',
        marginTop: 25,
        marginBottom: 25,
    },
    flex2: {
        display: "flex",
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        marginTop: 25,
        justifyContent: 'center',
        marginBottom: 25,
    },
})