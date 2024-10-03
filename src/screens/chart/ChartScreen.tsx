import React, {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import database from '@react-native-firebase/database';

const screenWidth = Dimensions.get('window').width;

const ChartScreen = ({navigation}: any) => {
  const energyDayRef = useRef<number[]>([]);
  const energyWeekRef = useRef<number[]>([]);
  const energyMonthRef = useRef<number[]>([]);

  const [refresh, setRefresh] = useState(false); // Trigger re-render when needed

  // Hàm xử lý để kiểm tra và parse dữ liệu hợp lệ
  const parseFirebaseData = (data: any) => {
    return Object.values(data).map(value => {
      const num = Number(value);
      return isNaN(num) ? 0 : num; // Đổi các giá trị không hợp lệ thành 0
    });
  };

  useEffect(() => {
    const dayRef = database().ref('Energy_use/energy_day');
    const weekRef = database().ref('Energy_use/energy_week');
    const monthRef = database().ref('Energy_use/energy_month');

    const dayListener = dayRef.on('value', snapshot => {
      const data = snapshot.val();
      energyDayRef.current = parseFirebaseData(data);
      setRefresh(prev => !prev); // Trigger a refresh
    });

    const weekListener = weekRef.on('value', snapshot => {
      const data = snapshot.val();
      energyWeekRef.current = parseFirebaseData(data);
      setRefresh(prev => !prev); // Trigger a refresh
    });

    const monthListener = monthRef.on('value', snapshot => {
      const data = snapshot.val();
      energyMonthRef.current = parseFirebaseData(data);
      setRefresh(prev => !prev); // Trigger a refresh
    });

    return () => {
      dayRef.off('value', dayListener);
      weekRef.off('value', weekListener);
      monthRef.off('value', monthListener);
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextComponent
            styles={[
              globalStyles.inputContainer,
              {
                backgroundColor: 'white',
                marginHorizontal: 20,
              },
            ]}
            color="black"
            text="Biểu đồ lượng điện sử dụng"
            size={20}
          />
        </View>

        {/* <View>
          <Text>Lượng điện tiêu thụ hàng ngày</Text>
          <LineChart
            data={{
              labels: Object.keys(energyDayRef.current),
              datasets: [
                {
                  data: energyDayRef.current,
                },
              ],
            }}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={{marginVertical: 10}}
          />
        </View>

        <View>
          <Text>Lượng điện tiêu thụ hàng tuần</Text>
          <LineChart
            data={{
              labels: Object.keys(energyWeekRef.current),
              datasets: [
                {
                  data: energyWeekRef.current,
                },
              ],
            }}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#22a6b3',
              backgroundGradientFrom: '#6dd5ed',
              backgroundGradientTo: '#2193b0',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={{marginVertical: 10}}
          />
        </View>

        <View>
          <Text>Lượng điện tiêu thụ hàng tháng</Text>
          <LineChart
            data={{
              labels: Object.keys(energyMonthRef.current),
              datasets: [
                {
                  data: energyMonthRef.current,
                },
              ],
            }}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#3498db',
              backgroundGradientFrom: '#2980b9',
              backgroundGradientTo: '#6dd5ed',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={{marginVertical: 10}}
          />
        </View> */}
      </Container>
    </View>
  );
};

export default ChartScreen;
