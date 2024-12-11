// import React, {useState, useEffect} from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';
// import database from '@react-native-firebase/database';

// interface ComputerOnCountData {
//   [date: string]: {
//     [computer: string]: {
//       onCount: number;
//     };
//   };
// }

// interface ComputerUsageTimeData {
//   [date: string]: {
//     [computer: string]: {
//       totalTime: string;
//     };
//   };
// }

// interface TemperaturesData {
//   [timestamp: string]: {
//     [computer: string]: {
//       temperature: number;
//     };
//   };
// }

// const PrepareDataForPrediction = (
//   computerOnCountData: ComputerOnCountData,
//   computerUsageTimeData: ComputerUsageTimeData,
//   temperatureData: TemperaturesData,
// ) => {
//   const preparedData: any = {}; // Đổi từ array sang object

//   // Lấy ngày từ ComputerOnCount (dữ liệu ngày và máy tính)
//   const days = Object.keys(computerOnCountData);

//   days.forEach(day => {
//     const dayData = computerOnCountData[day];
//     const usageData = computerUsageTimeData[day];

//     preparedData[day] = {}; // Tạo một đối tượng cho ngày
//     Object.keys(dayData).forEach(computer => {
//       const onCount = dayData[computer].onCount;
//       const totalTime = usageData[computer]
//         ? usageData[computer].totalTime
//         : '00:00:00';
//       const temperature = temperatureData[`${day}_${computer}`]
//         ? temperatureData[`${day}_${computer}`].temperature
//         : null;

//       preparedData[day][computer] = {
//         onCount,
//         totalTime,
//         temperature,
//       };
//     });
//   });

//   return preparedData;
// };

// const PrepareData = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [computerOnCountData, setComputerOnCountData] =
//     useState<ComputerOnCountData>({});
//   const [computerUsageTimeData, setComputerUsageTimeData] =
//     useState<ComputerUsageTimeData>({});
//   const [temperaturesData, setTemperaturesData] = useState<TemperaturesData>(
//     {},
//   );

//   useEffect(() => {
//     const db = database(); // Sử dụng firebase database

//     // Lắng nghe dữ liệu ComputerOnCount (7 ngày gần nhất)
//     const computerOnCountRef = db.ref('ComputerOnCount').limitToLast(7);
//     const computerOnCountListener = computerOnCountRef.on('value', snapshot => {
//       const data = snapshot.val();
//       setComputerOnCountData(data || {});
//     });

//     // Lắng nghe dữ liệu ComputerUsageTime (7 ngày gần nhất)
//     const computerUsageTimeRef = db.ref('ComputerUsageTime').limitToLast(7);
//     const computerUsageTimeListener = computerUsageTimeRef.on(
//       'value',
//       snapshot => {
//         const data = snapshot.val();
//         setComputerUsageTimeData(data || {});
//       },
//     );

//     // Lắng nghe dữ liệu Temperatures_30 (cần lọc để lấy 7 dữ liệu gần nhất)
//     const temperaturesRef = db.ref('Temperatures_30');
//     const temperaturesListener = temperaturesRef.on('value', snapshot => {
//       const data = snapshot.val();

//       if (data) {
//         // Lọc và lấy 7 ngày gần nhất
//         const filteredData: TemperaturesData = {};

//         // Chuyển đổi timestamps thành ngày và lọc lấy 7 ngày gần nhất
//         const timestamps = Object.keys(data);
//         const uniqueDates: Set<string> = new Set();
//         const latest7DaysData: TemperaturesData = {};

//         timestamps.forEach(timestamp => {
//           const date = timestamp.split('_')[0]; // Lấy ngày từ timestamp (yyyy-mm-dd)
//           uniqueDates.add(date); // Lưu ngày vào Set để không bị trùng

//           if (uniqueDates.size <= 7) {
//             if (!latest7DaysData[date]) {
//               latest7DaysData[date] = {};
//             }

//             // Tìm nhiệt độ cao nhất cho từng máy tính trong ngày
//             const computers = Object.keys(data[timestamp]);
//             computers.forEach(computer => {
//               const temperature = data[timestamp][computer].temperature;
//               if (
//                 !latest7DaysData[date][computer] ||
//                 latest7DaysData[date][computer] < temperature
//               ) {
//                 latest7DaysData[date][computer] = temperature;
//               }
//             });
//           }
//         });

