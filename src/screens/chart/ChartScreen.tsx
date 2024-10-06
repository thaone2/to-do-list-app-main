// import React, {useEffect, useState, useRef} from 'react';
// import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
// import Container from '../../components/Container';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';
// import {Dimensions} from 'react-native';
// import database from '@react-native-firebase/database';
// import {
//   VictoryChart,
//   VictoryLine,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import InputComponent from '../../components/InputComponent';

// const screenWidth = Dimensions.get('window').width;

// interface ChartData {
//   labels: string[];
//   datasets: {data: number[]}[];
// }

// const ChartScreen: React.FC = () => {
//   const [data, setData] = useState<ChartData>({
//     labels: [],
//     datasets: [{data: []}],
//   });
//   const [dailyData, setDailyData] = useState<ChartData>({
//     labels: [],
//     datasets: [{data: []}],
//   });
//   const [weeklyData, setWeeklyData] = useState<ChartData>({
//     labels: [],
//     datasets: [{data: []}],
//   });
//   const [monthlyData, setMonthlyData] = useState<ChartData>({
//     labels: [],
//     datasets: [{data: []}],
//   });
//   const [displayCount, setDisplayCount] = useState<number>(5);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [inputValue, setInputValue] = useState<string>('');
//   const chartRef = useRef<any>(null);

//   const formatLabels = (rawLabels: string[]) => {
//     const formattedLabels: string[] = [];
//     let previousDate = '';
//     rawLabels.forEach((label, index) => {
//       const [datePart, timePart] = label.split(' ');
//       if (datePart === previousDate) {
//         formattedLabels.push(timePart);
//       } else {
//         formattedLabels.push(`${datePart}\n${timePart}`);
//         previousDate = datePart;
//       }
//       if (rawLabels.length > 10 && index % 2 !== 0) {
//         formattedLabels[index] = '';
//       }
//     });
//     return formattedLabels;
//   };

//   const sortDataByTime = (rawData: any) => {
//     const sortedKeys = Object.keys(rawData).sort((a: string, b: string) => {
//       return new Date(a).getTime() - new Date(b).getTime();
//     });
//     return sortedKeys.reduce((sortedData: any, key: string) => {
//       sortedData[key] = rawData[key];
//       return sortedData;
//     }, {});
//   };

//   const calculateGroupedData = (groupedData: any) => {
//     const calculatedData: any = {};
//     let prevValue = 0;
//     Object.keys(groupedData).forEach(key => {
//       if (!prevValue) {
//         prevValue = groupedData[key];
//       } else {
//         calculatedData[key] = groupedData[key] - prevValue;
//         prevValue = groupedData[key];
//       }
//     });
//     return calculatedData;
//   };

//   const groupDataBy = (rawData: any, groupBy: string) => {
//     const groupedData: any = {};
//     Object.keys(rawData).forEach(timestamp => {
//       const date = new Date(timestamp);
//       let key: string;
//       switch (groupBy) {
//         case 'day':
//           key = date.toISOString().split('T')[0]; // YYYY-MM-DD
//           break;
//         case 'week':
//           key = `${date.getFullYear()}-W${Math.ceil((date.getDate() - 1) / 7)}`; // YYYY-WW
//           break;
//         case 'month':
//           key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
//           break;
//         case 'year':
//           key = `${date.getFullYear()}`; // YYYY
//           break;
//         default:
//           key = date.toISOString();
//       }
//       if (!groupedData[key]) {
//         groupedData[key] = 0;
//       }
//       groupedData[key] += rawData[timestamp].totalEnergy;
//     });
//     return groupedData;
//   };

//   const fetchData = async () => {
//     try {
//       const snapshot = await database()
//         .ref('/Energy_use')
//         .orderByKey()
//         .limitToLast(displayCount)
//         .once('value');
//       let rawData = snapshot.val();

//       if (rawData) {
//         rawData = sortDataByTime(rawData);

//         const labels = Object.keys(rawData);
//         const formattedLabels = formatLabels(labels);
//         const datasets = [
//           {
//             data: Object.values(rawData).map(entry => entry.totalEnergy),
//           },
//         ];

//         setData({labels: formattedLabels, datasets});

//         const daily = calculateGroupedData(groupDataBy(rawData, 'day'));
//         const weekly = calculateGroupedData(groupDataBy(rawData, 'week'));
//         const monthly = calculateGroupedData(groupDataBy(rawData, 'month'));

//         setDailyData({
//           labels: Object.keys(daily),
//           datasets: [{data: Object.values(daily)}],
//         });
//         setWeeklyData({
//           labels: Object.keys(weekly),
//           datasets: [{data: Object.values(weekly)}],
//         });
//         setMonthlyData({
//           labels: Object.keys(monthly),
//           datasets: [{data: Object.values(monthly)}],
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [displayCount]);

