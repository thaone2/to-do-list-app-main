// import database from '@react-native-firebase/database';
// import React, {useEffect, useRef, useState} from 'react';
// import {Alert, Dimensions, ScrollView, View} from 'react-native';
// import {
//   VictoryAxis,
//   VictoryChart,
//   VictoryLine,
//   VictoryScatter,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import Container from '../../components/Container';
// import SpaceComponent from '../../components/SpaceComponent';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const screenWidth = Dimensions.get('window').width;

// const ChartScreen: React.FC = () => {
//   const [realTimeData, setRealTimeData] = useState<any>({
//     labels: [],
//     datasets: [{data: []}],
//   });
//   const [monthlyUsage, setMonthlyUsage] = useState<number[]>([]); // Lượng điện sử dụng hàng tháng
//   const [dailyUsage, setDailyUsage] = useState<number[]>([]); // Lượng điện sử dụng hàng ngày

//   const realTimeDataRef = useRef<any>([]);

//   // Tạo mảng 12 tháng gần nhất
//   const getLast12Months = () => {
//     const result = [];
//     const currentDate = new Date();
//     for (let i = 0; i < 12; i++) {
//       const month = new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth() - i,
//         1,
//       );
//       result.unshift(
//         `${month.getMonth() + 1}/${month.getFullYear()}`, // Tạo định dạng Tháng/MM/YYYY
//       );
//     }
//     return result;
//   };

//   // code cũ
//   // Sắp xếp dữ liệu theo thời gian
//   const sortDataByTime = (rawData: any) => {
//     const sortedKeys = Object.keys(rawData).sort((a: string, b: string) => {
//       return new Date(a).getTime() - new Date(b).getTime();
//     });
//     return sortedKeys.reduce((sortedData: any, key: string) => {
//       sortedData[key] = rawData[key];
//       return sortedData;
//     }, {});
//   };

//   // Fetch dữ liệu hàng ngày hiện tại chỉ lấy 1 lần
//   // const fetchRealTimeData = async () => {
//   //   try {
//   //     const snapshot = await database()
//   //       .ref('/Energy_use')
//   //       .orderByKey()
//   //       .limitToLast(8)
//   //       // .on('value');
//   //       .once('value');
//   //     let rawData = snapshot.val();
//   //     if (rawData) {
//   //       rawData = sortDataByTime(rawData);
//   //       const labels = Object.keys(rawData);
//   //       const datasets = [
//   //         {data: Object.values(rawData).map((entry: any) => entry.totalEnergy)},
//   //       ];
//   //       setRealTimeData({labels, datasets});
//   //       realTimeDataRef.current = datasets[0].data.map((y, i) => ({
//   //         x: labels[i],
//   //         y,
//   //       }));

//   //       const dailyUsageData = datasets[0].data
//   //         .map((value, index, arr) => {
//   //           if (index === 0) return 0;
//   //           return arr[index] - arr[index - 1];
//   //         })
//   //         .slice(1);
//   //       setDailyUsage(dailyUsageData);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching real-time data:', error);
//   //   }
//   // };
//   const fetchRealTimeData = () => {
//     const ref = database().ref('/Energy_use').orderByKey().limitToLast(8);

//     const onDataChange = (snapshot: any) => {
//       let rawData = snapshot.val();
//       if (rawData) {
//         rawData = sortDataByTime(rawData);
//         const labels = Object.keys(rawData);
//         const datasets = [
//           {data: Object.values(rawData).map((entry: any) => entry.totalEnergy)},
//         ];
//         // console.log(realTimeData);
//         setRealTimeData({labels, datasets});
//         realTimeDataRef.current = datasets[0].data.map((y, i) => ({
//           x: labels[i],
//           y,
//         }));

//         const dailyUsageData = datasets[0].data
//           .map((value, index, arr) => {
//             if (index === 0) return 0;
//             return arr[index] - arr[index - 1];
//           })
//           .slice(1);
//         setDailyUsage(dailyUsageData);
//       }
//     };

//     // Lắng nghe dữ liệu thay đổi
//     ref.on('value', onDataChange);

//     // Cleanup subscription on component unmount
//     return () => ref.off('value', onDataChange);
//   };

//   useEffect(() => {
//     fetchRealTimeData();
//     fetchMonthlyData();
//   }, []);

//   // useEffect(() => {
//   //   fetchMonthlyData();
//   // }, []);