//         // Set filteredData với 7 ngày gần nhất
//         setTemperaturesData(latest7DaysData);
//       }
//     });

//     // Cleanup: Dừng lắng nghe khi component bị hủy
//     return () => {
//       computerOnCountRef.off('value', computerOnCountListener);
//       computerUsageTimeRef.off('value', computerUsageTimeListener);
//       temperaturesRef.off('value', temperaturesListener);
//     };
//   }, []);

//   const handleStartGetDataFirebase = async () => {
//     setLoading(true); // Bật loading khi bắt đầu lấy dữ liệu

//     try {
//       // Lọc và chuẩn bị dữ liệu đầu vào cho mô hình dự đoán
//       const preparedData = PrepareDataForPrediction(
//         computerOnCountData,
//         computerUsageTimeData,
//         temperaturesData,
//       );

//       // Gửi dữ liệu này tới server Python để dự đoán
//       const response = await fetch('http://192.168.1.7:5000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(preparedData), // Gửi dữ liệu đã chuẩn bị
//       });

//       const predictionResult = await response.json();
//       console.log('Kết quả dự đoán');
//       console.log(predictionResult); // Hiển thị kết quả dự đoán trả về từ server
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//     setLoading(false); // Tắt loading khi hoàn thành
//     console.log(computerOnCountData);
//     console.log(computerUsageTimeData);
//     console.log(temperaturesData);
//   };

//   return (
//     <View>
//       <TouchableOpacity
//         style={{marginTop: 20}}
//         onPress={handleStartGetDataFirebase}>
//         <Text
//           style={{
//             textAlign: 'center',
//             backgroundColor: '#6998FF',
//             padding: 10,
//             color: 'white',
//           }}>
//           {loading ? 'Đang lấy dữ liệu...' : 'Gửi dữ liệu sang server'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default PrepareData;

// import React, {useState, useEffect} from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';
// import database from '@react-native-firebase/database';

// // Định nghĩa các kiểu dữ liệu
// interface ComputerOnCountData {
//   [date: string]: {
//     [computer: string]: {
//       onCount: number;
//     };
//   };
// }

// interface ComputerUsageTimeData {
//   [date: string]: {
//     [computer: string]: {
//       totalTime: string;
//     };
//   };
// }

// interface TemperaturesData {
//   [timestamp: string]: {
//     [computer: string]: {
//       temperature: number;
//     };
//   };
// }

// interface PredictionResult {
//   [date: string]: {
//     [computer: string]: {
//       usage_level: string;
//       predicted_time_seconds: number;
//       predicted_time_hours: number;
//     };
//   };
// }

// // Hàm xử lý dữ liệu trước khi gửi đến server
// const PrepareDataForPrediction = (
//   computerOnCountData: ComputerOnCountData,
//   computerUsageTimeData: ComputerUsageTimeData,
//   temperatureData: TemperaturesData,
// ) => {
//   const preparedData: any = {}; // Đổi từ array sang object

//   // Lấy ngày từ ComputerOnCount (dữ liệu ngày và máy tính)
//   const days = Object.keys(computerOnCountData);

//   days.forEach(day => {
//     const dayData = computerOnCountData[day];
//     const usageData = computerUsageTimeData[day];

//     preparedData[day] = {}; // Tạo một đối tượng cho ngày
//     Object.keys(dayData).forEach(computer => {
//       const onCount = dayData[computer].onCount;
//       const totalTime = usageData[computer]
//         ? usageData[computer].totalTime
//         : '00:00:00';
//       const temperature = temperatureData[`${day}_${computer}`]
//         ? temperatureData[`${day}_${computer}`].temperature
//         : null;

//       preparedData[day][computer] = {
//         onCount,
//         totalTime,
//         temperature,
//       };
//     });
//   });

//   return preparedData;
// };

