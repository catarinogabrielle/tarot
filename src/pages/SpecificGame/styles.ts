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
padding: 10px 12px 25px 12px;
`;

export const Title = styled.Text`
font-size: 18px;
font-weight: 500;
color: ${ColorTheme.Theme};
margin-top: 20px;
`;

export const ContentInput = styled.View`
width: 100%;
margin-top: 25px;
`;

export const Alert = styled.Text`
color: ${ColorTheme.Vermelho};
font-size: 12px;
`;

export const Input = styled.TextInput`
width: 100%;
border-color: ${ColorTheme.Branco2};
border-width: 1px;
padding: 10px 14px;
color: ${ColorTheme.Preto};
font-size: 14px;
margin-top: 4px;
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

export const Name = styled.Text`
color: ${ColorTheme.Chumbo};
font-size: 22px;
font-weight: 400;
border-bottom-width: 1px;
border-bottom-color: ${ColorTheme.Branco4};
padding: 5px 10px;
margin: 20px 0 15px 0;
`;

export const Question = styled.Text`
color: ${ColorTheme.Chumbo};
font-size: 17px;
font-weight: 400;
margin: 10px 0 15px 0;
border-bottom-width: 1px;
border-bottom-color: ${ColorTheme.Branco4};
`;

export const ContentText = styled.View`
width: 100%;
background-color: ${ColorTheme.Secundaria};
margin-top: 25px;
padding: 20px 16px;
border-radius: 30px;
`;

export const ContentTextResponse = styled.View`
width: 100%;
background-color: ${ColorTheme.Amarelo2};
margin-top: 18px;
padding: 14px 16px;
border-radius: 30px;
`;

export const Text = styled.Text`
color: ${ColorTheme.Preto};
font-size: 15px;
text-align: center;
font-weight: 400;
line-height: 21px;
`;

export const ContentImage = styled.View`     
width: 100%;
display: flex;
justify-content: center;
align-items: center;
margin-top: 26px;
`;

export const Img = styled.Image`     
width: 145px;
height: 115px;
`;

export const ContentLoading = styled.View`
width: 100%;
height: 100%;
position: absolute;
display: flex;
background-color: rgba(255 ,255 ,255 , 0.8);
align-items: center;
`;

export const ContainerResponse = styled.View`
display: flex;
background-color: ${ColorTheme.Branco};
flex: 1;
padding: 0 12px 0 12px;
`;

export const TitleInitial = styled.Text`
color: ${ColorTheme.Chumbo};
font-size: 18px;
font-weight: 500;
text-align: center;
margin-top: 23px;
`;

export const TitleLabel = styled.Text`
color: ${ColorTheme.Preto};
font-size: 12px;
font-weight: 400;
text-align: center;
margin: 2px 0 20px 0;
`;

export const ContentLaters = styled.View`
width: 100%;
display: flex;
align-items: center;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
padding: 10px 0;
`;

export const Letter = styled.Image`
width: 90px;
height: 155px;
margin-right: 4px;
margin-left: 4px;
border-radius: 4px;
margin-bottom: 10px
`;

export const DescriptionLetter = styled.Text`
color: ${ColorTheme.Theme};
font-size: 17px;
font-weight: 500;
margin-bottom: 10px;
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

export const LetterResponse = styled.Image`
width: 200px;
height: 310px;
margin-right: 5px;
border-radius: 4px;
`;

export const TextLetter = styled.Text`
color: ${ColorTheme.Chumbo};
font-size: 16px;
font-weight: 300;
margin-bottom: 10px;
`;