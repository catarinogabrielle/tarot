import React, { useState, useContext } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";;
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
    TextBtnBePremium
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
    const [idCard, setIdCard] = useState('')

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

    function handleGameLatters() {
        return (
            <ContainerResponse>
                <TitleInitial>{t('choice')}</TitleInitial>
                <TitleLabel>{t('label_choice')}</TitleLabel>

                <ScrollView style={styles.scroll}>
                    <ContentLaters>
                        {cards.map(item => (
                            <TouchableOpacity onPress={() => {
                                setIdCard(item.carta_id)
                            }}
                                key={item.carta_id}
                            >
                                <Letter source={require('../../assets/carta.png')} />
                            </TouchableOpacity>
                        ))}
                    </ContentLaters>
                </ScrollView >
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
    }
})