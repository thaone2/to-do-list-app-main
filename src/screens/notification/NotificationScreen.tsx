import React from 'react';
import {View} from 'react-native';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const NotificationScreen = () => {
  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <TextComponent
          styles={[
            globalStyles.inputContainer,
            {
              backgroundColor: 'white',
              marginHorizontal: 20,
            },
          ]}
          color="black"
          text="Hiện tại đang không có thông báo nào 😴🥶"
          size={16}
        />
        <View
          style={[
            globalStyles.inputContainer,
            {marginHorizontal: 20, marginVertical: 8, backgroundColor: 'white'},
          ]}>
          <TextComponent
            text="Nhiệt độ hiện tại đang cao"
            color="red"
            size={16}
          />
        </View>
      </Container>
    </View>
  );
};

export default NotificationScreen;
