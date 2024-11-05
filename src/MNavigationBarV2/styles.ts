import { StyleSheet } from "react-native";

const navHeight = 44;

export default StyleSheet.create({
  header: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    display: "flex",
  },
  title: {
    position: "absolute",
    height: navHeight,
    justifyContent: "center",
  },
  imageBack: {
    width: 44,
    height: 44,
    transform: [{ rotate: `90deg` }],
  },
  buttonContainer: {
    flexDirection: "row",
  },
  hiddenLargeTitleContainer: {
    opacity: 0,
    position: "absolute",
    zIndex: -100,
  },
  hiddenLargeTitleText: {
    fontSize: 17,
    fontWeight: "700",
  },
});