//   const handleSubmit = () => {
//     const parsedValue = parseInt(inputValue, 10);
//     if (!isNaN(parsedValue)) {
//       setDisplayCount(parsedValue);
//     } else {
//       Alert.alert('Vui lòng nhập số hợp lệ');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Loading data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1}}>
//       <Container isScroll>
//         <View style={{flex: 1, marginHorizontal: 20}}>
//           <InputComponent
//             value={inputValue}
//             onChange={setInputValue}
//             placeholder="Nhập số lượng hiển thị"
//             title="Số lượng hiển thị"
//             type="numeric"
//             allowClear
//           />

//           <TouchableOpacity
//             onPress={handleSubmit}
//             style={[
//               globalStyles.inputContainer,
//               {
//                 flex: 1,
//                 backgroundColor: 'coral',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               },
//             ]}>
//             <TextComponent
//               text="Submit"
//               styles={[
//                 {
//                   color: 'white',
//                 },
//               ]}
//             />
//           </TouchableOpacity>

//           {/* Biểu đồ tổng theo ngày */}
//           <TextComponent text="Tổng theo ngày" color="black" />
//           <ScrollView horizontal>
//             <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
//               <VictoryAxis
//                 tickValues={dailyData.labels}
//                 style={{
//                   tickLabels: {fontSize: 10, angle: -45, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryAxis dependentAxis tickFormat={t => `${t} kWh`} />
//               <VictoryLine
//                 data={dailyData.datasets[0].data.map((y, i) => ({
//                   x: dailyData.labels[i],
//                   y,
//                 }))}
//                 style={{data: {stroke: '#c43a31'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//                 labelComponent={<VictoryTooltip />}
//               />
//             </VictoryChart>
//           </ScrollView>

//           {/* Biểu đồ tổng theo tuần */}
//           <TextComponent text="Tổng theo tuần" color="black" />
//           <ScrollView horizontal>
//             <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
//               <VictoryAxis
//                 tickValues={weeklyData.labels}
//                 style={{
//                   tickLabels: {fontSize: 10, angle: -45, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryAxis dependentAxis tickFormat={t => `${t} kWh`} />
//               <VictoryLine
//                 data={weeklyData.datasets[0].data.map((y, i) => ({
//                   x: weeklyData.labels[i],
//                   y,
//                 }))}
//                 style={{data: {stroke: '#c43a31'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//                 labelComponent={<VictoryTooltip />}
//               />
//             </VictoryChart>
//           </ScrollView>

//           {/* Biểu đồ tổng theo tháng */}
//           <TextComponent text="Tổng theo tháng" color="black" />
//           <ScrollView horizontal>
//             <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
//               <VictoryAxis
//                 tickValues={monthlyData.labels}
//                 style={{
//                   tickLabels: {fontSize: 10, angle: -45, textAnchor: 'end'},
//                 }}
//               />
//               <VictoryAxis dependentAxis tickFormat={t => `${t} kWh`} />
//               <VictoryLine
//                 data={monthlyData.datasets[0].data.map((y, i) => ({
//                   x: monthlyData.labels[i],
//                   y,
//                 }))}
//                 style={{data: {stroke: '#c43a31'}}}
//                 labels={({datum}) => `${datum.y} kWh`}
//                 labelComponent={<VictoryTooltip />}
//               />
//             </VictoryChart>
//           </ScrollView>
//         </View>
//       </Container>
//     </View>
//   );
// };

// export default ChartScreen;

