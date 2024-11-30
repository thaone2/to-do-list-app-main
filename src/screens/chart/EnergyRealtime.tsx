// Bản cũ chạy ok nhưng chưa có tính năng is loading
// import database from '@react-native-firebase/database';
// import React, {useCallback, useEffect, useMemo, useState} from 'react';
// import {Dimensions, FlatList, ScrollView, View} from 'react-native';
// import {
//   VictoryAxis,
//   VictoryBar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryTooltip,
// } from 'victory-native';
// import TextComponent from '../../components/TextComponent';

// const screenWidth = Dimensions.get('window').width;

// const EnergyRealtime: React.FC = () => {
//   const [rawData, setRawData] = useState<any>({});
//   const parseDate = useCallback((dateString: string) => {
//     return new Date(dateString.replace('_', ' '));
//   }, []);

//   const sortDataByTime = useCallback(
//     (data: any) =>
//       Object.keys(data)
//         .sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime())
//         .reduce((sorted: any, key: string) => {
//           sorted[key] = data[key];
//           return sorted;
//         }, {}),
//     [parseDate],
//   );

//   const sortedRawData = useMemo(() => {
//     return sortDataByTime(rawData);
//   }, [rawData, sortDataByTime]);

//   const realTimeData = useMemo(() => {
//     const labels = Object.keys(sortedRawData);
//     const datasets = [
//       {
//         data: Object.values(sortedRawData).map(
//           (entry: any) => entry.totalEnergy,
//         ),
//       },
//     ];
//     return {labels, datasets};
//   }, [sortedRawData]);

//   const fetchRealTimeData = useCallback(() => {
//     const ref = database().ref('/Energy_use').orderByKey().limitToLast(3);

//     const onDataChange = (snapshot: any) => {
//       setRawData(snapshot.val());
//     };

//     ref.on('value', onDataChange);
//     return () => ref.off('value', onDataChange);
//   }, []);

//   useEffect(() => {
//     fetchRealTimeData();
//   }, [fetchRealTimeData]);

//   return (
//     <View
//       style={{
//         margin: 10,
//         backgroundColor: 'white',
//         borderRadius: 10,
//         paddingBottom: 20,
//       }}>
//       <TextComponent
//         text={`Lượng điện tích lũy gần đây`}
//         color="green"
//         size={15}
//         styles={{
//           paddingTop: 10,
//           marginBottom: -40,
//           textTransform: 'uppercase',
//           textAlign: 'center',
//         }}
//       />

//       {/* Biểu đồ */}
//       <VictoryChart
//         theme={VictoryTheme.clean}
//         width={screenWidth}
//         animate={{
//           duration: 1000,
//           onLoad: {duration: 1000},
//         }}
//         domain={{x: [0.5, realTimeData.labels.length + 0.5]}}>
//         <VictoryAxis
//           tickValues={realTimeData.labels.map((_: any, i: number) => i + 1)}
//           tickFormat={t => realTimeData.labels[t - 1]}
//           style={{tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'}}}
//         />
//         <VictoryAxis
//           dependentAxis
//           tickFormat={t => `${t} kWh`}
//           style={{
//             tickLabels: {fontSize: 7},
//           }}
//         />
//         <VictoryBar
//           data={realTimeData.datasets[0].data.map((y: any, i: any) => ({
//             x: i + 1,
//             y: parseFloat(y.toFixed(2)),
//           }))}
//           style={{data: {fill: '#4caf50'}}}
//           labels={({datum}) => `${datum.y} kWh`}
//           labelComponent={<VictoryTooltip />}
//         />
//       </VictoryChart>

