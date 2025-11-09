import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import { T, } from "../../src/theme/typography";

export default function SectionHeader({ title, subtitle }:{title:string; subtitle?:string}) {
  return (
    <View style={styles.wrap}>
      <Text style={[T.h2, styles.title]}>{title}</Text>
      {subtitle ? <Text style={[T.body, styles.sub]}>{subtitle}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ marginTop:8, marginBottom:12 },
  title:{ color: Colors.text },
  sub:{ color: Colors.textDim, marginTop:4 }
});
