import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import ComputerImageComponent from './ComputerImageComponent';
import SwitchComponent from './SwitchComponent';
import TextComponent from './TextComponent';

interface Props {
  isAuto: boolean;
  computerName: string;
  temperature: number;
  switchValue: boolean;
  onSwitchChange: (value: boolean) => void;
}

const ComputerStatusCardProps = (props: Props) => {
  const {isAuto, computerName, temperature, switchValue, onSwitchChange} =
    props;
  return (
    <ComputerImageComponent
      disable={isAuto}
      styles={{
        borderRadius: 12,
        paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
        paddingVertical: 12,
        backgroundColor: 'rgba(106, 248, 253, 0.3)',
      }}>
      <View style={styles.content}>
        <TextComponent
          styles={styles.titleText}
          color="gray"
          size={16}
          text={computerName}
        />
        <TextComponent
          styles={styles.temperatureText}
          color="#F8C266"
          size={13}
          text={
            temperature === -127
              ? 'No reading data'
              : `Temp: ${temperature.toFixed(1)} ℃`
          }
        />
        <SwitchComponent
          showConfirmationDialog={true}
          styles={styles.switch}
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={isAuto}
        />
      </View>
    </ComputerImageComponent>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleText: {
    fontWeight: 'bold',
    backgroundColor: '#F2EAEA',
    padding: 2,
    borderRadius: 10,
  },
  temperatureText: {
    fontWeight: 'bold',
    backgroundColor: '#F2EAEA',
    borderRadius: 10,
    marginTop: 4,
    paddingHorizontal: 5,
  },
  switch: {
    paddingVertical: 8,
  },
});

export default ComputerStatusCardProps;
