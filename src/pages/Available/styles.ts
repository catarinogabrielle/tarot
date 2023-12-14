import styled from 'styled-components';
import Colors from '../../../constants/Colors';
const ColorTheme = Colors['Theme'];

export const Container = styled.View`
display: flex;
flex: 1;
align-items: center;
padding: 30px 30px 0 30px;
`;

export const Logo = styled.Image`     
width: 260px;
height: 180px;
margin-bottom: 20px;
`;

export const Text = styled.Text`
color: ${ColorTheme.Cinza_claro};
font-size: 15px;
text-align: center;
margin-top: 20px;
line-height: 23px;
`;

export const Button = styled.TouchableOpacity`
width: 80%;
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