//   // Fetch dữ liệu từ Firebase cho dữ liệu hàng tháng chỉ lấy một lần
//   // const fetchMonthlyData = async () => {
//   //   try {
//   //     const snapshot = await database()
//   //       .ref('/Energy_use')
//   //       .orderByKey()
//   //       .once('value');
//   //     const rawData = snapshot.val();
//   //     if (rawData) {
//   //       const sortedData = sortDataByTime(rawData);
//   //       const labels = Object.keys(sortedData);
//   //       const energyData = Object.values(sortedData).map(
//   //         (entry: any) => entry.totalEnergy,
//   //       );
//   //       const monthlyUsageData: number[] = [];

//   //       // Tính lượng điện mỗi tháng dựa trên dữ liệu cộng dồn
//   //       for (
//   //         let i = labels.length - 1;
//   //         i >= 0 && monthlyUsageData.length < 12; // Tính đúng 12 tháng
//   //         i--
//   //       ) {
//   //         const currentDate = new Date(labels[i]);
//   //         const currentMonth = currentDate.getMonth();
//   //         const currentYear = currentDate.getFullYear();

//   //         // Kiểm tra xem tháng trước đã được tính chưa
//   //         if (
//   //           monthlyUsageData.length === 0 ||
//   //           currentDate.getMonth() !== new Date(labels[i + 1]).getMonth()
//   //         ) {
//   //           const startOfMonthIndex = labels.findIndex(label => {
//   //             const labelDate = new Date(label);
//   //             return (
//   //               labelDate.getFullYear() === currentYear &&
//   //               labelDate.getMonth() === currentMonth
//   //             );
//   //           });

//   //           const endOfMonthIndex = i;
//   //           const startOfMonthEnergy = energyData[startOfMonthIndex];
//   //           const endOfMonthEnergy = energyData[endOfMonthIndex];

//   //           monthlyUsageData.unshift(endOfMonthEnergy - startOfMonthEnergy); // Thêm vào đầu mảng
//   //         }
//   //       }

//   //       setMonthlyUsage(monthlyUsageData);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching monthly data:', error);
//   //   }
//   // };

//   //Lấy liên tục
//   const fetchMonthlyData = () => {
//     const ref = database().ref('/Energy_use').orderByKey();

//     const onDataChange = (snapshot: any) => {
//       const rawData = snapshot.val();
//       if (rawData) {
//         const sortedData = sortDataByTime(rawData);
//         const labels = Object.keys(sortedData);
//         const energyData = Object.values(sortedData).map(
//           (entry: any) => entry.totalEnergy,
//         );
//         const monthlyUsageData: number[] = [];

//         // Tính lượng điện mỗi tháng dựa trên dữ liệu cộng dồn
//         for (
//           let i = labels.length - 1;
//           i >= 0 && monthlyUsageData.length < 12; // Tính đúng 12 tháng
//           i--
//         ) {
//           const currentDate = new Date(labels[i]);
//           const currentMonth = currentDate.getMonth();
//           const currentYear = currentDate.getFullYear();

//           // Kiểm tra xem tháng trước đã được tính chưa
//           if (
//             monthlyUsageData.length === 0 ||
//             currentDate.getMonth() !== new Date(labels[i + 1]).getMonth()
//           ) {
//             const startOfMonthIndex = labels.findIndex(label => {
//               const labelDate = new Date(label);
//               return (
//                 labelDate.getFullYear() === currentYear &&
//                 labelDate.getMonth() === currentMonth
//               );
//             });

//             const endOfMonthIndex = i;
//             const startOfMonthEnergy = energyData[startOfMonthIndex];
//             const endOfMonthEnergy = energyData[endOfMonthIndex];

//             monthlyUsageData.unshift(endOfMonthEnergy - startOfMonthEnergy); // Thêm vào đầu mảng
//           }
//         }

//         setMonthlyUsage(monthlyUsageData);
//       }
//     };

//     // Lắng nghe dữ liệu thay đổi
//     ref.on('value', onDataChange);

//     // Cleanup subscription on component unmount
//     return () => ref.off('value', onDataChange);
//   };

