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

// const EnergyTotalMonth = () => {
//   const chartDataRef = useRef({
//     labels: [] as string[],
//     datasets: {data: [] as number[]},
//   });

//   const [numMonths, setNumMonths] = useState(1); // Số tháng mặc định
//   const [error, setError] = useState<string | null>(null);
//   const [triggerRender, setTriggerRender] = useState(false);

//   const fetchData = useCallback(async (months: number) => {
//     try {
//       const snapshot = await database().ref('/Energy_use').once('value');
//       const rawData = snapshot.val();

//       if (!rawData) {
//         throw new Error('Dữ liệu từ Firebase trống hoặc không hợp lệ.');
//       }

//       const energyData = Object.entries(rawData).map(([key, value]: any) => ({
//         date: new Date(key.replace('_', ' ')),
//         totalEnergy: parseFloat(value.totalEnergy || 0),
//       }));

//       const sortedData = energyData.sort(
//         (a, b) => a.date.getTime() - b.date.getTime(),
//       );

//       const currentDate = new Date();
//       const filteredData = [];

//       for (let i = 0; i < months; i++) {
//         const monthStart = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth() - i,
//           1,
//         );
//         const monthEnd = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth() - i + 1,
//           0,
//         );

//         const monthData = sortedData.filter(
//           item => item.date >= monthStart && item.date <= monthEnd,
//         );

//         if (monthData.length > 1) {
//           const energyConsumption =
//             monthData[monthData.length - 1].totalEnergy -
//             monthData[0].totalEnergy;

//           filteredData.push({
//             date: `${monthStart.getMonth() + 1}/${monthStart.getFullYear()}`,
//             consumption: Math.max(energyConsumption, 0),
//           });
//         } else if (monthData.length === 1) {
//           filteredData.push({
//             date: `${monthStart.getMonth() + 1}/${monthStart.getFullYear()}`,
//             consumption: monthData[0].totalEnergy,
//           });
//         } else {
//           filteredData.push({
//             date: `${monthStart.getMonth() + 1}/${monthStart.getFullYear()}`,
//             consumption: 0,
//           });
//         }
//       }

//       filteredData.reverse(); // Hiển thị theo thứ tự thời gian từ cũ đến mới
//       const labels = filteredData.map(item => item.date);
//       const data = filteredData.map(item => item.consumption);

//       chartDataRef.current = {labels, datasets: {data}};
//       setTriggerRender(prev => !prev);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths, fetchData]);

//   const handleInputChange = useCallback((value: string) => {
//     const months = parseInt(value, 10);
//     if (!isNaN(months) && months > 0 && months <= 12) {
//       setNumMonths(months);
//     } else {
//       setError('Vui lòng nhập số tháng từ 1 đến 12.');
//     }
//   }, []);

//   useEffect(() => {
//     if (error) {
//       Alert.alert(
//         'Lỗi nhập liệu',
//         error,
//         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//         {cancelable: true},
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
//         placeholder="Nhập số tháng muốn hiển thị (1 - 12)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
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
//           width={Math.max(Dimensions.get('window').width, labels.length * 70)}
//           animate={{
//             duration: 200,
//             onLoad: {duration: 200},
//           }}
//           domain={{x: [0.5, labels.length + 0.5]}}>
//           <VictoryAxis
//             tickValues={labels.map((_, i) => i + 1)}
//             tickFormat={t => labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 8, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             // tickFormat={t => `${t} kWh`}
//             tickFormat={t => `${t.toFixed(2)} kWh`} // Làm tròn 2 chữ số thập phân
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
//               data: {fill: 'teal'},
//             }}
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={labels.length === 1 ? 2.5 : 0.5}
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

// export default EnergyTotalMonth;

// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
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
// import database from '@react-native-firebase/database';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const EnergyTotalMonth = () => {
//   const chartDataRef = useRef({
//     labels: [] as string[],
//     datasets: {data: [] as number[]},
//     rawData: [] as {date: string; consumption: number}[], // Thêm rawData cho FlatList
//   });

//   const [numMonths, setNumMonths] = useState(1); // Mặc định 1 tháng
//   const [error, setError] = useState<string | null>(null);
//   const [triggerRender, setTriggerRender] = useState(false);

//   const fetchData = useCallback(async (months: number) => {
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

