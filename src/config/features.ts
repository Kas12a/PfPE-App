export const featureFlags = {
  premiumAvatars: false,
  arQuests: false,
};

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag) {
  return Boolean(featureFlags[flag]);
}
