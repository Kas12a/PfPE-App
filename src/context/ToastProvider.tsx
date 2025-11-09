import React, { PropsWithChildren, createContext, useCallback, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { S } from "../theme/spacing";

type ToastContextValue = {
  showToast: (message: string) => void;
};

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMessage(null));
  }, [opacity]);

  const showToast = useCallback(
    (msg: string) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      setMessage(msg);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      timeout.current = setTimeout(() => {
        hide();
      }, 1800);
    },
    [hide, opacity]
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Animated.View pointerEvents="none" style={[styles.toast, { opacity }, message ? null : { display: "none" }]}>
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: S.xl,
    left: S.lg,
    right: S.lg,
    padding: S.md,
    borderRadius: 999,
    backgroundColor: "rgba(12, 28, 26, 0.85)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  toastText: {
    color: Colors.neon,
    fontWeight: "700",
  },
});
