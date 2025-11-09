import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";

export default function Badge({label, icon, locked=false}:{label:string; icon:string; locked?:boolean}){
  return (
    <View style={[styles.badge, locked && styles.locked]}>
      <Text style={[styles.icon, locked && {opacity:0.35}]}>{icon}</Text>
      <Text style={[styles.label, locked && {opacity:0.35}]} numberOfLines={2}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge:{width:"31%", aspectRatio:1, backgroundColor:Colors.cardAlt, borderRadius:18, padding:14, justifyContent:"space-between", borderWidth:1, borderColor:Colors.border},
  locked:{},
  icon:{fontSize:22},
  label:{color:Colors.text, fontWeight:"700"},
});