//       // Lọc dữ liệu theo tháng
//       const now = new Date();
//       const monthsData = [];
//       for (let i = 0; i < months; i++) {
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const endOfMonth = new Date(
//           now.getFullYear(),
//           now.getMonth() - i + 1,
//           0,
//         );

//         const filteredMonthData = sortedData.filter(
//           item =>
//             new Date(item.date) >= startOfMonth &&
//             new Date(item.date) <= endOfMonth,
//         );

//         if (filteredMonthData.length) {
//           const startEnergy = filteredMonthData[0].totalEnergy;
//           const endEnergy =
//             filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
//           const consumption = Math.max(endEnergy - startEnergy, 0);
//           monthsData.push({
//             date: `${
//               startOfMonth.getMonth() + 1
//             }/${startOfMonth.getFullYear()}`,
//             consumption: parseFloat(consumption.toFixed(2)),
//           });
//         }
//       }

//       const labels = monthsData.map(item => item.date);
//       const data = monthsData.map(item => item.consumption);

//       chartDataRef.current = {
//         labels,
//         datasets: {data},
//         rawData: monthsData, // Lưu dữ liệu để hiển thị trong FlatList
//       };
//       setTriggerRender(prev => !prev);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths, fetchData]);

//   const handleInputChange = useCallback((value: string) => {
//     const months = parseInt(value, 10);
//     if (!isNaN(months) && months > 0 && months <= 12) {
//       setNumMonths(months);
//     } else {
//       setError('Vui lòng nhập số tháng từ 1 đến 12.');
//     }
//   }, []);

//   useEffect(() => {
//     if (error) {
//       Alert.alert(
//         'Bạn đã nhập sai',
//         error,
//         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//         {cancelable: true},
//       );
//     }
//   }, [error]);

//   const {labels, datasets, rawData} = chartDataRef.current;

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số tháng muốn hiển thị (1 - 12)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
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
//             tickFormat={t => `${t.toFixed(2)} kWh`} // Làm tròn 2 chữ số thập phân
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
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={labels.length === 1 ? 3 : 0.5}
//           />
//         </VictoryChart>
//       </ScrollView>

//       {/* FlatList hiển thị dữ liệu */}
//       <FlatList
//         data={rawData}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({item}) => (
//           <View style={styles.listItem}>
//             <TextComponent text={`Tháng: ${item.date}`} color="black" />
//             <TextComponent
//               text={`Tiêu thụ: ${item.consumption.toFixed(2)} kWh`}
//               color="blue"
//             />
//           </View>
//         )}
//         style={{marginTop: 20}}
//       />
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
//   listItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

// export default EnergyTotalMonth;

// // code moiii gần xong nhưng bị ngược chiều dữ liệu
// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
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
// import database from '@react-native-firebase/database';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const EnergyTotalMonth = () => {
//   const [numMonths, setNumMonths] = useState(1); // Mặc định 1 tháng
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     data: number[];
//     rawData: {date: string; consumption: number}[];
//   }>({labels: [], data: [], rawData: []});
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async (months: number) => {
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

//       // Lọc dữ liệu theo tháng
//       const now = new Date();
//       const monthsData = [];
//       for (let i = 0; i < months; i++) {
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const endOfMonth = new Date(
//           now.getFullYear(),
//           now.getMonth() - i + 1,
//           0,
//         );

//         const filteredMonthData = sortedData.filter(
//           item =>
//             new Date(item.date) >= startOfMonth &&
//             new Date(item.date) <= endOfMonth,
//         );

//         if (filteredMonthData.length) {
//           const startEnergy = filteredMonthData[0].totalEnergy;
//           const endEnergy =
//             filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
//           const consumption = Math.max(endEnergy - startEnergy, 0);
//           monthsData.push({
//             date: `${
//               startOfMonth.getMonth() + 1
//             }/${startOfMonth.getFullYear()}`,
//             consumption: parseFloat(consumption.toFixed(2)),
//           });
//         }
//       }

//       const labels = monthsData.map(item => item.date);
//       const data = monthsData.map(item => item.consumption);

//       setChartData({
//         labels,
//         data,
//         rawData: monthsData,
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths, fetchData]);

//   const handleInputChange = useCallback((value: string) => {
//     const months = parseInt(value, 10);
//     if (!isNaN(months) && months > 0 && months <= 12) {
//       setNumMonths(months);
//     } else {
//       setError('Vui lòng nhập số tháng từ 1 đến 12.');
//     }
//   }, []);

//   useEffect(() => {
//     if (error) {
//       Alert.alert(
//         'Bạn đã nhập sai',
//         error,
//         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//         {cancelable: true},
//       );
//     }
//   }, [error]);

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số tháng muốn hiển thị (1 - 12)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
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
//           width={Math.max(
//             Dimensions.get('window').width,
//             chartData.labels.length * 50,
//           )}
//           animate={{
//             duration: 200,
//             onLoad: {duration: 200},
//           }}
//           domain={{x: [0.5, chartData.labels.length + 0.5]}}>
//           <VictoryAxis
//             tickValues={chartData.labels.map((_, i) => i + 1)}
//             tickFormat={t => chartData.labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             tickFormat={t => `${t.toFixed(2)} kWh`} // Làm tròn 2 chữ số thập phân
//             style={{
//               tickLabels: {fontSize: 8, textAnchor: 'end'},
//             }}
//           />
//           <VictoryBar
//             data={chartData.data.map((y, i) => ({
//               x: i + 1,
//               y: y,
//             }))}
//             style={{
//               data: {fill: 'purple'},
//             }}
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={chartData.labels.length === 1 ? 3 : 0.5}
//           />
//         </VictoryChart>
//       </ScrollView>

//       {/* FlatList hiển thị dữ liệu */}
//       <ScrollView style={{height: 150}}>
//         <FlatList
//           data={chartData.rawData}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({item}) => (
//             <View style={styles.listItem}>
//               <TextComponent text={`Tháng: ${item.date}`} color="black" />
//               <TextComponent
//                 text={`Tiêu thụ: ${item.consumption.toFixed(2)} kWh`}
//                 color="blue"
//               />
//             </View>
//           )}
//           style={{marginTop: 20}}
//         />
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
//   listItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

// export default EnergyTotalMonth;

// import database from '@react-native-firebase/database';
// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
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

// const EnergyTotalMonth = () => {
//   const [numMonths, setNumMonths] = useState(1); // Mặc định 1 tháng
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     data: number[];
//     rawData: {date: string; consumption: number}[];
//   }>({labels: [], data: [], rawData: []});
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async (months: number) => {
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

//       // Lọc dữ liệu theo tháng
//       const now = new Date();
//       const monthsData = [];
//       for (let i = 0; i < months; i++) {
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const endOfMonth = new Date(
//           now.getFullYear(),
//           now.getMonth() - i + 1,
//           0,
//         );

//         const filteredMonthData = sortedData.filter(
//           item =>
//             new Date(item.date) >= startOfMonth &&
//             new Date(item.date) <= endOfMonth,
//         );

//         if (filteredMonthData.length) {
//           const startEnergy = filteredMonthData[0].totalEnergy;
//           const endEnergy =
//             filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
//           const consumption = Math.max(endEnergy - startEnergy, 0);
//           monthsData.push({
//             date: `${
//               startOfMonth.getMonth() + 1
//             }/${startOfMonth.getFullYear()}`,
//             consumption: parseFloat(consumption.toFixed(2)),
//           });
//         }
//       }

//       // Đảo ngược thứ tự từ quá khứ -> hiện tại
//       const reversedMonthsData = monthsData.reverse();

//       const labels = reversedMonthsData.map(item => item.date);
//       const data = reversedMonthsData.map(item => item.consumption);

//       setChartData({
//         labels,
//         data,
//         rawData: reversedMonthsData,
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths, fetchData]);

//   const handleInputChange = useCallback((value: string) => {
//     const months = parseInt(value, 10);
//     if (!isNaN(months) && months > 0 && months <= 12) {
//       setNumMonths(months);
//     } else {
//       setError('Vui lòng nhập số tháng từ 1 đến 12.');
//     }
//   }, []);

//   //   useEffect(() => {
//   //     if (error) {
//   //       Alert.alert(
//   //         'Bạn đã nhập sai',
//   //         error,
//   //         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//   //         {cancelable: true},
//   //       );
//   //     }
//   //   }, [error]);
//   if (error) {
//     Alert.alert(
//       'Bạn đã nhập sai',
//       error,
//       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//       {cancelable: true},
//     );
//   }

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số tháng muốn hiển thị (1 - 12)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
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
//           width={Math.max(
//             Dimensions.get('window').width,
//             chartData.labels.length * 50,
//           )}
//           animate={{
//             duration: 200,
//             onLoad: {duration: 200},
//           }}
//           domain={{x: [0.5, chartData.labels.length + 0.5]}}>
//           <VictoryAxis
//             tickValues={chartData.labels.map((_, i) => i + 1)}
//             tickFormat={t => chartData.labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             tickFormat={t => `${t.toFixed(2)} kWh`}
//             style={{
//               tickLabels: {fontSize: 8, textAnchor: 'end'},
//             }}
//           />
//           <VictoryBar
//             data={chartData.data.map((y, i) => ({
//               x: i + 1,
//               y: y,
//             }))}
//             style={{
//               data: {fill: 'purple'},
//             }}
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={chartData.labels.length === 1 ? 3 : 0.5}
//           />
//         </VictoryChart>
//       </ScrollView>
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center', // Căn giữa theo chiều ngang
//           justifyContent: 'center', // Căn giữa theo chiều dọc
//         }}>
//         <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
//           <FlatList
//             data={chartData.rawData}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item}) => (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   paddingHorizontal: 20, // Cung cấp khoảng cách bên ngoài cho từng phần tử
//                   justifyContent: 'space-between', // Căn đều các item trong hàng
//                   alignItems: 'center', // Căn giữa theo chiều dọc
//                   marginVertical: 1, // Khoảng cách giữa các phần tử trong FlatList
//                   paddingVertical: 2, // Khoảng cách dọc bên trong
//                   borderBottomWidth: 1,
//                   borderBottomColor: '#ccc',
//                 }}>
//                 <TextComponent
//                   styles={{marginRight: 24}}
//                   text={`Tháng: ${item.date}`}
//                   color="black"
//                 />
//                 <TextComponent
//                   text={`Tiêu thụ: ${item.consumption.toFixed(2)} kWh`}
//                   color="blue"
//                   styles={{textAlign: 'right'}} // Căn chữ này sang phải nếu cần
//                 />
//               </View>
//             )}
//           />
//         </ScrollView>
//       </View>
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
//     paddingHorizontal: 10,
//   },
// });

// export default EnergyTotalMonth;

// code ok nhưng còn cache

// import database from '@react-native-firebase/database';
// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
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
// import {debounce} from 'lodash'; // Import lodash debounce function

// const EnergyTotalMonth = () => {
//   const [numMonths, setNumMonths] = useState(1); // Mặc định 1 tháng
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     data: number[];
//     rawData: {date: string; consumption: number}[];
//   }>({labels: [], data: [], rawData: []});
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async (months: number) => {
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

//       const now = new Date();
//       const monthsData = [];
//       for (let i = 0; i < months; i++) {
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const endOfMonth = new Date(
//           now.getFullYear(),
//           now.getMonth() - i + 1,
//           0,
//         );

//         const filteredMonthData = sortedData.filter(
//           item =>
//             new Date(item.date) >= startOfMonth &&
//             new Date(item.date) <= endOfMonth,
//         );

//         if (filteredMonthData.length) {
//           const startEnergy = filteredMonthData[0].totalEnergy;
//           const endEnergy =
//             filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
//           const consumption = Math.max(endEnergy - startEnergy, 0);
//           monthsData.push({
//             date: `${
//               startOfMonth.getMonth() + 1
//             }/${startOfMonth.getFullYear()}`,
//             consumption: parseFloat(consumption.toFixed(2)),
//           });
//         }
//       }

//       const reversedMonthsData = monthsData.reverse();

//       const labels = reversedMonthsData.map(item => item.date);
//       const data = reversedMonthsData.map(item => item.consumption);

//       setChartData({
//         labels,
//         data,
//         rawData: reversedMonthsData,
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths, fetchData]);

//   // Debounced input handler
//   const handleInputChange = useCallback(
//     debounce((value: string) => {
//       // Nếu giá trị không trống và hợp lệ (1 - 12)
//       if (value.trim() === '') {
//         setError(null); // Nếu người dùng xóa hết, không có lỗi
//         return;
//       }
//       const months = parseInt(value, 10);
//       // Kiểm tra giá trị nhập vào
//       if (!isNaN(months) && months > 0 && months <= 12) {
//         setNumMonths(months); // Cập nhật số tháng
//         setError(null); // Xóa lỗi khi đầu vào hợp lệ
//       } else {
//         setError('Vui lòng nhập số tháng từ 1 đến 12.');
//       }
//     }, 1000), // Delay of 500ms sau khi người dùng dừng nhập
//     [],
//   );

//   // Show error only when it occurs
//   //   useEffect(() => {
//   //     if (error) {
//   //       Alert.alert(
//   //         'Bạn đã nhập sai',
//   //         error,
//   //         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//   //         {cancelable: true},
//   //       );
//   //     }
//   //   }, [error]);
//   if (error) {
//     Alert.alert(
//       'Bạn đã nhập sai',
//       error,
//       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//       {cancelable: true},
//     );
//   }

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số tháng muốn hiển thị (1 - 12)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
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
//           width={Math.max(
//             Dimensions.get('window').width,
//             chartData.labels.length * 50,
//           )}
//           animate={{duration: 200, onLoad: {duration: 200}}}
//           domain={{x: [0.5, chartData.labels.length + 0.5]}}>
//           <VictoryAxis
//             tickValues={chartData.labels.map((_, i) => i + 1)}
//             tickFormat={t => chartData.labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             tickFormat={t => `${t.toFixed(2)} kWh`}
//             style={{
//               tickLabels: {fontSize: 8, textAnchor: 'end'},
//             }}
//           />
//           <VictoryBar
//             data={chartData.data.map((y, i) => ({
//               x: i + 1,
//               y: y,
//             }))}
//             style={{
//               data: {fill: 'purple'},
//             }}
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={chartData.labels.length === 1 ? 3 : 0.5}
//           />
//         </VictoryChart>
//       </ScrollView>
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center', // Căn giữa theo chiều ngang
//           justifyContent: 'center', // Căn giữa theo chiều dọc
//         }}>
//         <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
//           <FlatList
//             data={chartData.rawData}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item}) => (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   paddingHorizontal: 20, // Cung cấp khoảng cách bên ngoài cho từng phần tử
//                   justifyContent: 'space-between', // Căn đều các item trong hàng
//                   alignItems: 'center', // Căn giữa theo chiều dọc
//                   marginVertical: 1, // Khoảng cách giữa các phần tử trong FlatList
//                   paddingVertical: 2, // Khoảng cách dọc bên trong
//                   borderBottomWidth: 1,
//                   borderBottomColor: '#ccc',
//                 }}>
//                 <TextComponent
//                   styles={{marginRight: 24}}
//                   text={`Tháng: ${item.date}`}
//                   color="black"
//                 />
//                 <TextComponent
//                   text={`Tiêu thụ: ${item.consumption.toFixed(2)} kWh`}
//                   color="blue"
//                   styles={{textAlign: 'right'}} // Căn chữ này sang phải nếu cần
//                 />
//               </View>
//             )}
//           />
//         </ScrollView>
//       </View>
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
//     paddingHorizontal: 10,
//   },
//   listItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 20,
//   },
// });

// export default EnergyTotalMonth;

// import database from '@react-native-firebase/database';
// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
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
// import {debounce} from 'lodash'; // Import lodash debounce function

// const EnergyTotalMonth = () => {
//   const [numMonths, setNumMonths] = useState(1); // Mặc định 1 tháng
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     data: number[];
//     rawData: {date: string; consumption: number}[];
//   }>({labels: [], data: [], rawData: []});
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async (months: number) => {
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

//       const now = new Date();
//       const monthsData = [];
//       for (let i = 0; i < months; i++) {
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const endOfMonth = new Date(
//           now.getFullYear(),
//           now.getMonth() - i + 1,
//           0,
//         );

//         const filteredMonthData = sortedData.filter(
//           item =>
//             new Date(item.date) >= startOfMonth &&
//             new Date(item.date) <= endOfMonth,
//         );

//         if (filteredMonthData.length) {
//           const startEnergy = filteredMonthData[0].totalEnergy;
//           const endEnergy =
//             filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
//           const consumption = Math.max(endEnergy - startEnergy, 0);
//           monthsData.push({
//             date: `${
//               startOfMonth.getMonth() + 1
//             }/${startOfMonth.getFullYear()}`,
//             consumption: parseFloat(consumption.toFixed(2)),
//           });
//         }
//       }

//       const reversedMonthsData = monthsData.reverse();

//       const labels = reversedMonthsData.map(item => item.date);
//       const data = reversedMonthsData.map(item => item.consumption);

//       setChartData({
//         labels,
//         data,
//         rawData: reversedMonthsData,
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths, fetchData]);

//   // Debounced input handler
//   const handleInputChange = useCallback(
//     debounce((value: string) => {
//       // Nếu giá trị không trống và hợp lệ (1 - 12)
//       if (value.trim() === '') {
//         setError(null); // Nếu người dùng xóa hết, không có lỗi
//         return;
//       }
//       const months = parseInt(value, 10);
//       // Kiểm tra giá trị nhập vào
//       if (!isNaN(months) && months > 0 && months <= 12) {
//         setNumMonths(months); // Cập nhật số tháng
//         setError(null); // Xóa lỗi khi đầu vào hợp lệ
//       } else {
//         setError('Vui lòng nhập số tháng từ 1 đến 12.');
//       }
//     }, 1000), // Delay of 1000ms sau khi người dùng dừng nhập
//     [],
//   );

//   // Show error only when it occurs
//   if (error) {
//     Alert.alert(
//       'Bạn đã nhập sai',
//       error,
//       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//       {cancelable: true},
//     );
//   }

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số tháng muốn hiển thị (1 - 12)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
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
//           width={Math.max(
//             Dimensions.get('window').width,
//             chartData.labels.length * 50,
//           )}
//           animate={{duration: 200, onLoad: {duration: 200}}}
//           domain={{x: [0.5, chartData.labels.length + 0.5]}}>
//           <VictoryAxis
//             tickValues={chartData.labels.map((_, i) => i + 1)}
//             tickFormat={t => chartData.labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             tickFormat={t => `${t.toFixed(2)} kWh`}
//             style={{
//               tickLabels: {fontSize: 8, textAnchor: 'end'},
//             }}
//           />
//           <VictoryBar
//             data={chartData.data.map((y, i) => ({
//               x: i + 1,
//               y: y,
//             }))}
//             style={{
//               data: {fill: 'purple'},
//             }}
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={chartData.labels.length === 1 ? 3 : 0.5}
//           />
//         </VictoryChart>
//       </ScrollView>
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center', // Căn giữa theo chiều ngang
//           justifyContent: 'center', // Căn giữa theo chiều dọc
//         }}>
//         <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
//           <FlatList
//             data={chartData.rawData}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item}) => (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   paddingHorizontal: 20, // Cung cấp khoảng cách bên ngoài cho từng phần tử
//                   justifyContent: 'space-between', // Căn đều các item trong hàng
//                   alignItems: 'center', // Căn giữa theo chiều dọc
//                   marginVertical: 1, // Khoảng cách giữa các phần tử trong FlatList
//                   paddingVertical: 2, // Khoảng cách dọc bên trong
//                   borderBottomWidth: 1,
//                   borderBottomColor: '#ccc',
//                 }}>
//                 <TextComponent
//                   styles={{marginRight: 24}}
//                   text={`Tháng: ${item.date}`}
//                   color="black"
//                 />
//                 <TextComponent
//                   text={`Tiêu thụ: ${item.consumption.toFixed(2)} kWh`}
//                   color="blue"
//                   styles={{textAlign: 'right'}} // Căn chữ này sang phải nếu cần
//                 />
//               </View>
//             )}
//           />
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     margin: 10,
//     backgroundColor: '#fff',
//     paddingBottom: 50,
//     flex: 1,
//   },
// });

// export default EnergyTotalMonth;

// import database from '@react-native-firebase/database';
// import React, {useEffect, useState} from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
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
// import {debounce} from 'lodash'; // Import lodash debounce function

// const EnergyTotalMonth = () => {
//   const [numMonths, setNumMonths] = useState(1); // Mặc định 1 tháng
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     data: number[];
//     rawData: {date: string; consumption: number}[];
//   }>({labels: [], data: [], rawData: []});
//   const [error, setError] = useState<string | null>(null);

//   // Fetch data without useCallback
//   const fetchData = async (months: number) => {
//     try {
//       const snapshot = await database().ref('/Energy_use').once('value');
//       const rawData = snapshot.val();

//       if (!rawData) {
//         throw new Error('Dữ liệu từ Firebase trống hoặc không hợp lệ.');
//       }

//       // Map data into the format needed
//       const energyData = Object.entries(rawData).map(([key, value]: any) => ({
//         date: key.replace('_', ' '),
//         totalEnergy: parseFloat(value.totalEnergy || 0),
//       }));

//       // Sort data by date
//       const sortedData = energyData.sort(
//         (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
//       );

//       const now = new Date();
//       const monthsData = [];

//       // Loop to get the data for the last 'months' number of months
//       for (let i = 0; i < months; i++) {
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const endOfMonth = new Date(
//           now.getFullYear(),
//           now.getMonth() - i + 1,
//           0,
//         );

//         // Filter the data for each month
//         const filteredMonthData = sortedData.filter(
//           item =>
//             new Date(item.date).getFullYear() === startOfMonth.getFullYear() &&
//             new Date(item.date).getMonth() === startOfMonth.getMonth(),
//         );

//         if (filteredMonthData.length) {
//           const startEnergy = filteredMonthData[0].totalEnergy;
//           const endEnergy =
//             filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
//           const consumption = Math.max(endEnergy - startEnergy, 0);

//           // Push month data to the monthsData array
//           monthsData.push({
//             date: `${
//               startOfMonth.getMonth() + 1
//             }/${startOfMonth.getFullYear()}`,
//             consumption: parseFloat(consumption.toFixed(2)),
//           });
//         }
//       }

//       // Reverse the data to show the latest month first
//       const reversedMonthsData = monthsData.reverse();

//       // Set chart data
//       const labels = reversedMonthsData.map(item => item.date);
//       const data = reversedMonthsData.map(item => item.consumption);

//       setChartData({
//         labels,
//         data,
//         rawData: reversedMonthsData,
//       });
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//     }
//   };

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths]);