//   // useEffect(() => {
//   //   fetchMonthlyData();
//   // }, []);

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         <View
//           style={{
//             flex: 1,
//             marginHorizontal: 10,
//             backgroundColor: 'white',
//             borderRadius: 20,
//           }}>
//           {/* Real-time Chart */}
//           <TextComponent
//             text="Realtime data"
//             size={20}
//             color="white"
//             styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
//           />
//           <ScrollView horizontal>
//             <VictoryChart
//               theme={VictoryTheme.material}
//               width={screenWidth}
//               animate={{
//                 duration: 1000,
//                 onLoad: {duration: 1000},
//               }}>
//               <VictoryAxis
//                 tickValues={realTimeData.labels}
//                 style={{
//                   tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={t => `${t} kWh`}
//                 style={{tickLabels: {fontSize: 8, textAnchor: 'end'}}}
//               />
//               <VictoryLine
//                 data={realTimeData.datasets[0].data.map((y: any, i: any) => ({
//                   x: realTimeData.labels[i],
//                   y: parseFloat(y.toFixed(2)),
//                 }))}
//                 style={{data: {stroke: '#c43a31'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//               />
//               <VictoryScatter
//                 data={realTimeDataRef.current}
//                 size={7}
//                 style={{data: {fill: 'coral'}}}
//                 labelComponent={<VictoryTooltip />}
//                 events={[
//                   {
//                     target: 'data',
//                     eventHandlers: {
//                       onPress: (event, props) => {
//                         const {datum} = props;
//                         Alert.alert(
//                           `${datum.x} là: \n ${datum.y.toFixed(2)} kWh`,
//                         );
//                       },
//                     },
//                   },
//                 ]}
//               />
//             </VictoryChart>
//           </ScrollView>

//           {/* Histogram - Daily Usage  */}
//           <SpaceComponent height={14} />
//           <TextComponent
//             text="Lượng điện sử dụng trong 7 ngày trước"
//             color="white"
//             size={20}
//             styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
//           />
//           <ScrollView horizontal>
//             <VictoryChart
//               theme={VictoryTheme.material}
//               width={screenWidth}
//               // animate={{
//               //   duration: 1000,
//               //   onLoad: {duration: 1000},
//               // }}
//             >
//               <VictoryAxis
//                 tickValues={realTimeData.labels.slice(1)}
//                 style={{
//                   tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={t => `${t} kWh`}
//                 style={{
//                   tickLabels: {fontSize: 8, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryLine
//                 data={dailyUsage.map((y, i) => ({
//                   x: realTimeData.labels[i + 1],
//                   y: parseFloat(y.toFixed(2)), // Làm tròn dữ liệu thành 2 chữ số thập phân
//                 }))}
//                 // style={{data: {fill: 'white'}}}
//               />
//               {/* Thêm Scatter points cho Daily Usage */}
//               <VictoryScatter
//                 data={dailyUsage.map((y, i) => ({
//                   x: realTimeData.labels[i + 1],
//                   y: parseFloat(y.toFixed(2)), // Làm tròn 2 chữ số thập phân
//                 }))}
//                 size={7}
//                 style={{data: {fill: 'blue'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//                 // labelComponent={<VictoryTooltip />}
//                 events={[
//                   {
//                     target: 'data',
//                     eventHandlers: {
//                       onPress: (event, props) => {
//                         const {datum} = props;
//                         Alert.alert(
//                           `Lượng điện ${datum.x} là: \n ${datum.y.toFixed(
//                             2,
//                           )} kWh`,
//                         );
//                       },
//                     },
//                   },
//                 ]}
//               />
//             </VictoryChart>
//           </ScrollView>
//           {/* Monthly Usage Chart */}
//           <SpaceComponent height={14} />
//           <TextComponent
//             text="Lượng điện sử dụng hàng tháng"
//             size={20}
//             color="white"
//             styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
//           />
//           <ScrollView horizontal>
//             <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
//               <VictoryAxis
//                 tickValues={getLast12Months()} // Sử dụng hàm này để lấy nhãn tháng
//                 style={{
//                   tickLabels: {fontSize: 8, angle: -25, textAnchor: 'end'},
//                 }}
//               />

//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={t => `${t} kWh`}
//                 style={{tickLabels: {fontSize: 8, textAnchor: 'end'}}}
//               />

//               <VictoryLine
//                 data={monthlyUsage.map((y, i) => ({
//                   x: getLast12Months()[i], // Cập nhật x để lấy nhãn từ getLast12Months
//                   y: parseFloat(y.toFixed(2)),
//                 }))}
//                 style={{data: {stroke: '#c43a31'}}}
//               />

