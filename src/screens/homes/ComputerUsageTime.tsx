// import database from '@react-native-firebase/database';
// import React, {useEffect, useRef, useState} from 'react';
// import {View} from 'react-native';
// import SectionComponent from '../../components/SectionComponent';
// import TextComponent from '../../components/TextComponent';
// import {globalStyles} from '../../styles/globalStyles';
// import {colors} from '../../constants/colors';

// interface ComputerTime {
//   computer1: string;
//   computer2: string;
//   computer3: string;
//   computer4: string;
// }

// const ComputerUsageTime: React.FC = () => {
//   const [usageTime, setUsageTime] = useState<ComputerTime>({
//     computer1: '00:00:00',
//     computer2: '00:00:00',
//     computer3: '00:00:00',
//     computer4: '00:00:00',
//   });

//   const usageTimeRef = useRef<ComputerTime>({
//     computer1: '00:00:00',
//     computer2: '00:00:00',
//     computer3: '00:00:00',
//     computer4: '00:00:00',
//   });

//   const formatTime = (time: string): string => {
//     const [hours, minutes, seconds] = time.split(':');
//     return `${hours} giờ : ${minutes} phút : ${seconds} giây`;
//   };

//   const updateUsageTime = (key: keyof ComputerTime, value: string) => {
//     usageTimeRef.current[key] = value;

//     setUsageTime(prev => {
//       if (prev[key] !== value) {
//         // Chỉ set state nếu giá trị thay đổi
//         return {...prev, [key]: value};
//       }
//       return prev;
//     });
//   };

//   useEffect(() => {
//     const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại: YYYY-MM-DD
//     const basePath = `/ComputerUsageTime/${today}`;

//     const refs = [
//       database().ref(`${basePath}/computer1/totalTime`),
//       database().ref(`${basePath}/computer2/totalTime`),
//       database().ref(`${basePath}/computer3/totalTime`),
//       database().ref(`${basePath}/computer4/totalTime`),
//     ];

//     const listeners = refs.map((ref, index) => {
//       return ref.on('value', snapshot => {
//         const value = snapshot.val();
//         if (value) {
//           const key = `computer${index + 1}` as keyof ComputerTime;
//           updateUsageTime(key, value); // Cập nhật giá trị qua hàm `updateUsageTime`
//         }
//       });
//     });

//     // Hủy lắng nghe khi component unmount
//     return () => {
//       refs.forEach((ref, index) => ref.off('value', listeners[index]));
//     };
//   }, []);

//   return (
//     <SectionComponent>
//       <View
//         style={[
//           globalStyles.inputContainer,
//           {
//             backgroundColor: '#B9B6D6',
//           },
//         ]}>
//         <View
//           style={[
//             {
//               alignItems: 'center',
//               justifyContent: 'center',
//               flex: 1,
//             },
//           ]}>
//           <TextComponent
//             text="Tổng thời gian hoạt động hôm nay"
//             color="black"
//             size={17}
//             styles={{fontWeight: 'bold'}}
//           />
//         </View>
//         <View
//           style={[
//             {
//               justifyContent: 'space-between',
//               flex: 1,
//               paddingVertical: 4,
//             },
//           ]}>
//           <TextComponent
//             text={`Computer 1:  ${formatTime(usageTime.computer1)}`}
//             color="black"
//             size={15}
//             styles={{
//               fontWeight: 'normal',
//               marginLeft: 10,
//             }}
//           />
//           <TextComponent
//             text={`Computer 2:  ${formatTime(usageTime.computer2)}`}
//             color="black"
//             size={15}
//             styles={{fontWeight: 'normal', marginLeft: 10}}
//           />
//           <TextComponent
//             text={`Computer 3:  ${formatTime(usageTime.computer3)}`}
//             color="black"
//             size={15}
//             styles={{fontWeight: 'normal', marginLeft: 10}}
//           />
//           <TextComponent
//             text={`Computer 4:  ${formatTime(usageTime.computer4)}`}
//             color="black"
//             size={15}
//             styles={{fontWeight: 'normal', marginLeft: 10}}
//           />
//         </View>
//       </View>
//     </SectionComponent>
//   );
// };

// export default ComputerUsageTime;

import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  TouchableHighlight,
  TouchableOpacityBase,
  TouchableOpacity,
} from 'react-native';
import {Calendar} from 'iconsax-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';
import {fontFamilies} from '../../constants/fontFamilies';

interface ComputerTime {
  computer1: string;
  computer2: string;
  computer3: string;
  computer4: string;
}

