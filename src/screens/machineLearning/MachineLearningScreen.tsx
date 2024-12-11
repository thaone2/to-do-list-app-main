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

// import axios from 'axios';
// import React, {useState} from 'react';
// import {Image, Text, TouchableOpacity, View} from 'react-native';

// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {colors} from '../../constants/colors';
// import {globalStyles} from '../../styles/globalStyles';

// const MachineLearningScreen = () => {
//   const [gifState, setGifState] = useState('sleep'); // Trạng thái hiển thị GIF
//   const [connectionStatus, setConnectionStatus] = useState('Chưa kiểm tra'); // Trạng thái kết nối

//   const [predictionResult, setPredictionResult] = useState<any>({});

//   const handleCheckConnection = async () => {
//     setGifState('loading'); // Hiển thị GIF kiểm tra kết nối
//     try {
//       // Gửi yêu cầu đến máy chủ
//       const response = await axios.get('http://192.168.1.7:5000/ping');
//       if (response.status === 200) {
//         setConnectionStatus('Kết nối thành công');
//         setGifState('skateboard'); // Hiển thị GIF trượt ván
//       } else {
//         setConnectionStatus('Không thể kết nối với server');
//         setGifState('error'); // Hiển thị GIF lỗi
//       }
//     } catch (error) {
//       setConnectionStatus('Không thể kết nối với server');
//       setGifState('error'); // Hiển thị GIF lỗi
//     }
//   };
//   const handleStartTrain = async () => {
//     setGifState('learning');
//     try {
//       // Lấy dữ liệu từ server Python (không gửi dữ liệu gì, chỉ nhận kết quả dự đoán)
//       const response = await fetch('http://192.168.1.7:5000/train', {
//         method: 'GET', // Chỉ là GET, không gửi dữ liệu gì
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Lỗi khi nhận dữ liệu từ server');
//         setGifState('error');
//       }

//       const result = await response.json();
//       setPredictionResult(result); // Lưu kết quả vào state để render
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setGifState('error');
//     }
//     setGifState('thinking');
//   };

//   const renderGif = () => {
//     switch (gifState) {
//       case 'sleep':
//         return (
//           <Image
//             source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'skateboard':
//         return (
//           <Image
//             source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'error':
//         return (
//           <Image
//             source={require('../../assets/images/3.error-404-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'learning':
//         return (
//           <Image
//             source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'thinking':
//         return (
//           <Image
//             source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: colors.bgColor}}>
//       <Container isScroll>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: 130,
//               width: 130,
//             }}>
//             {renderGif()}
//           </View>
//         </View>

//         <TouchableOpacity
//           style={{marginTop: 10, marginBottom: 10}}
//           onPress={handleCheckConnection}>
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
//           text={`Trạng thái: ${connectionStatus}`}
//           styles={{
//             color: connectionStatus === 'Kết nối thành công' ? 'green' : 'red',
//             flex: 0,
//             marginHorizontal: 14,
//             textAlign: 'center',
//             padding: 10,
//           }}
//           size={16}
//         />

//         <TouchableOpacity style={{marginTop: 10}} onPress={handleStartTrain}>
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
//         {predictionResult && Object.keys(predictionResult).length > 0 && (
//           <View style={{marginTop: 20}}>
//             <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//               Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
//             </Text>
//             {Object.keys(predictionResult).map(date => (
//               <View key={date}>
//                 <Text style={{fontWeight: 'bold'}}>{date}:</Text>
//                 {Object.keys(predictionResult[date]).map(computer => {
//                   const {usage_level, predicted_time_hours} =
//                     predictionResult[date][computer];
//                   return (
//                     <Text key={computer}>
//                       Máy {computer}: Dự đoán sử dụng {usage_level}, Thời gian
//                       sử dụng: ~ {predicted_time_hours} giờ
//                     </Text>
//                   );
//                 })}
//               </View>
//             ))}
//           </View>
//         )}
//       </Container>
//     </View>
//   );
// };

// const styles = {
//   gif: {
//     width: 130,
//     height: 130,
//   },
// };

// export default MachineLearningScreen;

// import axios from 'axios';
// import React, {useState} from 'react';
// import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';

// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {colors} from '../../constants/colors';
// import {globalStyles} from '../../styles/globalStyles';

