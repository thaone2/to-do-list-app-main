import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

const BlinkingIndicator = ({isActive}: {isActive: boolean}) => {
  const outerOpacity = useRef(new Animated.Value(1)).current;
  const innerScale = useRef(new Animated.Value(1)).current;

  // Hiệu ứng chớp nháy
  useEffect(() => {
    if (isActive) {
      // hiệu ứng cho độ mờ rõ
      Animated.loop(
        Animated.sequence([
          Animated.timing(outerOpacity, {
            toValue: 0.1, // Độ trong suốt thấp nhất
            duration: 1000, // Thời gian chuyển đổi
            useNativeDriver: true,
          }),
          Animated.timing(outerOpacity, {
            toValue: 1, // Độ trong suốt cao nhất
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
      // hiệu ứng phóng to thu nhỏ
      Animated.loop(
        Animated.sequence([
          Animated.timing(innerScale, {
            toValue: 1, // Phóng to hình tròn bên trong
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(innerScale, {
            toValue: 0.8, // Thu nhỏ về ban đầu
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [isActive, outerOpacity, innerScale]);

  return (
    <View style={styles.container}>
      {/* Hình tròn lớn */}
      <Animated.View
        style={{
          opacity: outerOpacity,
          backgroundColor: isActive ? '#5DF15A' : '#FF6347',
          position: 'absolute',
          width: 35,
          height: 35,
          borderRadius: 35 / 2,
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 10,
          borderWidth: 1,
          // borderColor: isActive ? '#5DF15A' : '#FF6347',
          borderColor: 'gray',
        }}
      />

      {/* Hình tròn nhỏ chớp nháy */}
      <Animated.View
        style={{
          backgroundColor: isActive ? '#5DF15A' : '#FF6347',
          transform: [{scale: innerScale}],
          width: 30,
          height: 30,
          borderRadius: 30 / 2,
          borderWidth: 1,
          borderColor: isActive ? '#5DF15A' : '#FF6390',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    // backgroundColor: 'green',
  },
});

export default BlinkingIndicator;
