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
`;

export const TitleIn = styled.Text`
font-size: 20px;
font-weight: 400;
color: ${ColorTheme.Chumbo};
margin: 10px 0 15px 0;
`;

export const Description = styled.Text`
font-size: 15px;
font-weight: 400;
color: ${ColorTheme.Cinza};
`;

export const ContentCard = styled.TouchableOpacity`
display: flex;
border-bottom-color: ${ColorTheme.Branco4};
border-bottom-width: 1px;
margin-top: 16px;
padding: 5px 12px;
flex-direction: row;
`;

export const ImgIn = styled.Image`
width: 33px;
height: 65px;
border-radius: 4px;
margin-bottom: 12px;
`;

export const ContentInfo = styled.View`
display: flex;
flex-direction: column;
margin-left: 17px;
`;

export const TitleCard = styled.Text`
font-size: 15px;
font-weight: 500;
margin-bottom: 3px;
color: ${ColorTheme.Theme};
`;

export const TextCard = styled.Text`
font-size: 12px;
font-weight: 300;
margin-top: 4px;
color: ${ColorTheme.Chumbo};
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

export const ContentLoading = styled.View`
width: 100%;
height: 100%;
position: absolute;
display: flex;
background-color: rgba(255 ,255 ,255 , 0.8);
align-items: center;
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