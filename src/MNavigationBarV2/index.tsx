import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Dimensions, LayoutChangeEvent, View, Text, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styles from "./styles";

export type MNavigationBarV2Ref = {
  toggleAnimationBaseOnOffsetY: (offsetY: number) => void;
};

export type MNavigationBarV2Prop = {
  title?: string;
  marginLeftLargeTitle?: number;
  marginBottomLargeTitle?: number;
  rightComponent?: JSX.Element;
  leftComponent?: JSX.Element;
};

const MNavigationBarV2 = forwardRef<MNavigationBarV2Ref, MNavigationBarV2Prop>(
  (
    {
      marginLeftLargeTitle = 8,
      marginBottomLargeTitle = 8,
      title = "",
      rightComponent,
      leftComponent,
    },
    ref
  ) => {
    const navHeight = 44;
    const navLargeTitleHeight = 97;
    const widthScreen = Dimensions.get("window").width;
    const duration = 200;

    const isFirstLayout = useRef(true);
    const largeTitleState = useSharedValue(1);
    const [smallTitleWidth, setSmallTitleWidth] = useState(0);

    useImperativeHandle(ref, () => ({
      toggleAnimationBaseOnOffsetY: (offsetY) => {
        largeTitleState.value = Number(!(offsetY > 0));
      },
    }));

    const handleTitleLayout = useCallback((event: LayoutChangeEvent) => {
      if (!isFirstLayout.current) {
        return;
      }
      isFirstLayout.current = false;
      console.log("handleTitleLayout first");

      const { width } = event.nativeEvent.layout;
      console.log("small title width: ", width);
      console.log("widthScreen: ", widthScreen);
      setSmallTitleWidth(width);
    }, []);

    const aniNavBarStyle = useAnimatedStyle(() => {
      return {
        height: withTiming(
          largeTitleState.value ? navLargeTitleHeight : navHeight,
          {
            duration: duration,
          }
        ),
      };
    });

    const aniFontStyle = useAnimatedStyle(() => {
      return {
        fontSize: withTiming(largeTitleState.value ? 34 : 17, {
          duration: duration,
        }),
        fontWeight: "700",
      };
    });

    const aniTitleViewStyle = useAnimatedStyle(() => {
      return {
        left: withTiming(
          largeTitleState.value
            ? marginLeftLargeTitle
            : (widthScreen - smallTitleWidth) / 2,
          {
            duration: duration,
          }
        ),
        bottom: withTiming(largeTitleState.value ? marginBottomLargeTitle : 0, {
          duration: duration,
        }),
      };
    });

    return (
      <Animated.View
        entering={undefined}
        style={[styles.header, aniNavBarStyle]}
      >
        <Animated.View
          pointerEvents="box-none"
          style={[styles.title, aniTitleViewStyle]}
        >
          <Animated.Text style={aniFontStyle}>{title}</Animated.Text>
        </Animated.View>
        <View
          onLayout={handleTitleLayout}
          pointerEvents="box-none"
          style={styles.hiddenLargeTitleContainer}
        >
          <Text style={styles.hiddenLargeTitleText}>{title}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Image
            source={require("../../assets/chevron.png")}
            style={[styles.imageBack]}
            resizeMode="center"
          />
          {leftComponent}
        </View>
        <View style={styles.buttonContainer}>{rightComponent}</View>
      </Animated.View>
    );
  }
);

export default memo(MNavigationBarV2);
