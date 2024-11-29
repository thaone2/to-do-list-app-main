// import database from '@react-native-firebase/database';
// import React, {useEffect, useState} from 'react';
// import {Dimensions, FlatList, ScrollView, StyleSheet, View} from 'react-native';
// import {
//   VictoryAxis,
//   VictoryBar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import TextComponent from '../../components/TextComponent';

// const EnergyTotalMonth = () => {
//   const [numMonths] = useState(6);
//   const [chartData, setChartData] = useState<{
//     labels: string[];
//     data: number[];
//     rawData: {date: string; consumption: number}[];
//   }>({labels: [], data: [], rawData: []});

//   const fetchData = (months: number) => {
//     const ref = database().ref('/Energy_use');

//     const listener = ref.on('value', snapshot => {
//       try {
//         const rawData = snapshot.val();
//         if (!rawData) {
//           throw new Error('Dữ liệu từ Firebase trống hoặc không hợp lệ.');
//         }
//         const energyData = Object.entries(rawData).map(([key, value]: any) => ({
//           date: key.replace('_', ' '),
//           totalEnergy: parseFloat(value.totalEnergy || 0),
//         }));

//         const sortedData = energyData.sort(
//           (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
//         );

//         const now = new Date();
//         const monthsData = [];

//         for (let i = 0; i < months; i++) {
//           const startOfMonth = new Date(
//             now.getFullYear(),
//             now.getMonth() - i,
//             1,
//           );
//           const endOfMonth = new Date(
//             now.getFullYear(),
//             now.getMonth() - i + 1,
//             0,
//           );

//           const filteredMonthData = sortedData.filter(
//             item =>
//               new Date(item.date).getFullYear() ===
//                 startOfMonth.getFullYear() &&
//               new Date(item.date).getMonth() === startOfMonth.getMonth(),
//           );

//           if (filteredMonthData.length) {
//             const startEnergy = filteredMonthData[0].totalEnergy;
//             const endEnergy =
//               filteredMonthData[filteredMonthData.length - 1]?.totalEnergy || 0;
//             const consumption = Math.max(endEnergy - startEnergy, 0);

//             monthsData.push({
//               date: `${
//                 startOfMonth.getMonth() + 1
//               }/${startOfMonth.getFullYear()}`,
//               consumption: parseFloat(consumption.toFixed(2)),
//             });
//           }
//         }

//         const reversedMonthsData = monthsData.reverse();
//         const labels = reversedMonthsData.map(item => item.date);
//         const data = reversedMonthsData.map(item => item.consumption);

//         setChartData({
//           labels,
//           data,
//           rawData: reversedMonthsData,
//         });

//         console.log(chartData);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       }
//     });

//     // Cleanup listener khi component unmount
//     return () => ref.off('value', listener);
//   };

//   useEffect(() => {
//     fetchData(numMonths);
//   }, [numMonths]);

//   return (
//     <View
//       style={{
//         margin: 10,
//         backgroundColor: '#fff',
//         paddingBottom: 20,
//         flex: 1,
//         paddingHorizontal: 10,
//         borderRadius: 12,
//       }}>
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TextComponent
//           text={`Lượng điện tiêu thụ ${numMonths} tháng gần đây`}
//           color="#4682B4"
//           size={15}
//           styles={{
//             paddingTop: 10,
//             marginBottom: -40,
//             textTransform: 'uppercase',
//             marginTop: 8,
//           }}
//         />
//       </View>
//       <ScrollView horizontal>
//         <VictoryChart
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
//               tickLabels: {fontSize: 7},
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
//               data: {fill: '#C9E6F0'},
//             }}
//             labels={({datum}) => `${datum.y.toFixed(2)} kWh`}
//             labelComponent={<VictoryTooltip />}
//             barRatio={chartData.labels.length === 1 ? 3 : 0.8}
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
//                   paddingVertical: 4,
//                   borderWidth: 1,
//                   borderColor: '#ccc',
//                   flex: 1,
//                 }}>
//                 <TextComponent
//                   styles={{
//                     borderColor: '#ccc',
//                   }}
//                   text={`Tháng ${item.date}`}
//                   color="black"
//                 />

//                 <TextComponent
//                   text={`${item.consumption.toFixed(2)} kWh`}
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
//   chartContainer: {},
// });

// export default EnergyTotalMonth;

import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {globalStyles} from '../../styles/globalStyles';

const EnergyTotalMonth = () => {
  const [numMonths] = useState(6);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
    rawData: {date: string; consumption: number}[];
  }>({labels: [], data: [], rawData: []});

  const fetchData = async (months: number) => {
    setIsLoading(true); // Bắt đầu trạng thái tải
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

        setTimeout(() => {
          setIsLoading(false); // Kết thúc trạng thái tải sau khi xử lý
        }, 1000); // Thêm 1 giây để tạo hiệu ứng mượt
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading(false); // Dừng trạng thái tải nếu gặp lỗi
      }
    });

    return () => ref.off('value', listener); // Cleanup listener
  };

  useEffect(() => {
    fetchData(numMonths);
  }, [numMonths]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.bgColor,
        }}>
        {/* <ActivityIndicator size="large" color="blue" /> */}
        <TextComponent
          text="Đang tải dữ liệu..."
          color="black"
          size={18}
          styles={[
            globalStyles.inputContainer,
            {textAlign: 'center', marginTop: 20, width: '96%'},
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        margin: 10,
        backgroundColor: '#fff',
        paddingBottom: 20,
        flex: 1,
        paddingHorizontal: 10,
        borderRadius: 12,
      }}>
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
          animate={{duration: 200, onLoad: {duration: 200}}}
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
  chartContainer: {},
});

export default EnergyTotalMonth;
