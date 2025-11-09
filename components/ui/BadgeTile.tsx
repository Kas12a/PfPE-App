import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function BadgeTile({ label, icon, locked=false }:{
  label:string; icon:any; locked?:boolean;
}) {
  return (
    <View style={[styles.card, locked && { opacity: 0.4 }]}>
      <View style={styles.iconWrap}>
        {typeof icon === "number" ? <Image source={icon} style={{ width:26, height:26 }} /> : icon}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card:{ width:"30%", aspectRatio:1, borderRadius:16, backgroundColor:"#1E2A31", alignItems:"center", justifyContent:"center", gap:8 },
  iconWrap:{ width:48, height:48, borderRadius:12, backgroundColor:"#24343C", alignItems:"center", justifyContent:"center" },
  label:{ color:"#D9E3E9", fontWeight:"600", textAlign:"center" },
});
