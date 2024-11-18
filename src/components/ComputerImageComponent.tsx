import {
  View,
  ImageBackground,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
  color?: string;
  styles?: StyleProp<ViewStyle>;
  disable?: boolean;
}

const screenWidth = Dimensions.get('window').width;

const ComputerImageComponent = (props: Props) => {
  const {children, color, styles, disable} = props;

  return (
    <ImageBackground
      source={require('../assets/images/computer-lab.png')}
      imageStyle={{borderRadius: 12, opacity: disable ? 0.5 : 1}} // Thay đổi opacity khi disable
      style={[
        globalStyles.card,
        styles,
        {
          backgroundColor: disable ? 'rgba(0,0,0,0.5)' : color,
          borderRadius: disable ? 12 : 0,
        },
      ]}>
      <View
        style={{
          borderRadius: 12,
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: screenWidth / 22,
        }}>
        {/* Nếu disable, thêm lớp TouchableWithoutFeedback */}
        {disable ? (
          <TouchableWithoutFeedback>
            <View style={{flex: 1}}>{children}</View>
          </TouchableWithoutFeedback>
        ) : (
          children
        )}
      </View>
    </ImageBackground>
  );
};

export default ComputerImageComponent;
