import { memo, useEffect, useMemo, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type CollapsibleItemProps = {
  item: {
    id: string;
    title: string;
    content: string;
  };
  expanded: boolean;
  onToggle: (id: string) => void;
};

/* 
  suitable for flatlist, virtualized list
  get shutter or wrong animation due to recyling when use with flashlist
*/
export const CollapsibleItem = ({
  item,
  expanded,
  onToggle,
}: CollapsibleItemProps) => {
  const aniExpanded = useSharedValue(expanded);
  const image = useMemo(() => {
    return require("./assets/chevron.png");
  }, []);

  useEffect(() => {
    aniExpanded.value = expanded;
  }, [expanded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(aniExpanded.value ? 300 : 0, {
        duration: 300,
      }),
      opacity: withTiming(aniExpanded.value ? 1 : 0, {
        duration: 300,
      }),
    };
  }, []);

  const aniImgStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${expanded ? 180 : 0}deg` }],
    };
  });

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.touchContainer}
        onPress={() => onToggle(item.id)}
      >
        <Text style={[styles.itemTitle, { color: expanded ? "red" : "black" }]}>
          {item.title}
        </Text>
        <Animated.Image
          source={image}
          style={[styles.image, aniImgStyle]}
          resizeMode="center"
        />
      </TouchableOpacity>
      <Animated.View style={[styles.itemContent, animatedStyle]}>
        <Text>{item.content}</Text>
      </Animated.View>
    </View>
  );
};

// new implement
export const CollapsibleItemV2 = ({
  item,
  expanded,
  onToggle,
}: CollapsibleItemProps) => {
  const height = useSharedValue(expanded ? 300 : 0);
  const opacity = useSharedValue(Number(expanded));
  const rotation = useSharedValue(0);
  const lastItemId = useRef(item.id);

  const image = useMemo(() => {
    return require("./assets/chevron.png");
  }, []);

  useEffect(() => {
    //console.log(`${item.id} ${expanded}`);
    let duration = 0;
    if (item.id !== lastItemId.current) {
      // handle when recycling, update id then disable animation
      lastItemId.current = item.id;
      duration = 0;
    } else {
      duration = 300;
    }

    height.value = withTiming(expanded ? 100 : 0, {
      duration: duration,
    });
    /* 
      for some animation, disable animation by setting duration = 0
      will get some buggy result, we should set something small (around 50-100ms)
    */
    opacity.value = withTiming(Number(expanded), {
      duration: duration || 100,
    });
    rotation.value = withTiming(expanded ? 180 : 0, {
      duration: duration || 100,
    });
  }, [item.id, expanded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
    };
  });

  const aniImgStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.touchContainer}
        onPress={() => onToggle(item.id)}
      >
        <Text style={[styles.itemTitle, { color: expanded ? "red" : "black" }]}>
          {item.title}
        </Text>
        <Animated.Image
          source={image}
          style={[styles.image, aniImgStyle]}
          resizeMode="center"
        />
      </TouchableOpacity>
      <Animated.View style={[styles.itemContent, animatedStyle]}>
        <Text>{item.content}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemContent: {
    overflow: "hidden",
  },
  touchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 15,
    height: 15,
  },
});
