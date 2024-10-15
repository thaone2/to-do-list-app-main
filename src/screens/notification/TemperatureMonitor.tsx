import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

const TemperatureMonitor = () => {
  useEffect(() => {
    const temperatureRef = database().ref('/Temperatures');

    // Lắng nghe sự thay đổi dữ liệu từ Firebase
    const onValueChange = temperatureRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        checkTemperature(data);
      }
    });

    return () => {
      temperatureRef.off('value', onValueChange);
    };
  }, []);

  // Kiểm tra nhiệt độ và gửi thông báo nếu quá cao
  const checkTemperature = (data: {[x: string]: any}) => {
    Object.keys(data).forEach(key => {
      const computerData = data[key];

      // Kiểm tra nếu nhiệt độ vượt quá 80 hoặc dưới 1
      if (computerData.temperature >= 80 || computerData.temperature <= 1) {
        sendNotification(computerData, key);
      }
    });
  };

  // Gửi thông báo cho người dùng
  const sendNotification = (
    computerData: {temperature: any},
    computerId: string,
  ) => {
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM Token:', token);

        // Gửi thông báo đẩy đến người dùng
        messaging().sendMessage({
          token,
          notification: {
            title: `Nhiệt độ cao từ ${computerId}`,
            body: `Máy tính ${computerId} có nhiệt độ ${computerData.temperature}°C, vui lòng kiểm tra ngay!`,
          },
        });
      });
  };

  return null;
};

export default TemperatureMonitor;
