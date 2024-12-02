import React, {ReactNode} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {colors} from '../constants/colors';
import TextComponent from './TextComponent';

interface Props {
  text: string;
  icon?: ReactNode;
  onPress: () => void;
  color?: string;
  isLoading?: boolean;
  backgroundColor?: string;
  styles?: StyleProp<ViewStyle>;
}

const ButtonComponent = (props: Props) => {
  const {text, icon, onPress, color, isLoading, backgroundColor, styles} =
    props;

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={onPress}
      style={[
        styles,
        {
          padding: 16,
          width: '100%',
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: backgroundColor ? backgroundColor : 'white',
        },
      ]}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TextComponent
          text={text}
          flex={0}
          size={16}
          styles={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: color ? color : isLoading ? colors.gray2 : colors.blue,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