// const PrepareData = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [computerOnCountData, setComputerOnCountData] =
//     useState<ComputerOnCountData>({});
//   const [computerUsageTimeData, setComputerUsageTimeData] =
//     useState<ComputerUsageTimeData>({});
//   const [temperaturesData, setTemperaturesData] = useState<TemperaturesData>(
//     {},
//   );
//   const [predictionResult, setPredictionResult] = useState<PredictionResult>(
//     {},
//   );

//   // Lắng nghe dữ liệu từ Firebase
//   useEffect(() => {
//     const db = database(); // Sử dụng firebase database

//     // Lắng nghe dữ liệu ComputerOnCount (7 ngày gần nhất)
//     const computerOnCountRef = db.ref('ComputerOnCount').limitToLast(7);
//     const computerOnCountListener = computerOnCountRef.on('value', snapshot => {
//       const data = snapshot.val();
//       setComputerOnCountData(data || {});
//     });

//     // Lắng nghe dữ liệu ComputerUsageTime (7 ngày gần nhất)
//     const computerUsageTimeRef = db.ref('ComputerUsageTime').limitToLast(7);
//     const computerUsageTimeListener = computerUsageTimeRef.on(
//       'value',
//       snapshot => {
//         const data = snapshot.val();
//         setComputerUsageTimeData(data || {});
//       },
//     );

//     // Lắng nghe dữ liệu Temperatures_30 (cần lọc để lấy 7 dữ liệu gần nhất)
//     const temperaturesRef = db.ref('Temperatures_30');
//     const temperaturesListener = temperaturesRef.on('value', snapshot => {
//       const data = snapshot.val();

//       if (data) {
//         // Lọc và lấy 7 ngày gần nhất
//         const filteredData: TemperaturesData = {};

//         // Chuyển đổi timestamps thành ngày và lọc lấy 7 ngày gần nhất
//         const timestamps = Object.keys(data);
//         const uniqueDates: Set<string> = new Set();
//         const latest7DaysData: TemperaturesData = {};

//         timestamps.forEach(timestamp => {
//           const date = timestamp.split('_')[0]; // Lấy ngày từ timestamp (yyyy-mm-dd)
//           uniqueDates.add(date); // Lưu ngày vào Set để không bị trùng

//           if (uniqueDates.size <= 7) {
//             if (!latest7DaysData[date]) {
//               latest7DaysData[date] = {};
//             }

//             // Tìm nhiệt độ cao nhất cho từng máy tính trong ngày
//             const computers = Object.keys(data[timestamp]);
//             computers.forEach(computer => {
//               const temperature = data[timestamp][computer].temperature;
//               if (
//                 !latest7DaysData[date][computer] ||
//                 latest7DaysData[date][computer] < temperature
//               ) {
//                 latest7DaysData[date][computer] = temperature;
//               }
//             });
//           }
//         });

//         // Set filteredData với 7 ngày gần nhất
//         setTemperaturesData(latest7DaysData);
//       }
//     });

//     // Cleanup: Dừng lắng nghe khi component bị hủy
//     return () => {
//       computerOnCountRef.off('value', computerOnCountListener);
//       computerUsageTimeRef.off('value', computerUsageTimeListener);
//       temperaturesRef.off('value', temperaturesListener);
//     };
//   }, []);

//   const handleStartGetDataFirebase = async () => {
//     setLoading(true); // Bật loading khi bắt đầu lấy dữ liệu

//     try {
//       // Lọc và chuẩn bị dữ liệu đầu vào cho mô hình dự đoán
//       const preparedData = PrepareDataForPrediction(
//         computerOnCountData,
//         computerUsageTimeData,
//         temperaturesData,
//       );
//       console.log('Dữ liệu đầu vào chuẩn bị: ');
//       console.log(preparedData);

//       // Gửi dữ liệu này tới server Python để dự đoán
//       const response = await fetch('http://192.168.1.7:5000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(preparedData), // Gửi dữ liệu đã chuẩn bị
//       });

//       const predictionResult = await response.json();
//       setPredictionResult(predictionResult); // Lưu kết quả trả về từ server
//       console.log('Kết quả dự đoán: ', predictionResult); // Hiển thị kết quả dự đoán trả về từ server
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//     setLoading(false); // Tắt loading khi hoàn thành
//     // console.log(computerOnCountData);
//     // console.log(computerUsageTimeData);
//     console.log(temperaturesData);
//   };

