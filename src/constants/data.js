import {
  User,
  Bell,
  ShoppingBag,
  Heart,
  CreditCard,
  Settings,
  Headphones,
} from "lucide-react";

export const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
export const SORTOPTIONS = [
  { value: "lowToHigh", labelKey: "PRODUCTS_LIST.SORT.OPTIONS.PRICE_LOWHIGH" },
  { value: "highToLow"  , labelKey: "PRODUCTS_LIST.SORT.OPTIONS.PRICE_HIGHLOW" },
  { value: "newArrival", labelKey: "PRODUCTS_LIST.SORT.OPTIONS.NEWEST" },
  { value: "customerRating", labelKey: "PRODUCTS_LIST.SORT.OPTIONS.TOP_RATED" },
   { value:"discount", labelKey: "PRODUCTS_LIST.SORT.OPTIONS.DISCOUNT" },
];
export const DATE_LOCALE = "en-US";
export const DEFAULT_COUNTRY_CODE = "IN";
export const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "short",
  day: "numeric",
};
export const DEFAULT_STORE_ID = "default-store";
export const ITEMS_PER_PAGE = 28;
export const STEP = 100;
export const MIN_GAP = 100;
export const MAX_PRICE = 50000;
export const PERCENT_SCALE = 100;
export const MAX_RATING = 5;
export const STATUS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  ERROR:"ERROR",
};
export const OTP_LENGTH = 6;
export const OTP_TIMER =60;
export const LOGIN_STATUS={
VERIFIED:"Verified",
COMPLETED:"Completed"
};
export const REDUX_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};
export const VIEW_TYPES = {
  GRID: "grid",
  LIST: "list",
};
export const WISHLIST_STATUS = {
  ADDED: "added",
  REMOVED: "removed",
  FETCHED: "fetched",
  FAILED: "failed",
  UPDATED: 'updated',
};
export const ORDER_STATUS = {
  DELIVERED: "Delivered",
};

export const DATEFILTERS = [
    { key: "last6months", label:"ORDER.LAST_6_MONTHS" },
    { key: "2024", label: "2024" },
    { key: "2023", label: "2023" },
    { key: "2022", label: "2022" },
    { key: "2021", label: "2021" },
    { key: "older", label:"ORDER.OLDER"},
  ];
export const PROMOCARDS = [
  {
    TITLEKEY: "PROMO.FLASHSALE.TITLE",
    SUBTITLEKEY: "PROMO.FLASHSALE.SUBTITLE",
    DESCRIPTIONKEY: "PROMO.FLASHSALE.DESCRIPTION",
    IMAGE:
      "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    LINK: "/category?discount=50",
    COLOR: "from-emerald-900/80 to-transparent",
    LARGE: false,
  },
  {
    TITLEKEY: "PROMO.NEWARRIVALS.TITLE",
    SUBTITLEKEY: "PROMO.NEWARRIVALS.SUBTITLE",
    DESCRIPTIONKEY: "PROMO.NEWARRIVALS.DESCRIPTION",
    IMAGE:
      "https://images.pexels.com/photos/5699665/pexels-photo-5699665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    LINK: "/category",
    SORTBY: "newArrival",
    COLOR: "from-indigo-900/80 to-transparent",
    LARGE: false,
  },
  {
    TITLEKEY: "PROMO.HOMEDECOR.TITLE",
    SUBTITLEKEY: "PROMO.HOMEDECOR.SUBTITLE",
    DESCRIPTIONKEY: "PROMO.HOMEDECOR.DESCRIPTION",
    IMAGE:
      "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    LINK: "/category/home-decor",
    COLOR: "from-slate-900/80 to-transparent",
    LARGE: true,
  },
];

export const BANNER_IMAGES = [
  "https://picsum.photos/200/100?random=1",
  "https://picsum.photos/200/100?random=2",
  "https://picsum.photos/200/100?random=3",
  "https://picsum.photos/200/100?random=4",
];

export const MENU_ITEMS = [
  { path: "/profile", icon: User, labelKey: "MENU.MY_PROFILE" },
  {
    path: "/notifications",
    icon: Bell,
    labelKey: "MENU.NOTIFICATIONS",
    badge: 2,
  },
  { path: "/orders", icon: ShoppingBag, labelKey: "MENU.MY_ORDERS" },
  { path: "/wishlist", icon: Heart, labelKey: "MENU.MY_WISHLIST" },
  { path: "/payments", icon: CreditCard, labelKey: "MENU.MY_PAYMENTS" },
  { path: "/settings", icon: Settings, labelKey: "MENU.SETTINGS" },
  { path: "/support", icon: Headphones, labelKey: "MENU.HELP_SUPPORT" },
];

export const PAYMENT_TYPES = {
  RAZORPAY: "Razorpay",
  ONLINE_PAYMENT: "ONLINE_PAYMENT",
  CASH_ON_DELIVERY: "Cash On Delivery",
};

export const PAYMENT_ERROR_MESSAGES = {
  PAYMENT_GATEWAY_NOT_LOADING: "PAYMENT_GateWAY_NOT_LOADING",
  FAILED_TO_GET_PAYMENT_DETAILS: "FAILED_TO_GET_PAYMENT_DETAILS",
  PAYMENT_INITIALIZATION: "PAYMENT_INITIALIZATION",
  PAYMENT_FAILED: "PAYMENT_FAILED",
};
export const FAILED = 'failed'
export const ADDRESS_TYPE = {
  HOME: "Home",
  OFFICE: "Office",
};
export const ADDRESS_TYPE_OPTIONS = [
  { value: ADDRESS_TYPE.HOME, labelKey: "ADDRESS_TYPE.HOME" },
  { value: ADDRESS_TYPE.OFFICE, labelKey: "ADDRESS_TYPE.OFFICE" },
];
export const STEP_COLORS = {
  COMPLETED: "#22c55e",
  CURRENT: "#3b82f6",   
  PENDING: "#d1d5db",
};
export const STATUS_COLORS = {
  pending: '#94969F',            
  processing: 'rgb(255, 152, 0)',
  shipped: 'rgb(33, 150, 243)',
  delivered: 'rgb(34, 197, 94)',
  cancelled: '#ef4444',     
  returned: '#8B5CF6',    
  default: '#9CA3AF',     
};
 