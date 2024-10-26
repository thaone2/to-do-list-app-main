import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

const TemperatureMonitor = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  useEffect(() => {
    const temperatureRef = database().ref('Temperatures');

    // Lắng nghe sự thay đổi của nhiệt độ
    const onValueChange = temperatureRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        checkTemperature(data);
      }
    });

    return () => temperatureRef.off('value', onValueChange);
  }, []);

  // Kiểm tra nếu nhiệt độ vượt quá 80 hoặc dưới 1
  const checkTemperature = (data: any) => {
    Object.keys(data).forEach(key => {
      const computerData = data[key];

      if (computerData) {
        const {computer1, computer2, computer3, computer4} = computerData;

        if (computer1.temperature >= 80 || computer1.temperature <= 1) {
          sendNotification(
            'computer1',
            computer1.temperature,
            'Cảnh báo nhiệt độ',
          );
        }

        if (computer2.temperature >= 80 || computer2.temperature <= 1) {
          sendNotification(
            'computer2',
            computer2.temperature,
            'Cảnh báo nhiệt độ',
          );
        }

        if (computer3.temperature >= 80 || computer3.temperature <= 1) {
          sendNotification(
            'computer3',
            computer3.temperature,
            'Cảnh báo nhiệt độ',
          );
        }

        if (computer4.temperature >= 80 || computer4.temperature <= 1) {
          sendNotification(
            'computer4',
            computer4.temperature,
            'Cảnh báo nhiệt độ',
          );
        }
      }
    });
  };

  // Gửi thông báo qua FCM bằng REST API
  const sendNotification = async (
    computerId: string,
    temperature: number,
    message: string,
  ) => {
    try {
      const token = await messaging().getToken();

      const notificationBody = {
        to: token, // Token của thiết bị nhận thông báo
        notification: {
          title: `${message} ở máy tính ${computerId}`,
          body: `Máy tính ${computerId} có nhiệt độ là ${temperature}°C. Vui lòng kiểm tra!`,
          sound: 'default',
        },
        priority: 'high',
      };

      // Gửi yêu cầu HTTP đến FCM
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=YOUR_SERVER_KEY`, // Thay YOUR_SERVER_KEY bằng server key từ Firebase Console
        },
        body: JSON.stringify(notificationBody),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return null;
};

export default TemperatureMonitor;
