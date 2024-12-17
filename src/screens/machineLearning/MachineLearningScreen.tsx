import axios from 'axios';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {globalStyles} from '../../styles/globalStyles';

const MachineLearningScreen = () => {
  const [gifState, setGifState] = useState('sleep');
  const [connectionStatus, setConnectionStatus] = useState('Chưa kiểm tra');
  const [predictionResult, setPredictionResult] = useState<any>({});

  const handleCheckConnection = async () => {
    setGifState('loading');
    try {
      const response = await axios.get('http://192.168.1.7:5000/ping');
      // const response = await axios.get('192.168.1.7:8000/ping');

      if (response.status === 200) {
        setConnectionStatus('Kết nối thành công');
        setGifState('skateboard');
      } else {
        setConnectionStatus('Không thể kết nối với server');
        setGifState('error');
      }
    } catch (error) {
      setConnectionStatus('Không thể kết nối với server');
      setGifState('error');
    }
  };

  const handleStartTrain = async () => {
    setGifState('learning');
    try {
      const response = await fetch('http://192.168.1.7:5000/train', {
        // const response = await fetch('http://192.168.1.7:8000/train', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setPredictionResult(result);

      if (response.ok) {
        setConnectionStatus('Dự đoán thành công');
        setGifState('thinking');
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
      setGifState('crying');
      setConnectionStatus('Dự đoán không thành công');
      // setPredictionResult('');
    }
    // setGifState('thinking');
    // setConnectionStatus('Dự đoán thành công');
  };

  const handlePrepareData = async () => {
    setGifState('ok'); // Giả sử thay đổi trạng thái gif khi chuẩn bị dữ liệu

    try {
      const response = await fetch('http://192.168.1.7:5000/prepare_data', {
        // const response = await fetch('http://192.168.1.7:8000/prepare_data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Data prepared successfully:', data);
        // Có thể xử lý thêm ở đây nếu cần
        setConnectionStatus('Chuẩn bị dữ liệu thành công');
        setGifState('ok');
      } else {
        const errorData = await response.json();
        // console.error('Error preparing data:', errorData);
        setConnectionStatus('Chuẩn bị dữ liệu không thành công');
        setGifState('crying');
        // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      // console.error('Error:', error);
      setConnectionStatus('Chuẩn bị dữ liệu không thành công');
      setGifState('crying');
    }
  };

  // const renderGif = () => {
  //   switch (gifState) {
  //     case 'sleep':
  //       return (
  //         <Image
  //           // source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}

  //           source={require('../../assets/images/Orbo-vui-unscreen.gif')}
  //           style={styles.gif}
  //         />
  //       );
  //     case 'skateboard':
  //       return (
  //         <Image
  //           source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
  //           style={styles.gif}
  //         />
  //       );
  //     case 'error':
  //       return (
  //         <Image
  //           // source={require('../../assets/images/3.error-404-unscreen.gif')}
  //           source={require('../../assets/images/404-error-unscreen.gif')}
  //           style={styles.gif}
  //         />
  //       );
  //     case 'learning':
  //       return (
  //         <Image
  //           source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
  //           style={styles.gif}
  //         />
  //       );
  //     case 'thinking':
  //       return (
  //         <Image
  //           source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
  //           style={styles.gif}
  //         />
  //       );
  //     case 'ok':
  //       return (
  //         <Image
  //           source={require('../../assets/images/Orbo-ok-unscreen.gif')}
  //           style={styles.gif}
  //         />
  //       );
  //     case 'crying':
  //       return (
  //         <Image
  //           source={require('../../assets/images/Crying-Orbo-unscreen.gif')}
  //           style={styles.gif}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const renderGif = () => {
    const gifMapping: Record<string, any> = {
      sleep: require('../../assets/images/Orbo-vui-unscreen.gif'),
      skateboard: require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif'),
      error: require('../../assets/images/404-error-unscreen.gif'),
      learning: require('../../assets/images/4.robot-quay-dau-unscreen.gif'),
      thinking: require('../../assets/images/5.Orbo-suynghi-unscreen.gif'),
      ok: require('../../assets/images/Orbo-ok-unscreen.gif'),
      crying: require('../../assets/images/Crying-Orbo-unscreen.gif'),
    };

    // Kiểm tra nếu gifState không có trong gifMapping, trả về hình ảnh mặc định
    const gifSource =
      gifMapping[gifState] ||
      require('../../assets/images/Orbo-vui-unscreen.gif');

    return <Image source={gifSource} style={styles.gif} />;
  };

  const renderTable = () => {
    // console.log(predictionResult);
    return Object.keys(predictionResult).map((date, index) => {
      const machines = predictionResult[date];
      return (
        <View
          key={index}
          style={{
            marginTop: 10,
            marginHorizontal: -20,
            borderRadius: 12,
          }}>
          <View
            style={{
              paddingVertical: 8,
              borderRadius: 12,
            }}>
            <Text style={[styles.dateText, {color: 'black'}]}>{date}</Text>
          </View>

          <View style={{backgroundColor: '#26495c'}}>
            <View
              style={[
                styles.machineRow,
                {
                  alignItems: 'center',
                },
              ]}>
              <Text style={[styles.machineCell, {flex: 1, color: 'white'}]}>
                Tên máy
              </Text>
              <Text style={[styles.machineCell, {flex: 1, color: 'white'}]}>
                Dự đoán thời gian sử dụng
              </Text>
              <Text style={[styles.machineCell, {flex: 1, color: 'white'}]}>
                Dự đoán tần suất sử dụng
              </Text>
            </View>

            {Object.keys(machines).map((computer, compIndex) => {
              const {usage_level, predicted_time_hours} = machines[computer];
              return (
                <View
                  key={compIndex}
                  style={[styles.machineRow, {backgroundColor: '#a2d5c6'}]}>
                  <Text
                    style={[
                      styles.machineCell,
                      {flex: 1, color: 'black', textTransform: 'capitalize'},
                    ]}>
                    {computer}
                  </Text>
                  <Text style={[styles.machineCell, {flex: 1, color: 'black'}]}>
                    ~ {predicted_time_hours} giờ
                  </Text>
                  <Text style={[styles.machineCell, {flex: 1, color: 'black'}]}>
                    {usage_level}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bgColor}}>
      <Container isScroll>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 130,
              width: 130,
            }}>
            {renderGif()}
          </View>
        </View>
        <TextComponent
          text={`Trạng thái: ${connectionStatus}`}
          styles={{
            color:
              connectionStatus === 'Kết nối thành công'
                ? 'green'
                : connectionStatus === 'Chuẩn bị dữ liệu thành công'
                ? 'green'
                : connectionStatus === 'Dự đoán thành công'
                ? 'green'
                : 'red',
            flex: 0,
            marginHorizontal: 14,
            textAlign: 'center',
            padding: 10,
          }}
          size={16}
        />

        <TouchableOpacity
          style={{marginTop: 10, marginBottom: 10}}
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

        <TouchableOpacity
          style={{
            opacity:
              connectionStatus === 'Kết nối thành công'
                ? 1
                : connectionStatus === 'Chuẩn bị dữ liệu thành công'
                ? 1
                : connectionStatus === 'Dự đoán thành công'
                ? 1
                : 0.3,
          }}
          onPress={handlePrepareData}
          disabled={connectionStatus !== 'Kết nối thành công'}>
          <TextComponent
            text="Chuẩn bị dữ liệu"
            styles={[
              globalStyles.inputContainer,
              {
                flex: 0,
                marginHorizontal: 14,
                textAlign: 'center',
                backgroundColor: '#699888',
              },
            ]}
            color="white"
            size={16}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 10,
            opacity:
              connectionStatus === 'Chuẩn bị dữ liệu thành công' ? 1 : 0.3,
          }}
          onPress={handleStartTrain}
          disabled={connectionStatus !== 'Chuẩn bị dữ liệu thành công'}>
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

        {connectionStatus === 'Dự đoán thành công' &&
          predictionResult &&
          Object.keys(predictionResult).length > 0 && (
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 40,
                marginBottom: 20,
                flex: 1,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'green',
                  fontSize: 17,
                  textTransform: 'uppercase',
                }}>
                Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
              </Text>
              {renderTable()}
            </View>
          )}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  gif: {
    width: 130,
    height: 130,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    flex: 0,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
  },
  dateText: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 10,
    fontSize: 18,
  },
  machineRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  machineCell: {
    textAlign: 'center',
    fontSize: 14,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default MachineLearningScreen;
