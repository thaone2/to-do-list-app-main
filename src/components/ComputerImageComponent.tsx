import {View, Text, ImageBackground, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
  color?: string;
  styles?: StyleProp<ViewStyle>;
}

const ComputerImageComponent = (props: Props) => {
  const {children, color, styles} = props;
  return (
    <ImageBackground
      source={require('../assets/images/computer-lab.png')}
      imageStyle={{borderRadius: 12}}
      style={[globalStyles.card, styles]}>
      <View
        style={[
          {
            // backgroundColor: color ?? 'rgba(23, 73, 230, 0.3)',
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

export default ComputerImageComponent;
