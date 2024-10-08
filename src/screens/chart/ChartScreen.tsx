import database from '@react-native-firebase/database';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, ScrollView, View} from 'react-native';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {globalStyles} from '../../styles/globalStyles';
import SpaceComponent from '../../components/SpaceComponent';

const screenWidth = Dimensions.get('window').width;

const ChartScreen: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<any>({
    labels: [],
    datasets: [{data: []}],
  });
  const [monthlyUsage, setMonthlyUsage] = useState<number[]>([]); // Lượng điện sử dụng hàng tháng
  const [dailyUsage, setDailyUsage] = useState<number[]>([]); // Lượng điện sử dụng hàng ngày

  const realTimeDataRef = useRef<any>([]);

  // Tạo mảng 12 tháng gần nhất
  const getLast12Months = () => {
    const result = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      result.unshift(
        `${month.getMonth() + 1}/${month.getFullYear()}`, // Tạo định dạng Tháng/MM/YYYY
      );
    }
    return result;
  };

  // Sắp xếp dữ liệu theo thời gian
  const sortDataByTime = (rawData: any) => {
    const sortedKeys = Object.keys(rawData).sort((a: string, b: string) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    return sortedKeys.reduce((sortedData: any, key: string) => {
      sortedData[key] = rawData[key];
      return sortedData;
    }, {});
  };
  // Fetch dữ liệu hàng ngày hiện tại
  const fetchRealTimeData = async () => {
    try {
      const snapshot = await database()
        .ref('/Energy_use')
        .orderByKey()
        .limitToLast(8)
        .once('value');
      let rawData = snapshot.val();
      if (rawData) {
        rawData = sortDataByTime(rawData);
        const labels = Object.keys(rawData);
        const datasets = [
          {data: Object.values(rawData).map((entry: any) => entry.totalEnergy)},
        ];
        setRealTimeData({labels, datasets});
        realTimeDataRef.current = datasets[0].data.map((y, i) => ({
          x: labels[i],
          y,
        }));

        const dailyUsageData = datasets[0].data
          .map((value, index, arr) => {
            if (index === 0) return 0;
            return arr[index] - arr[index - 1];
          })
          .slice(1);
        setDailyUsage(dailyUsageData);
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  useEffect(() => {
    fetchRealTimeData();
  }, []);

  // Fetch dữ liệu từ Firebase cho dữ liệu hàng tháng
  const fetchMonthlyData = async () => {
    try {
      const snapshot = await database()
        .ref('/Energy_use')
        .orderByKey()
        .once('value');
      const rawData = snapshot.val();
      if (rawData) {
        const sortedData = sortDataByTime(rawData);
        const labels = Object.keys(sortedData);
        const energyData = Object.values(sortedData).map(
          (entry: any) => entry.totalEnergy,
        );
        const monthlyUsageData: number[] = [];

        // Tính lượng điện mỗi tháng dựa trên dữ liệu cộng dồn
        for (
          let i = labels.length - 1;
          i >= 0 && monthlyUsageData.length < 12; // Tính đúng 12 tháng
          i--
        ) {
          const currentDate = new Date(labels[i]);
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          // Kiểm tra xem tháng trước đã được tính chưa
          if (
            monthlyUsageData.length === 0 ||
            currentDate.getMonth() !== new Date(labels[i + 1]).getMonth()
          ) {
            const startOfMonthIndex = labels.findIndex(label => {
              const labelDate = new Date(label);
              return (
                labelDate.getFullYear() === currentYear &&
                labelDate.getMonth() === currentMonth
              );
            });

            const endOfMonthIndex = i;
            const startOfMonthEnergy = energyData[startOfMonthIndex];
            const endOfMonthEnergy = energyData[endOfMonthIndex];

            monthlyUsageData.unshift(endOfMonthEnergy - startOfMonthEnergy); // Thêm vào đầu mảng
          }
        }

        setMonthlyUsage(monthlyUsageData);
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            backgroundColor: 'white',
            borderRadius: 20,
          }}>
          {/* Real-time Chart */}
          <TextComponent
            text="Realtime data"
            size={20}
            color="white"
            styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
          />
          <ScrollView horizontal>
            <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
              <VictoryAxis
                tickValues={realTimeData.labels}
                style={{
                  tickLabels: {fontSize: 7, angle: -25, textAnchor: 'end'},
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={t => `${t} kWh`}
                style={{tickLabels: {fontSize: 8, textAnchor: 'end'}}}
              />
              <VictoryLine
                data={realTimeData.datasets[0].data.map((y: any, i: any) => ({
                  x: realTimeData.labels[i],
                  y: parseFloat(y.toFixed(2)),
                }))}
                style={{data: {stroke: '#c43a31'}}}
                labels={({datum}) => `${datum.y} kWh`}
              />
              <VictoryScatter
                data={realTimeDataRef.current}
                size={5}
                style={{data: {fill: 'coral'}}}
                labelComponent={<VictoryTooltip />}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPress: (event, props) => {
                        const {datum} = props;
                        Alert.alert(
                          `Giá trị tích lũy ${datum.x} là: \n ${datum.y.toFixed(
                            2,
                          )} kWh`,
                        );
                      },
                    },
                  },
                ]}
              />
            </VictoryChart>
          </ScrollView>

          {/* Histogram - Daily Usage  */}
          <SpaceComponent height={14} />
          <TextComponent
            text="Lượng điện sử dụng trong 7 ngày trước"
            color="white"
            size={20}
            styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
          />
          <ScrollView horizontal>
            <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
              <VictoryAxis
                tickValues={realTimeData.labels.slice(1)}
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
              <VictoryLine
                data={dailyUsage.map((y, i) => ({
                  x: realTimeData.labels[i + 1],
                  y: parseFloat(y.toFixed(2)), // Làm tròn dữ liệu thành 2 chữ số thập phân
                }))}
                // style={{data: {fill: 'white'}}}
              />
              {/* Thêm Scatter points cho Daily Usage */}
              <VictoryScatter
                data={dailyUsage.map((y, i) => ({
                  x: realTimeData.labels[i + 1],
                  y: parseFloat(y.toFixed(2)), // Làm tròn 2 chữ số thập phân
                }))}
                size={5}
                style={{data: {fill: 'blue'}}}
                labels={({datum}) => `${datum.y} kWh`}
                // labelComponent={<VictoryTooltip />}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPress: (event, props) => {
                        const {datum} = props;
                        Alert.alert(
                          `Lượng điện ${datum.x} là: \n ${datum.y.toFixed(
                            2,
                          )} kWh`,
                        );
                      },
                    },
                  },
                ]}
              />
            </VictoryChart>
          </ScrollView>
          {/* Monthly Usage Chart */}
          <SpaceComponent height={14} />
          <TextComponent
            text="Lượng điện sử dụng hàng tháng"
            size={20}
            color="white"
            styles={[globalStyles.inputContainer, {backgroundColor: 'coral'}]}
          />
          <ScrollView horizontal>
            <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
              <VictoryAxis
                tickValues={getLast12Months()} // Sử dụng hàm này để lấy nhãn tháng
                style={{
                  tickLabels: {fontSize: 8, angle: -25, textAnchor: 'end'},
                }}
              />

              <VictoryAxis
                dependentAxis
                tickFormat={t => `${t} kWh`}
                style={{tickLabels: {fontSize: 8, textAnchor: 'end'}}}
              />

              <VictoryLine
                data={monthlyUsage.map((y, i) => ({
                  x: getLast12Months()[i], // Cập nhật x để lấy nhãn từ getLast12Months
                  y: parseFloat(y.toFixed(2)),
                }))}
                style={{data: {stroke: '#c43a31'}}}
              />

              <VictoryScatter
                data={monthlyUsage.map((y, i) => ({
                  x: getLast12Months()[i], // Cập nhật x để lấy nhãn từ getLast12Months
                  y: parseFloat(y.toFixed(2)),
                }))}
                size={5}
                style={{data: {fill: 'orange'}}}
                labels={({datum}) => `${datum.y} kWh`}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPress: (event, props) => {
                        const {datum} = props;
                        Alert.alert(
                          `Lượng điện ${datum.x} là: \n \t ${datum.y.toFixed(
                            2,
                          )} kWh`,
                        );
                      },
                    },
                  },
                ]}
              />
            </VictoryChart>
          </ScrollView>
        </View>
      </Container>
    </View>
  );
};

export default ChartScreen;
