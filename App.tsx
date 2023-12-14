import React, { useEffect, useState } from "react";
import { StatusBar, PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import Routes from "./src/routes";
import Available from "./src/pages/Available";

import Colors from "./constants/Colors";
const ColorTheme = Colors['Theme'];

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export default function App() {
  const [available, setAvailable] = useState(true)

  const checkAppVersion = async () => {
    try {
      // Obtenha a versão do aplicativo instalado
      const installedVersion = await DeviceInfo.getVersion()

      // Substitua o URL com o URL real da sua listagem na Play Store
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.gabrielledcastro.mobile'

      // Faça uma solicitação à Play Store para obter a versão mais recente
      const response = await fetch(playStoreUrl)
      const html = await response.text()

      // Extraia a versão mais recente do HTML da Play Store (isso pode variar dependendo da estrutura HTML da página)
      const match = html.match(/<div[^>]*>Versão[^<]*<\/div><span[^>]*>([^<]*)<\/span>/)
      const latestVersion = match ? match[1] : null

      // Compare as versões
      if (latestVersion && installedVersion !== latestVersion) {
        console.log('O aplicativo está desatualizado!')
        setAvailable(false)
      } else {
        // O aplicativo está atualizado
        console.log('O aplicativo está atualizado!')
        setAvailable(true)
      }
    } catch (error) {
      console.error('Erro ao verificar a versão do aplicativo:', error)
    }
  }

  useEffect(() => {
    checkAppVersion()
  })

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      )
    })

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          )
        }
      })

    messaging().onMessage(async remoteMessage => {
      console.log("notification on forground state.......", remoteMessage)
    })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage)
    })
  }, [])

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={ColorTheme.Theme} barStyle="light-content" translucent={false} />
      {available == true ? (
        <>
          <Routes />
        </>
      ) : (
        <Available />
      )}
    </NavigationContainer>
  )
}