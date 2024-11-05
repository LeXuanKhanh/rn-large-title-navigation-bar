import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  FlatList,
  Button,
  Dimensions,
  View,
  Image,
  Text,
  TouchableOpacity,
  LayoutChangeEvent,
  RefreshControl,
} from "react-native";
import { CollapsibleItem } from "./CollapsibleItem";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MNavigationBarV2, { MNavigationBarV2Ref } from "./src/MNavigationBarV2";

type ItemData = {
  id: string;
  title: string;
  content: string;
};

const generateDataItems = (count: number): ItemData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: (index + 1).toString(),
    title: `Item ${index + 1}`,
    content: `Content for item ${index + 1}`,
  }));
};

const data: ItemData[] = generateDataItems(50);

export default function App() {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const handleToggle = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollRef = useRef<FlatList>(null);
  const navRef = useRef<MNavigationBarV2Ref>(null);

  const onScrollOffsetY = useCallback((offsetY: number) => {
    if (navRef.current) {
      navRef.current.toggleAnimationBaseOnOffsetY(offsetY);
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      runOnJS(onScrollOffsetY)(e.contentOffset.y);
    },
  });

  const renderRightComp = useMemo(
    () => (
      <TouchableOpacity onPress={() => console.log("press add button")}>
        <Image
          source={require("./assets/plus.png")}
          style={[styles.image]}
          resizeMode="center"
        />
      </TouchableOpacity>
    ),
    []
  );

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <MNavigationBarV2
          ref={navRef}
          title={"Home Content"}
          rightComponent={renderRightComp}
        />
        <Animated.FlatList
          ref={scrollRef}
          data={data}
          renderItem={({ item }) => (
            <CollapsibleItem
              item={item}
              expanded={!!expandedItems[item.id]}
              onToggle={handleToggle}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={undefined} />
          }
          extraData={expandedItems}
          keyExtractor={(item) => item.id}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          initialNumToRender={10}
          removeClippedSubviews
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBack: {
    width: 44,
    height: 44,
    transform: [{ rotate: `90deg` }],
  },
  image: {
    width: 44,
    height: 44,
  },
});
