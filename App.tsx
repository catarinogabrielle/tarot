import React, { useEffect, useState } from "react";
import { StatusBar, PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import inAppMessaging from '@react-native-firebase/in-app-messaging';

import Routes from "./src/routes";
import Available from "./src/pages/Available";

import { AuthProvider } from './src/contexts/AuthContext';

import Colors from "./constants/Colors";
import { Api } from "./src/services/api";
const ColorTheme = Colors['Theme'];

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export default function App() {
  const [available, setAvailable] = useState(true)

  const checkAppVersion = async () => {
    const installedVersion = await DeviceInfo.getVersion()

    try {
      await Api.get(`/api/last-app-version.php`).then(response => {
        if (installedVersion !== response.data.version) {
          setAvailable(false)
        } else {
          setAvailable(true)
        }
      }).catch((err) => {
        console.log('erro', err)
      })
    } catch (err) {
      console.log('erro', err)
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

  async function bootstrap() {
    await inAppMessaging().setMessagesDisplaySuppressed(true);
  }

  useEffect(() => {
    bootstrap
  }, [])

  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor={ColorTheme.Theme} barStyle="light-content" translucent={false} />
        {available == true ? (
          <Routes />
        ) : (
          <Available />
        )}
      </AuthProvider>
    </NavigationContainer>
  )
}