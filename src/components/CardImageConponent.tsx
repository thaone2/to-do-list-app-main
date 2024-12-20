import React, {ReactNode} from 'react';
import {ImageBackground, StyleProp, View, ViewStyle} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
interface Props {
  children: ReactNode;
  color?: string;
  styles?: StyleProp<ViewStyle>;
}

const CardImageConponent = (props: Props) => {
  const {children, color, styles} = props;

  return (
    <ImageBackground
      source={require('../assets/images/card-bg.png')}
      // source={require('../assets/images/loadingMeo-unscreen.gif')}
      imageStyle={{borderRadius: 12}}
      style={[globalStyles.card, styles]}>
      <View
        style={[
          {
            backgroundColor: color ?? 'rgba(113, 77, 217, 0.9)',
            borderRadius: 12,
            flex: 1,
            padding: 12,
          },
        ]}>
        {children}
      </View>
    </ImageBackground>
  );
};

export default CardImageConponent;
