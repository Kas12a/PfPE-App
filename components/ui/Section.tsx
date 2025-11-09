import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";

export const SectionTitle = ({children}:{children:string})=>(
  <Text style={styles.h1}>{children}</Text>
);
export const SubTitle = ({children}:{children:string})=>(
  <Text style={styles.sub}>{children}</Text>
);
export const Card = ({children, style}:{children:any; style?:any})=>(
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  h1:{color:Colors.text,fontSize:34,fontWeight:"800",marginBottom:S.sm},
  sub:{color:Colors.textDim,fontSize:16,marginBottom:S.lg},
  card:{
    backgroundColor:Colors.card,
    borderRadius:20,
    borderWidth:1,
    borderColor:Colors.border,
    padding:S.lg,
  },
});
