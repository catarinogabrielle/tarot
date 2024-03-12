import React, { useContext } from "react";
import { ActivityIndicator, View } from 'react-native';

import Colors from "../../constants/Colors";
const ColorTheme = Colors['Theme'];

import AppRoutes from "./app.routes";
import AuthRoutes from './auth.routes';

import { AuthContext } from '../contexts/AuthContext';

function Routes() {
    const { isAuthenticated, loadingAuth } = useContext(AuthContext)

    if (loadingAuth) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: ColorTheme.Branco3,
                    alignContent: 'center'
                }}
            >
                <ActivityIndicator size={60} color={ColorTheme.Theme} style={{ marginTop: '50%' }} />
            </View>
        )
    }

    return (
        isAuthenticated ? <AppRoutes /> : <AuthRoutes />
    )
}

export default Routes;