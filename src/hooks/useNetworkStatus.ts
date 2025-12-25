import { useEffect, useState } from "react";
import * as Network from "expo-network";

function isOnlineState(state: Network.NetworkState | null) {
  if (!state) return false;
  if (state.isInternetReachable === null || state.isInternetReachable === undefined) {
    return Boolean(state.isConnected);
  }
  return Boolean(state.isConnected && state.isInternetReachable);
}

export function useNetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const status = await Network.getNetworkStateAsync();
        if (mounted) {
          setOnline(isOnlineState(status));
        }
      } catch {
        if (mounted) setOnline(false);
      }
    };
    void check();
    const subscription = Network.addNetworkStateListener?.((state) => {
      if (mounted) {
        setOnline(isOnlineState(state));
      }
    });
    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  return { isOnline: online };
}
