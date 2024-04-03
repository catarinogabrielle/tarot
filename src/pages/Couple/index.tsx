import React, { useState, useContext, useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'expo-dev-client';

import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

import { PlatformPay, PlatformPayButton, StripeProvider, usePlatformPay } from '@stripe/stripe-react-native';
const publishableKey = "pk_test_51OwSDII6KpCwG5t5pbYDPBtg2PQSMefGUpnZjINIBhTDurFLUPCHUQHIHFi4No1eXKUvYi2RixhXcC2wJWXTvbT5004xhzc71T"

import { Api } from "../../services/api"

import {
    Container,
    Header,
    ATitleHeader,
    Content,
    Title,
    ContentInput,
    Input,
    Button,
    TextButton,
    Name,
    ContentText,
    Text,
    ContentImage,
    Img,
    ContentLoading,
    ContainerResponse,
    TitleInitial,
    TitleLabel,
    ContentLaters,
    Letter,
    ContentBePremium,
    ContentInfoPremium,
    TitleBePremium,
    TextBePremium,
    ContentValue,
    TextValue,
    TextValue2,
    DescriptionLetter,
    ContentResponse,
    NameLetter,
    ContentTextResponse,
    LetterResponse,
    TextLetter
} from './styles';

export default function Couple({ navigation }) {
    const { premium, handlePremiunState } = useContext(AuthContext)
    const [name1, setName1] = useState('')
    const [saveName1, setSaveName1] = useState(false)
    const [name2, setName2] = useState('')
    const [saveName2, setSaveName2] = useState(false)
    const [startGame, setStartGame] = useState(false)
    const [cards, setCards] = useState([])
    const [loadin, setLoadin] = useState(false)
    const [idCard1, setIdCard1] = useState(0)
    const [loadingResponse, setLoadingResponse] = useState(false)
    const [gpt_response, setGpt_response] = useState('')
    const [question, setQuestion] = useState([])

    const { t, i18n } = useTranslation()

    async function handleCards() {
        setLoadin(true)
        try {
            await Api.get(`/api/index.php?request=cards&lang=${i18n.language}`).then(response => {
                setCards(response.data)
                setStartGame(true)
                setLoadin(false)
            }).catch((err) => {
                console.log('erro', err)
                setLoadin(false)
            })
        } catch (err) {
            console.log('erro', err)
            setLoadin(false)
        }
    }

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
            await Api.post(`/api/index.php?request=couple_questions&lang=${i18n.language}`, {
                question_text: "conselhododia",
                user_id: id,
                user_name: name1,
                partner_name: name2,
                card_ids: [idCard1, item]
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

    const [nomeCard1, setNomeCard1] = useState('')
    const [tipoCard1, setTipoCard1] = useState('')
    const [descricaoCard1, setDescricaoCard1] = useState('')
    const [imagem_urlCard1, setImagem_urlCard1] = useState('')

    const [nomeCard2, setNomeCard2] = useState('')
    const [tipoCard2, setTipoCard2] = useState('')
    const [descricaoCard2, setDescricaoCard2] = useState('')
    const [imagem_urlCard2, setImagem_urlCard2] = useState('')

    function handleGameLatters() {
        return (
            <ContainerResponse>
                {loadingResponse != true ? (
                    <>
                        {idCard1 === 0 && (
                            <TitleInitial>{t('choice_couple')} {name1}</TitleInitial>
                        )}
                        {idCard1 != 0 && (
                            <TitleInitial>{t('choice_couple')} {name2}</TitleInitial>
                        )}

                        <TitleLabel>{t('label_choice')}</TitleLabel>
                        <ScrollView style={styles.scroll}>
                            <ContentLaters>
                                {cards.map(item => (
                                    <TouchableOpacity onPress={() => {
                                        if (idCard1 === 0) {
                                            setIdCard1(item.carta_id)

                                            setNomeCard1(item.nome)
                                            setTipoCard1(item.tipo)
                                            setDescricaoCard1(item.descricao)
                                            setImagem_urlCard1(item.imagem_url)
                                        } else {
                                            setLoadingResponse(true)
                                            getUserData(item.carta_id)

                                            setNomeCard2(item.nome)
                                            setTipoCard2(item.tipo)
                                            setDescricaoCard2(item.descricao)
                                            setImagem_urlCard2(item.imagem_url)
                                        }
                                    }}
                                        key={item.carta_id}
                                    >
                                        <Letter source={require('../../assets/carta.png')} />
                                    </TouchableOpacity>
                                ))}
                            </ContentLaters>
                        </ScrollView>
                    </>
                ) : (
                    <>
                        {gpt_response == '' ? (
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
                            </ScrollView>
                        ) : (
                            <ScrollView style={styles.scroll}>
                                <ContentResponse>
                                    <TouchableOpacity onPress={() => {
                                        setName1('')
                                        setName2('')
                                        setGpt_response('')
                                        setIdCard1(0)
                                        setStartGame(false)
                                        navigation.navigate('NewGame')
                                    }}
                                        style={{ display: 'flex', width: '97%', alignItems: 'flex-end' }}>
                                        <EvilIcons name="close" size={24} color={ColorTheme.Theme} />
                                    </TouchableOpacity>

                                    <NameLetter style={{ fontWeight: 'bold' }}>{name1} - {nomeCard1}</NameLetter>
                                    <NameLetter>{tipoCard1}</NameLetter>
                                    <DescriptionLetter>{descricaoCard1}</DescriptionLetter>

                                    <NameLetter style={{ fontWeight: 'bold', marginTop: 20 }}>{name2} - {nomeCard2}</NameLetter>
                                    <NameLetter>{tipoCard2}</NameLetter>
                                    <DescriptionLetter>{descricaoCard2}</DescriptionLetter>

                                    <ContentTextResponse>
                                        <Text>{t('remember')}</Text>
                                    </ContentTextResponse>

                                    <View style={styles.flex}>
                                        <LetterResponse source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${imagem_urlCard1}`) }} />
                                        <LetterResponse source={{ uri: (`https://ymonetize.com/apps/app_tarot/assets/img/${imagem_urlCard2}`) }} />
                                    </View>

                                    <TextLetter>{question.gpt_response}</TextLetter>
                                </ContentResponse>
                            </ScrollView >
                        )}
                    </>

                )}
            </ContainerResponse>
        )
    }

    const {
        isPlatformPaySupported,
        confirmPlatformPayPayment,
    } = usePlatformPay();

    React.useEffect(() => {
        (async function () {
            if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
                Alert.alert('Google Pay is not supported.');
                return;
            }
        })();
    }, []);

    const fetchPaymentIntentClientSecret = async () => {
        // Fetch payment intent created on the server, see above
        const response = await fetch(`https://ymonetize.com/apps/app_tarot/api/v1/subscription/create-payment-intent.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currency: 'usd',
            }),
        });
        const { clientSecret } = await response.json();

        return clientSecret;
    };

    const pay = async () => {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')

        if (storageIMEI == null) {
            navigation.navigate('Game')
        } else {

            const clientSecret = await fetchPaymentIntentClientSecret();

            const { error } = await confirmPlatformPayPayment(
                clientSecret,
                {
                    googlePay: {
                        testEnv: true,
                        merchantName: 'My merchant name',
                        merchantCountryCode: 'US',
                        currencyCode: 'USD',
                        billingAddressConfig: {
                            format: PlatformPay.BillingAddressFormat.Full,
                            isPhoneNumberRequired: true,
                            isRequired: true,
                        },
                    },
                }
            );

            if (error) {
                Alert.alert(error.code, error.message);
                // Update UI to prompt user to retry payment (and possibly another payment method)
                return;
            }
            getImei()
        }
    };

    async function getImei() {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        try {
            await Api.post('/api/index.php?request=users&action=return', {
                IMEI: handleStorageIMEI
            }).then(response => {
                const USER_ID = response.data
                getUpgradePremium(USER_ID)
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
        }
    }

    async function getUpgradePremium(USER_ID) {
        const id = USER_ID.data.usuario_id

        try {
            await Api.post('/api/index.php?request=users&action=upgrade-premium', {
                user_id: id
            }).then(response => {
                console.log(response.data)
                tooglePremium()
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
        <Container>
            {premium != true ? (
                <ImageBackground source={require('../../assets/banner.png')} resizeMode="cover" style={styles.image}>
                    <StripeProvider
                        publishableKey={publishableKey}
                        merchantIdentifier="merchant.identifier"
                        urlScheme="your-url-scheme"
                    >
                        <ContentBePremium>
                            <ContentInfoPremium>
                                <View style={{ width: '100%', height: 'auto' }}>
                                    <TitleBePremium>{t('seja_premium')}</TitleBePremium>

                                    <View style={styles.premiumFlex}>
                                        <AntDesign name="checkcircle" size={18} color={ColorTheme.Verde} />
                                        <TextBePremium>{t('label_premium1')}</TextBePremium>
                                    </View>

                                    <View style={styles.premiumFlex}>
                                        <AntDesign name="checkcircle" size={18} color={ColorTheme.Verde} />
                                        <TextBePremium>{t('label_premium2')}</TextBePremium>
                                    </View>

                                    <View style={styles.premiumFlex}>
                                        <AntDesign name="checkcircle" size={18} color={ColorTheme.Verde} />
                                        <TextBePremium>{t('label_premium3')}</TextBePremium>
                                    </View>

                                    <View style={styles.premiumFlex}>
                                        <AntDesign name="checkcircle" size={18} color={ColorTheme.Verde} />
                                        <TextBePremium>{t('label_premium4')}</TextBePremium>
                                    </View>

                                    <View style={styles.premiumFlex}>
                                        <AntDesign name="checkcircle" size={18} color={ColorTheme.Verde} />
                                        <TextBePremium>{t('label_premium5')}</TextBePremium>
                                    </View>

                                    <ContentValue>
                                        <TextValue>{t('amount')}</TextValue>
                                        <TextValue2>{t('mensal')}</TextValue2>
                                    </ContentValue>
                                </View>

                                <View>
                                    <PlatformPayButton
                                        type={PlatformPay.ButtonType.Pay}
                                        onPress={pay}
                                        style={{
                                            width: '100%',
                                            marginTop: 25,
                                            height: 50,
                                        }}
                                    />
                                </View>
                            </ContentInfoPremium>
                        </ContentBePremium>
                    </StripeProvider>
                </ImageBackground>
            ) : (
                <>
                    <Header>
                        <TouchableOpacity onPress={() => {
                            setStartGame(false),
                                setName1(''),
                                setName2(''),
                                setSaveName1(false),
                                setSaveName2(false),
                                setCards([])
                        }} style={{ position: 'absolute', left: 19 }}>
                            <AntDesign name="arrowleft" size={24} color={ColorTheme.Branco} />
                        </TouchableOpacity>
                        <ATitleHeader>{t('conselho_amor')}</ATitleHeader>
                    </Header>
                    {startGame != true ? (
                        <ScrollView style={styles.scroll}>
                            <Content>
                                {saveName1 != true ? (
                                    <>
                                        <Title>1 - {t('name')}</Title>

                                        <ContentInput>
                                            <Input
                                                onChangeText={(text: React.SetStateAction<string>) => setName1(text)}
                                                placeholderTextColor={ColorTheme.Cinza_escuro}
                                                placeholder={t('placeholder')}
                                            />

                                            {name1 != '' && (
                                                <Button onPress={() => { setSaveName1(true) }}>
                                                    <TextButton>{t('next')}</TextButton>
                                                </Button>
                                            )}
                                        </ContentInput>
                                    </>
                                ) : (
                                    <>
                                        {saveName2 != true ? (
                                            <>
                                                <Title>2 - {t('couple_name')}</Title>

                                                <ContentInput>
                                                    <Input
                                                        onChangeText={(text: React.SetStateAction<string>) => setName2(text)}
                                                        placeholderTextColor={ColorTheme.Cinza_escuro}
                                                        placeholder={t('placeholder')}
                                                    />

                                                    {name2 != '' && (
                                                        <Button onPress={() => { setSaveName2(true) }}>
                                                            <TextButton>{t('next')}</TextButton>
                                                        </Button>
                                                    )}
                                                </ContentInput>
                                            </>
                                        ) : (
                                            <>
                                                <Title>{t('names')}:</Title>
                                                <Name>{name1} & {name2}</Name>

                                                <Title>3 - {t('pense')}</Title>

                                                <ContentText>
                                                    <Text>{t('couple')}</Text>
                                                </ContentText>

                                                <Button onPress={() => {
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

                    {loadin && (
                        <ContentLoading>
                            <ActivityIndicator style={{ marginTop: '60%', transform: [{ scaleX: 2 }, { scaleY: 2 }] }} size="large" color={ColorTheme.Theme} />
                        </ContentLoading>
                    )}
                </>
            )
            }
        </Container >
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
        flexDirection: 'row',
        width: '100%',
        marginTop: 25,
        justifyContent: 'center',
        marginBottom: 25,
    },
    flexBanner: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 25,
    },
    premiumFlex: {
        display: "flex",
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
})