//               <VictoryScatter
//                 data={monthlyUsage.map((y, i) => ({
//                   x: getLast12Months()[i], // Cập nhật x để lấy nhãn từ getLast12Months
//                   y: parseFloat(y.toFixed(2)),
//                 }))}
//                 size={7}
//                 style={{data: {fill: 'orange'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//                 events={[
//                   {
//                     target: 'data',
//                     eventHandlers: {
//                       onPress: (event, props) => {
//                         const {datum} = props;
//                         Alert.alert(
//                           `Lượng điện ${datum.x} là: \n \t ${datum.y.toFixed(
//                             2,
//                           )} kWh`,
//                         );
//                       },
//                     },
//                   },
//                 ]}
//               />
//             </VictoryChart>
//           </ScrollView>
//         </View>
//       </Container>
//     </View>
//   );
// };

// export default ChartScreen;

// import database from '@react-native-firebase/database';
// import React, {useEffect, useRef, useState} from 'react';
// import {Alert, Dimensions, ScrollView, View} from 'react-native';
// import {
//   VictoryAxis,
//   VictoryChart,
//   VictoryLine,
//   VictoryScatter,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import Container from '../../components/Container';
// import SpaceComponent from '../../components/SpaceComponent';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';

// const screenWidth = Dimensions.get('window').width;

// const ChartScreen: React.FC = () => {
//   const [realTimeData, setRealTimeData] = useState<any>({
//     labels: [],
//     datasets: [{data: []}],
//   });
//   const [monthlyUsage, setMonthlyUsage] = useState<number[]>([]);
//   const [dailyUsage, setDailyUsage] = useState<number[]>([]);

//   const realTimeDataRef = useRef<any>([]);

//   // Helper to create date format parsing as 'YYYY-MM-DD_HH:mm:ss'
//   const parseDate = (dateString: string) => {
//     return new Date(dateString.replace('_', ' '));
//   };

//   // Sort data based on date-time format
//   const sortDataByTime = (rawData: any) => {
//     const sortedKeys = Object.keys(rawData).sort((a, b) => {
//       return parseDate(a).getTime() - parseDate(b).getTime();
//     });
//     return sortedKeys.reduce((sortedData: any, key: string) => {
//       sortedData[key] = rawData[key];
//       return sortedData;
//     }, {});
//   };

//   const fetchRealTimeData = () => {
//     const ref = database().ref('/Energy_use').orderByKey().limitToLast(8);

//     const onDataChange = (snapshot: any) => {
//       let rawData = snapshot.val();
//       if (rawData) {
//         rawData = sortDataByTime(rawData);
//         const labels = Object.keys(rawData);
//         const datasets = [
//           {data: Object.values(rawData).map((entry: any) => entry.totalEnergy)},
//         ];
//         setRealTimeData({labels, datasets});
//         realTimeDataRef.current = datasets[0].data.map((y, i) => ({
//           x: labels[i],
//           y,
//         }));

//         const dailyUsageData = datasets[0].data
//           .map((value, index, arr) =>
//             index === 0 ? 0 : arr[index] - arr[index - 1],
//           )
//           .slice(1);
//         setDailyUsage(dailyUsageData);
//       }
//     };

//     ref.on('value', onDataChange);
//     return () => ref.off('value', onDataChange);
//   };

//   const fetchMonthlyData = () => {
//     const ref = database().ref('/Energy_use').orderByKey();

//     const onDataChange = (snapshot: any) => {
//       const rawData = snapshot.val();
//       if (rawData) {
//         const sortedData = sortDataByTime(rawData);
//         const labels = Object.keys(sortedData);
//         const energyData = Object.values(sortedData).map(
//           (entry: any) => entry.totalEnergy,
//         );
//         const monthlyUsageData: number[] = [];

//         for (
//           let i = labels.length - 1;
//           i >= 0 && monthlyUsageData.length < 12;
//           i--
//         ) {
//           const currentDate = parseDate(labels[i]);
//           const currentMonth = currentDate.getMonth();
//           const currentYear = currentDate.getFullYear();

//           if (
//             monthlyUsageData.length === 0 ||
//             currentDate.getMonth() !== parseDate(labels[i + 1]).getMonth()
//           ) {
//             const startOfMonthIndex = labels.findIndex(label => {
//               const labelDate = parseDate(label);
//               return (
//                 labelDate.getFullYear() === currentYear &&
//                 labelDate.getMonth() === currentMonth
//               );
//             });

