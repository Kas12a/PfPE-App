import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../src/theme/colors";

export default function Progress({value}:{value:number}) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, {width:`${Math.max(0, Math.min(100, value))}%`}]} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{height:8, backgroundColor:"rgba(255,255,255,0.08)", borderRadius:8, overflow:"hidden"},
  bar:{height:8, backgroundColor:Colors.accent, borderRadius:8},
});
