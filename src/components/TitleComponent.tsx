import React from 'react';
import {fontFamilies} from '../constants/fontFamilies';
import TextComponent from './TextComponent';

interface Props {
  text: string;
  font?: string;
  size?: number;
  color?: string;
  flex?: number;
}

const TitleComponent = (props: Props) => {
  const {text, font, size, color, flex} = props;

  return (
    <TextComponent
      size={size ?? 20}
      font={font ?? fontFamilies.semiBold}
      color={color}
      text={text}
      flex={flex ?? 1}
    />
  );
};

export default TitleComponent;