// const MachineLearningScreen = () => {
//   const [gifState, setGifState] = useState('sleep'); // Trạng thái hiển thị GIF
//   const [connectionStatus, setConnectionStatus] = useState('Chưa kiểm tra'); // Trạng thái kết nối

//   const [predictionResult, setPredictionResult] = useState<any>({});

//   const handleCheckConnection = async () => {
//     setGifState('loading'); // Hiển thị GIF kiểm tra kết nối
//     try {
//       // Gửi yêu cầu đến máy chủ
//       const response = await axios.get('http://192.168.1.7:5000/ping');
//       if (response.status === 200) {
//         setConnectionStatus('Kết nối thành công');
//         setGifState('skateboard'); // Hiển thị GIF trượt ván
//       } else {
//         setConnectionStatus('Không thể kết nối với server');
//         setGifState('error'); // Hiển thị GIF lỗi
//       }
//     } catch (error) {
//       setConnectionStatus('Không thể kết nối với server');
//       setGifState('error'); // Hiển thị GIF lỗi
//     }
//   };

//   const handleStartTrain = async () => {
//     setGifState('learning');
//     try {
//       // Lấy dữ liệu từ server Python (không gửi dữ liệu gì, chỉ nhận kết quả dự đoán)
//       const response = await fetch('http://192.168.1.7:5000/train', {
//         method: 'GET', // Chỉ là GET, không gửi dữ liệu gì
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Lỗi khi nhận dữ liệu từ server');
//         setGifState('error');
//       }

//       const result = await response.json();
//       setPredictionResult(result); // Lưu kết quả vào state để render
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setGifState('error');
//     }
//     setGifState('thinking');
//   };

//   const renderGif = () => {
//     switch (gifState) {
//       case 'sleep':
//         return (
//           <Image
//             source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'skateboard':
//         return (
//           <Image
//             source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'error':
//         return (
//           <Image
//             source={require('../../assets/images/3.error-404-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'learning':
//         return (
//           <Image
//             source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'thinking':
//         return (
//           <Image
//             source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: colors.bgColor}}>
//       <Container isScroll>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: 130,
//               width: 130,
//             }}>
//             {renderGif()}
//           </View>
//         </View>

//         <TouchableOpacity
//           style={{marginTop: 10, marginBottom: 10}}
//           onPress={handleCheckConnection}>
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
//           text={`Trạng thái: ${connectionStatus}`}
//           styles={{
//             color: connectionStatus === 'Kết nối thành công' ? 'green' : 'red',
//             flex: 0,
//             marginHorizontal: 14,
//             textAlign: 'center',
//             padding: 10,
//           }}
//           size={16}
//         />

//         <TouchableOpacity
//           style={{
//             marginTop: 10,
//             opacity: connectionStatus === 'Kết nối thành công' ? 1 : 0.3,
//           }}
//           onPress={handleStartTrain}
//           disabled={connectionStatus !== 'Kết nối thành công'}>
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

//         {predictionResult && Object.keys(predictionResult).length > 0 && (
//           <View style={{marginTop: 20}}>
//             <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//               Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
//             </Text>
//             <View style={styles.table}>
//               <View style={styles.tableHeader}>
//                 <Text style={styles.tableCell}>Ngày</Text>
//                 <Text style={styles.tableCell}>Máy</Text>
//                 <Text style={styles.tableCell}>Dự đoán sử dụng</Text>
//                 <Text style={styles.tableCell}>Thời gian sử dụng</Text>
//               </View>
//               {Object.keys(predictionResult).map(date => (
//                 <View key={date} style={styles.tableRow}>
//                   {Object.keys(predictionResult[date]).map(computer => {
//                     const {usage_level, predicted_time_hours} =
//                       predictionResult[date][computer];
//                     return (
//                       <View key={computer} style={styles.tableRow}>
//                         <Text style={styles.tableCell}>{date}</Text>
//                         <Text style={styles.tableCell}>Máy {computer}</Text>
//                         <Text style={styles.tableCell}>{usage_level}</Text>
//                         <Text style={styles.tableCell}>
//                           ~ {predicted_time_hours} giờ
//                         </Text>
//                       </View>
//                     );
//                   })}
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}
//       </Container>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   gif: {
//     width: 130,
//     height: 130,
//   },
//   table: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     justifyContent: 'space-between',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   tableCell: {
//     flex: 1,
//     textAlign: 'center',
//   },
// });

