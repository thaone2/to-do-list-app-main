import React from 'react';
import {ScrollView, View} from 'react-native';
import EnergyConsumption from './EnergyConsumption';
import EnergyRealtime from './EnergyRealtime';
import EnergyTotalMonth from './EnergyTotalMonth';
import {colors} from '../../constants/colors';

const ChartScreen: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 6,
        backgroundColor: colors.bgColor,
      }}>
      <ScrollView>
        {/* Biểu đồ thời gian thực */}
        <EnergyRealtime />
        {/* Biểu đồ 7 ngày */}
        <EnergyConsumption />
        {/* biểu đồ 6 tháng */}
        <EnergyTotalMonth />
      </ScrollView>
    </View>
  );
};

export default ChartScreen;
