import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import DeviceInfo from 'react-native-device-info';
import { AuthContext } from '../../contexts/AuthContext';
import 'expo-dev-client';

import { useTranslation } from 'react-i18next';

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

import { Api } from "../../services/api"

import {
    Container,
    Content,
    Title,
    ContentInput,
    Alert,
    Input,
    Button,
    TextButton,
    Name,
    Question,
    ContentText,
    ContentTextResponse,
    Text,
    ContentImage,
    Img,
    ContentLoading,
    ContainerResponse,
    TitleInitial,
    TitleLabel,
    ContentLaters,
    Letter,
    DescriptionLetter,
    ContentResponse,
    NameLetter,
    LetterResponse,
    TextLetter,
} from './styles';

import { useInterstitialAd, GAMBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const adUnitId = '/92206805/app-astrosytarot/interstitial';
const adUnitIdBanner = '/92206805/app-astrosytarot/b1';

export default function SpecificGame({ navigation }) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [saveName, setSaveName] = useState(false)
    const [cards, setCards] = useState([])
    const [startGame, setStartGame] = useState(false)
    const [idCard, setIdCard] = useState('')
    const [alert, setAlert] = useState(false)
    const [question, setQuestion] = useState('')
    const [questionResult, setQuestionResult] = useState([])
    const [saveQuestion, setSaveQuestion] = useState(false)
    const { premium } = useContext(AuthContext)

    async function diveceItemStorage() {
        const storageInfo = await AsyncStorage.getItem('@deviceStorage')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')

        await AsyncStorage.setItem('@deviceStorage', JSON.stringify(hasDeviceStorage - 5))
    }

    const { t, i18n } = useTranslation()

    async function handleCards() {
        try {
            await Api.get(`/api/index.php?request=cards&lang=${i18n.language}`).then(response => {
                setCards(response.data)
                setStartGame(true)
                setLoading(false)
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
            setLoading(false)
        }
        setLoading(false)
    }

    let deviceId = DeviceInfo.getDeviceId()

    async function getUserData(item) {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        try {
            await Api.post('/api/index.php?request=users&action=return', {
                IMEI: handleStorageIMEI
            }).then(response => {
                const USER_ID = response.data
                handleQuestion(USER_ID, item)
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
        }
    }

    async function handleQuestion(USER_ID, item) {
        const id = USER_ID.data.usuario_id

        try {
            await Api.post(`/api/index.php?request=questions&lang=${i18n.language}`, {
                question_text: question,
                user_id: id,
                card_ids: [item]
            }).then(response => {
                setQuestionResult(response.data)
                diveceItemStorage()
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('error', err)
        }
    }

    async function handleUser() {
        const date = new Date()
        await AsyncStorage.setItem('@IMEI', JSON.stringify(deviceId + date))

        try {
            await Api.post('/api/index.php?request=users', {
                nome: name,
                email: '',
                login: null,
                IMEI: deviceId + date,
                senha: ''
            }).then(response => {
                console.log(response.data)
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('error', err)
        }
    }

    function handleSaveName() {
        if (name == '') {
            setAlert(true)
            setSaveName(false)
        } else {
            deviceItemData()
            setSaveName(true)
            setAlert(false)
            handleUser()
        }
    }

    async function deviceItemData() {
        setLoading(true)
        const storageInfo = await AsyncStorage.getItem('@deviceStorageInfo')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')

        if (storageInfo == null) {
            if (name !== '') {
                await AsyncStorage.setItem('@deviceStorageInfo', JSON.stringify(name))
            }
            setLoading(false)
        } else {
            setName(hasDeviceStorage)
            setSaveName(true)
            setAlert(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        deviceItemData()
    }, [])

    function handleSaveQuestion() {
        if (question == '') {
            setAlert(true)
            setSaveQuestion(false)
        } else {
            setSaveQuestion(true)
            setAlert(false)
        }
    }

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
            navigation.navigate('NewGame')
        }
    }, [isClosed, navigation])

    function handleGameLatters() {
        return (
            <ContainerResponse>
                {idCard == '' ? (
                    <>
                        <TitleInitial>{t('choice')}</TitleInitial>
                        <TitleLabel>{t('label_choice')}</TitleLabel>

                        <ScrollView style={styles.scroll}>
                            <ContentLaters>
                                {cards.map(item => (
                                    <TouchableOpacity onPress={() => {
                                        setIdCard(item.carta_id)
                                        getUserData(item.carta_id)
                                    }} key={item.carta_id}>
                                        <Letter source={require('../../assets/carta.png')} />
                                    </TouchableOpacity>
                                ))}
                            </ContentLaters>
                        </ScrollView >
                    </>
                ) : (
                    <>
                        {questionResult.length == 0 ? (
                            <ContentLoading>
                                <ScrollView style={styles.scroll}>
                                    <View style={{ width: '100%', alignItems: 'center', marginTop: 30 }}>
                                        <LottieView
                                            autoPlay
                                            loop
                                            style={{
                                                width: 200,
                                                height: 130,
                                            }}
                                            source={require('../../assets/animation.json')}
                                        />
                                    </View>

                                    <DescriptionLetter style={{
                                        textAlign: 'center'
                                    }}>"{t('text_loading')}"</DescriptionLetter>

                                    <DescriptionLetter style={{
                                        textAlign: 'center'
                                    }}>{t('label_loading')}</DescriptionLetter>

                                    <DescriptionLetter style={{
                                        textAlign: 'center',
                                        marginTop: 20
                                    }}>{t('time')}</DescriptionLetter>

                                    {premium != true && (
                                        <View style={styles.flexBanner}>
                                            <GAMBannerAd
                                                unitId={adUnitIdBanner}
                                                sizes={[BannerAdSize.MEDIUM_RECTANGLE]}
                                                requestOptions={{
                                                    requestNonPersonalizedAdsOnly: true,
                                                }}
                                            />
                                        </View>
                                    )}
                                </ScrollView>
                            </ContentLoading>
                        ) : (
                            <>
                                {cards.map(item => {
                                    if (item.carta_id === idCard)
                                        return (
                                            <ScrollView key={item.carta_id} style={styles.scroll}>
                                                <ContentResponse>
                                                    <TouchableOpacity onPress={() => navigation.navigate('NewGame')} style={{ display: 'flex', width: '97%', alignItems: 'flex-end' }}>
                                                        <EvilIcons name="close" size={24} color={ColorTheme.Theme} />
                                                    </TouchableOpacity>

                                                    <NameLetter style={{ fontWeight: 'bold' }}>{item.nome}</NameLetter>
                                                    <NameLetter>{item.tipo}</NameLetter>
                                                    <DescriptionLetter>{item.descricao}</DescriptionLetter>

                                                    <ContentTextResponse>
                                                        <Text>{t('remember')}</Text>
                                                    </ContentTextResponse>

                                                    <View style={styles.flex}>
                                                        <LetterResponse source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${item.imagem_url}`) }} />
                                                    </View>

                                                    <TextLetter>{questionResult.gpt_response}</TextLetter>

                                                    {premium != true && (
                                                        <Button onPress={() => {
                                                            if (isLoaded) {
                                                                show()
                                                            } else {
                                                                navigation.navigate('NewGame')
                                                            }
                                                        }}>
                                                            <TextButton>{t('one_credit')}</TextButton>
                                                        </Button>
                                                    )}
                                                </ContentResponse>
                                            </ScrollView >
                                        )
                                })}
                            </>
                        )}
                    </>
                )}
            </ContainerResponse>
        )
    }

    return (
        <Container>
            {startGame == false ? (
                <ScrollView style={styles.scroll}>
                    <Content>
                        {saveName == false ? (
                            <>
                                <Title>1 - {t('your_name')}</Title>
                                <ContentInput>
                                    {alert && (
                                        <Alert>{t('fields')}*</Alert>
                                    )}
                                    <Input
                                        value={name}
                                        onChangeText={(text: React.SetStateAction<string>) => setName(text)}
                                        placeholderTextColor={ColorTheme.Cinza_escuro}
                                        placeholder={t('name')}
                                    />

                                    <Button onPress={handleSaveName}>
                                        <TextButton>{t('save')}</TextButton>
                                    </Button>
                                </ContentInput>
                            </>
                        ) : (
                            <>
                                <Name>{name}</Name>

                                {saveQuestion == false ? (
                                    <>
                                        <Title>2 - {t('specific_question')}</Title>

                                        <ContentInput>
                                            {alert && (
                                                <Alert>{t('alert_write')}*</Alert>
                                            )}
                                            <Input
                                                value={question}
                                                onChangeText={(text: React.SetStateAction<string>) => setQuestion(text)}
                                                placeholderTextColor={ColorTheme.Cinza_escuro}
                                                placeholder={t('type_your_question')}
                                            />

                                            <Button onPress={handleSaveQuestion}>
                                                <TextButton>{t('btn_question')}</TextButton>
                                            </Button>
                                        </ContentInput>
                                    </>
                                ) : (
                                    <>
                                        <Title>{t('label_question')}</Title>
                                        <Question>{question}</Question>

                                        <Title>3 - {t('third_question')}</Title>

                                        <ContentText>
                                            <Text>{t('label_third_question')}</Text>
                                        </ContentText>

                                        <Button onPress={() => {
                                            setLoading(true)
                                            handleCards()
                                        }}>
                                            <TextButton>{t('btn_shuffle')}</TextButton>
                                        </Button>

                                        <ContentImage>
                                            <Img source={require('../../assets/cartas.png')} />
                                        </ContentImage>
                                    </>
                                )}
                            </>
                        )}
                    </Content>
                </ScrollView>

            ) : (
                <>
                    {handleGameLatters()}
                </>
            )}

            {loading && (
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
        width: '100%',
        paddingHorizontal: 10,
    },
    flex: {
        display: "flex",
        alignItems: 'center',
        width: '100%',
        marginTop: 25,
        marginBottom: 25,
    },
    flexBanner: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 25,
    }
})