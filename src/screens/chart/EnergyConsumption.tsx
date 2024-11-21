// import database from '@react-native-firebase/database';
// import React, {useEffect, useState} from 'react';
// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {
//   VictoryAxis,
//   VictoryBar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const EnergyConsumptionChart = () => {
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     datasets: {data: number[]};
//   }>({
//     labels: [],
//     datasets: {data: []},
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [numDays, setNumDays] = useState(7); // Số lượng ngày hiển thị (mặc định 7)

//   useEffect(() => {
//     // Hàm lấy dữ liệu từ Firebase
//     const fetchData = async () => {
//       try {
//         const snapshot = await database().ref('/Energy_use').once('value');
//         const rawData = snapshot.val();

//         // Chuyển dữ liệu từ object sang mảng
//         const energyData = Object.entries(rawData).map(([key, value]: any) => ({
//           date: key.replace('_', ' '), // Loại bỏ dấu "_"
//           totalEnergy: parseFloat(value.totalEnergy),
//         }));

//         // Sắp xếp theo ngày tăng dần
//         const sortedData = energyData.sort(
//           (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
//         );

//         // Lấy 8 ngày gần nhất
//         const recentData = sortedData.slice(-8);

//         // Tính lượng điện tiêu thụ hàng ngày
//         const calculatedData = recentData.map((item, index) => {
//           if (index === 0) return null; // Bỏ qua ngày đầu tiên (dùng làm mốc so sánh)

//           const previousEnergy = recentData[index - 1].totalEnergy;
//           const consumption = Math.max(item.totalEnergy - previousEnergy, 0); // Đảm bảo không âm

//           return {
//             date: item.date.split(' ')[0], // Chỉ lấy ngày
//             consumption: parseFloat(consumption.toFixed(2)), // Làm tròn 2 chữ số thập phân
//           };
//         });

//         // Lọc bỏ giá trị `null` và tạo dữ liệu biểu đồ
//         const filteredData = calculatedData.slice(1); // Bỏ ngày đầu tiên
//         const labels = filteredData.map(item => item.date);
//         const data = filteredData.map(item => item.consumption);

//         setChartData({labels, datasets: {data}});
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Không thể tải dữ liệu');
//       }
//     };

//     fetchData();
//   }, []);

