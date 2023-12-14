import React, { useState } from "react";

import Colors from '../../../constants/Colors';
const ColorTheme = Colors['Theme'];

import {
    Container,
    Logo,
    Title,
    ContentInput,
    Input,
    Button,
    TextButton,
    BtnSign,
    Sign,
    Text,
} from './styles';

export default function SignIn() {
    const [name, setName] = useState('')
    const [email, setEmai] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [login, setLogin] = useState(true)

    function toggleLogin() {
        setLogin(!login)
    }

    if (login) {
        return (
            <Container>
                <Logo source={require('../../assets/logo.png')} />

                <ContentInput>
                    <Input
                        value={email}
                        onChangeText={(text: React.SetStateAction<string>) => setEmai(text)}
                        placeholderTextColor={ColorTheme.Cinza_escuro}
                        placeholder="Digite seu Email"
                    />

                    <Input
                        value={password}
                        onChangeText={(text: React.SetStateAction<string>) => setPassword(text)}
                        placeholderTextColor={ColorTheme.Cinza_escuro}
                        placeholder="Digite sua Senha"
                    />

                    <Button>
                        <TextButton>Acessar</TextButton>
                    </Button>

                    <BtnSign onPress={toggleLogin}>
                        <Sign>Novo aqui? Clique em <Text>Cadastrar</Text></Sign>
                    </BtnSign>
                </ContentInput>
            </Container>
        )
    }

    return (
        <Container>
            <Logo source={require('../../assets/logo.png')} />

            <Title>Tela de Cadastro</Title>

            <ContentInput>
                <Input
                    value={name}
                    onChangeText={(text: React.SetStateAction<string>) => setName(text)}
                    placeholderTextColor={ColorTheme.Cinza_escuro}
                    placeholder="Digite seu Nome"
                />

                <Input
                    value={email}
                    onChangeText={(text: React.SetStateAction<string>) => setEmai(text)}
                    placeholderTextColor={ColorTheme.Cinza_escuro}
                    placeholder="Digite seu Email aqui"
                />

                <Input
                    value={password}
                    onChangeText={(text: React.SetStateAction<string>) => setPassword(text)}
                    placeholderTextColor={ColorTheme.Cinza_escuro}
                    placeholder="Digite sua Senha"
                />

                <Input
                    value={confirm}
                    onChangeText={(text: React.SetStateAction<string>) => setConfirm(text)}
                    placeholderTextColor={ColorTheme.Cinza_escuro}
                    placeholder="Confirmar Senha"
                />

                <Button>
                    <TextButton>Cadastrar</TextButton>
                </Button>

                <BtnSign onPress={toggleLogin}>
                    <Sign>Voltar para tela de <Text>Login</Text></Sign>
                </BtnSign>
            </ContentInput>
        </Container>
    )
}