const ComputerUsageTime: React.FC = () => {
  const [usageTime, setUsageTime] = useState<ComputerTime | null>(null); // Dữ liệu từ Firebase
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Ngày được chọn
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false); // Hiển thị DatePicker

  // Hàm format thời gian để hiển thị
  const formatTime = (time: string): string => {
    if (!time) return '00:00:00';
    const [hours, minutes, seconds] = time.split(':');
    return `${hours} giờ : ${minutes} phút : ${seconds} giây`;
  };

  // Hàm format ngày thành chuỗi 'YYYY-MM-DD'
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Hàm format ngày thành chuỗi 'DD/MM/YYYY - Thứ X'
  const formatDateDisplay = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('vi-VN', options); // Định dạng ngày theo kiểu Việt Nam
    return formattedDate;
  };

  // Hàm fetch dữ liệu từ Firebase theo ngày
  const fetchUsageTime = async (date: string) => {
    try {
      const basePath = `/ComputerUsageTime/${date}`;
      const refs = [
        database().ref(`${basePath}/computer1/totalTime`),
        database().ref(`${basePath}/computer2/totalTime`),
        database().ref(`${basePath}/computer3/totalTime`),
        database().ref(`${basePath}/computer4/totalTime`),
      ];

      // Lấy dữ liệu từ Firebase
      const snapshots = await Promise.all(refs.map(ref => ref.once('value')));
      const data: ComputerTime = {
        computer1: snapshots[0].val() || '00:00:00',
        computer2: snapshots[1].val() || '00:00:00',
        computer3: snapshots[2].val() || '00:00:00',
        computer4: snapshots[3].val() || '00:00:00',
      };

      const hasData = Object.values(data).some(value => value !== '00:00:00');
      setUsageTime(hasData ? data : null); // Nếu có dữ liệu, cập nhật; không thì để null
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
      setUsageTime(null);
    }
  };

  // Khi ngày thay đổi, fetch dữ liệu mới
  useEffect(() => {
    const formattedDate = formatDate(selectedDate);
    fetchUsageTime(formattedDate);
  }, [selectedDate]);

  // Xử lý khi chọn ngày trong DatePicker
  const handleDateConfirm = (date: Date) => {
    setPickerVisible(false); // Ẩn DatePicker
    setSelectedDate(date); // Cập nhật ngày được chọn
  };

  const handleCancel = () => {
    setPickerVisible(false); // Đóng DatePicker khi hủy
  };

  return (
    <SectionComponent>
      <View
        style={[
          globalStyles.inputContainer,
          {
            // backgroundColor: '#B9B6D6',
            backgroundColor: '#B0C4DE',
            padding: 10,
          },
        ]}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
            marginBottom: 6,
          }}>
          <TextComponent
            text={`Thời gian hoạt động`}
            color="black"
            size={17}
            styles={{fontWeight: 'bold', textTransform: 'uppercase'}}
          />
        </View>
        {/* Nút chọn ngày */}
        {/* <Button title="Chọn ngày" onPress={() => setPickerVisible(true)} /> */}
        <TouchableOpacity
          style={{
            backgroundColor: '#6495ED',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            padding: 6,
          }}
          onPress={() => setPickerVisible(true)}>
          <Calendar size="22" color="white" />
          <TextComponent
            text="Chọn ngày"
            size={16}
            styles={{flex: 0, paddingLeft: 6}}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="date"
          onConfirm={handleDateConfirm} // Xử lý khi chọn ngày
          onCancel={handleCancel} // Xử lý khi hủy chọn
          date={selectedDate} // Ngày hiện tại
        />
        {/* Hiển thị ngày được chọn */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 6,
          }}>
          <TextComponent
            text={`${formatDateDisplay(selectedDate)}`}
            color="green"
            size={17}
            styles={{fontFamily: fontFamilies.regular}}
          />
        </View>

        {/* Hiển thị dữ liệu hoặc thông báo không có dữ liệu */}
        {usageTime ? (
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
              paddingVertical: 4,
            }}>
            <TextComponent
              text={`Computer 1: ${formatTime(usageTime.computer1)}`}
              color="black"
              size={15}
              styles={{marginLeft: 10}}
            />
            <TextComponent
              text={`Computer 2: ${formatTime(usageTime.computer2)}`}
              color="black"
              size={15}
              styles={{marginLeft: 10}}
            />
            <TextComponent
              text={`Computer 3: ${formatTime(usageTime.computer3)}`}
              color="black"
              size={15}
              styles={{marginLeft: 10}}
            />
            <TextComponent
              text={`Computer 4: ${formatTime(usageTime.computer4)}`}
              color="black"
              size={15}
              styles={{marginLeft: 10}}
            />
          </View>
        ) : (
          <TextComponent
            text="Không có dữ liệu của ngày này"
            color="red"
            size={15}
            styles={{textAlign: 'center', marginVertical: 10}}
          />
        )}
      </View>
    </SectionComponent>
  );
};

export default ComputerUsageTime;