//   if (error) {
//     return (
//       <View style={styles.chartContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   const {labels, datasets} = chartData;

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[globalStyles.inputContainer, {marginHorizontal: 10}]}
//         placeholder="Nhập số ngày muốn hiển thị (1 - 20)"
//         keyboardType="numeric"
//         // onChangeText={handleInputChange}
//         defaultValue={numDays.toString()}
//       />
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numDays}  ngày gần đây`}
//           color="black"
//           size={18}
//           styles={{
//             paddingTop: 10,
//             marginBottom: -40,
//           }}
//         />
//       </View>
//       <VictoryChart
//         theme={VictoryTheme.material}
//         width={Dimensions.get('window').width}
//         animate={{
//           duration: 700,
//           onLoad: {duration: 700},
//           easing: 'linear',
//         }}
//         domain={{x: [0.5, labels.length + 0.5]}} // Dịch domain trục X sang phải
//       >
//         {/* Trục X */}
//         <VictoryAxis
//           tickValues={labels.map((_, i) => i + 1)} // Tạo tick values (1, 2, 3,...)
//           tickFormat={t => labels[t - 1]} // Gắn nhãn dữ liệu tương ứng
//           style={{
//             tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//           }}
//         />
//         {/* Trục Y */}
//         <VictoryAxis
//           dependentAxis
//           tickFormat={t => `${t} kWh`}
//           style={{
//             tickLabels: {fontSize: 8, textAnchor: 'end'},
//           }}
//         />
//         {/* Dữ liệu cột */}
//         <VictoryBar
//           data={datasets.data.map((y, i) => ({
//             x: i + 1, // X bắt đầu từ 1
//             y: y,
//           }))}
//           style={{
//             data: {fill: 'purple'},
//           }}
//           labels={({datum}) => `${datum.y} kWh`}
//           labelComponent={<VictoryTooltip />}
//         />
//       </VictoryChart>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingBottom: 20,
//     paddingTop: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default EnergyConsumptionChart;

// code ok rồi nhưng còn re-render quá nhiều lần
// import database from '@react-native-firebase/database';
// import React, {useEffect, useState} from 'react';
// import {
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   View,
// } from 'react-native';
// import {
//   VictoryAxis,
//   VictoryBar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const EnergyConsumptionChart = () => {
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     datasets: {data: number[]};
//   }>({
//     labels: [],
//     datasets: {data: []},
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [numDays, setNumDays] = useState(8); // Số ngày mặc định

//   useEffect(() => {
//     fetchData(numDays);
//   }, [numDays]);

//   // Hàm lấy dữ liệu từ Firebase
//   const fetchData = async (days: number) => {
//     try {
//       const snapshot = await database().ref('/Energy_use').once('value');
//       const rawData = snapshot.val();

//       if (!rawData) {
//         throw new Error('Dữ liệu từ Firebase trống hoặc không hợp lệ.');
//       }

//       // Chuyển dữ liệu từ object sang mảng
//       const energyData = Object.entries(rawData).map(([key, value]: any) => ({
//         date: key.replace('_', ' '), // Loại bỏ dấu "_"
//         totalEnergy: parseFloat(value.totalEnergy || 0),
//       }));

//       // Sắp xếp theo ngày tăng dần
//       const sortedData = energyData.sort(
//         (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
//       );

//       // Lấy `days` ngày gần nhất
//       const recentData = sortedData.slice(-days);

//       // Tính lượng điện tiêu thụ hàng ngày
//       const calculatedData = recentData.map((item, index) => {
//         if (index === 0) return null; // Bỏ ngày đầu tiên
//         const previousEnergy = recentData[index - 1].totalEnergy;
//         const consumption = Math.max(item.totalEnergy - previousEnergy, 0);
//         return {
//           date: item.date.split(' ')[0], // Chỉ lấy ngày
//           consumption: parseFloat(consumption.toFixed(2)),
//         };
//       });

//       // Lọc bỏ giá trị null và chuẩn bị dữ liệu cho biểu đồ
//       const filteredData = calculatedData.filter(Boolean);
//       const labels = filteredData.map(item => item.date);
//       const data = filteredData.map(item => item.consumption);

//       setChartData({labels, datasets: {data}});
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   };

//   const handleInputChange = (value: string) => {
//     const days = parseInt(value, 10);
//     if (!isNaN(days) && days > 0 && days <= 20) {
//       setNumDays(days + 1);
//     } else {
//       setError('Vui lòng nhập số ngày từ 1 đến 20.');
//     }
//   };

//   //   if (error) {
//   //     return (
//   //       <View style={styles.chartContainer}>
//   //         <Text style={styles.errorText}>{error}</Text>
//   //       </View>
//   //     );
//   //   }

//   const {labels, datasets} = chartData;

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số ngày muốn hiển thị (1 - 20)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//         // defaultValue={numDays.toString()}
//       />
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numDays - 1} ngày gần đây`}
//           color="black"
//           size={18}
//           styles={{
//             paddingTop: 10,
//             marginBottom: -40,
//           }}
//         />
//       </View>
//       <ScrollView horizontal>
//         <VictoryChart
//           theme={VictoryTheme.material}
//           //   width={Dimensions.get('window').width}
//           width={Math.max(Dimensions.get('window').width, labels.length * 50)}
//           animate={{
//             duration: 200,
//             onLoad: {duration: 200},
//             // easing: 'linear',
//           }}
//           domain={{x: [0.5, labels.length + 0.5]}}>
//           {/* Trục X */}
//           <VictoryAxis
//             tickValues={labels.map((_, i) => i + 1)}
//             tickFormat={t => labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           {/* Trục Y */}
//           <VictoryAxis
//             dependentAxis
//             tickFormat={t => `${t} kWh`}
//             style={{
//               tickLabels: {fontSize: 8, textAnchor: 'end'},
//             }}
//           />
//           {/* Dữ liệu cột */}
//           <VictoryBar
//             data={datasets.data.map((y, i) => ({
//               x: i + 1,
//               y: y,
//             }))}
//             style={{
//               data: {fill: 'purple'},
//             }}
//             labels={({datum}) => `${datum.y} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={labels.length === 1 ? 3 : 0.5} // Cột lớn hơn khi chỉ có 1 ngày
//           />
//         </VictoryChart>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingBottom: 20,
//     paddingTop: 10,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default EnergyConsumptionChart;

