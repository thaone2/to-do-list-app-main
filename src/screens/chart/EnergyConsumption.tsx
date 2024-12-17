import database from '@react-native-firebase/database';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
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

const EnergyConsumptionChart = () => {
  const chartDataRef = useRef({
    labels: [] as string[],
    datasets: {data: [] as number[]},
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Trạng thái loading
  const [flatListData, setFlatListData] = useState<
    {date: string; consumption: number}[]
  >([]);

  const fetchData = useCallback(() => {
    const ref = database().ref('/Energy_use');

    setIsLoading(true); // Bắt đầu trạng thái tải
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
        setError(null);

        // Thêm thời gian chờ sau khi xử lý dữ liệu
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        setIsLoading(false); // Dừng trạng thái tải khi gặp lỗi
      }
    });

    return () => ref.off('value', listener);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {labels, datasets} = chartDataRef.current;

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
            {
              width: screenWidth - 25,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Image
            // source={require('../../assets/images/Loading2.gif')}
            source={require('../../assets/images/botunscreen.gif')}
            style={{width: 150, height: 150}}
          />
          <TextComponent
            text="Đang tải dữ liệu..."
            color="black"
            size={16}
            styles={[
              {
                textAlign: 'center',
                marginTop: -15,
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
            duration: 200,
            onLoad: {duration: 200},
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
                    // borderRightWidth: 1,
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
