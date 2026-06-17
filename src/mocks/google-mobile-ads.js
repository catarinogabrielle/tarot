// Mock for react-native-google-mobile-ads on web
export const useInterstitialAd = () => ({
  isLoaded: false,
  isLoading: false,
  error: 'Google Mobile Ads not available on web',
  load: () => {},
  show: async () => false,
});

export const GAMBannerAd = () => null;

export const BannerAdSize = {
  ANCHOR_TOP_BANNER: 'ANCHOR_TOP_BANNER',
  ANCHOR_BOTTOM_BANNER: 'ANCHOR_BOTTOM_BANNER',
  BANNER: 'BANNER',
};

export const RewardedAd = {
  createForAdRequest: () => ({
    load: () => {},
    show: async () => false,
  }),
};

export const RewardedAdEventType = {
  LOADED: 'LOADED',
  ERROR: 'ERROR',
  EARNED_REWARD: 'EARNED_REWARD',
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

export const AdEventType = {
  LOADED: 'LOADED',
  ERROR: 'ERROR',
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
  IMPRESSION: 'IMPRESSION',
  CLICK: 'CLICK',
};

export const RewardedAdReward = class {
  constructor(type, amount) {
    this.type = type;
    this.amount = amount;
  }
};

export default {
  useInterstitialAd,
  GAMBannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  RewardedAdReward,
};