//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <ScrollView horizontal>
//           <FlatList
//             data={Object.entries(sortedRawData)}
//             keyExtractor={(item: any) => item[0]}
//             style={{marginTop: 20, paddingHorizontal: 10}}
//             renderItem={({item}) => {
//               const [date, value] = item;
//               return (
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     paddingHorizontal: 20,
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     paddingVertical: 2,
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                   }}>
//                   <TextComponent
//                     styles={{
//                       marginRight: 14,
//                       borderColor: '#ccc',
//                       borderRightWidth: 1,
//                       paddingRight: 10,
//                     }}
//                     text={`${date.replace('_', ' ')}`}
//                     color="black"
//                   />
//                   <TextComponent
//                     text={`${value.totalEnergy.toFixed(2)} kWh`}
//                     color="blue"
//                     styles={{textAlign: 'right'}}
//                   />
//                 </View>
//               );
//             }}
//           />
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default EnergyRealtime;

import database from '@react-native-firebase/database';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
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

const screenWidth = Dimensions.get('window').width;

const EnergyRealtime: React.FC = () => {
  const [rawData, setRawData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true); // Trạng thái loading

  const parseDate = useCallback((dateString: string) => {
    return new Date(dateString.replace('_', ' '));
  }, []);

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

  const sortedRawData = useMemo(() => {
    return sortDataByTime(rawData);
  }, [rawData, sortDataByTime]);

  const realTimeData = useMemo(() => {
    const labels = Object.keys(sortedRawData);
    const datasets = [
      {
        data: Object.values(sortedRawData).map(
          (entry: any) => entry.totalEnergy,
        ),
      },
    ];
    return {labels, datasets};
  }, [sortedRawData]);

  const fetchRealTimeData = useCallback(() => {
    const ref = database().ref('/Energy_use').orderByKey().limitToLast(3);

    const onDataChange = (snapshot: any) => {
      setRawData(snapshot.val());
      // setIsLoading(false); // Dữ liệu đã được tải xong
      setTimeout(() => {
        setIsLoading(false); // Kết thúc trạng thái tải sau 1.5 giây
      }, 2000);
    };

    setIsLoading(true); // Bắt đầu tải
    ref.on('value', onDataChange);

    return () => ref.off('value', onDataChange);
  }, []);

  useEffect(() => {
    fetchRealTimeData();
  }, [fetchRealTimeData]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.bgColor,
          padding: 20,
        }}>
        <View
          style={[
            globalStyles.inputContainer,
            {marginTop: 20, width: screenWidth - 25},
          ]}>
          <ActivityIndicator size="large" animating={true} color="green" />
          <TextComponent
            text="Đang tải dữ liệu..."
            color="green"
            size={16}
            styles={[
              {
                textAlign: 'center',
                marginTop: 5,
                marginBottom: 5,
                width: screenWidth - 25,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingBottom: 20,
        paddingTop: 8,
      }}>
      <TextComponent
        text={`Lượng điện tích lũy gần đây`}
        color="green"
        size={15}
        styles={{
          paddingTop: 10,
          marginBottom: -40,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      />

      {/* Biểu đồ */}
      <VictoryChart
        theme={VictoryTheme.clean}
        width={screenWidth}
        animate={{
          duration: 1000,
          onLoad: {duration: 1000},
        }}
        domain={{x: [0.5, realTimeData.labels.length + 0.5]}}>
        <VictoryAxis
          tickValues={realTimeData.labels.map((_: any, i: number) => i + 1)}
          tickFormat={t => realTimeData.labels[t - 1]}
          style={{tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'}}}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={t => `${t} kWh`}
          style={{
            tickLabels: {fontSize: 7},
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

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ScrollView horizontal>
          <FlatList
            data={Object.entries(sortedRawData)}
            keyExtractor={(item: any) => item[0]}
            style={{marginTop: 20, paddingHorizontal: 10}}
            renderItem={({item}) => {
              const [date, value] = item;
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 2,
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}>
                  <TextComponent
                    styles={{
                      marginRight: 14,
                      borderColor: '#ccc',
                      borderRightWidth: 1,
                      paddingRight: 10,
                    }}
                    text={`${date.replace('_', ' ')}`}
                    color="black"
                  />
                  <TextComponent
                    text={`${value.totalEnergy.toFixed(2)} kWh`}
                    color="blue"
                    styles={{textAlign: 'right'}}
                  />
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default EnergyRealtime;