// export default MachineLearningScreen;

// import React, {useState} from 'react';
// import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
// import axios from 'axios';
// import {Table, Row, Rows} from 'react-native-table-component';

// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {colors} from '../../constants/colors';
// import {globalStyles} from '../../styles/globalStyles';

// const MachineLearningScreen = () => {
//   const [gifState, setGifState] = useState('sleep');
//   const [connectionStatus, setConnectionStatus] = useState('Chưa kiểm tra');
//   const [predictionResult, setPredictionResult] = useState<any>({});

//   const handleCheckConnection = async () => {
//     setGifState('loading');
//     try {
//       const response = await axios.get('http://192.168.1.7:5000/ping');
//       if (response.status === 200) {
//         setConnectionStatus('Kết nối thành công');
//         setGifState('skateboard');
//       } else {
//         setConnectionStatus('Không thể kết nối với server');
//         setGifState('error');
//       }
//     } catch (error) {
//       setConnectionStatus('Không thể kết nối với server');
//       setGifState('error');
//     }
//   };

//   const handleStartTrain = async () => {
//     setGifState('learning');
//     try {
//       const response = await fetch('http://192.168.1.7:5000/train', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Lỗi khi nhận dữ liệu từ server');
//         setGifState('error');
//       }

//       const result = await response.json();
//       setPredictionResult(result);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setGifState('error');
//     }
//     setGifState('thinking');
//   };

//   const renderGif = () => {
//     switch (gifState) {
//       case 'sleep':
//         return (
//           <Image
//             source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'skateboard':
//         return (
//           <Image
//             source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'error':
//         return (
//           <Image
//             source={require('../../assets/images/3.error-404-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'learning':
//         return (
//           <Image
//             source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'thinking':
//         return (
//           <Image
//             source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   // Table header and data preparation
//   const tableHead = ['Ngày', 'Máy', 'Dự đoán sử dụng', 'Thời gian sử dụng'];
//   const tableData = Object.keys(predictionResult)
//     .map(date => {
//       return Object.keys(predictionResult[date]).map(computer => {
//         const {usage_level, predicted_time_hours} =
//           predictionResult[date][computer];
//         return [
//           date,
//           `Máy ${computer}`,
//           usage_level,
//           `~ ${predicted_time_hours} giờ`,
//         ];
//       });
//     })
//     .flat();

//   return (
//     <View style={{flex: 1, backgroundColor: colors.bgColor}}>
//       <Container isScroll>
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: 130,
//               width: 130,
//             }}>
//             {renderGif()}
//           </View>
//         </View>

//         <TouchableOpacity
//           style={{marginTop: 10, marginBottom: 10}}
//           onPress={handleCheckConnection}>
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
//           text={`Trạng thái: ${connectionStatus}`}
//           styles={{
//             color: connectionStatus === 'Kết nối thành công' ? 'green' : 'red',
//             flex: 0,
//             marginHorizontal: 14,
//             textAlign: 'center',
//             padding: 10,
//           }}
//           size={16}
//         />

//         <TouchableOpacity
//           style={{
//             marginTop: 10,
//             opacity: connectionStatus === 'Kết nối thành công' ? 1 : 0.3,
//           }}
//           onPress={handleStartTrain}
//           disabled={connectionStatus !== 'Kết nối thành công'}>
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

//         {predictionResult && Object.keys(predictionResult).length > 0 && (
//           <View style={{marginTop: 20}}>
//             <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//               Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
//             </Text>
//             <Table
//               borderStyle={{
//                 borderWidth: 1,
//                 borderColor: '#ddd',
//                 borderRadius: 5,
//                 overflow: 'hidden',
//               }}>
//               <Row
//                 data={tableHead}
//                 style={styles.tableHeader}
//                 textStyle={styles.text}
//               />
//               <Rows data={tableData} textStyle={styles.text} />
//             </Table>
//           </View>
//         )}
//       </Container>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   gif: {
//     width: 130,
//     height: 130,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     justifyContent: 'space-between',
//   },
//   text: {
//     textAlign: 'center',
//     padding: 10,
//   },
// });

// export default MachineLearningScreen;

