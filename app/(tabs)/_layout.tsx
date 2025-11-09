import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "../../src/theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0D1A17", borderTopColor: "rgba(255,255,255,0.06)" },
        tabBarActiveTintColor: Colors.tabIconActive,
        tabBarInactiveTintColor: Colors.tabIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="quests"
        options={{ title: "Quests", tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="ranking"
        options={{ title: "Ranking", tabBarIcon: ({ color, size }) => <Feather name="award" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="rewards"
        options={{ title: "Rewards", tabBarIcon: ({ color, size }) => <Feather name="gift" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
