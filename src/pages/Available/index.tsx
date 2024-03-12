import React from "react";
import { Linking } from 'react-native';

import { useTranslation } from 'react-i18next';

import {
    Container,
    Logo,
    Button,
    TextButton,
    Text,
} from './styles';

export default function Available() {
    const { t } = useTranslation()

    return (
        <Container>
            <Logo source={require('../../assets/logo.png')} />

            <Text>{t('update_text1')} 💫</Text>

            <Text>{t('update_text2')}</Text>

            <Text>{t('update_text3')}</Text>

            <Button onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.gabrielledcastro.mobile')}>
                <TextButton>{t('btn_update')}</TextButton>
            </Button>
        </Container>
    )
}