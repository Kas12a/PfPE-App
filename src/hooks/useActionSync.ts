import { useEffect } from "react";
import * as Network from "expo-network";
import { useStore } from "./useStore";
import { useToast } from "./useToast";

export function useActionSync() {
  const { actions, markSynced } = useStore();
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      try {
        const status = await Network.getNetworkStateAsync();
        const online = Boolean(status.isConnected && (status.isInternetReachable ?? true));
        if (!online || cancelled) return;
        const pending = actions.filter((a) => !a.synced).map((a) => a.id);
        if (!pending.length) return;
        await new Promise((resolve) => setTimeout(resolve, 250));
        if (!cancelled) {
          markSynced(pending);
          showToast(`Synced ${pending.length} actions`);
        }
      } catch {
        // swallow errors; will retry on next network change
      }
    };
    void sync();
    const subscription = Network.addNetworkStateListener?.(() => {
      void sync();
    });
    return () => {
      cancelled = true;
      subscription?.remove?.();
    };
  }, [actions, markSynced, showToast]);
}