// import database from '@react-native-firebase/database';
// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   Alert,
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   View,
// } from 'react-native';
// import {
//   VictoryAxis,
//   VictoryBar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const EnergyConsumptionChart = () => {
//   const chartDataRef = useRef({
//     labels: [] as string[],
//     datasets: {data: [] as number[]},
//   });

//   const [numDays, setNumDays] = useState(8); // Số ngày mặc định
//   const [error, setError] = useState<string | null>(null);
//   const [triggerRender, setTriggerRender] = useState(false); // Dùng để trigger re-render

//   const fetchData = useCallback(async (days: number) => {
//     try {
//       const snapshot = await database().ref('/Energy_use').once('value');
//       const rawData = snapshot.val();

//       if (!rawData) {
//         throw new Error('Dữ liệu từ Firebase trống hoặc không hợp lệ.');
//       }

//       const energyData = Object.entries(rawData).map(([key, value]: any) => ({
//         date: key.replace('_', ' '),
//         totalEnergy: parseFloat(value.totalEnergy || 0),
//       }));

//       const sortedData = energyData.sort(
//         (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
//       );

//       const recentData = sortedData.slice(-days);
//       const calculatedData = recentData.map((item, index) => {
//         if (index === 0) return null;
//         const previousEnergy = recentData[index - 1].totalEnergy;
//         const consumption = Math.max(item.totalEnergy - previousEnergy, 0);
//         return {
//           date: item.date.split(' ')[0],
//           consumption: parseFloat(consumption.toFixed(2)),
//         };
//       });

//       const filteredData = calculatedData.filter(Boolean) as {
//         date: string;
//         consumption: number;
//       }[];

//       const labels = filteredData.map(item => item.date);
//       const data = filteredData.map(item => item.consumption);

//       chartDataRef.current = {labels, datasets: {data}};
//       setTriggerRender(prev => !prev); // Trigger re-render thủ công
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(numDays);
//   }, [numDays, fetchData]);

//   const handleInputChange = useCallback((value: string) => {
//     const days = parseInt(value, 10);
//     if (!isNaN(days) && days > 0 && days <= 30) {
//       setNumDays(days + 1);
//     } else {
//       setError('Vui lòng nhập số ngày từ 1 đến 30.');
//     }
//   }, []);

//   useEffect(() => {
//     if (error) {
//       Alert.alert(
//         'Bạn đã nhập sai',
//         error,
//         [
//           {text: 'OK', onPress: () => console.log('OK Pressed')}, // Nút xử lý
//         ],
//         {cancelable: true}, // Cho phép đóng alert bằng cách chạm ra ngoài
//       );
//     }
//   }, [error]);

//   const {labels, datasets} = chartDataRef.current;

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số ngày muốn hiển thị (1 - 30)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numDays - 1} ngày gần đây`}
//           color="black"
//           size={18}
//           styles={{
//             paddingTop: 10,
//             marginBottom: -40,
//           }}
//         />
//       </View>
//       <ScrollView horizontal>
//         <VictoryChart
//           theme={VictoryTheme.clean}
//           width={Math.max(Dimensions.get('window').width, labels.length * 50)}
//           animate={{
//             duration: 200,
//             onLoad: {duration: 200},
//           }}
//           domain={{x: [0.5, labels.length + 0.5]}}>
//           <VictoryAxis
//             tickValues={labels.map((_, i) => i + 1)}
//             tickFormat={t => labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             tickFormat={t => `${t} kWh`}
//             style={{
//               tickLabels: {fontSize: 8, textAnchor: 'end'},
//             }}
//           />
//           <VictoryBar
//             data={datasets.data.map((y, i) => ({
//               x: i + 1,
//               y: y,
//             }))}
//             style={{
//               data: {fill: 'coral'},
//             }}
//             labels={({datum}) => `${datum.y} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={labels.length === 1 ? 3 : 0.5}
//           />
//         </VictoryChart>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingBottom: 20,
//     paddingTop: 10,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default EnergyConsumptionChart;