/* {predictionResult && Object.keys(predictionResult).length > 0 && (
          <View style={{marginTop: 20}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
              Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
            </Text>
            {Object.keys(predictionResult).map(date => (
              <View key={date}>
                <Text style={{fontWeight: 'bold'}}>{date}:</Text>
                {Object.keys(predictionResult[date]).map(computer => {
                  const {usage_level, predicted_time_hours} =
                    predictionResult[date][computer];
                  return (
                    <Text key={computer}>
                      Máy {computer}: Dự đoán sử dụng {usage_level}, Thời gian
                      sử dụng: ~ {predicted_time_hours} giờ
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        )} */

// import React, {useState} from 'react';
// import {
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import axios from 'axios';

// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {colors} from '../../constants/colors';
// import {globalStyles} from '../../styles/globalStyles';

// const MachineLearningScreen = () => {
//   const [gifState, setGifState] = useState('sleep');
//   const [connectionStatus, setConnectionStatus] = useState('Chưa kiểm tra');
//   const [predictionResult, setPredictionResult] = useState<any>({});

//   const handleCheckConnection = async () => {
//     setGifState('loading');
//     try {
//       const response = await axios.get('http://192.168.1.7:5000/ping');
//       if (response.status === 200) {
//         setConnectionStatus('Kết nối thành công');
//         setGifState('skateboard');
//       } else {
//         setConnectionStatus('Không thể kết nối với server');
//         setGifState('error');
//       }
//     } catch (error) {
//       setConnectionStatus('Không thể kết nối với server');
//       setGifState('error');
//     }
//   };

//   const handleStartTrain = async () => {
//     setGifState('learning');
//     try {
//       const response = await fetch('http://192.168.1.7:5000/train', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Lỗi khi nhận dữ liệu từ server');
//       }

//       const result = await response.json();
//       setPredictionResult(result);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setGifState('error');
//     }
//     setGifState('thinking');
//   };

//   const renderGif = () => {
//     switch (gifState) {
//       case 'sleep':
//         return (
//           <Image
//             source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'skateboard':
//         return (
//           <Image
//             source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'error':
//         return (
//           <Image
//             source={require('../../assets/images/3.error-404-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'learning':
//         return (
//           <Image
//             source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'thinking':
//         return (
//           <Image
//             source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   // Table header and data preparation
//   const tableHead = ['Ngày', 'Máy', 'Dự đoán sử dụng', 'Thời gian sử dụng'];
//   const tableData = Object.keys(predictionResult)
//     .map(date => {
//       const machines = Object.keys(predictionResult[date]);
//       return machines.map(computer => {
//         const {usage_level, predicted_time_hours} =
//           predictionResult[date][computer];
//         return [
//           date,
//           `Máy ${computer}`,
//           usage_level,
//           `~ ${predicted_time_hours} giờ`,
//         ];
//       });
//     })
//     .flat();

//   // Group by day for display purposes
//   const groupedData = tableData.reduce((acc: any, row: any) => {
//     const date = row[0];
//     if (!acc[date]) {
//       acc[date] = [];
//     }
//     acc[date].push(row);
//     return acc;
//   }, {});

//   return (
//     <View style={{flex: 1, backgroundColor: colors.bgColor}}>
//       <Container isScroll>
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: 130,
//               width: 130,
//             }}>
//             {renderGif()}
//           </View>
//         </View>

//         <TouchableOpacity
//           style={{marginTop: 10, marginBottom: 10}}
//           onPress={handleCheckConnection}>
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
//           text={`Trạng thái: ${connectionStatus}`}
//           styles={{
//             color: connectionStatus === 'Kết nối thành công' ? 'green' : 'red',
//             flex: 0,
//             marginHorizontal: 14,
//             textAlign: 'center',
//             padding: 10,
//           }}
//           size={16}
//         />

//         <TouchableOpacity
//           style={{
//             marginTop: 10,
//             opacity: connectionStatus === 'Kết nối thành công' ? 1 : 0.3,
//           }}
//           onPress={handleStartTrain}
//           disabled={connectionStatus !== 'Kết nối thành công'}>
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

