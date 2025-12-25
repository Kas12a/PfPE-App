import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ActionType = 'cycle'|'refuse_plastic'|'recycle'|'energy_save'|'plant_tree';

const BASE_POINTS: Record<ActionType, number> = {
  cycle: 10, refuse_plastic: 5, recycle: 5, energy_save: 8, plant_tree: 25,
};

export type ActionEntry = { id: string; type: ActionType; qty: number; pts: number; at: number; user: string; synced?: boolean };
export type AddActionResult = { pts: number; streak: number; todayTotal: number };

type Store = {
  points: number;                 // lifetime points
  actions: ActionEntry[];         // history (last 500)
  addAction: (p: { type: ActionType; qty?: number; user?: string }) => AddActionResult;

  // daily tracking
  streak: number;                 // consecutive days with at least 1 action
  todayTotal: number;             // points earned today
  resetAll: () => void;
  markSynced: (ids: string[]) => void;
  loaded: boolean;
};

const PTS_KEY = 'pfpe_points_v2';
const ACT_KEY = 'pfpe_actions_v2';
const META_KEY = 'pfpe_meta_v2';

type Meta = { lastActiveISO?: string; todayISO?: string; streak: number; todayTotal: number };

function isoDay(d = new Date()) {
  // normalize to YYYY-MM-DD (no time)
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);
  const [actions, setActions] = useState<ActionEntry[]>([]);
  const [meta, setMeta] = useState<Meta>({ streak: 0, todayTotal: 0, todayISO: isoDay() });
  const [loaded, setLoaded] = useState(false);

  // Load once
  useEffect(() => {
    (async () => {
      try {
        const [p, a, m] = await Promise.all([
          AsyncStorage.getItem(PTS_KEY),
          AsyncStorage.getItem(ACT_KEY),
          AsyncStorage.getItem(META_KEY),
        ]);
        if (p) setPoints(Number(p) || 0);
        if (a) setActions(JSON.parse(a));
        if (m) {
          const parsed: Meta = JSON.parse(m);
          setMeta(prev => ({ ...prev, ...parsed }));
        }
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Day rollover check
  useEffect(() => {
    if (!loaded) return;
    const today = isoDay();
    if (meta.todayISO !== today) {
      // new day: reset todayTotal; keep streak as-is (will increment on first action)
      setMeta(prev => ({ ...prev, todayISO: today, todayTotal: 0 }));
    }
  }, [loaded]); // run once after load

  // persist
  useEffect(() => { if (loaded) AsyncStorage.setItem(PTS_KEY, String(points)).catch(()=>{}); }, [points, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(ACT_KEY, JSON.stringify(actions)).catch(()=>{}); }, [actions, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(META_KEY, JSON.stringify(meta)).catch(()=>{}); }, [meta, loaded]);

  const addAction: Store['addAction'] = ({ type, qty = 1, user = 'Player' }) => {
    const n = Math.max(1, Math.floor(Number(qty) || 1));
    const pts = (BASE_POINTS[type] || 0) * n;

    // lifetime points
    setPoints(p => p + pts);

    // history
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setActions(prev => [{ id, type, qty: n, pts, at: Date.now(), user, synced: false }, ...prev].slice(0, 500));

    // daily + streak
    const today = isoDay();
    let computedStreak = meta.streak;
    let computedToday = meta.todayTotal;
    setMeta(prev => {
      const isNewDay = prev.todayISO !== today;
      const lastActive = prev.lastActiveISO;
      let nextStreak = prev.streak;

      if (isNewDay) {
        // if yesterday was the last active, streak continues; else reset
        const yesterday = isoDay(new Date(Date.now() - 24*60*60*1000));
        nextStreak = lastActive === yesterday ? (prev.streak + 1) : 1;
      } else if (!lastActive) {
        nextStreak = 1;
      }
      const nextTodayTotal = (isNewDay ? 0 : prev.todayTotal) + pts;
      computedStreak = nextStreak;
      computedToday = nextTodayTotal;
      return {
        todayISO: today,
        lastActiveISO: today,
        todayTotal: nextTodayTotal,
        streak: nextStreak,
      };
    });

    return { pts, streak: computedStreak, todayTotal: computedToday };
  };

  const resetAll = () => {
    setPoints(0);
    setActions([]);
    setMeta({ streak: 0, todayTotal: 0, todayISO: isoDay(), lastActiveISO: undefined });
  };

  const markSynced = (ids: string[]) => {
    if (!ids.length) return;
    setActions(prev => prev.map(entry => (ids.includes(entry.id) ? { ...entry, synced: true } : entry)));
  };

  const value = useMemo<Store>(() => ({
    points,
    actions,
    addAction,
    streak: meta.streak,
    todayTotal: meta.todayTotal,
    resetAll,
    markSynced,
    loaded,
  }), [points, actions, meta, loaded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside <StoreProvider>');
  return v;
}