//   return (
//     <View>
//       <TouchableOpacity
//         style={{marginTop: 20}}
//         onPress={handleStartGetDataFirebase}>
//         <Text
//           style={{
//             textAlign: 'center',
//             backgroundColor: '#6998FF',
//             padding: 10,
//             color: 'white',
//           }}>
//           {loading ? 'Đang lấy dữ liệu...' : 'Gửi dữ liệu sang server'}
//         </Text>
//       </TouchableOpacity>

//       {predictionResult && (
//         <View style={{marginTop: 20}}>
//           <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//             Dự đoán 7 ngày tương lai:
//           </Text>
//           {Object.keys(predictionResult).map(date => (
//             <View key={date}>
//               <Text style={{fontWeight: 'bold'}}>{date}:</Text>
//               {Object.keys(predictionResult[date]).map(computer => {
//                 const {usage_level, predicted_time_hours} =
//                   predictionResult[date][computer];
//                 return (
//                   <Text key={computer}>
//                     Máy {computer}: {usage_level}, Thời gian sử dụng:{' '}
//                     {predicted_time_hours} giờ
//                   </Text>
//                 );
//               })}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// export default PrepareData;

// import React, {useState, useEffect} from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';
// import database from '@react-native-firebase/database';

// // Định nghĩa các kiểu dữ liệu
// interface ComputerOnCountData {
//   [date: string]: {
//     [computer: string]: {
//       onCount: number;
//     };
//   };
// }

// interface ComputerUsageTimeData {
//   [date: string]: {
//     [computer: string]: {
//       totalTime: string;
//     };
//   };
// }

// interface TemperaturesData {
//   [timestamp: string]: {
//     [computer: string]: {
//       temperature: number;
//     };
//   };
// }

// interface PredictionResult {
//   [date: string]: {
//     [computer: string]: {
//       usage_level: string;
//       predicted_time_seconds: number;
//       predicted_time_hours: number;
//     };
//   };
// }

// const PrepareDataForPrediction = (
//   computerOnCountData: ComputerOnCountData,
//   computerUsageTimeData: ComputerUsageTimeData,
//   temperatureData: TemperaturesData,
// ) => {
//   const preparedData: any[] = []; // Dữ liệu sẽ là một mảng thay vì object

//   // Lấy ngày từ ComputerOnCount (dữ liệu ngày và máy tính)
//   const days = Object.keys(computerOnCountData);

//   days.forEach(day => {
//     const dayData = computerOnCountData[day];
//     const usageData = computerUsageTimeData[day];

//     Object.keys(dayData).forEach(computer => {
//       const onCount = dayData[computer].onCount;
//       const totalTime = usageData[computer]
//         ? usageData[computer].totalTime
//         : '00:00:00';

//       // Lấy nhiệt độ từ temperatureData cho máy tính tương ứng vào ngày đó
//       const temperature = temperatureData[`${day}_${computer}`]
//         ? temperatureData[`${day}_${computer}`].temperature
//         : null;

//       // Chuyển đổi totalTime từ định dạng 'hh:mm:ss' sang giây
//       const [hours, minutes, seconds] = totalTime.split(':').map(Number);
//       const totalTimeSeconds = hours * 3600 + minutes * 60 + seconds;

//       // Nếu không có nhiệt độ trong temperatureData, giữ nguyên giá trị null hoặc có thể gán giá trị mặc định khác
//       preparedData.push({
//         date: day,
//         computer,
//         total_time_seconds: totalTimeSeconds,
//         on_count: onCount,
//         max_temperature: temperature !== null ? temperature : null, // Giữ nguyên giá trị nhiệt độ thực tế
//       });
//     });
//   });

//   return preparedData;
// };

// const PrepareData = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [computerOnCountData, setComputerOnCountData] =
//     useState<ComputerOnCountData>({});
//   const [computerUsageTimeData, setComputerUsageTimeData] =
//     useState<ComputerUsageTimeData>({});
//   const [temperaturesData, setTemperaturesData] = useState<TemperaturesData>(
//     {},
//   );
//   const [predictionResult, setPredictionResult] = useState<PredictionResult>(
//     {},
//   );

