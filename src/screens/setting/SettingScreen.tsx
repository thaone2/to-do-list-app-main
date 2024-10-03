import auth from '@react-native-firebase/auth';
import {Logout} from 'iconsax-react-native';
import React from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';

import Container from '../../components/Container';
import RowComponent from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const SettingScreen = () => {
  // const handleSingout = async () => {
  //   await auth().signOut();
  // };

  const handleDangXuat = () => {
    Alert.alert('Xác nhận', 'Bạn có thật sự muốn đăng xuất không?', [
      {text: 'Hủy', style: 'cancel'},
      {text: 'Đồng ý', onPress: async () => await auth().signOut()},
    ]);
  };
  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <TouchableOpacity onPress={handleDangXuat}>
          <RowComponent
            styles={[
              globalStyles.inputContainer,
              {
                // paddingVertical: 20,
                paddingHorizontal: 20,
                backgroundColor: 'white',
                marginHorizontal: 20,
                marginVertical: 20,
              },
            ]}>
            <TextComponent text="Đăng xuất" color="black" size={20} />

            <Logout size={34} color="black" />
          </RowComponent>
        </TouchableOpacity>
        <TextComponent
          styles={[
            globalStyles.inputContainer,
            {
              backgroundColor: '#DEDEDF',
              marginHorizontal: 20,
              // marginVertical: 20,
            },
          ]}
          color="black"
          text="Chào bạn, chúc bạn một ngày tốt lành khi sử dụng ứng dụng lỏ này của tụi mình 😂🙂"
          size={20}
        />
      </Container>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
