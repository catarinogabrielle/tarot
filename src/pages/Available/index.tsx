import React from "react";
import { Linking } from 'react-native';

import {
    Container,
    Logo,
    Button,
    TextButton,
    Text,
} from './styles';

export default function Available() {
    return (
        <Container>
            <Logo source={require('../../assets/logo.png')} />

            <Text>Estamos empolgados em anunciar uma nova atualização para o nosso aplicativo! 💫</Text>

            <Text>Queremos sempre oferecer a melhor experiência possível, e esta atualização inclui melhorias de desempenho, correções de bugs e recursos aprimorados.</Text>

            <Text>Por favor, não se esqueça de atualizar seu aplicativo para aproveitar ao máximo essas melhorias.</Text>

            <Button onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.gabrielledcastro.mobile')}>
                <TextButton>Atualizar</TextButton>
            </Button>
        </Container>
    )
}