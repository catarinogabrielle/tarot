import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
const ColorTheme = Colors['Theme'];

import Profile from '../pages/Profile';
import YourGame from "../pages/YourGame";
import Game from "../pages/Game";
import SpecificGame from "../pages/SpecificGame";
import NewGame from '../pages/NewGame';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NewGame" component={NewGame} options={{ headerShown: false }} />
            <Stack.Screen name="Game" component={Game} options={{
                title: 'Conselho diário',
                headerStyle: {
                    backgroundColor: ColorTheme.Theme,
                },
                headerTintColor: ColorTheme.Branco,
                headerTitleStyle: {
                    fontWeight: '400',
                    fontSize: 20,
                },
            }} />
            <Stack.Screen name="SpecificGame" component={SpecificGame} options={{
                title: 'Pergunta específica',
                headerStyle: {
                    backgroundColor: ColorTheme.Theme,
                },
                headerTintColor: ColorTheme.Branco,
                headerTitleStyle: {
                    fontWeight: '400',
                    fontSize: 20,
                },
            }} />
        </Stack.Navigator>
    )
}

export default function AppRoutes() {
    return (
        <Tab.Navigator initialRouteName="StackScreen" screenOptions={{
            "tabBarHideOnKeyboard": true,
            "tabBarActiveTintColor": ColorTheme.Theme,
            "tabBarInactiveTintColor": ColorTheme.Cinza,
            "tabBarShowLabel": false,
            headerShown: false,
            "tabBarStyle": [
                {
                    "backgroundColor": ColorTheme.Primaria,
                    "display": "flex",
                    "height": 56,
                }
            ]
        }}>
            <Tab.Screen
                name="YourGame"
                component={YourGame}
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="game-controller" size={size} color={color} />
                    }
                }}
            />

            <Tab.Screen
                name="StackScreen"
                component={StackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <AntDesign name="pluscircle" size={size} color={color} />
                    }
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <FontAwesome name="user" size={size} color={color} />
                    }
                }}
            />
        </Tab.Navigator>
    );
}