import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import TextComponent from '../../components/TextComponent';
import auth from '@react-native-firebase/auth';
import {Logout} from 'iconsax-react-native';
import InputComponent from '../../components/InputComponent';
import RowComponent from '../../components/RowComponent';
import {globalStyles} from '../../styles/globalStyles';
import {colors} from '../../constants/colors';
import Container from '../../components/Container';
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
                backgroundColor: '#D3E0E2',
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
              backgroundColor: 'orange',
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
