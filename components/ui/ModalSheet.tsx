// components/ModalSheet.tsx
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import Card from "./Card";

export function ModalSheet({
  visible,
  title,
  children,
  onClose,
  primaryText,
  onPrimary,
}: {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  primaryText?: string;
  onPrimary?: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Card style={{ backgroundColor: Colors.surface, borderRadius: 24, gap: 14 }}>
          <Text style={{ color: Colors.text, fontSize: 18, fontWeight: "800" }}>{title}</Text>
          <View style={{ gap: 12 }}>{children}</View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12 }}>
            <Pressable onPress={onClose}>
              <Text style={{ color: Colors.subtext, fontWeight: "700" }}>Close</Text>
            </Pressable>
            {primaryText ? (
              <Pressable onPress={onPrimary}>
                <Text style={{ color: Colors.brand, fontWeight: "800" }}>{primaryText}</Text>
              </Pressable>
            ) : null}
          </View>
        </Card>
      </View>
    </Modal>
  );
}