//         {predictionResult && Object.keys(predictionResult).length > 0 && (
//           <View style={{marginTop: 20, marginHorizontal: 20, marginBottom: 20}}>
//             <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//               Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
//             </Text>
//             <ScrollView horizontal style={{marginTop: 10}}>
//               <View style={styles.tableContainer}>
//                 <View style={styles.tableHeader}>
//                   {tableHead.map((header, index) => (
//                     <Text
//                       key={index}
//                       style={[styles.tableCell, styles.tableHeaderText]}>
//                       {header}
//                     </Text>
//                   ))}
//                 </View>
//                 {Object.keys(groupedData).map((date, index) => (
//                   <View key={index}>
//                     {groupedData[date].map((row, rowIndex) => (
//                       <View key={rowIndex} style={styles.tableRow}>
//                         {row.map((cell, cellIndex) => (
//                           <Text key={cellIndex} style={styles.tableCell}>
//                             {cell}
//                           </Text>
//                         ))}
//                       </View>
//                     ))}
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>
//           </View>
//         )}
//       </Container>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   gif: {
//     width: 130,
//     height: 130,
//   },
//   tableContainer: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#f2f2f2',
//     paddingVertical: 8,
//     justifyContent: 'space-between',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   tableCell: {
//     flex: 1,
//     textAlign: 'center',
//     paddingHorizontal: 8,
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//   },
// });

// export default MachineLearningScreen;

// import React, {useState} from 'react';
// import {
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import axios from 'axios';

// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {colors} from '../../constants/colors';
// import {globalStyles} from '../../styles/globalStyles';

// const MachineLearningScreen = () => {
//   const [gifState, setGifState] = useState('sleep');
//   const [connectionStatus, setConnectionStatus] = useState('Chưa kiểm tra');
//   const [predictionResult, setPredictionResult] = useState<any>({});

//   const handleCheckConnection = async () => {
//     setGifState('loading');
//     try {
//       const response = await axios.get('http://192.168.1.7:5000/ping');
//       if (response.status === 200) {
//         setConnectionStatus('Kết nối thành công');
//         setGifState('skateboard');
//       } else {
//         setConnectionStatus('Không thể kết nối với server');
//         setGifState('error');
//       }
//     } catch (error) {
//       setConnectionStatus('Không thể kết nối với server');
//       setGifState('error');
//     }
//   };

//   const handleStartTrain = async () => {
//     setGifState('learning');
//     try {
//       const response = await fetch('http://192.168.1.7:5000/train', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Lỗi khi nhận dữ liệu từ server');
//       }

//       const result = await response.json();
//       setPredictionResult(result);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setGifState('error');
//     }
//     setGifState('thinking');
//   };

//   const renderGif = () => {
//     switch (gifState) {
//       case 'sleep':
//         return (
//           <Image
//             source={require('../../assets/images/1.Orbo-ngu-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'skateboard':
//         return (
//           <Image
//             source={require('../../assets/images/2.Orbo-tr-t-van-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'error':
//         return (
//           <Image
//             source={require('../../assets/images/3.error-404-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'learning':
//         return (
//           <Image
//             source={require('../../assets/images/4.robot-quay-dau-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       case 'thinking':
//         return (
//           <Image
//             source={require('../../assets/images/5.Orbo-suynghi-unscreen.gif')}
//             style={styles.gif}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const tableData = Object.keys(predictionResult)
//     .map(date => {
//       const machines = predictionResult[date];
//       if (!machines || typeof machines !== 'object') return []; // Skip if data is not valid

//       return Object.keys(machines).map((computer, index) => {
//         const {usage_level, predicted_time_hours} = machines[computer];
//         return [
//           index === 0 ? date : '', // Show the date only once for grouped rows
//           `Máy ${computer}`,
//           usage_level,
//           `~ ${predicted_time_hours} giờ`,
//         ];
//       });
//     })
//     .flat();

//   return (
//     <View style={{flex: 1, backgroundColor: colors.bgColor}}>
//       <Container isScroll>
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: 130,
//               width: 130,
//             }}>
//             {renderGif()}
//           </View>
//         </View>

//         <TouchableOpacity
//           style={{marginTop: 10, marginBottom: 10}}
//           onPress={handleCheckConnection}>
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
//           text={`Trạng thái: ${connectionStatus}`}
//           styles={{
//             color: connectionStatus === 'Kết nối thành công' ? 'green' : 'red',
//             flex: 0,
//             marginHorizontal: 14,
//             textAlign: 'center',
//             padding: 10,
//           }}
//           size={16}
//         />

