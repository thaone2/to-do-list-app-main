import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import {colors} from '../../constants/colors';
import {
  ChartSquare,
  Home2,
  Notification1,
  Setting3,
} from 'iconsax-react-native';

const ChartScreen = ({navigation}: any) => {
  return (
    <View style={{flex: 1}}>
      <Container>
        <Text>ChartScreen</Text>
      </Container>
      {/* <View
        style={{
          position: 'relative',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 25,
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: colors.bgColor,
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Home2 size="32" color={colors.blue} variant="Bold" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChartScreen')}>
          <ChartSquare size="32" color={colors.gray2} variant="Bold" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Notification1 size="32" color={colors.gray2} variant="Bold" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Setting3 size="32" color={colors.gray2} variant="Bold" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default ChartScreen;
