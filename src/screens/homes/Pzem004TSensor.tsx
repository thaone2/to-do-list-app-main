import database from '@react-native-firebase/database';
import React, {useEffect, useRef} from 'react';
import {Dimensions, ImageBackground, View} from 'react-native';

import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';
import {colors} from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;

const Pzem004TSensor = () => {
  const voltageRef = useRef(0);
  const currentRef = useRef(0);
  const frequencyRef = useRef(0);
  const energyRef = useRef(0);

  // useEffect sensor Pzem
  useEffect(() => {
    const voltageRefPath = database().ref('/PZEM_Voltage/voltage');
    const currentRefPath = database().ref('/PZEM_Voltage/current');
    const frequencyRefPath = database().ref('/PZEM_Voltage/frequency');
    const energyRefPath = database().ref('/PZEM_Voltage/energy');

    const handleVoltageUpdate = (snapshot: {val: () => number}) => {
      voltageRef.current = parseFloat(snapshot.val().toFixed(2));
    };

    const handleCurrentUpdate = (snapshot: {val: () => number}) => {
      currentRef.current = parseFloat(snapshot.val().toFixed(2));
    };

    const handleFrequencyUpdate = (snapshot: {val: () => number}) => {
      frequencyRef.current = parseFloat(snapshot.val().toFixed(2));
    };
    const handleEnergyUpdate = (snapshot: {val: () => number}) => {
      energyRef.current = parseFloat(snapshot.val().toFixed(2));
    };

    voltageRefPath.on('value', handleVoltageUpdate);
    currentRefPath.on('value', handleCurrentUpdate);
    frequencyRefPath.on('value', handleFrequencyUpdate);
    energyRefPath.on('value', handleEnergyUpdate);

    // Cleanup function
    return () => {
      voltageRefPath.off('value', handleVoltageUpdate);
      currentRefPath.off('value', handleCurrentUpdate);
      frequencyRefPath.off('value', handleFrequencyUpdate);
      energyRefPath.off('value', handleEnergyUpdate);
    };
  }, []);

  return (
    <SectionComponent>
      <ImageBackground
        source={require('../../assets/images/pzem-004t.jpeg')}
        imageStyle={{borderRadius: 12}}
        style={[
          globalStyles.card,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          },
        ]}>
        <View
          style={[
            globalStyles.inputContainer,
            {
              backgroundColor: 'rgba(190, 198, 200, 0.6)',
              width: screenWidth - 40,
            },
          ]}>
          <View
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <TextComponent
              text="PZEM004T Sensor"
              color="black"
              size={17}
              styles={{fontWeight: 'bold'}}
            />
          </View>
          <View
            style={[
              {
                alignItems: 'center',
                flex: 1,
                // paddingVertical: 4,
                // padding: 4,
              },
            ]}>
            <TextComponent
              text={`Voltage: ${voltageRef.current} V`}
              color="blue"
              size={15}
              styles={{
                fontWeight: 'normal',
                backgroundColor: colors.bgColor,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 8,
                marginVertical: 2,
              }}
            />
            <TextComponent
              text={`Frequency: ${frequencyRef.current} Hz`}
              color="green"
              size={15}
              styles={{
                fontWeight: 'normal',
                backgroundColor: colors.bgColor,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 8,
                marginVertical: 2,
              }}
            />
            <TextComponent
              text={`Current: ${currentRef.current} A`}
              color="#444444"
              size={15}
              styles={{
                fontWeight: 'normal',
                backgroundColor: colors.bgColor,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 8,
                marginVertical: 2,
              }}
            />
            <TextComponent
              text={`Energy: ${energyRef.current} kWh`}
              color="purple"
              size={15}
              styles={{
                fontWeight: 'normal',
                backgroundColor: colors.bgColor,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 8,
                marginVertical: 2,
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </SectionComponent>
  );
};

export default Pzem004TSensor;