//   // Lắng nghe dữ liệu từ Firebase
//   useEffect(() => {
//     const db = database(); // Sử dụng firebase database

//     // Lắng nghe dữ liệu ComputerOnCount (7 ngày gần nhất)
//     const computerOnCountRef = db.ref('ComputerOnCount').limitToLast(7);
//     const computerOnCountListener = computerOnCountRef.on('value', snapshot => {
//       const data = snapshot.val();
//       setComputerOnCountData(data || {});
//     });

//     // Lắng nghe dữ liệu ComputerUsageTime (7 ngày gần nhất)
//     const computerUsageTimeRef = db.ref('ComputerUsageTime').limitToLast(7);
//     const computerUsageTimeListener = computerUsageTimeRef.on(
//       'value',
//       snapshot => {
//         const data = snapshot.val();
//         setComputerUsageTimeData(data || {});
//       },
//     );

//     // Lắng nghe dữ liệu Temperatures_30 (cần lọc để lấy 7 dữ liệu gần nhất)
//     const temperaturesRef = db.ref('Temperatures_30');
//     const temperaturesListener = temperaturesRef.on('value', snapshot => {
//       const data = snapshot.val();

//       if (data) {
//         const filteredData: TemperaturesData = {};
//         const timestamps = Object.keys(data);
//         const uniqueDates: Set<string> = new Set();
//         const latest7DaysData: TemperaturesData = {};

//         timestamps.forEach(timestamp => {
//           const date = timestamp.split('_')[0]; // Lấy ngày từ timestamp (yyyy-mm-dd)
//           uniqueDates.add(date);

//           if (uniqueDates.size <= 7) {
//             if (!latest7DaysData[date]) {
//               latest7DaysData[date] = {};
//             }

//             // Tìm nhiệt độ cao nhất cho từng máy tính trong ngày
//             const computers = Object.keys(data[timestamp]);
//             computers.forEach(computer => {
//               const temperature = data[timestamp][computer].temperature;
//               if (
//                 !latest7DaysData[date][computer] ||
//                 latest7DaysData[date][computer] < temperature
//               ) {
//                 latest7DaysData[date][computer] = temperature;
//               }
//             });
//           }
//         });

//         setTemperaturesData(latest7DaysData);
//       }
//     });

//     // Cleanup: Dừng lắng nghe khi component bị hủy
//     return () => {
//       computerOnCountRef.off('value', computerOnCountListener);
//       computerUsageTimeRef.off('value', computerUsageTimeListener);
//       temperaturesRef.off('value', temperaturesListener);
//     };
//   }, []);

//   const handleStartGetDataFirebase = async () => {
//     setLoading(true);

//     try {
//       // Lọc và chuẩn bị dữ liệu đầu vào cho mô hình dự đoán
//       const preparedData = PrepareDataForPrediction(
//         computerOnCountData,
//         computerUsageTimeData,
//         temperaturesData,
//       );
//       console.log('Dữ liệu đầu vào chuẩn bị: ', preparedData);

//       // Gửi dữ liệu này tới server Python để dự đoán
//       const response = await fetch('http://192.168.1.7:5000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(preparedData), // Gửi dữ liệu đã chuẩn bị
//       });

//       if (!response.ok) {
//         throw new Error('Lỗi khi gửi dữ liệu đến server');
//       }

//       const predictionResult = await response.json();
//       setPredictionResult(predictionResult);
//       console.log('Kết quả dự đoán: ', predictionResult);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//     setLoading(false);
//     console.log(temperaturesData);
//     console.log(computerOnCountData);
//     console.log(computerUsageTimeData);
//   };

//   return (
//     <View>
//       <TouchableOpacity
//         style={{marginTop: 20}}
//         onPress={handleStartGetDataFirebase}>
//         <Text
//           style={{
//             textAlign: 'center',
//             backgroundColor: '#6998FF',
//             padding: 10,
//             color: 'white',
//           }}>
//           {loading ? 'Đang lấy dữ liệu...' : 'Gửi dữ liệu sang server'}
//         </Text>
//       </TouchableOpacity>

