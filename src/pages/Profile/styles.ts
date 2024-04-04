import styled from 'styled-components';
import Colors from '../../../constants/Colors';
const ColorTheme = Colors['Theme'];

export const Container = styled.View`
height: 100%;
display: flex;
background-color: ${ColorTheme.Theme};
`;

export const Content = styled.View`
display: flex;
flex: 1;
background-color: ${ColorTheme.Branco};
margin-top: 15px;
padding: 20px 30px;
border-radius: 30px 30px 0 0;
`;

export const Title = styled.Text`
font-size: 20px;
font-weight: 400;
color: ${ColorTheme.Chumbo};
margin: 10px 0 12px 0;
`;

export const ContentInput = styled.View`
width: 100%;
margin-top: 15px;
`;

export const Input = styled.TextInput`
width: 100%;
border-bottom-color: ${ColorTheme.Branco2};
border-bottom-width: 1px;
padding: 10px 14px 10px 4px;
color: ${ColorTheme.Preto};
font-size: 15px;
margin-top: 20px;
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

export const ButtonSign = styled.TouchableOpacity`
width: 100%;
margin-top: 15px;
align-items: center;
padding: 10px;
border-radius: 4px;
border: 1px solid ${ColorTheme.Theme};
`;

export const TextButtonSign = styled.Text`
color: ${ColorTheme.Theme};
font-size: 15px;
`;

export const Alert1 = styled.Text`
color: ${ColorTheme.Vermelho};
font-size: 12px;
`;

export const ContentLoading = styled.View`
width: 100%;
height: 100%;
position: absolute;
display: flex;
background-color: rgba(255 ,255 ,255 , 0.8);
align-items: center;
`;