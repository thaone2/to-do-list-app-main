import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {colors} from './src/constants/colors';
import Router from './src/routers/Router';
import Orientation from 'react-native-orientation-locker';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
const App = () => {
  // useEffect cho màn hình đứng
  useEffect(() => {
    Orientation.lockToPortrait(); // Khóa hướng dọc khi màn hình được load
    // cleanup function
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // useEff lấy token cho message
  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };
    getToken();
    // Lắng nghe tin nhắn khi ứng dụng chạy nền
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('Thông báo', JSON.stringify(remoteMessage.notification));
    // });
    // return unsubscribe;
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  useEffect(() => {
    requestUserPermission;
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bgColor}}>
        {/* <StatusBar barStyle="light-content" backgroundColor={colors.bgColor} /> */}
        <StatusBar barStyle="dark-content" backgroundColor={colors.bgColor} />
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default App;
