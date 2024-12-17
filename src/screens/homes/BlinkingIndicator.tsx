import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';

const BlinkingIndicator = ({isActive}: {isActive: boolean}) => {
  const outerOpacity = useRef(new Animated.Value(1)).current;
  const innerScale = useRef(new Animated.Value(1)).current;

  // Hiệu ứng chớp nháy
  useEffect(() => {
    // Hiệu ứng cho độ mờ rõ
    const outerOpacityAnimation = Animated.loop(
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
    );

    // Hiệu ứng phóng to thu nhỏ
    const innerScaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(innerScale, {
          toValue: 1.2, // Phóng to hình tròn bên trong
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(innerScale, {
          toValue: 0.8, // Thu nhỏ về ban đầu
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    // Bắt đầu hiệu ứng ngay khi component mount
    outerOpacityAnimation.start();
    innerScaleAnimation.start();

    // Cleanup animation khi component unmount
    return () => {
      outerOpacityAnimation.stop();
      innerScaleAnimation.stop();
    };
  }, [outerOpacity, innerScale]);

  return (
    <View
      style={{
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
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

export default BlinkingIndicator;
