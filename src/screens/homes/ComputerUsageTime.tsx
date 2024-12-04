import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import database from '@react-native-firebase/database';
import TextComponent from '../../components/TextComponent';
import SectionComponent from '../../components/SectionComponent';
import {globalStyles} from '../../styles/globalStyles';

interface ComputerTime {
  computer1: string;
  computer2: string;
  computer3: string;
  computer4: string;
}

const ComputerUsageTime: React.FC = () => {
  const [usageTime, setUsageTime] = useState<ComputerTime>({
    computer1: '00:00:00',
    computer2: '00:00:00',
    computer3: '00:00:00',
    computer4: '00:00:00',
  });

  const usageTimeRef = useRef<ComputerTime>({
    computer1: '00:00:00',
    computer2: '00:00:00',
    computer3: '00:00:00',
    computer4: '00:00:00',
  });

  const formatTime = (time: string): string => {
    const [hours, minutes, seconds] = time.split(':');
    return `${hours} giờ : ${minutes} phút : ${seconds} giây`;
  };

  const updateUsageTime = (key: keyof ComputerTime, value: string) => {
    usageTimeRef.current[key] = value;

    // Chỉ set state nếu giá trị thay đổi
    setUsageTime(prev => {
      if (prev[key] !== value) {
        return {...prev, [key]: value};
      }
      return prev;
    });
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại: YYYY-MM-DD
    const basePath = `/ComputerUsageTime/${today}`;

    const refs = [
      database().ref(`${basePath}/computer1/totalTime`),
      database().ref(`${basePath}/computer2/totalTime`),
      database().ref(`${basePath}/computer3/totalTime`),
      database().ref(`${basePath}/computer4/totalTime`),
    ];

    const listeners = refs.map((ref, index) => {
      return ref.on('value', snapshot => {
        const value = snapshot.val();
        if (value) {
          const key = `computer${index + 1}` as keyof ComputerTime;
          updateUsageTime(key, value); // Cập nhật giá trị qua hàm `updateUsageTime`
        }
      });
    });

    // Hủy lắng nghe khi component unmount
    return () => {
      refs.forEach((ref, index) => ref.off('value', listeners[index]));
    };
  }, []);

  return (
    <SectionComponent>
      <View
        style={[
          globalStyles.inputContainer,
          {
            backgroundColor: 'white',
          },
        ]}>
        <View
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            },
          ]}>
          <TextComponent
            text="Tổng thời gian hoạt động hôm nay"
            color="black"
            size={17}
            styles={{fontWeight: 'bold'}}
          />
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flex: 1,
              paddingVertical: 4,
            },
          ]}>
          <TextComponent
            text={`Computer 1:  ${formatTime(usageTime.computer1)}`}
            color="black"
            size={15}
            styles={{
              fontWeight: 'normal',
              marginLeft: 10,
            }}
          />
          <TextComponent
            text={`Computer 2:  ${formatTime(usageTime.computer2)}`}
            color="black"
            size={15}
            styles={{fontWeight: 'normal', marginLeft: 10}}
          />
          <TextComponent
            text={`Computer 3:  ${formatTime(usageTime.computer3)}`}
            color="black"
            size={15}
            styles={{fontWeight: 'normal', marginLeft: 10}}
          />
          <TextComponent
            text={`Computer 4:  ${formatTime(usageTime.computer4)}`}
            color="black"
            size={15}
            styles={{fontWeight: 'normal', marginLeft: 10}}
          />
        </View>
      </View>
    </SectionComponent>
  );
};

export default ComputerUsageTime;