import database from '@react-native-firebase/database';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';
import TextComponent from '../../components/TextComponent';

const EnergyConsumptionChart = () => {
  const chartDataRef = useRef({
    labels: [] as string[],
    datasets: {data: [] as number[]},
  });

  const [error, setError] = useState<string | null>(null);
  const [triggerRender, setTriggerRender] = useState(false);
  const [flatListData, setFlatListData] = useState<
    {date: string; consumption: number}[]
  >([]);

  const fetchData = useCallback(() => {
    const ref = database().ref('/Energy_use');
    const listener = ref.on('value', snapshot => {
      try {
        const rawData = snapshot.val();
        if (!rawData) {
          throw new Error('Dữ liệu từ Firebase trống hoặc không hợp lệ.');
        }
        const energyData = Object.entries(rawData).map(([key, value]: any) => ({
          date: key.replace('_', ' '),
          totalEnergy: parseFloat(value.totalEnergy || 0),
        }));
        const sortedData = energyData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        // Lấy 8 ngày gần nhất (bao gồm ngày trước đó để tính toán)
        const recentData = sortedData.slice(-8);
        const calculatedData = recentData.map((item, index) => {
          if (index === 0) return null;
          const previousEnergy = recentData[index - 1].totalEnergy;
          const consumption = Math.max(item.totalEnergy - previousEnergy, 0);
          return {
            date: item.date.split(' ')[0],
            consumption: parseFloat(consumption.toFixed(2)),
          };
        });

        const filteredData = calculatedData.filter(Boolean) as {
          date: string;
          consumption: number;
        }[];

        const labels = filteredData.map(item => item.date);
        const data = filteredData.map(item => item.consumption);

        chartDataRef.current = {labels, datasets: {data}};
        setFlatListData(filteredData);
        setTriggerRender(prev => !prev);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      }
    });

    // Cleanup listener on unmount
    return () => ref.off('value', listener);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {labels, datasets} = chartDataRef.current;

  return (
    <View
      style={{
        margin: 10,
        backgroundColor: '#fff',
        paddingBottom: 20,
        paddingTop: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
      }}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TextComponent
          text="Lượng điện tiêu thụ 7 ngày gần đây"
          color="#FF9C43"
          size={15}
          styles={{
            paddingTop: 10,
            marginBottom: -40,
            textTransform: 'uppercase',
          }}
        />
      </View>

      <ScrollView horizontal>
        <VictoryChart
          theme={VictoryTheme.clean}
          width={Math.max(Dimensions.get('window').width, labels.length * 50)}
          animate={{
            duration: 1000,
            onLoad: {duration: 1000},
          }}
          domain={{x: [0.5, labels.length + 0.5]}}>
          <VictoryAxis
            tickValues={labels.map((_, i) => i + 1)}
            tickFormat={t => labels[t - 1]}
            style={{
              tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t} kWh`}
            style={{
              tickLabels: {fontSize: 8, textAnchor: 'end'},
            }}
          />
          <VictoryBar
            data={datasets.data.map((y, i) => ({
              x: i + 1,
              y: y,
            }))}
            style={{
              data: {fill: '#FF9C73'},
            }}
            labels={({datum}) => `${datum.y} kWh`}
            labelComponent={<VictoryTooltip />}
            barRatio={labels.length === 1 ? 3 : 0.8}
          />
        </VictoryChart>
      </ScrollView>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
          <FlatList
            data={flatListData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 40,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: '#ccc',
                }}>
                <TextComponent
                  styles={{
                    borderColor: '#ccc',
                    borderRightWidth: 1,
                    paddingRight: 10,
                  }}
                  text={`${item.date}`}
                  color="black"
                />
                <TextComponent
                  text={`${item.consumption.toFixed(2)} kWh`}
                  color="blue"
                  styles={{textAlign: 'right'}}
                />
              </View>
            )}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default EnergyConsumptionChart;