//             const endOfMonthIndex = i;
//             const startOfMonthEnergy = energyData[startOfMonthIndex];
//             const endOfMonthEnergy = energyData[endOfMonthIndex];

//             monthlyUsageData.unshift(endOfMonthEnergy - startOfMonthEnergy);
//           }
//         }

//         setMonthlyUsage(monthlyUsageData);
//       }
//     };

//     ref.on('value', onDataChange);
//     return () => ref.off('value', onDataChange);
//   };

//   useEffect(() => {
//     fetchRealTimeData();
//     fetchMonthlyData();
//   }, []);

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         <View
//           style={{
//             flex: 1,
//             marginHorizontal: 10,
//             backgroundColor: 'white',
//             borderRadius: 20,
//           }}>
//           <TextComponent
//             text="Realtime data"
//             size={20}
//             color="white"
//             styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
//           />
//           <ScrollView horizontal>
//             <VictoryChart
//               theme={VictoryTheme.material}
//               width={screenWidth}
//               animate={{duration: 1000, onLoad: {duration: 1000}}}>
//               <VictoryAxis
//                 tickValues={realTimeData.labels}
//                 style={{
//                   tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={t => `${t} kWh`}
//                 style={{tickLabels: {fontSize: 8, textAnchor: 'end'}}}
//               />
//               <VictoryLine
//                 data={realTimeData.datasets[0].data.map((y: any, i: any) => ({
//                   x: realTimeData.labels[i],
//                   y: parseFloat(y.toFixed(2)),
//                 }))}
//                 style={{data: {stroke: '#c43a31'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//               />
//               <VictoryScatter
//                 data={realTimeDataRef.current}
//                 size={7}
//                 style={{data: {fill: 'coral'}}}
//                 labelComponent={<VictoryTooltip />}
//                 events={[
//                   {
//                     target: 'data',
//                     eventHandlers: {
//                       onPress: (event, props) => {
//                         const {datum} = props;
//                         Alert.alert(
//                           `${datum.x} là: \n ${datum.y.toFixed(2)} kWh`,
//                         );
//                       },
//                     },
//                   },
//                 ]}
//               />
//             </VictoryChart>
//           </ScrollView>
//           <SpaceComponent height={14} />
//           <TextComponent
//             text="Lượng điện sử dụng trong 7 ngày trước"
//             color="white"
//             size={20}
//             styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
//           />
//           <ScrollView horizontal>
//             <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
//               <VictoryAxis
//                 tickValues={realTimeData.labels.slice(1)}
//                 style={{
//                   tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={t => `${t} kWh`}
//                 style={{tickLabels: {fontSize: 8, textAnchor: 'end'}}}
//               />
//               <VictoryLine
//                 data={dailyUsage.map((y, i) => ({
//                   x: realTimeData.labels[i + 1],
//                   y: parseFloat(y.toFixed(2)),
//                 }))}
//                 style={{data: {stroke: '#c43a31'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//               />
//             </VictoryChart>
//           </ScrollView>
//         </View>
//       </Container>
//     </View>
//   );
// };

// export default ChartScreen;

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
} from 'victory-native';

const ChartScreen = () => {
  // Dữ liệu cho biểu đồ
  const data = [
    {quarter: 1, earnings: 1000},
    {quarter: 2, earnings: 1500},
    {quarter: 3, earnings: 1750},
    {quarter: 4, earnings: 1900},
    {quarter: 5, earnings: 2000},
  ];

  return (
    <View style={styles.container}>
      <VictoryChart theme={VictoryTheme.material}>
        {/* Trục x */}
        <VictoryAxis
          tickValues={[10, 0, 1, 2, 3, 4, 5, 6, 7]} // Các giá trị hiển thị trên trục x
          // tickFormat={['Q1', 'Q2', 'Q3', 'Q4', 'Q5']} // Nhãn cho các tick
        />
        {/* Trục y */}
        <VictoryAxis dependentAxis tickFormat={x => `${x}k`} />
        {/* Biểu đồ cột */}
        <VictoryBar
          data={data}
          x="quarter" // Dữ liệu trục x
          y="earnings" // Dữ liệu trục y
          style={{
            data: {fill: '#a78bfa', width: 21}, // Style cho cột
          }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
});

export default ChartScreen;
