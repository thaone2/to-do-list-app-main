import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

const BlinkingIndicator = ({isActive}: {isActive: boolean}) => {
  const outerOpacity = useRef(new Animated.Value(1)).current;
  const innerScale = useRef(new Animated.Value(1)).current;

  // Hiệu ứng chớp nháy
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(outerOpacity, {
            toValue: 0.2, // Độ trong suốt thấp nhất
            duration: 300, // Thời gian chuyển đổi
            useNativeDriver: true,
          }),
          Animated.timing(outerOpacity, {
            toValue: 0.7, // Độ trong suốt cao nhất
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(innerScale, {
            toValue: 1.1, // Phóng to hình tròn bên trong
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(innerScale, {
            toValue: 1, // Thu nhỏ về ban đầu
            duration: 600,
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
          width: 40,
          height: 40,
          borderRadius: 20,
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      />

      {/* Hình tròn nhỏ chớp nháy */}
      <Animated.View
        style={{
          backgroundColor: isActive ? '#5DF15A' : '#FF6347',
          transform: [{scale: innerScale}],
          width: 30,
          height: 30,
          borderRadius: 15,
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
  },
});

export default BlinkingIndicator;
