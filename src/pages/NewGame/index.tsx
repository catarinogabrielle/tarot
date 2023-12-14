import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Modal, View, Text, Pressable, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons } from '@expo/vector-icons';

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

import Header from '../../components/Header';

import {
    Container,
    Content,
    Title,
    Card,
    Letter1,
    Letter2,
    Label,
    ContainerResponse,
    ContentTextResponse,
    TextIn,
    ContentResponse,
    NameLetter,
    TextLetter,
    DescriptionLetter,
    LetterResponse,
    Button,
    TextButton,
} from './styles';

import { RewardedAd, RewardedAdEventType, AdEventType, RewardedAdReward, useInterstitialAd } from 'react-native-google-mobile-ads';

const adUnitIdInterstitial = '/92206805/app-astrosytarot/interstitial';
const adUnitId = '/92206805/app-astrosytarot/rewards';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
})

export default function NewGame({ navigation }) {
    const [rewardloaded, setRewardLoaded] = useState(false)
    const [time, setTime] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [games, setGames] = useState([])
    const [response, setResponse] = useState(false)

    const handleStorage = async () => {
        const storageInfo = await AsyncStorage.getItem('@deviceStorage')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')

        if (storageInfo == null || hasDeviceStorage < 5) {
            setModalVisible(true)
        } else {
            navigation.navigate('SpecificGame')
        }
    }

    async function deviceItemStorage(reward: RewardedAdReward) {
        const storageInfo = await AsyncStorage.getItem('@deviceStorage')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')
        const value = reward.amount + 1

        if (storageInfo == null) {
            await AsyncStorage.setItem('@deviceStorage', JSON.stringify(value))
        } else {
            await AsyncStorage.setItem('@deviceStorage', JSON.stringify(value + hasDeviceStorage))
        }
    }

    const loadRewarded = () => {
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setRewardLoaded(true)
            setTime(true)
        })

        const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
            deviceItemStorage(reward)
        })

        const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
            setTime(false)
            rewarded.load()
        })

        rewarded.load()

        return () => {
            unsubscribeLoaded()
            unsubscribeClosed()
            unsubscribeEarned()
        }
    }

    useEffect(() => {
        const unsubscribeRewardedEvents = loadRewarded()

        return unsubscribeRewardedEvents
    }, [])

    async function handleDataFormat() {
        var datas = new Date()
        var dataFormatada = ("0" + datas.getDate()).substr(-2) + "/" + ("0" + (datas.getMonth() + 1)).substr(-2) + "/" + datas.getFullYear()

        const storageInfo = await AsyncStorage.getItem('@deviceStorageDate')
        let hasDeviceStorageDate = JSON.parse(storageInfo || '{}')

        const storageInfoResponse = await AsyncStorage.getItem('@deviceStorageDataResponse')
        let hasDeviceStorageResponse = JSON.parse(storageInfoResponse || '{}')

        if (storageInfo == null) {
            navigation.navigate('Game')
        } else {
            if (hasDeviceStorageDate == dataFormatada) {
                setGames(hasDeviceStorageResponse)
                setResponse(true)
                return
            } else {
                navigation.navigate('Game')
            }
        }
    }

    async function deviceItemStorageCredt() {
        const storageInfo = await AsyncStorage.getItem('@deviceStorage')
        let hasDeviceStorage = JSON.parse(storageInfo || '{}')
        const value = 1

        if (storageInfo == null) {
            await AsyncStorage.setItem('@deviceStorage', JSON.stringify(value))
        } else {
            await AsyncStorage.setItem('@deviceStorage', JSON.stringify(value + hasDeviceStorage))
        }
    }

    const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitIdInterstitial, {
        requestNonPersonalizedAdsOnly: true,
    })

    useEffect(() => {
        load()
    }, [load])

    useEffect(() => {
        if (isClosed) {
            deviceItemStorageCredt()
            setResponse(false)
            navigation.navigate('NewGame')
        }
    }, [isClosed, navigation])

    const deleteCache = async () => {
        let storageFirst = await AsyncStorage.getItem("@deviceFirst")

        if (storageFirst == null) {
            try {
                await AsyncStorage.setItem('@deviceFirst', JSON.stringify("true"))
                await AsyncStorage.removeItem("@deviceStorage")
                await AsyncStorage.removeItem("@deviceStorageDataResponse")
                await AsyncStorage.removeItem("@deviceStorageDate")
                await AsyncStorage.removeItem("@IMEI")
                await AsyncStorage.removeItem("@deviceStorageInfo")
            }
            catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        deleteCache()
    })

    function handleGameLatters() {
        return (
            <ContainerResponse>
                <ScrollView key={games.pergunta_id} style={styles.scroll}>
                    <ContentResponse>
                        <TouchableOpacity onPress={() => setResponse(false)} style={{ display: 'flex', width: '97%', alignItems: 'flex-end' }}>
                            <EvilIcons name="close" size={24} color={ColorTheme.Theme} />
                        </TouchableOpacity>

                        <NameLetter style={{ fontWeight: 'bold' }}>{games.nome}</NameLetter>
                        <NameLetter>{games.nome}</NameLetter>
                        <DescriptionLetter>{games.descricao}</DescriptionLetter>

                        <ContentTextResponse>
                            <TextIn>Lembre-se: mesmo diante das previsões do Tarot, você detém do poder de moldar o seu futuro com suas escolhas e ações.</TextIn>
                        </ContentTextResponse>

                        <View style={styles.flex}>
                            <LetterResponse source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${games.imagem_url}`) }} />
                        </View>

                        <TextLetter>{games.gpt_response}</TextLetter>

                        {isClosed == false && (
                            <Button onPress={() => {
                                if (isLoaded) {
                                    show()
                                } else {
                                    setResponse(false)
                                    navigation.navigate('NewGame')
                                }
                            }}>
                                <TextButton>GANHE 1 CREDITO GRATUITO E FAÇA UMA PERGUNTA ESPECÍFICA</TextButton>
                            </Button>
                        )}
                    </ContentResponse>
                </ScrollView >
            </ContainerResponse>
        )
    }

    return (
        <>
            <Container>
                {response == false ? (
                    <>
                        <Header />

                        <ScrollView style={styles.scroll}>
                            <Content>
                                <Title>Escolha o tipo de jogo</Title>

                                <Card onPress={handleDataFormat}>
                                    <Letter1 source={require('../../assets/carta.png')} />
                                    <Label>Conselho diário gratuito</Label>
                                </Card>

                                <Card onPress={handleStorage}>
                                    <Letter2 source={require('../../assets/cartas.png')} />
                                    <Label>Uma pergunta específica</Label>
                                    <Label style={{ marginTop: 3 }}> 5 pontos por pergunta</Label>
                                </Card>

                                {(time == true && rewardloaded == true) && (
                                    <Card onPress={() => { rewarded.show() }} style={{ backgroundColor: ColorTheme.Verde2 }}>
                                        <Label>Ganhe pontos gratuitos assistindo anúncios</Label>
                                    </Card>
                                )}
                            </Content>
                        </ScrollView>
                    </>
                ) : (
                    <>
                        {handleGameLatters()}
                    </>
                )}
            </Container >

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Você não tem créditos suficientes para fazer uma pergunta específica!</Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>voltar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: ColorTheme.Branco,
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
    button: {
        borderRadius: 4,
        padding: 10,
        width: 100,
        elevation: 2,
        backgroundColor: ColorTheme.Laranja,
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
    },
    flex: {
        display: "flex",
        alignItems: 'center',
        width: '100%',
        marginTop: 25,
        marginBottom: 25,
    }
})
