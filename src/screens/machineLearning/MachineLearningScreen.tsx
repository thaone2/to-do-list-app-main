// import React from 'react';
// import {Image, TouchableOpacity, View} from 'react-native';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';
// import {colors} from '../../constants/colors';
// import Container from '../../components/Container';

// const MachineLearningScreen = () => {
//   return (
//     <View style={{flex: 1, backgroundColor: colors.bgColor}}>
//       <Container isScroll>
//         <View
//           style={[
//             {
//               flex: 0,
//               justifyContent: 'center',
//               alignItems: 'center',
//               paddingTop: 20,
//             },
//           ]}>
//           <Image
//             source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}
//             style={[
//               {
//                 width: 250,
//                 height: 150,
//               },
//             ]}
//           />
//           <Image
//             source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
//             style={[
//               {
//                 width: 250,
//                 height: 150,
//               },
//             ]}
//           />
//           <Image
//             source={require('../../assets/images/3.error-404-unscreen.gif')}
//             style={[
//               {
//                 width: 250,
//                 height: 150,
//               },
//             ]}
//           />
//           <Image
//             source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
//             style={[
//               {
//                 width: 250,
//                 height: 150,
//               },
//             ]}
//           />
//           <Image
//             source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
//             style={[
//               {
//                 width: 250,
//                 height: 150,
//               },
//             ]}
//           />
//         </View>
//         <TouchableOpacity style={{marginTop: 50, marginBottom: 20}}>
//           <TextComponent
//             text="Kiểm tra kết nối server"
//             styles={[
//               globalStyles.inputContainer,
//               {
//                 flex: 0,
//                 marginHorizontal: 14,
//                 textAlign: 'center',
//                 backgroundColor: '#BFC8BD',
//               },
//             ]}
//             color="black"
//             size={16}
//           />
//         </TouchableOpacity>
//         <TextComponent
//           text="Trạng thái kết nối: OK"
//           styles={{
//             color: 'gray',
//             flex: 0,
//             marginHorizontal: 14,
//             textAlign: 'center',
//             padding: 10,
//           }}
//           size={16}
//         />
//         <TouchableOpacity style={{marginTop: 20}}>
//           <TextComponent
//             text="Bắt đầu dự đoán"
//             styles={[
//               globalStyles.inputContainer,
//               {
//                 flex: 0,
//                 marginHorizontal: 14,
//                 textAlign: 'center',
//                 backgroundColor: '#6998FF',
//               },
//             ]}
//             color="white"
//             size={16}
//           />
//         </TouchableOpacity>

//         {/* kết quả */}
//       </Container>
//     </View>
//   );
// };

// export default MachineLearningScreen;

import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import axios from 'axios';

import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';
import {colors} from '../../constants/colors';
import Container from '../../components/Container';

const MachineLearningScreen = () => {
  const [gifState, setGifState] = useState('sleep'); // Trạng thái hiển thị GIF
  const [connectionStatus, setConnectionStatus] = useState('Chưa kiểm tra'); // Trạng thái kết nối

  const handleCheckConnection = async () => {
    setGifState('loading'); // Hiển thị GIF kiểm tra kết nối
    try {
      // Gửi yêu cầu đến máy chủ
      const response = await axios.get('http://192.168.1.7:5000/ping');
      if (response.status === 200) {
        setConnectionStatus('Kết nối thành công');
        setGifState('skateboard'); // Hiển thị GIF trượt ván
      } else {
        setConnectionStatus('Không thể kết nối với server');
        setGifState('error'); // Hiển thị GIF lỗi
      }
    } catch (error) {
      setConnectionStatus('Không thể kết nối với server');
      setGifState('error'); // Hiển thị GIF lỗi
    }
  };

  const handleStartLearning = () => {
    setGifState('learning'); // Hiển thị GIF học
    setTimeout(() => {
      setGifState('thinking'); // Sau khi học, hiển thị GIF suy nghĩ
    }, 15000); // Thời gian học giả định
  };

  const renderGif = () => {
    switch (gifState) {
      case 'sleep':
        return (
          <Image
            source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}
            style={styles.gif}
          />
        );
      case 'skateboard':
        return (
          <Image
            source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
            style={styles.gif}
          />
        );
      case 'error':
        return (
          <Image
            source={require('../../assets/images/3.error-404-unscreen.gif')}
            style={styles.gif}
          />
        );
      case 'learning':
        return (
          <Image
            source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
            style={styles.gif}
          />
        );
      case 'thinking':
        return (
          <Image
            source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
            style={styles.gif}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bgColor}}>
      <Container isScroll>
        <View
          style={{
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
          }}>
          {renderGif()}
        </View>
        <TouchableOpacity
          style={{marginTop: 50, marginBottom: 20}}
          onPress={handleCheckConnection}>
          <TextComponent
            text="Kiểm tra kết nối server"
            styles={[
              globalStyles.inputContainer,
              {
                flex: 0,
                marginHorizontal: 14,
                textAlign: 'center',
                backgroundColor: '#BFC8BD',
              },
            ]}
            color="black"
            size={16}
          />
        </TouchableOpacity>
        <TextComponent
          text={`Trạng thái: ${connectionStatus}`}
          styles={{
            color: connectionStatus === 'Kết nối thành công' ? 'green' : 'red',
            flex: 0,
            marginHorizontal: 14,
            textAlign: 'center',
            padding: 10,
          }}
          size={16}
        />
        <TouchableOpacity style={{marginTop: 20}} onPress={handleStartLearning}>
          <TextComponent
            text="Bắt đầu dự đoán"
            styles={[
              globalStyles.inputContainer,
              {
                flex: 0,
                marginHorizontal: 14,
                textAlign: 'center',
                backgroundColor: '#6998FF',
              },
            ]}
            color="white"
            size={16}
          />
        </TouchableOpacity>
      </Container>
    </View>
  );
};

const styles = {
  gif: {
    width: 250,
    height: 150,
  },
};

export default MachineLearningScreen;
