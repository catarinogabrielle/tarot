import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Modal, View, Text, Pressable, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from 'expo-localization';
import { EvilIcons } from '@expo/vector-icons';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Api } from '../../services/api';

import { AuthContext } from '../../contexts/AuthContext';

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
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';

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
    const { premium } = useContext(AuthContext)

    const handlePurchase = async (purchase: InAppPurchases.IAPItemDetails) => {
        if (purchase.productId === '2astrosytarot24') {
            await saveSubscriptionStatus(true);
        }
    };

    const saveSubscriptionStatus = async (isSubscriber: boolean) => {
        // Salve o status da assinatura no AsyncStorage ou em uma API externa
        await AsyncStorage.setItem('isSubscriber', JSON.stringify(isSubscriber));
    };

    const checkSubscriptionStatus = async (): Promise<boolean> => {
        try {
            const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                // Verifique se há alguma assinatura ativa
                const activeSubscription = results.some(purchase => purchase.productId === '2astrosytarot24' && (!purchase.expirationDate || new Date(purchase.expirationDate) > new Date()));
                return activeSubscription;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Erro ao verificar o status da assinatura:', error);
            return false;
        }
    };

    const [isSubscriber, setIsSubscriber] = useState<boolean>(false);

    useEffect(() => {
        const initializeIAP = async () => {
            await InAppPurchases.connectAsync();

            InAppPurchases.setPurchaseListener(({ responseCode, results }) => {
                if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                    results.forEach(async (purchase) => {
                        if (!purchase.acknowledged) {
                            await handlePurchase(purchase);
                            await InAppPurchases.finishTransactionAsync(purchase, true);
                        }
                    });
                }
            });

            // Verificar o status da assinatura ao iniciar o aplicativo
            const subscriptionStatus = await checkSubscriptionStatus();
            if (subscriptionStatus == false) {
                getUserId()
            }
            setIsSubscriber(subscriptionStatus);
        };

        initializeIAP();

        return () => {
            InAppPurchases.disconnectAsync();
        };
    }, []);

    async function getUserId() {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        try {
            await Api.post('/api/index.php?request=users&action=return', {
                IMEI: handleStorageIMEI
            }).then(async response => {
                handlePremiun(response)
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
        }
    }

    async function handlePremiun(response: AxiosResponse<any, any>) {
        try {
            await Api.post('/api/index.php?request=users&action=downgrade-premium', {
                user_id: response.data.data.usuario_id
            }).then(response => {
                console.log(response.data)
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
        }
    }

    const handleStorage = async () => {
        if (premium == true) {
            navigation.navigate('SpecificGame')
        } else {
            const storageInfo = await AsyncStorage.getItem('@deviceStorage')
            let hasDeviceStorage = JSON.parse(storageInfo || '{}')

            if (storageInfo == null || hasDeviceStorage < 5) {
                setModalVisible(true)
            } else {
                navigation.navigate('SpecificGame')
            }
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
    }, [])

    const deviceLanguage = getLocales()[0].languageCode

    const { t, i18n } = useTranslation()

    const changeLanguage = async () => {
        const language = await AsyncStorage.getItem('@Language')
        let hasLanguageStorage = JSON.parse(language || '{}')

        if (language !== null) {
            i18n.changeLanguage(hasLanguageStorage)
        } else {
            if (deviceLanguage == 'pt') {
                i18n.changeLanguage("pt_BR")
                await AsyncStorage.setItem('@Language', JSON.stringify("pt_BR"))
            }
            else if (deviceLanguage == 'en') {
                i18n.changeLanguage("en_US")
                await AsyncStorage.setItem('@Language', JSON.stringify("en_US"))
            } else {
                i18n.changeLanguage("es_ES")
                await AsyncStorage.setItem('@Language', JSON.stringify("es_ES"))
            }
        }
    }

    useEffect(() => {
        changeLanguage()
    }, [])

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
                            <TextIn>{t('remember')}</TextIn>
                        </ContentTextResponse>

                        <View style={styles.flex}>
                            <LetterResponse source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${games.imagem_url}`) }} />
                        </View>

                        <TextLetter>{games.gpt_response}</TextLetter>

                        {premium != true && (
                            <>
                                {isClosed == false && (
                                    <Button onPress={() => {
                                        if (isLoaded) {
                                            show()
                                        } else {
                                            setResponse(false)
                                            navigation.navigate('NewGame')
                                        }
                                    }}>
                                        <TextButton>{t('one_credit')}</TextButton>
                                    </Button>
                                )}
                            </>
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
                                <Title>{t('title')}</Title>

                                <Card onPress={handleDataFormat}>
                                    <Letter1 source={require('../../assets/carta.png')} />
                                    <Label>{t('advice')}</Label>
                                </Card>

                                <Card onPress={handleStorage}>
                                    <Letter2 source={require('../../assets/cartas.png')} />
                                    <Label>{t('question')}</Label>
                                    {premium != true && (
                                        <Label style={{ marginTop: 3 }}>{t('question_label')}</Label>
                                    )}
                                </Card>

                                {premium != true && (
                                    <>
                                        {(time == true && rewardloaded == true) && (
                                            <Card onPress={() => { rewarded.show() }} style={{ backgroundColor: ColorTheme.Verde2 }}>
                                                <Label>{t('new_points')}</Label>
                                            </Card>
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
            </Container >

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{t('modal_credits')}</Text>
                        <View style={styles.btnContent}>
                            <Pressable
                                style={styles.button}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>{t('btn_back')}</Text>
                            </Pressable>
                            <Pressable
                                style={styles.buttonPremium}
                                onPress={() => { setModalVisible(!modalVisible), navigation.navigate('Couple') }}>
                                <Text style={styles.textStyle}>Sejá Premium</Text>
                            </Pressable>
                        </View>
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
    btnContent: {
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        borderRadius: 4,
        padding: 10,
        elevation: 2,
        backgroundColor: ColorTheme.Laranja,
        marginTop: 30,
        marginRight: 5,
        marginLeft: 5,
    },
    buttonPremium: {
        borderRadius: 4,
        padding: 10,
        elevation: 2,
        backgroundColor: ColorTheme.Theme,
        marginTop: 30,
        marginRight: 5,
        marginLeft: 5,
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