import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView} from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
} from 'victory-native';
import database from '@react-native-firebase/database';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';
import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const RealTimeChartScreen: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<{x: number; y: number}[]>(
    [],
  );
  const [maxElectricity, setMaxElectricity] = useState<number>(0);
  const [dailyData, setDailyData] = useState<{x: number; y: number}[]>([]);
  const [weeklyData, setWeeklyData] = useState<{x: number; y: number}[]>([]);
  const [monthlyData, setMonthlyData] = useState<{x: number; y: number}[]>([]);
  const [yearlyData, setYearlyData] = useState<{x: number; y: number}[]>([]);

  // Hàm xử lý khi dữ liệu mới từ Firebase
  const handleDataUpdate = (dataSnapshot: any) => {
    const data = dataSnapshot.val();
    if (data) {
      const sortedKeys = Object.keys(data).sort(
        (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
      );
      const realTimeArray = sortedKeys.map((key: string, index: number) => ({
        // x: index,
        x: new Date(key), // Dùng thời gian thay vì index
        y: data[key].totalEnergy,
      }));
      setRealTimeData(realTimeArray);

      // Cập nhật điện lượng cao nhất
      const maxElectric = Math.max(...realTimeArray.map(item => item.y));
      setMaxElectricity(maxElectric);

      // Xử lý dữ liệu cho biểu đồ ngày, tuần, tháng, năm
      const daily = calculateGroupedData(groupDataBy(data, 'day'));
      const weekly = calculateGroupedData(groupDataBy(data, 'week'));
      const monthly = calculateGroupedData(groupDataBy(data, 'month'));
      const yearly = calculateGroupedData(groupDataBy(data, 'year'));

      setDailyData(
        Object.values(daily).map((value, index) => ({x: index, y: value})),
      );
      setWeeklyData(
        Object.values(weekly).map((value, index) => ({x: index, y: value})),
      );
      setMonthlyData(
        Object.values(monthly).map((value, index) => ({x: index, y: value})),
      );
      setYearlyData(
        Object.values(yearly).map((value, index) => ({x: index, y: value})),
      );
    }
  };

  // Hàm tính toán dữ liệu cho từng nhóm
  const calculateGroupedData = (groupedData: any) => {
    const calculatedData: any = {};
    let prevValue = 0;
    Object.keys(groupedData).forEach(key => {
      if (!prevValue) {
        prevValue = groupedData[key];
      } else {
        calculatedData[key] = groupedData[key] - prevValue;
        prevValue = groupedData[key];
      }
    });
    return calculatedData;
  };

  const groupDataBy = (rawData: any, groupBy: string) => {
    const groupedData: any = {};
    Object.keys(rawData).forEach(timestamp => {
      const date = new Date(timestamp);
      let key: string;
      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'week':
          key = `${date.getFullYear()}-W${Math.ceil((date.getDate() - 1) / 7)}`; // YYYY-WW
          break;
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
          break;
        case 'year':
          key = `${date.getFullYear()}`; // YYYY
          break;
        default:
          key = date.toISOString();
      }
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += rawData[timestamp].totalEnergy;
    });
    return groupedData;
  };

  // Lấy dữ liệu từ Firebase và lắng nghe thay đổi
  useEffect(() => {
    const ref = database().ref('/Energy_use');
    ref.on('value', handleDataUpdate);

    return () => {
      ref.off();
    };
  }, []);

  return (
    <Container isScroll>
      <View style={{marginHorizontal: 20, flex: 1}}>
        {/* Hiển thị điện năng cao nhất */}
        <TextComponent
          text={`Lượng điện cao nhất hiện tại: ${maxElectricity} kWh`}
          color="black"
          styles={[globalStyles.text, {marginBottom: 20, color: 'black'}]}
        />

        {/* Biểu đồ thời gian thực */}
        <TextComponent text="Biểu đồ thời gian thực" color="black" />
        <VictoryChart
          theme={VictoryTheme.material}
          width={screenWidth}
          animate={{
            duration: 1000,
            onLoad: {duration: 1000},
          }}>
          {/* <VictoryAxis /> */}
          <VictoryAxis
            tickFormat={x => {
              const date = new Date(x);
              return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`; // Định dạng HH:MM:SS
            }}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t} kWh`}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryLine
            data={realTimeData}
            style={{data: {stroke: '#c43a31'}}}
          />
        </VictoryChart>

        {/* Biểu đồ ngày */}
        <TextComponent text="Biểu đồ theo ngày" color="black" />
        <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
          <VictoryAxis
            tickFormat={x => {
              const date = new Date(x);
              return `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
            }}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t} kWh`}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryLine data={dailyData} style={{data: {stroke: '#007AFF'}}} />
        </VictoryChart>

        {/* Biểu đồ tuần */}
        <TextComponent text="Biểu đồ theo tuần" color="black" />
        <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
          <VictoryAxis
            tickFormat={x => {
              const date = new Date(x);
              return `Tuần ${Math.ceil(
                date.getDate() / 7,
              )} ${date.getFullYear()}`; // Định dạng Tuần Năm
            }}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t} kWh`}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryLine data={weeklyData} style={{data: {stroke: '#4CAF50'}}} />
        </VictoryChart>

        {/* Biểu đồ tháng */}
        <TextComponent text="Biểu đồ theo tháng" color="black" />
        <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
          <VictoryAxis
            tickFormat={x => {
              const date = new Date(x);
              return `${date.getMonth() + 1}/${date.getFullYear()}`; // Định dạng MM/YYYY
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t} kWh`}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryLine data={monthlyData} style={{data: {stroke: '#FFA726'}}} />
        </VictoryChart>

        {/* Biểu đồ năm */}
        <TextComponent text="Biểu đồ theo năm" color="black" />
        <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
          <VictoryAxis
            tickFormat={x => {
              const date = new Date(x);
              return `${date.getFullYear()}`; // Chỉ hiển thị năm
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t} kWh`}
            style={{
              tickLabels: {fontSize: 9}, // Chỉnh kích thước chữ ở đây
            }}
          />
          <VictoryLine data={yearlyData} style={{data: {stroke: '#673AB7'}}} />
        </VictoryChart>
      </View>
    </Container>
  );
};

export default RealTimeChartScreen;