//   // Debounced input handler
//   const handleInputChange = debounce((value: string) => {
//     // Nếu giá trị không trống và hợp lệ (1 - 12)
//     if (value.trim() === '') {
//       setError(null); // Nếu người dùng xóa hết, không có lỗi
//       return;
//     }
//     const months = parseInt(value, 10);
//     // Kiểm tra giá trị nhập vào
//     if (!isNaN(months) && months > 0 && months <= 12) {
//       setNumMonths(months); // Cập nhật số tháng
//       setError(null); // Xóa lỗi khi đầu vào hợp lệ
//     } else {
//       setError('Vui lòng nhập số tháng từ 1 đến 12.');
//     }
//   }, 1000); // Delay of 1000ms sau khi người dùng dừng nhập

//   // Show error only when it occurs
//   if (error) {
//     Alert.alert(
//       'Bạn đã nhập sai',
//       error,
//       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//       {cancelable: true},
//     );
//   }

//   return (
//     <View style={styles.chartContainer}>
//       <TextInput
//         style={[
//           globalStyles.inputContainer,
//           {marginHorizontal: 10, color: 'black'},
//         ]}
//         placeholder="Nhập số tháng muốn hiển thị (1 - 12)"
//         placeholderTextColor="gray"
//         keyboardType="numeric"
//         onChangeText={handleInputChange}
//       />
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
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
//           // theme={VictoryTheme.material}
//           theme={VictoryTheme.clean}
//           width={Math.max(
//             Dimensions.get('window').width,
//             chartData.labels.length * 50,
//           )}
//           animate={{duration: 1000, onLoad: {duration: 1000}}}
//           domain={{x: [0.5, chartData.labels.length + 0.5]}}>
//           <VictoryAxis
//             tickValues={chartData.labels.map((_, i) => i + 1)}
//             tickFormat={t => chartData.labels[t - 1]}
//             style={{
//               tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             tickFormat={t => `${t.toFixed(2)} kWh`}
//             style={{
//               tickLabels: {fontSize: 8, textAnchor: 'end'},
//             }}
//           />
//           <VictoryBar
//             data={chartData.data.map((y, i) => ({
//               x: i + 1,
//               y: y,
//             }))}
//             style={{
//               data: {fill: 'purple'},
//             }}
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={chartData.labels.length === 1 ? 3 : 0.5}
//           />
//         </VictoryChart>
//       </ScrollView>
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
//           <FlatList
//             data={chartData.rawData}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item}) => (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   paddingHorizontal: 20,
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginVertical: 1,
//                   paddingVertical: 2,
//                   borderBottomWidth: 1,
//                   borderBottomColor: '#ccc',
//                 }}>
//                 <TextComponent
//                   styles={{marginRight: 24}}
//                   text={`Tháng: ${item.date}`}
//                   color="black"
//                 />
//                 <TextComponent
//                   text={`Tiêu thụ: ${item.consumption.toFixed(2)} kWh`}
//                   color="blue"
//                   styles={{textAlign: 'right'}}
//                 />
//               </View>
//             )}
//           />
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     margin: 10,
//     backgroundColor: '#fff',
//     paddingBottom: 50,
//     flex: 1,
//   },
// });

