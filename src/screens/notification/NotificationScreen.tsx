// // import React from 'react';
// // import {View} from 'react-native';
// // import Container from '../../components/Container';
// // import TextComponent from '../../components/TextComponent';
// // import {globalStyles} from '../../styles/globalStyles';

// // const NotificationScreen = () => {
// //   return (
// //     <View style={{flex: 1}}>
// //       <Container isScroll>
// //         <TextComponent
// //           styles={[
// //             globalStyles.inputContainer,
// //             {
// //               backgroundColor: 'white',
// //               marginHorizontal: 20,
// //               // marginVertical: 20,
// //             },
// //           ]}
// //           color="black"
// //           text="Hiện tại đang không có thông báo nào 😴🥶"
// //           size={20}
// //         />
// //       </Container>
// //     </View>
// //   );
// // };

// // export default NotificationScreen;

import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const NotificationScreen = () => {
  // useEffect(() => {
  //   // Yêu cầu quyền nhận thông báo từ Firebase Messaging
  //   requestUserPermission();

  //   // Lắng nghe dữ liệu từ Firebase Database
  //   const temperatureRef = database().ref('/Temperatures');
  //   const onValueChange = temperatureRef.on('value', snapshot => {
  //     const data = snapshot.val();
  //     if (data) {
  //       checkTemperature(data); // Kiểm tra nhiệt độ
  //     }
  //   });

  //   return () => {
  //     temperatureRef.off('value', onValueChange); // Ngắt lắng nghe khi component unmount
  //   };
  // }, []);

  // // Yêu cầu quyền nhận thông báo
  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // };

  // // Kiểm tra nhiệt độ và gửi thông báo nếu vượt ngưỡng
  // const checkTemperature = (data: any) => {
  //   Object.keys(data).forEach(key => {
  //     const computerData = data[key];
  //     if (computerData.temperature >= 80 || computerData.temperature <= 1) {
  //       sendNotification(computerData, key); // Gửi thông báo nếu nhiệt độ vượt ngưỡng
  //     }
  //   });
  // };

  // // Gửi thông báo đến thiết bị người dùng
  // const sendNotification = (computerData: any, computerId: string) => {
  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       console.log('FCM Token:', token);

  //       // Hiển thị thông báo cục bộ
  //       Alert.alert(
  //         `Cảnh báo nhiệt độ máy ${computerId}`,
  //         `Máy tính ${computerId} có nhiệt độ ${computerData.temperature}°C. Kiểm tra ngay!`,
  //       );

  //       // Gửi thông báo qua FCM
  //       fetch('https://fcm.googleapis.com/fcm/send', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'key=YOUR_SERVER_KEY', // Thay YOUR_SERVER_KEY bằng Firebase server key của bạn
  //         },
  //         body: JSON.stringify({
  //           to: token,
  //           notification: {
  //             title: `Cảnh báo nhiệt độ từ ${computerId}`,
  //             body: `Máy tính ${computerId} có nhiệt độ ${computerData.temperature}°C, vui lòng kiểm tra ngay!`,
  //             priority: 'high',
  //           },
  //           data: {
  //             temperature: computerData.temperature,
  //             computerId: computerId,
  //           },
  //         }),
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error sending notification:', error);
  //     });
  // };

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
          size={20}
        />
      </Container>
    </View>
  );
};

export default NotificationScreen;
