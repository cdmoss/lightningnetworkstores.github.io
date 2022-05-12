export const state = () => ({
  announcements: {
    configuration: {},
    items: [],
  },
  baseURL: process.env.BASE_URL,
  browserFingerprint: '',
  configuration: {
    max_comment_size: 250,
    min_post: 100,
    min_reply: 100,
    listing_fee: 1000,
    min_skip_captcha: 1000,
    minimum_donation: 1000,
    maximum_donation_timeout_days: 70,
    version: 0,
  },
  activeStoreDiscussions: [],
  deviceFingerprint: '',
  deviceResolution: {},
  discussions: [],
  donations: [],
  excludedTags: [],
  faucetDonors: [],
  faucetStats: {},
  filterByFavorites: false,
  filteredStores: [],
  filteredTags: [],
  isDev: null,
  lastActivity: 0,
  lastCommentSeenTimestamp: 0,
  lastDiscussions: [],
  likedStores: {},
  loading: false,
  loginStatus: {},
  popularSearches: [],
  quizContest: {},
  nameQuizContest: '',
  scores: [],
  scrolledStores: 0,
  selectedStore: { logged: false }, // makes components reactive to selectedStore.logged
  selectedStoreSettings: {},
  selectedTags: [],
  statistics: {},
  storeContest: {},
  nameStoreContest: '',
  storeEvents: [],
  storePages: 0,
  stores: [],
  storeSummary: [],
  tags: [],
  wallets: [],
  externallyTrending: [],
  settingCustomSorting: {
    halflife: 0,
    score: 0,
    satsPerLike: 0,
    trending:  0,
    likeTrend: 0,
    externalTrend:  0,
    novelty: 0,
    newontop: 0,
    default: false,
  },
  sliderCustomSorting: [
    {
      id: "scs01",
      name: "",
      slide: [
        { id: "sl01", label: "Promotion weight", value: 0 },
        { id: "sl02", label: "Evaporation half-life", value: 0 },
        { id: "sl03", label: "Like weight", value: 0 },
      ]
    },
    {
      id: "scs02",
      name: "Trending score",
      slide: [
        { id: "sl01", label: "Promotion", value: 0 },
        { id: "sl02", label: "Likes", value: 0 },
        { id: "sl03", label: "Social media", value: 0 },
      ]
    },
    {
      id: "scs03",
      name: "Novelty",
      slide: [
        { id: "sl01", label: "Novelty score", value: 0 },
        { id: "sl02", label: "Move newest stores on top", value: 0 },
      ]
    },
  ]
})

export default state