//       {predictionResult && (
//         <View style={{marginTop: 20}}>
//           <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//             Dự đoán 7 ngày tương lai:
//           </Text>
//           {Object.keys(predictionResult).map(date => (
//             <View key={date}>
//               <Text style={{fontWeight: 'bold'}}>{date}:</Text>
//               {Object.keys(predictionResult[date]).map(computer => {
//                 const {usage_level, predicted_time_hours} =
//                   predictionResult[date][computer];
//                 return (
//                   <Text key={computer}>
//                     Máy {computer}: {usage_level}, Thời gian sử dụng:{' '}
//                     {predicted_time_hours} giờ
//                   </Text>
//                 );
//               })}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// export default PrepareData;

// import React, {useState, useEffect} from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';

// const PrepareData = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [predictionResult, setPredictionResult] = useState<any>({});

//   const handleStartGetDataFirebase = async () => {
//     setLoading(true);

//     try {
//       // Gửi dữ liệu trực tiếp tới server Python để dự đoán
//       const response = await fetch('http://192.168.1.7:5000/train', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         // body: JSON.stringify({}), // Gửi dữ liệu đã chuẩn bị nếu có
//       });

//       //   if (!response.ok) {
//       //     throw new Error('Lỗi khi gửi dữ liệu đến server');
//       //   }

//       const predictionResult = await response.json();
//     //   setPredictionResult(predictionResult);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }

//     setLoading(false);
//   };

//   return (
//     <View>
//       <TouchableOpacity
//         style={{marginTop: 20}}
//         onPress={handleStartGetDataFirebase}>
//         <Text
//           style={{
//             textAlign: 'center',
//             backgroundColor: '#6998FF',
//             padding: 10,
//             color: 'white',
//           }}>
//           {loading ? 'Đang lấy dữ liệu...' : 'Gửi dữ liệu sang server'}
//         </Text>
//       </TouchableOpacity>

//       {predictionResult && (
//         <View style={{marginTop: 20}}>
//           <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//             Dự đoán 7 ngày tương lai:
//           </Text>
//           {Object.keys(predictionResult).map(date => (
//             <View key={date}>
//               <Text style={{fontWeight: 'bold'}}>{date}:</Text>
//               {Object.keys(predictionResult[date]).map(computer => {
//                 const {usage_level, predicted_time_hours} =
//                   predictionResult[date][computer];
//                 return (
//                   <Text key={computer}>
//                     Máy {computer}: {usage_level}, Thời gian sử dụng:{' '}
//                     {predicted_time_hours} giờ
//                   </Text>
//                 );
//               })}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// export default PrepareData;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const PrepareData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<any>({});

  const handleStartGetDataFirebase = async () => {
    setLoading(true);

    try {
      // Lấy dữ liệu từ server Python (không gửi dữ liệu gì, chỉ nhận kết quả dự đoán)
      const response = await fetch('http://192.168.1.7:5000/train', {
        method: 'GET', // Chỉ là GET, không gửi dữ liệu gì
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi nhận dữ liệu từ server');
      }

      const result = await response.json();
      setPredictionResult(result); // Lưu kết quả vào state để render
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={{marginTop: 20}}
        onPress={handleStartGetDataFirebase}>
        <Text
          style={{
            textAlign: 'center',
            backgroundColor: '#6998FF',
            padding: 10,
            color: 'white',
          }}>
          {loading ? 'Đang lấy dữ liệu...' : 'Nhận dữ liệu từ server'}
        </Text>
      </TouchableOpacity>

      {predictionResult && Object.keys(predictionResult).length > 0 && (
        <View style={{marginTop: 20}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
            Dự đoán 7 ngày tương lai:
          </Text>
          {Object.keys(predictionResult).map(date => (
            <View key={date}>
              <Text style={{fontWeight: 'bold'}}>{date}:</Text>
              {Object.keys(predictionResult[date]).map(computer => {
                const {usage_level, predicted_time_hours} =
                  predictionResult[date][computer];
                return (
                  <Text key={computer}>
                    Máy {computer}: {usage_level}, Thời gian sử dụng:{' '}
                    {predicted_time_hours} giờ
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default PrepareData;
