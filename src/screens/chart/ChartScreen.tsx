// // // code cũng ok nhưng chưa tối ưu việc re-render
// import database from '@react-native-firebase/database';
// import React, {useEffect, useState} from 'react';
// import {Dimensions, ScrollView, View} from 'react-native';
// import {
//   VictoryAxis,
//   VictoryBar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import TextComponent from '../../components/TextComponent';
// import {colors} from '../../constants/colors';
// import EnergyConsumption from './EnergyConsumption';

// const screenWidth = Dimensions.get('window').width;

// const ChartScreen: React.FC = () => {
//   const [realTimeData, setRealTimeData] = useState<any>({
//     labels: [],
//     datasets: [{data: []}],
//   });
//   const [dailyUsage, setDailyUsage] = useState<number[]>([]);

//   // Hàm parse ngày giờ từ chuỗi
//   const parseDate = (dateString: string) => {
//     return new Date(dateString.replace('_', ' '));
//   };

//   // Sắp xếp dữ liệu theo thời gian
//   const sortDataByTime = (rawData: any) => {
//     const sortedKeys = Object.keys(rawData).sort((a, b) => {
//       return parseDate(a).getTime() - parseDate(b).getTime();
//     });
//     return sortedKeys.reduce((sortedData: any, key: string) => {
//       sortedData[key] = rawData[key];
//       return sortedData;
//     }, {});
//   };

//   // Lấy dữ liệu từ Firebase
//   const fetchRealTimeData = () => {
//     const ref = database().ref('/Energy_use').orderByKey().limitToLast(4);

//     const onDataChange = (snapshot: any) => {
//       let rawData = snapshot.val();
//       if (rawData) {
//         rawData = sortDataByTime(rawData);
//         console.log(rawData);
//         const labels = Object.keys(rawData);
//         const datasets = [
//           {data: Object.values(rawData).map((entry: any) => entry.totalEnergy)},
//         ];
//         setRealTimeData({labels, datasets});
//         // console.log(realTimeData);
//         // Tính toán lượng điện tiêu thụ hàng ngày
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

//   useEffect(() => {
//     fetchRealTimeData();
//   }, []);

//   return (
//     <View style={{flex: 1}}>
//       <ScrollView>
//         {/* Biểu đồ thời gian thực */}
//         <View
//           style={{
//             margin: 10,
//             backgroundColor: colors.white,
//             borderRadius: 10,
//             paddingBottom: 20,
//           }}>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <TextComponent
//               text="Lượng điện tích lũy thời gian thực"
//               color="black"
//               size={18}
//               styles={{
//                 paddingTop: 10,
//                 marginBottom: -40,
//               }}
//             />
//           </View>
//           <VictoryChart
//             theme={VictoryTheme.material}
//             width={screenWidth}
//             animate={{
//               duration: 700,
//               onLoad: {duration: 700},
//               easing: 'linear',
//             }}
//             domain={{x: [0.5, realTimeData.labels.length + 0.5]}} // Dịch domain trục X sang phải
//           >
//             {/* Trục X */}
//             <VictoryAxis
//               tickValues={realTimeData.labels.map((_: any, i: number) => i + 1)} // Tạo tick values (1, 2, 3,...)
//               tickFormat={t => realTimeData.labels[t - 1]} // Gắn nhãn dữ liệu tương ứng
//               style={{
//                 tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
//               }}
//             />
//             {/* Trục Y */}
//             <VictoryAxis
//               dependentAxis
//               tickFormat={t => `${t} kWh`}
//               style={{
//                 tickLabels: {fontSize: 8, textAnchor: 'end'},
//               }}
//             />
//             {/* Dữ liệu cột */}
//             <VictoryBar
//               data={realTimeData.datasets[0].data.map((y: any, i: any) => ({
//                 x: i + 1, // X bắt đầu từ 1
//                 y: parseFloat(y.toFixed(2)),
//               }))}
//               style={{
//                 data: {fill: '#4caf50'},
//               }}
//               labels={({datum}) => `${datum.y} kWh`}
//               labelComponent={<VictoryTooltip />}
//             />
//           </VictoryChart>
//         </View>
//         <View>
//           <EnergyConsumption />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ChartScreen;

import React, {useEffect, useState, useMemo, useRef, useCallback} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';
import database from '@react-native-firebase/database';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import EnergyConsumption from './EnergyConsumption';

const screenWidth = Dimensions.get('window').width;

const ChartScreen: React.FC = () => {
  const [rawData, setRawData] = useState<any>({});
  const realTimeRef = useRef({labels: [], datasets: [{data: []}]});
  const sevenDaysRef = useRef({labels: [], datasets: [{data: []}]});

  // Hàm parse ngày giờ từ chuỗi (memoized)
  const parseDate = useCallback((dateString: string) => {
    return new Date(dateString.replace('_', ' '));
  }, []);

  // Sắp xếp dữ liệu theo thời gian (memoized)
  const sortDataByTime = useCallback(
    (data: any) =>
      Object.keys(data)
        .sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime())
        .reduce((sorted: any, key: string) => {
          sorted[key] = data[key];
          return sorted;
        }, {}),
    [parseDate],
  );

  // Tính toán dữ liệu biểu đồ (memoized)
  const realTimeData = useMemo(() => {
    if (!rawData) return {labels: [], datasets: [{data: []}]};
    const sortedData = sortDataByTime(rawData);
    const labels = Object.keys(sortedData);
    const datasets = [
      {data: Object.values(sortedData).map((entry: any) => entry.totalEnergy)},
    ];
    return {labels, datasets};
  }, [rawData, sortDataByTime]);

  const dailyUsage = useMemo(() => {
    return realTimeData.datasets[0].data
      .map((value, index, arr) =>
        index === 0 ? 0 : arr[index] - arr[index - 1],
      )
      .slice(1);
  }, [realTimeData]);

  // Lấy dữ liệu từ Firebase
  const fetchRealTimeData = useCallback(() => {
    const ref = database().ref('/Energy_use').orderByKey().limitToLast(4);

    const onDataChange = (snapshot: any) => {
      setRawData(snapshot.val());
    };

    ref.on('value', onDataChange);
    return () => ref.off('value', onDataChange);
  }, []);

  useEffect(() => {
    fetchRealTimeData();
  }, [fetchRealTimeData]);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        {/* Biểu đồ thời gian thực */}
        <View
          style={{
            margin: 10,
            backgroundColor: colors.white,
            borderRadius: 10,
            paddingBottom: 20,
          }}>
          <TextComponent
            text="Lượng điện tích lũy thời gian thực"
            color="black"
            size={18}
            styles={{paddingTop: 10, marginBottom: -40}}
          />
          <VictoryChart
            theme={VictoryTheme.material}
            width={screenWidth}
            animate={{
              duration: 700,
              onLoad: {duration: 700},
              easing: 'linear',
            }}
            domain={{x: [0.5, realTimeData.labels.length + 0.5]}}>
            <VictoryAxis
              tickValues={realTimeData.labels.map((_: any, i: number) => i + 1)}
              tickFormat={t => realTimeData.labels[t - 1]}
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
              data={realTimeData.datasets[0].data.map((y: any, i: any) => ({
                x: i + 1,
                y: parseFloat(y.toFixed(2)),
              }))}
              style={{data: {fill: '#4caf50'}}}
              labels={({datum}) => `${datum.y} kWh`}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        </View>
        <View>
          <EnergyConsumption />
        </View>
      </ScrollView>
    </View>
  );
};

export default ChartScreen;
