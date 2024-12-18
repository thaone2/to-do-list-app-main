import React, {useEffect, useState} from 'react';
import {Alert, Image, TouchableOpacity, View, StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const ProfileImage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // Lấy URL ảnh đại diện từ Firebase Storage
    const fetchAvatar = async () => {
      const user = auth().currentUser;
      if (user?.photoURL) {
        setAvatarUrl(user.photoURL);
      }
    };
    fetchAvatar();
  }, []);

  const handleChoosePhoto = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });
      if (image.path) {
        await uploadImageToFirebase(image.path);
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Lỗi', 'Không thể chọn ảnh');
      }
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });
      if (image.path) {
        await uploadImageToFirebase(image.path);
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Lỗi', 'Không thể chụp ảnh');
      }
    }
  };

  const handleRemovePhoto = async () => {
    const user = auth().currentUser;
    if (user) {
      await user.updateProfile({photoURL: null});
      setAvatarUrl(null);
      Alert.alert('Thành công', 'Ảnh đại diện đã được xóa.');
    }
  };

  const uploadImageToFirebase = async (uri: string) => {
    const user = auth().currentUser;
    if (!user) return;

    const fileName = `avatars/${user.uid}.jpg`;
    const reference = storage().ref(fileName);

    try {
      await reference.putFile(uri); // Upload file lên Firebase Storage
      const url = await reference.getDownloadURL(); // Lấy URL sau khi upload
      await user.updateProfile({photoURL: url}); // Cập nhật URL vào Firebase Auth
      setAvatarUrl(url); // Cập nhật ảnh hiển thị
      Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật.');
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên.');
    }
  };

  const handleAvatarOptions = () => {
    Alert.alert('Cài đặt ảnh đại diện', 'Chọn một hành động', [
      {text: 'Chụp ảnh', onPress: handleTakePhoto},
      {text: 'Chọn ảnh từ thư viện', onPress: handleChoosePhoto},
      {text: 'Xóa ảnh đại diện', onPress: handleRemovePhoto},
      {text: 'Hủy', style: 'cancel'},
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAvatarOptions}>
        <Image
          source={
            avatarUrl
              ? {uri: avatarUrl}
              : require('../../assets/images/robot.gif') // Ảnh mặc định
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
  },
});

export default ProfileImage;
