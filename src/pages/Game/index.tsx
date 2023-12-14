import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from 'lottie-react-native';
import { EvilIcons } from "@expo/vector-icons";
import DeviceInfo from 'react-native-device-info';
import 'expo-dev-client';

import { useInterstitialAd, GAMBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const adUnitId = '/92206805/app-astrosytarot/interstitial';
const adUnitIdBanner = '/92206805/app-astrosytarot/b1';

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

import { Api } from "../../services/api";

import {
    Container,
    Content,
    ContainerResponse,
    Title,
    ContentInput,
    Alert,
    Input,
    Button,
    TextButton,
    ContentImage,
    Img,
    Name,
    ContentText,
    ContentTextResponse,
    Text,
    ContentLoading,
    TitleInitial,
    TitleLabel,
    ContentLaters,
    Letter,
    ContentResponse,
    NameLetter,
    TextLetter,
    DescriptionLetter,
    LetterResponse,
} from './styles';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export default function Game({ navigation }) {
    const [name, setName] = useState('')
    const [saveName, setSaveName] = useState(false)
    const [idCard, setIdCard] = useState('')
    const [alert, setAlert] = useState(false)
    const [startGame, setStartGame] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cards, setCards] = useState([])
    const [question, setQuestion] = useState([])
    const [nome, setNome] = useState('')
    const [tipo, setTipo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [imagem_url, setImagem_url] = useState('')
    const [gpt_response, setGpt_response] = useState('')

    const handleDataResponse = (item) => {
        setNome(item.nome)
        setTipo(item.tipo)
        setDescricao(item.descricao)
        setImagem_url(item.imagem_url)
    }

    const data = {
        nome,
        tipo,
        descricao,
        imagem_url,
        gpt_response
    }

    async function store() {
        await AsyncStorage.setItem('@deviceStorageDataResponse', JSON.stringify(data))
    }

    useEffect(() => {
        if (gpt_response !== '') {
            store()
        }
    }, [gpt_response])

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

    async function handleCards() {
        try {
            await Api.get('/api/index.php?request=cards').then(response => {
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
            await Api.post('/api/index.php?request=questions', {
                question_text: "conselhododia",
                user_id: id,
                card_ids: [item]
            }).then(response => {
                setQuestion(response.data)
                setGpt_response(response.data.gpt_response)
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
                nome: nome,
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

    async function deviceItemStorageStart() {
        const value = 7
        await AsyncStorage.setItem('@deviceStorage', JSON.stringify(value))
        handleUser()
    }

    function handleSaveName() {
        if (name == '') {
            setAlert(true)
            setSaveName(false)
        } else {
            deviceItemData()
            setSaveName(true)
            setAlert(false)
            deviceItemStorageStart()
        }
    }

    async function deviceItemData() {
        setLoading(true)
        const storageInfo = await AsyncStorage.getItem('@deviceStorageInfo')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')

        if (storageInfo == null) {
            if (name !== '') {
                await AsyncStorage.setItem('@deviceStorageInfo', JSON.stringify(name))
                setLoading(false)
            } else {
                setLoading(false)
            }
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

    const dataFormat = async () => {
        var datas = new Date()
        var dataFormatada = ("0" + datas.getDate()).substr(-2) + "/" + ("0" + (datas.getMonth() + 1)).substr(-2) + "/" + datas.getFullYear()

        await AsyncStorage.setItem('@deviceStorageDate', JSON.stringify(dataFormatada))
    }

    function handleGameLatters() {
        return (
            <ContainerResponse>
                {idCard == '' ? (
                    <>
                        <TitleInitial>ESCOLHA UMA CARTA</TitleInitial>
                        <TitleLabel>Deslize as cartas, e selecione uma delas!</TitleLabel>

                        <ScrollView style={styles.scroll}>
                            <ContentLaters>
                                {cards.map(item => (
                                    <TouchableOpacity onPress={() => {
                                        setIdCard(item.carta_id)
                                        getUserData(item.carta_id)
                                        dataFormat()
                                        handleDataResponse(item)
                                    }} key={item.carta_id}>
                                        <Letter source={require('../../assets/carta.png')} />
                                    </TouchableOpacity>
                                ))}
                            </ContentLaters>
                        </ScrollView >
                    </>
                ) : (
                    <>
                        {question.length == 0 ? (
                            <ContentLoading>
                                <ScrollView style={styles.scroll}>
                                    <View style={{ width: '100%', alignItems: 'center', marginLeft: 20, marginTop: 30 }}>
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
                                        textAlign: 'center',
                                        marginLeft: 20
                                    }}>"Acendendo a chama da sabedoria tecnológica..."</DescriptionLetter>

                                    <DescriptionLetter style={{
                                        textAlign: 'center',
                                        marginLeft: 20
                                    }}>Consultando o oráculo</DescriptionLetter>

                                    <View style={styles.flexBanner}>
                                        <GAMBannerAd
                                            unitId={adUnitIdBanner}
                                            sizes={[BannerAdSize.MEDIUM_RECTANGLE]}
                                            requestOptions={{
                                                requestNonPersonalizedAdsOnly: true,
                                            }}
                                        />
                                    </View>
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
                                                        <Text>Lembre-se: mesmo diante das previsões do Tarot, você detém do poder de moldar o seu futuro com suas escolhas e ações.</Text>
                                                    </ContentTextResponse>

                                                    <View style={styles.flex}>
                                                        <LetterResponse source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${item.imagem_url}`) }} />
                                                    </View>

                                                    <TextLetter>{question.gpt_response}</TextLetter>

                                                    <Button onPress={() => {
                                                        if (isLoaded) {
                                                            show()
                                                        } else {
                                                            navigation.navigate('NewGame')
                                                        }
                                                    }}>
                                                        <TextButton>GANHE 1 CREDITO GRATUITO E FAÇA UMA PERGUNTA ESPECÍFICA</TextButton>
                                                    </Button>
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
                                <Title>1 - Como gostaria de ser chamado?</Title>
                                <ContentInput>
                                    {alert && (
                                        <Alert>Preencha o campo abaixo*</Alert>
                                    )}
                                    <Input
                                        value={name}
                                        onChangeText={(text: React.SetStateAction<string>) => setName(text)}
                                        placeholderTextColor={ColorTheme.Cinza_escuro}
                                        placeholder="Digite seu Nome"
                                    />

                                    <Button onPress={handleSaveName}>
                                        <TextButton>Salvar</TextButton>
                                    </Button>
                                </ContentInput>
                            </>
                        ) : (
                            <>
                                <Name>{name}</Name>

                                <Title>2 - CONCENTRE-SE PROFUNDAMENTE NO SEU DIA.</Title>

                                <ContentText>
                                    <Text>Concentre-se e peça mentalmente uma orientação para o seu dia.
                                        Você só pode tirar uma carta, por isso, quando se sentir preparado embaralhe as cartas.</Text>
                                </ContentText>

                                <Button onPress={() => {
                                    setLoading(true)
                                    handleCards()
                                }}>
                                    <TextButton>EMBARALHAR CARTAS</TextButton>
                                </Button>

                                <ContentImage>
                                    <Img source={require('../../assets/cartas_1.png')} />
                                </ContentImage>
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
        marginLeft: 20,
        position: 'relative',
    }
})