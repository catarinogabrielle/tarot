import styled from 'styled-components';
import Colors from '../../../constants/Colors';
const ColorTheme = Colors['Theme'];

export const Container = styled.View`
display: flex;
flex: 1;
align-items: center;
`;

export const ContentBack = styled.View`
display: flex;
width: 100%;
margin-top: 30px;
flex-direction: row;
align-items: center;
padding: 0 0 0 20px;
`;

export const TextBack = styled.Text`
color: ${ColorTheme.Theme};
font-size: 17px;
margin-left: 7px;
`;

export const Logo = styled.Image`     
width: 260px;
height: 180px;
margin: 50px 0 20px 0;
`;

export const ContentInput = styled.View`
width: 76%;
align-items: center;
`;

export const Input = styled.TextInput`
width: 100%;
border-bottom-color: ${ColorTheme.Branco2};
border-bottom-width: 1px;
padding: 10px 14px 10px 4px;
color: ${ColorTheme.Preto};
margin-top: 17px;
font-size: 14px;
`;

export const Button = styled.TouchableOpacity`
width: 100%;
margin-top: 40px;
align-items: center;
background-color: ${ColorTheme.Theme};
padding: 10px;
border-radius: 4px;
`;

export const TextButton = styled.Text`
color: ${ColorTheme.Branco};
font-size: 15px;
`;

export const BtnSign = styled.TouchableOpacity`
display: flex;
align-items: center;
justify-content: center;
margin: 25px 0 45px 0;
width: 100%;
`;

export const Sign = styled.Text`
color: ${ColorTheme.Cinza_claro};
font-size: 14px;
`;

export const Text = styled.Text`
color: ${ColorTheme.Theme};
font-weight: bold;
text-decoration: underline;
`;