// export default EnergyTotalMonth;

import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';

const EnergyTotalMonth = () => {
  const [numMonths] = useState(6); // Mặc định hiển thị 6 tháng
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
    rawData: {date: string; consumption: number}[];
  }>({labels: [], data: [], rawData: []});

  const fetchData = (months: number) => {
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

        const now = new Date();
        const monthsData = [];

        for (let i = 0; i < months; i++) {
          const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1,
          );
          const endOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            0,
          );

          const filteredMonthData = sortedData.filter(
            item =>
              new Date(item.date).getFullYear() ===
                startOfMonth.getFullYear() &&
              new Date(item.date).getMonth() === startOfMonth.getMonth(),
          );

          if (filteredMonthData.length) {
            const startEnergy = filteredMonthData[0].totalEnergy;
            const endEnergy =
              filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
            const consumption = Math.max(endEnergy - startEnergy, 0);

            monthsData.push({
              date: `${
                startOfMonth.getMonth() + 1
              }/${startOfMonth.getFullYear()}`,
              consumption: parseFloat(consumption.toFixed(2)),
            });
          }
        }

        const reversedMonthsData = monthsData.reverse();

        const labels = reversedMonthsData.map(item => item.date);
        const data = reversedMonthsData.map(item => item.consumption);

        setChartData({
          labels,
          data,
          rawData: reversedMonthsData,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    });

    // Cleanup listener khi component unmount
    return () => ref.off('value', listener);
  };

  useEffect(() => {
    fetchData(numMonths);
  }, [numMonths]);

  return (
    <View style={styles.chartContainer}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TextComponent
          text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
          color="#4682B4"
          size={15}
          styles={{
            paddingTop: 10,
            marginBottom: -40,
            textTransform: 'uppercase',
            marginTop: 8,
          }}
        />
      </View>
      <ScrollView horizontal>
        <VictoryChart
          theme={VictoryTheme.clean}
          width={Math.max(
            Dimensions.get('window').width,
            chartData.labels.length * 50,
          )}
          animate={{duration: 1000, onLoad: {duration: 1000}}}
          domain={{x: [0.5, chartData.labels.length + 0.5]}}>
          <VictoryAxis
            tickValues={chartData.labels.map((_, i) => i + 1)}
            tickFormat={t => chartData.labels[t - 1]}
            style={{
              tickLabels: {fontSize: 7},
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t.toFixed(2)} kWh`}
            style={{
              tickLabels: {fontSize: 8, textAnchor: 'end'},
            }}
          />
          <VictoryBar
            data={chartData.data.map((y, i) => ({
              x: i + 1,
              y: y,
            }))}
            style={{
              data: {fill: '#C9E6F0'},
            }}
            labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
            labelComponent={<VictoryTooltip />}
            barRatio={chartData.labels.length === 1 ? 3 : 0.8}
          />
        </VictoryChart>
      </ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
          <FlatList
            data={chartData.rawData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              //
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                  justifyContent: 'space-between',
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  flex: 1,
                }}>
                <TextComponent
                  styles={{
                    borderColor: '#ccc',
                    // marginRight: 7,
                  }}
                  text={`Tháng ${item.date}`}
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

const styles = StyleSheet.create({
  chartContainer: {
    margin: 10,
    backgroundColor: '#fff',
    paddingBottom: 20,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    // marginHorizontal: 10,
  },
});

export default EnergyTotalMonth;
