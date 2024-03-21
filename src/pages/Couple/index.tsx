import React, { useState, useContext } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'expo-dev-client';

import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';

import Colors from "../../../constants/Colors";
const ColorTheme = Colors['Theme'];

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
    TitleBePremium,
    ButtonBePremium,
    TextBtnBePremium,
    DescriptionLetter,
    ContentResponse,
    NameLetter,
    ContentTextResponse,
    LetterResponse,
    TextLetter
} from './styles';

export default function Couple({ navigation }) {
    const { premium } = useContext(AuthContext)
    const [name1, setName1] = useState('')
    const [saveName1, setSaveName1] = useState(false)
    const [name2, setName2] = useState('')
    const [saveName2, setSaveName2] = useState(false)
    const [startGame, setStartGame] = useState(false)
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(false)
    const [idCard1, setIdCard1] = useState(0)
    const [loadingResponse, setLoadingResponse] = useState(false)
    const [gpt_response, setGpt_response] = useState('')
    const [question, setQuestion] = useState([])

    const { t, i18n } = useTranslation()

    async function handleCards() {
        setLoading(true)
        try {
            await Api.get(`/api/index.php?request=cards&lang=${i18n.language}`).then(response => {
                setCards(response.data)
                setStartGame(true)
                setLoading(false)
            }).catch((err) => {
                console.log('erro', err)
                setLoading(false)
            })
        } catch (err) {
            console.log('erro', err)
            setLoading(false)
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
                            <TitleInitial>Escolha a primeira carta</TitleInitial>
                        )}
                        {idCard1 != 0 && (
                            <TitleInitial>Escolha a segunda carta</TitleInitial>
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
                            </ScrollView>
                        ) : (
                            <ScrollView style={styles.scroll}>
                                <ContentResponse>
                                    <TouchableOpacity onPress={() => navigation.navigate('NewGame')} style={{ display: 'flex', width: '97%', alignItems: 'flex-end' }}>
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

    return (
        <Container>
            {premium != true ? (
                <ContentBePremium>
                    <TitleBePremium>Você ainda não é premium</TitleBePremium>

                    <ButtonBePremium>
                        <TextBtnBePremium>Seja Premium</TextBtnBePremium>
                    </ButtonBePremium>
                </ContentBePremium>
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
                        <ATitleHeader>Seu conselho de amor</ATitleHeader>
                    </Header>
                    {startGame != true ? (
                        <ScrollView style={styles.scroll}>
                            <Content>
                                {saveName1 != true ? (
                                    <>
                                        <Title>1 - Digite seu nome</Title>

                                        <ContentInput>
                                            <Input
                                                onChangeText={(text: React.SetStateAction<string>) => setName1(text)}
                                                placeholderTextColor={ColorTheme.Cinza_escuro}
                                                placeholder={'Digite aqui'}
                                            />

                                            {name1 != '' && (
                                                <Button onPress={() => { setSaveName1(true) }}>
                                                    <TextButton>Próximo</TextButton>
                                                </Button>
                                            )}
                                        </ContentInput>
                                    </>
                                ) : (
                                    <>
                                        {saveName2 != true ? (
                                            <>
                                                <Title>2 - Digite o nome da pessoa escolhida</Title>

                                                <ContentInput>
                                                    <Input
                                                        onChangeText={(text: React.SetStateAction<string>) => setName2(text)}
                                                        placeholderTextColor={ColorTheme.Cinza_escuro}
                                                        placeholder={'Digite aqui'}
                                                    />

                                                    {name2 != '' && (
                                                        <Button onPress={() => { setSaveName2(true) }}>
                                                            <TextButton>Próximo</TextButton>
                                                        </Button>
                                                    )}
                                                </ContentInput>
                                            </>
                                        ) : (
                                            <>
                                                <Title>Nomes escolhidos:</Title>
                                                <Name>{name1} & {name2}</Name>

                                                <Title>3 - Pense na pessoa que você colocou o nome</Title>

                                                <ContentText>
                                                    <Text>Concentre-se e peça mentalmente uma orientação para a ter a resposta dos dois nomes envolvidos. Você só pode tirar uma carta, por isso, quando se sentir preparado embaralhe as cartas.</Text>
                                                </ContentText>

                                                <Button onPress={() => {
                                                    handleCards()
                                                }}>
                                                    <TextButton>Embaralhar cartas</TextButton>
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
                </>
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
    }
})