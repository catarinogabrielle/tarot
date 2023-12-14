import styled from 'styled-components';
import Colors from '../../../constants/Colors';
const ColorTheme = Colors['Theme'];

export const Container = styled.View`
height: 100%;
display: flex;
`;

export const Content = styled.View`
display: flex;
background-color: ${ColorTheme.Branco};
flex: 1;
padding: 10px 20px 25px 20px;
align-items: center;
`;

export const Title = styled.Text`
font-size: 18px;
font-weight: 400;
color: ${ColorTheme.Chumbo};
margin: 10px 0 5px 0;
`;

export const Card = styled.TouchableOpacity`
width: 85%;
justify-content: center;
align-items: center;
margin-top: 20px;
padding: 18px;
background-color: ${ColorTheme.Secundaria};
border: 1px solid ${ColorTheme.Branco4};
border-radius: 6px;
`;

export const Letter1 = styled.Image`
width: 43px;
height: 80px;
border-radius: 4px;
margin-bottom: 12px;
`;

export const Letter2 = styled.Image`
width: 116px;
height: 90px;
margin-bottom: 8px;
`;

export const Label = styled.Text`
font-size: 17px;
font-weight: 400;
color: ${ColorTheme.Preto};
text-align: center;
`;

export const ContainerResponse = styled.View`
display: flex;
background-color: ${ColorTheme.Branco};
flex: 1;
padding: 0 12px 0 12px;
`;

export const ContentTextResponse = styled.View`
width: 100%;
background-color: ${ColorTheme.Amarelo2};
margin-top: 18px;
padding: 14px 16px;
border-radius: 30px;
`;

export const TextIn = styled.Text`
color: ${ColorTheme.Preto};
font-size: 15px;
text-align: center;
font-weight: 400;
line-height: 21px;
`;

export const ContentResponse = styled.View`
width: 100%;
display: flex;
margin: 23px 0 40px 0;
`;

export const NameLetter = styled.Text`
color: ${ColorTheme.Chumbo};
font-size: 17px;
font-weight: 300;
margin-bottom: 5px;
`;

export const TextLetter = styled.Text`
color: ${ColorTheme.Chumbo};
font-size: 16px;
font-weight: 300;
margin-bottom: 10px;
`;

export const DescriptionLetter = styled.Text`
color: ${ColorTheme.Theme};
font-size: 19px;
font-weight: 500;
margin-top: 10px;
`;

export const LetterResponse = styled.Image`
width: 200px;
height: 310px;
margin-right: 5px;
border-radius: 4px;
`;

export const Button = styled.TouchableOpacity`
width: 100%;
margin: 25px 0 0 0;
align-items: center;
background-color: ${ColorTheme.Theme};
padding: 10px;
border-radius: 4px;
`;

export const TextButton = styled.Text`
color: ${ColorTheme.Branco};
font-size: 15px;
text-align: center;
`;