//         <TouchableOpacity
//           style={{
//             marginTop: 10,
//             opacity: connectionStatus === 'Kết nối thành công' ? 1 : 0.3,
//           }}
//           onPress={handleStartTrain}
//           disabled={connectionStatus !== 'Kết nối thành công'}>
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

//         {predictionResult && Object.keys(predictionResult).length > 0 && (
//           <View style={{marginTop: 20, marginHorizontal: 20, marginBottom: 20}}>
//             <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//               Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
//             </Text>
//             <ScrollView horizontal style={{marginTop: 10}}>
//               <View style={styles.tableContainer}>
//                 <View style={styles.tableHeaderRow}>
//                   <Text style={[styles.tableHeaderText, {flex: 2}]}>Ngày</Text>
//                   <Text style={[styles.tableHeaderText, {flex: 1}]}>Máy</Text>
//                   <Text style={[styles.tableHeaderText, {flex: 1}]}>
//                     Sử dụng
//                   </Text>
//                   <Text style={[styles.tableHeaderText, {flex: 1}]}>
//                     Thời gian
//                   </Text>
//                 </View>
//                 {tableData.map((row, rowIndex) => (
//                   <View key={rowIndex} style={styles.tableRow}>
//                     {row.map((cell, cellIndex) => (
//                       <Text
//                         key={cellIndex}
//                         style={[
//                           styles.tableCell,
//                           {flex: cellIndex === 0 ? 2 : 1},
//                         ]}>
//                         {' '}
//                         {cell}{' '}
//                       </Text>
//                     ))}
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>
//           </View>
//         )}
//       </Container>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   gif: {
//     width: 130,
//     height: 130,
//   },
//   tableContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   tableHeaderRow: {
//     flexDirection: 'row',
//     backgroundColor: '#f2f2f2',
//     paddingVertical: 8,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingVertical: 8,
//   },
//   tableCell: {
//     textAlign: 'center',
//     paddingHorizontal: 8,
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default MachineLearningScreen;

import React, {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';

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
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Lỗi khi nhận dữ liệu từ server');
      }

      const result = await response.json();
      setPredictionResult(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setGifState('error');
    }
    setGifState('thinking');
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

  const renderTable = () => {
    return Object.keys(predictionResult).map((date, index) => {
      const machines = predictionResult[date];
      return (
        <View key={index} style={styles.dateGroup}>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          {Object.keys(machines).map((computer, compIndex) => {
            const {usage_level, predicted_time_hours} = machines[computer];
            return (
              <View key={compIndex} style={styles.machineRow}>
                <Text style={[styles.machineCell, {flex: 1}]}>{computer}</Text>
                <Text style={[styles.machineCell, {flex: 1}]}>
                  ~ {predicted_time_hours} giờ
                </Text>
                <Text style={[styles.machineCell, {flex: 1}]}>
                  {usage_level}
                </Text>
              </View>
            );
          })}
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

        <TouchableOpacity
          style={{
            marginTop: 10,
            opacity: connectionStatus === 'Kết nối thành công' ? 1 : 0.3,
          }}
          onPress={handleStartTrain}
          disabled={connectionStatus !== 'Kết nối thành công'}>
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

        {predictionResult && Object.keys(predictionResult).length > 0 && (
          <View style={{marginTop: 20, marginHorizontal: 40, marginBottom: 20}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
              Kết quả dự đoán thời gian sử dụng cho 7 ngày tới:
            </Text>
            <ScrollView horizontal style={{marginTop: 10, flex: 1}}>
              <View style={styles.tableContainer}>
                {/* <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderText, {flex: 1}]}>Máy</Text>
                  <Text style={[styles.tableHeaderText, {flex: 1}]}>
                    Sử dụng
                  </Text>
                  <Text style={[styles.tableHeaderText, {flex: 1}]}>
                    Thời gian
                  </Text>
                </View> */}
                {renderTable()}
              </View>
            </ScrollView>
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
    // overflow: 'hidden',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
  },
  dateGroup: {
    marginTop: 10,
  },
  dateRow: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
  },
  dateText: {
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
    fontSize: 16,
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
