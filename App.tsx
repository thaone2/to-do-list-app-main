import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import Orientation from 'react-native-orientation-locker';

import {colors} from './src/constants/colors';
import Router from './src/routers/Router';

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait(); // Khóa hướng dọc khi màn hình được load
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }
  // useEffect(() => {
  //   requestUserPermission;
  // }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bgColor}}>
        {/* <StatusBar barStyle="light-content" backgroundColor={colors.bgColor} />  */}
        <StatusBar barStyle="dark-content" backgroundColor={colors.bgColor} />
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default App;
