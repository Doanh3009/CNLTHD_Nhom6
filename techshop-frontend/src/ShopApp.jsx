import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  BadgePercent,
  Bot,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Gamepad2,
  Headphones,
  Heart,
  Home,
  Laptop,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Tablet,
  Trash2,
  Truck,
  User,
  UserPlus,
  Watch,
  X,
} from 'lucide-react';
import './ShopApp.css';
import {
  BRANDS,
  CATEGORIES,
  CATEGORY_ALIASES,
  CATEGORY_NAMES,
  CATEGORY_TILES,
  COLORS,
  FALLBACK_IMAGES,
  PRICE_RANGES,
  PRODUCT_BY_SKU,
  PRODUCT_CATALOG,
  PRODUCT_META,
  QUICK_TAGS,
} from './catalogData';

const API_BASE = 'http://localhost:8181/api';

const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ADMIN_TOKEN_KEY = 'kdkt_admin_token';
const ADMIN_USER_KEY = 'kdkt_admin_user';

const COUPONS = {
  TECH10: { label: '10% off your order', percent: 0.1 },
  VIP20: { label: '20% off for VIP customers', percent: 0.2 },
  FREESHIP: { label: 'Free shipping', freeShipping: true },
};

const CATEGORY_ICONS = {
  'Smart Watches': Watch,
  Headphones,
  'Smart Phones': Smartphone,
  Laptops: Laptop,
  'Gaming Console': Gamepad2,
  Tablets: Tablet,
};

const CUSTOMER_TEXT = {
  en: {
    offer: 'Limited offer: TECH10 saves 10% on selected gadgets',
    shopAll: 'Shop all products',
    categories: 'Categories',
    shopByBrand: 'Shop by Brand',
    shopByPrice: 'Shop by Price',
    shopByColor: 'Shop by Color',
    nav: ['Home', 'Shop', 'Orders', 'AI Finder'],
    search: 'Search gadgets...',
    cart: 'Open cart',
    signIn: 'Sign in',
    logout: 'Log out',
    footerText: 'Curated phones, laptops, tablets, wearables, headphones, and gaming gear for everyday tech buyers.',
    newsletter: 'Email for weekly deals',
    subscribe: 'Subscribe',
    usefulLinks: 'Useful Links',
    shop: 'Our Shop',
    tracking: 'Order Tracking',
    support: 'Support',
    services: 'Services',
    authentic: 'Authentic products',
    payment: 'Flexible payment',
    returns: '30-day returns',
    delivery: 'Fast delivery',
    gadgetShop: 'Gadgets shop',
    heroTitle: 'Get Best Device With Lowest Price.',
    heroText: 'Fresh tech deals across tablets, smartphones, watches, laptops, headphones, and gaming gear.',
    exploreNow: 'Explore Now',
    askAi: 'Ask AI Finder',
    fastDeliveryTitle: 'Fast Delivery',
    fastDeliveryText: 'Same-week shipping for available products.',
    securePaymentTitle: 'Secure Payment',
    securePaymentText: 'COD, bank transfer, Momo, and VNPAY.',
    originalProductsTitle: 'Original Products',
    originalProductsText: 'Every product is cataloged by SKU.',
    dailyDealsTitle: 'Daily Deals',
    dailyDealsText: 'Use TECH10, VIP20, or FREESHIP.',
    shopByCategory: 'Shop by category',
    shopAllShort: 'Shop all',
    quickFind: 'Quick find',
    browsePopular: 'Browse popular terms',
    buyNow: 'Buy Now',
    tabletOfferTitle: 'Apple iPad Air',
    tabletOfferText: 'Lightweight performance for notes, streaming, travel, and creative work.',
    watchOfferTitle: 'Apple Watch',
    watchOfferText: 'Fitness, health insights, notifications, and bright displays for every day.',
    popularProducts: 'Popular products',
    freshDeals: 'Fresh deals this week',
    shopAllProducts: 'Shop all Products',
    dealOfDay: 'Deal of the day',
    vrDealTitle: 'Get Virtual Reality with 30% off.',
    vrDealText: 'Immersive VR entertainment, gaming, learning, and virtual events in one compact headset.',
    getDeal: 'Get 30% Off Now',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    productAdded: 'added to cart',
    wishlistAdded: 'added to wishlist',
    add: 'Add',
    inStock: 'in stock',
    outOfStock: 'Out of stock',
    productTagNew: 'New',
    sale: 'Sale',
    catalogTitle: 'All KDKTech gadgets',
    catalogText: 'Search, filter, compare prices, and add the right device to your cart.',
    checkoutDiscount: '10% off at checkout',
    vipCoupon: '20% off for VIP customers',
    freeShippingCoupon: 'Free shipping',
    filters: 'Filters',
    reset: 'Reset',
    needMatch: 'Need a match?',
    aiMatchText: 'Ask AI Finder for a product recommendation.',
    openAi: 'Open AI Finder',
    searchByFeature: 'Search by name, tag, or feature...',
    sortFeatured: 'Sort: Featured',
    sortRating: 'Sort: Best rating',
    sortPriceAsc: 'Sort: Price low to high',
    sortPriceDesc: 'Sort: Price high to low',
    sortName: 'Sort: Name',
    productsFound: 'products found',
    noMatching: 'No matching products',
    noMatchingText: 'Try another brand, category, color, or price range.',
    clearFilters: 'Clear filters',
    checkout: 'Checkout',
    checkoutTitle: 'Complete your KDKTech order',
    checkoutText: 'Review your cart, add delivery details, choose payment, and apply a coupon.',
    cartStep: 'Cart',
    deliveryStep: 'Delivery',
    completeStep: 'Complete',
    deliveryInfo: 'Delivery information',
    fullName: 'Full name',
    phoneNumber: 'Phone number',
    deliveryAddress: 'Delivery address',
    ward: 'Ward',
    orderNote: 'Order note',
    paymentMethod: 'Payment method',
    codTitle: 'Cash on delivery',
    codDetail: 'Inspect the device at delivery, then pay the courier.',
    bankTitle: 'Bank transfer',
    bankDetail: 'Receive bank details after placing the order.',
    momoTitle: 'Momo wallet',
    momoDetail: 'Demo flow for digital wallet payment.',
    vnpayTitle: 'VNPAY',
    vnpayDetail: 'Demo flow for domestic payment gateway.',
    orderSummary: 'Order summary',
    remove: 'Remove',
    couponPlaceholder: 'Enter code: TECH10, VIP20, FREESHIP',
    invalidCode: 'Invalid code',
    subtotal: 'Subtotal',
    discount: 'Discount',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    creatingOrder: 'Creating order...',
    placeOrder: 'Place order',
    completeDelivery: 'Please enter complete delivery information',
    orderPlaced: 'Order placed successfully',
    orderFailed: 'Could not create the order. Please check the backend order-service.',
    emptyCart: 'Your cart is empty',
    emptyCartText: 'Explore the latest KDKTech devices and add your favorites.',
    selectedGear: 'Your selected gear',
    orderHistory: 'Order history',
    orderHistoryText: 'Track status, payment, and product details for every purchased gadget.',
    loadingOrders: 'Loading orders...',
    noOrders: 'No orders yet',
    order: 'Order',
    recipient: 'Recipient',
    justCreated: 'Just created',
    welcomeBack: 'Welcome back',
    join: 'Join KDKTech',
    createAccount: 'Create account',
    authLoginText: 'Sign in to checkout faster and track your orders.',
    authRegisterText: 'Create an account to save orders and manage your gadget purchases.',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    processing: 'Processing...',
    needAccount: 'Need an account? Register',
    haveAccount: 'Already have an account? Sign in',
    signedIn: 'Signed in successfully',
    accountCreated: 'Account created. Please sign in.',
    requestFailed: 'Could not process the request',
    findRightGadget: 'Find the right gadget',
    aiFinderText: 'Ask for a device by budget, feature, category, or use case.',
    aiWelcome: 'Tell me your budget and priorities: camera, battery, work, study, gaming, tablet, watch, or audio. I will recommend products from the KDKTech catalog.',
    chatbotNotReady: 'The chatbot service is not ready yet. You can continue shopping from the catalog.',
    replying: 'Replying...',
    askProducts: 'Ask about products...',
    send: 'Send',
    addToCart: 'Add to cart',
    promptIdeas: [
      'Best camera phone under 25,000,000 VND',
      'Laptop for coding and study',
      'Headphones with strong noise cancellation',
      'Watch for fitness and long battery life',
    ],
    categoryLabel: {
      All: 'All',
      'Smart Watches': 'Smart Watches',
      Headphones: 'Headphones',
      'Smart Phones': 'Smart Phones',
      Laptops: 'Laptops',
      'Gaming Console': 'Gaming Console',
      Tablets: 'Tablets',
    },
    categoryDescription: {
      'Smart Watches': 'Fitness tracking, bright displays, and premium straps.',
      Headphones: 'Noise cancellation and immersive wireless audio.',
      'Smart Phones': 'Flagship cameras, fast chips, and 5G connectivity.',
      Laptops: 'Portable machines for study, work, and creation.',
      'Gaming Console': 'Consoles, VR, and gaming audio for every setup.',
      Tablets: 'Big-screen entertainment, notes, and productivity.',
    },
    colorLabel: {
      All: 'All',
      Black: 'Black',
      Silver: 'Silver',
      White: 'White',
      Blue: 'Blue',
      Titanium: 'Titanium',
      Graphite: 'Graphite',
    },
    priceLabel: {
      all: 'All prices',
      'under-10': 'Under 10,000,000 VND',
      '10-20': '10,000,000 - 20,000,000 VND',
      '20-35': '20,000,000 - 35,000,000 VND',
      'over-35': 'Over 35,000,000 VND',
    },
    productCopy: {},
  },
  vi: {
    offer: 'Ưu đãi giới hạn: TECH10 giảm 10% cho thiết bị được chọn',
    shopAll: 'Xem sản phẩm',
    categories: 'Danh mục',
    shopByBrand: 'Theo thương hiệu',
    shopByPrice: 'Theo giá',
    shopByColor: 'Theo màu',
    nav: ['Trang chủ', 'Sản phẩm', 'Đơn hàng', 'Tư vấn AI'],
    search: 'Tìm thiết bị...',
    cart: 'Mở giỏ hàng',
    signIn: 'Đăng nhập',
    logout: 'Đăng xuất',
    footerText: 'Điện thoại, laptop, tablet, đồng hồ, tai nghe và thiết bị gaming được tuyển chọn cho người dùng công nghệ.',
    newsletter: 'Email nhận ưu đãi hằng tuần',
    subscribe: 'Đăng ký',
    usefulLinks: 'Liên kết',
    shop: 'Cửa hàng',
    tracking: 'Theo dõi đơn',
    support: 'Hỗ trợ',
    services: 'Dịch vụ',
    authentic: 'Sản phẩm chính hãng',
    payment: 'Thanh toán linh hoạt',
    returns: 'Đổi trả 30 ngày',
    delivery: 'Giao hàng nhanh',
    gadgetShop: 'Cửa hàng công nghệ',
    heroTitle: 'Sắm thiết bị tốt với giá hợp lý.',
    heroText: 'Ưu đãi công nghệ mới cho tablet, điện thoại, đồng hồ, laptop, tai nghe và gaming.',
    exploreNow: 'Khám phá ngay',
    askAi: 'Hỏi tư vấn AI',
    fastDeliveryTitle: 'Giao hàng nhanh',
    fastDeliveryText: 'Giao trong tuần với sản phẩm còn hàng.',
    securePaymentTitle: 'Thanh toán an toàn',
    securePaymentText: 'COD, chuyển khoản, Momo và VNPAY.',
    originalProductsTitle: 'Sản phẩm chính hãng',
    originalProductsText: 'Mỗi sản phẩm được quản lý bằng mã SKU.',
    dailyDealsTitle: 'Ưu đãi mỗi ngày',
    dailyDealsText: 'Dùng TECH10, VIP20 hoặc FREESHIP.',
    shopByCategory: 'Mua theo danh mục',
    shopAllShort: 'Xem tất cả',
    quickFind: 'Tìm nhanh',
    browsePopular: 'Từ khóa phổ biến',
    buyNow: 'Mua ngay',
    tabletOfferTitle: 'Apple iPad Air',
    tabletOfferText: 'Hiệu năng nhẹ gọn cho ghi chú, xem phim, du lịch và sáng tạo.',
    watchOfferTitle: 'Apple Watch',
    watchOfferText: 'Theo dõi sức khỏe, thông báo và màn hình sáng cho hằng ngày.',
    popularProducts: 'Sản phẩm nổi bật',
    freshDeals: 'Ưu đãi trong tuần',
    shopAllProducts: 'Xem toàn bộ sản phẩm',
    dealOfDay: 'Ưu đãi hôm nay',
    vrDealTitle: 'Sở hữu kính VR giảm 30%.',
    vrDealText: 'Trải nghiệm VR cho giải trí, gaming, học tập và sự kiện ảo trong một thiết bị gọn nhẹ.',
    getDeal: 'Nhận ưu đãi 30%',
    hour: 'Giờ',
    minute: 'Phút',
    second: 'Giây',
    productAdded: 'đã thêm vào giỏ hàng',
    wishlistAdded: 'đã thêm vào yêu thích',
    add: 'Thêm',
    inStock: 'còn hàng',
    outOfStock: 'Hết hàng',
    productTagNew: 'Mới',
    sale: 'Giảm',
    catalogTitle: 'Tất cả thiết bị KDKTech',
    catalogText: 'Tìm kiếm, lọc, so sánh giá và thêm thiết bị phù hợp vào giỏ hàng.',
    checkoutDiscount: 'Giảm 10% khi thanh toán',
    vipCoupon: 'Giảm 20% cho khách VIP',
    freeShippingCoupon: 'Miễn phí vận chuyển',
    filters: 'Bộ lọc',
    reset: 'Đặt lại',
    needMatch: 'Cần gợi ý?',
    aiMatchText: 'Hỏi AI Finder để được gợi ý sản phẩm.',
    openAi: 'Mở AI Finder',
    searchByFeature: 'Tìm theo tên, nhãn hoặc tính năng...',
    sortFeatured: 'Sắp xếp: Nổi bật',
    sortRating: 'Sắp xếp: Đánh giá cao',
    sortPriceAsc: 'Sắp xếp: Giá tăng dần',
    sortPriceDesc: 'Sắp xếp: Giá giảm dần',
    sortName: 'Sắp xếp: Tên',
    productsFound: 'sản phẩm phù hợp',
    noMatching: 'Không có sản phẩm phù hợp',
    noMatchingText: 'Thử thương hiệu, danh mục, màu hoặc mức giá khác.',
    clearFilters: 'Xóa bộ lọc',
    checkout: 'Thanh toán',
    checkoutTitle: 'Hoàn tất đơn hàng KDKTech',
    checkoutText: 'Kiểm tra giỏ hàng, nhập giao hàng, chọn thanh toán và áp dụng mã giảm giá.',
    cartStep: 'Giỏ hàng',
    deliveryStep: 'Giao hàng',
    completeStep: 'Hoàn tất',
    deliveryInfo: 'Thông tin giao hàng',
    fullName: 'Họ và tên',
    phoneNumber: 'Số điện thoại',
    deliveryAddress: 'Địa chỉ giao hàng',
    ward: 'Phường',
    orderNote: 'Ghi chú đơn hàng',
    paymentMethod: 'Phương thức thanh toán',
    codTitle: 'Thanh toán khi nhận hàng',
    codDetail: 'Kiểm tra thiết bị khi nhận rồi thanh toán cho đơn vị giao hàng.',
    bankTitle: 'Chuyển khoản ngân hàng',
    bankDetail: 'Nhận thông tin chuyển khoản sau khi đặt hàng.',
    momoTitle: 'Ví Momo',
    momoDetail: 'Luồng demo cho thanh toán ví điện tử.',
    vnpayTitle: 'VNPAY',
    vnpayDetail: 'Luồng demo cho cổng thanh toán nội địa.',
    orderSummary: 'Tóm tắt đơn hàng',
    remove: 'Xóa',
    couponPlaceholder: 'Nhập mã: TECH10, VIP20, FREESHIP',
    invalidCode: 'Mã không hợp lệ',
    subtotal: 'Tạm tính',
    discount: 'Giảm giá',
    shipping: 'Vận chuyển',
    free: 'Miễn phí',
    total: 'Tổng cộng',
    creatingOrder: 'Đang tạo đơn...',
    placeOrder: 'Đặt hàng',
    completeDelivery: 'Vui lòng nhập đầy đủ thông tin giao hàng',
    orderPlaced: 'Đặt hàng thành công',
    orderFailed: 'Không tạo được đơn hàng. Vui lòng kiểm tra order-service.',
    emptyCart: 'Giỏ hàng đang trống',
    emptyCartText: 'Khám phá thiết bị mới nhất tại KDKTech và thêm sản phẩm bạn thích.',
    selectedGear: 'Thiết bị đã chọn',
    orderHistory: 'Lịch sử đơn hàng',
    orderHistoryText: 'Theo dõi trạng thái, thanh toán và sản phẩm trong từng đơn hàng.',
    loadingOrders: 'Đang tải đơn hàng...',
    noOrders: 'Chưa có đơn hàng',
    order: 'Đơn hàng',
    recipient: 'Người nhận',
    justCreated: 'Vừa tạo',
    welcomeBack: 'Chào mừng quay lại',
    join: 'Tham gia KDKTech',
    createAccount: 'Tạo tài khoản',
    authLoginText: 'Đăng nhập để thanh toán nhanh hơn và theo dõi đơn hàng.',
    authRegisterText: 'Tạo tài khoản để lưu đơn hàng và quản lý mua sắm công nghệ.',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    email: 'Email',
    processing: 'Đang xử lý...',
    needAccount: 'Chưa có tài khoản? Đăng ký',
    haveAccount: 'Đã có tài khoản? Đăng nhập',
    signedIn: 'Đăng nhập thành công',
    accountCreated: 'Tạo tài khoản thành công. Vui lòng đăng nhập.',
    requestFailed: 'Không xử lý được yêu cầu',
    findRightGadget: 'Tìm thiết bị phù hợp',
    aiFinderText: 'Hỏi theo ngân sách, tính năng, danh mục hoặc nhu cầu sử dụng.',
    aiWelcome: 'Hãy cho tôi biết ngân sách và ưu tiên của bạn: camera, pin, làm việc, học tập, gaming, tablet, đồng hồ hoặc âm thanh. Tôi sẽ gợi ý sản phẩm từ KDKTech.',
    chatbotNotReady: 'Chatbot chưa sẵn sàng. Bạn vẫn có thể tiếp tục mua sắm từ catalog.',
    replying: 'Đang trả lời...',
    askProducts: 'Hỏi về sản phẩm...',
    send: 'Gửi',
    addToCart: 'Thêm vào giỏ',
    promptIdeas: [
      'Điện thoại camera tốt dưới 25,000,000 VND',
      'Laptop cho lập trình và học tập',
      'Tai nghe chống ồn mạnh',
      'Đồng hồ cho thể thao và pin lâu',
    ],
    categoryLabel: {
      All: 'Tất cả',
      'Smart Watches': 'Đồng hồ thông minh',
      Headphones: 'Tai nghe',
      'Smart Phones': 'Điện thoại',
      Laptops: 'Laptop',
      'Gaming Console': 'Thiết bị gaming',
      Tablets: 'Máy tính bảng',
    },
    categoryDescription: {
      'Smart Watches': 'Theo dõi sức khỏe, màn hình sáng và dây đeo cao cấp.',
      Headphones: 'Chống ồn và âm thanh không dây sống động.',
      'Smart Phones': 'Camera cao cấp, chip nhanh và kết nối 5G.',
      Laptops: 'Máy tính di động cho học tập, làm việc và sáng tạo.',
      'Gaming Console': 'Console, VR và âm thanh gaming cho mọi góc chơi.',
      Tablets: 'Màn hình lớn cho giải trí, ghi chú và năng suất.',
    },
    colorLabel: {
      All: 'Tất cả',
      Black: 'Đen',
      Silver: 'Bạc',
      White: 'Trắng',
      Blue: 'Xanh',
      Titanium: 'Titanium',
      Graphite: 'Than chì',
    },
    priceLabel: {
      all: 'Tất cả mức giá',
      'under-10': 'Dưới 10,000,000 VND',
      '10-20': '10,000,000 - 20,000,000 VND',
      '20-35': '20,000,000 - 35,000,000 VND',
      'over-35': 'Trên 35,000,000 VND',
    },
    productCopy: {
      chrome_watch: { tag: 'Độc quyền', description: 'Đồng hồ thông minh vỏ bóng với màn hình AMOLED, theo dõi sức khỏe và pin dùng cả ngày.' },
      black_sports_watch: { tag: 'Đang giảm', description: 'Đồng hồ thể thao bền bỉ có GPS, theo dõi bơi lội, giấc ngủ và sạc nhanh.' },
      apple_watch_ultra_2: { tag: 'Cao cấp', description: 'Đồng hồ titan với GPS chính xác, màn hình sáng và tính năng thể thao bền bỉ.' },
      playstation_headset: { tag: 'Gaming', description: 'Tai nghe gaming không dây có âm thanh độ trễ thấp, đệm tai êm và đàm thoại rõ.' },
      sony_wh1000xm5: { tag: 'Chống ồn', description: 'Tai nghe chống ồn flagship với pin 30 giờ và kết nối đa thiết bị.' },
      airpods_max: { tag: 'Âm thanh không gian', description: 'Tai nghe over-ear Apple có âm thanh không gian, chống ồn chủ động và hoàn thiện cao cấp.' },
      iphone_14_pro: { tag: '5G', description: 'Chip A16, Dynamic Island, camera 48MP và màn hình Super Retina luôn bật.' },
      android_phone_premium_set: { tag: 'Combo', description: 'Bộ Android cao cấp với màn hình tần số quét cao, camera AI và sạc nhanh.' },
      samsung_s24_ultra: { tag: 'AI phone', description: 'Điện thoại Galaxy AI với S Pen, camera 200MP và màn hình Dynamic AMOLED.' },
      silver_laptop_pro: { tag: 'Sẵn sàng làm việc', description: 'Laptop nhôm mỏng nhẹ với màn hình sáng, SSD nhanh và hiệu năng ổn định.' },
      macbook_air_15: { tag: 'Mỏng nhẹ', description: 'Màn hình Liquid Retina lớn, Apple silicon êm ái và thời lượng pin dài.' },
      dell_xps_15_oled: { tag: 'Sáng tạo', description: 'Laptop cho creator với màn hình OLED, đồ họa rời và thân máy cao cấp.' },
      playstation_5: { tag: 'Bán chạy', description: 'Console thế hệ mới với SSD siêu nhanh, tay cầm DualSense và hỗ trợ chơi game 4K.' },
      xbox_series_x: { tag: 'Mạnh mẽ', description: 'Console mạnh với tải game nhanh, chơi 4K và thư viện Game Pass phong phú.' },
      vr_gaming_headset: { tag: 'Nhập vai', description: 'Kính VR nhập vai cho game, sự kiện ảo và giải trí tương tác.' },
      tablet_x5: { tag: 'Di động', description: 'Tablet gọn nhẹ với màn hình sống động, hỗ trợ bút và pin ổn định khi di chuyển.' },
      ipad_air: { tag: 'Apple silicon', description: 'Tablet nhẹ với chip Apple, màn hình sắc nét, Touch ID và hỗ trợ Apple Pencil.' },
      galaxy_tab_s9: { tag: 'Android', description: 'Tablet Android cao cấp với màn hình AMOLED, S Pen và thiết kế kháng nước.' },
    },
  },
};

const translateCategory = (text, value) => text.categoryLabel?.[value] || value;
const translateColor = (text, value) => text.colorLabel?.[value] || value;
const translatePriceRange = (text, range) => text.priceLabel?.[range.id] || range.label;
const categoryFilterItems = (text) => CATEGORIES.map((item) => ({ label: translateCategory(text, item), value: item }));
const colorFilterItems = (text) => COLORS.map((item) => ({ label: translateColor(text, item), value: item }));
const priceFilterItems = (text) => PRICE_RANGES.map((item) => ({ label: translatePriceRange(text, item), value: item.id }));
const couponFeedback = (couponCode, calculated, text) => {
  if (!couponCode) return '';
  if (!calculated.coupon) return text.invalidCode;
  if (calculated.coupon.freeShipping) return text.freeShippingCoupon || 'Free shipping';
  if (couponCode.trim().toUpperCase() === 'VIP20') return text.vipCoupon || '20% off for VIP customers';
  return text.checkoutDiscount;
};

const makeSku = (value) => (value || 'product')
  .toString()
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

const money = (value) => `${Number(value || 0).toLocaleString('en-US')} VND`;

const normalizeCategory = (category, skuCode) => CATEGORY_ALIASES[category] || category || PRODUCT_BY_SKU[skuCode]?.category || 'Gaming Console';

const productDescription = (description, skuCode) => PRODUCT_BY_SKU[skuCode]?.description || description || 'Product details are being updated.';

const decodeJwtPayload = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

const decodeUser = () => {
  const token = localStorage.getItem('token');
  const fallbackUsername = localStorage.getItem('username');
  if (!token) return fallbackUsername ? { username: fallbackUsername } : null;
  const payload = decodeJwtPayload(token);
  return { username: payload?.sub || fallbackUsername || 'user', role: payload?.role || 'USER' };
};

const getAdminSession = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || '{}'); } catch { return {}; }
  })();
  const role = payload?.role || stored.role;
  if (role !== 'ADMIN') return null;
  return { token, username: payload?.sub || stored.username || 'admin', role };
};

const adminConfig = () => {
  const session = getAdminSession();
  return session ? { headers: { Authorization: `Bearer ${session.token}` } } : {};
};

const enrichProduct = (product, index = 0) => {
  const skuCode = product.skuCode || makeSku(product.name || product.id);
  const demo = PRODUCT_BY_SKU[skuCode];
  const meta = PRODUCT_META[skuCode] || {};
  return {
    id: product.id || skuCode,
    skuCode,
    name: product.name || demo?.name || 'New product',
    description: productDescription(product.description, skuCode),
    price: Number(product.price || demo?.price || 0),
    category: normalizeCategory(product.category, skuCode),
    imageUrl: product.imageUrl || demo?.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    stockQuantity: product.stockQuantity ?? demo?.stockQuantity ?? 99,
    unit: product.unit || demo?.unit || 'piece',
    lastImportPrice: Number(product.lastImportPrice ?? demo?.lastImportPrice ?? Math.round(Number(product.price || demo?.price || 0) * 0.8)),
    profitMarginPercent: Number(product.profitMarginPercent ?? demo?.profitMarginPercent ?? 25),
    status: product.status || demo?.status || 'VISIBLE',
    hasImportHistory: Boolean(product.hasImportHistory ?? demo?.hasImportHistory ?? false),
    brand: meta.brand || product.brand || 'KDK',
    color: meta.color || product.color || 'Black',
    rating: meta.rating || product.rating || 4.5,
    salePercent: meta.salePercent ?? product.salePercent ?? 0,
    tag: meta.tag || product.tag || 'New',
  };
};

const fallbackProducts = PRODUCT_CATALOG.map(enrichProduct);

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200);
  }, []);
  return { toasts, addToast };
}

function Toasts({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <BadgePercent size={18} />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts_cart') || '[]'); } catch { return []; }
  });
  const save = (next) => {
    setCart(next);
    localStorage.setItem('ts_cart', JSON.stringify(next));
  };
  const addItem = (product) => {
    save(cart.some((item) => item.id === product.id)
      ? cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      : [...cart, { ...product, qty: 1 }]);
  };
  const updateQty = (id, qty) => save(qty <= 0 ? cart.filter((item) => item.id !== id) : cart.map((item) => item.id === id ? { ...item, qty } : item));
  const removeItem = (id) => save(cart.filter((item) => item.id !== id));
  const clearCart = () => save([]);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.qty * Number(item.price || 0), 0);
  return { cart, addItem, updateQty, removeItem, clearCart, count, subtotal };
}

function loadLocalOrders() {
  try { return JSON.parse(localStorage.getItem('ts_orders') || '[]'); } catch { return []; }
}

function saveLocalOrder(order) {
  const orders = loadLocalOrders();
  localStorage.setItem('ts_orders', JSON.stringify([order, ...orders].slice(0, 30)));
}

const isAdminAuthed = () => Boolean(getAdminSession());

function AdminIndex() {
  return <Navigate to={isAdminAuthed() ? '/admin/dashboard' : '/admin/login'} replace />;
}

function AdminGate({ children }) {
  return isAdminAuthed() ? children : <Navigate to="/admin/login" replace />;
}

function BrandLogo({ admin = false }) {
  return (
    <Link className={admin ? 'admin-logo' : 'brand'} to={admin ? '/admin/dashboard' : '/'}>
      <span className="brand-mark">K</span>
      <span>KDKTech</span>
    </Link>
  );
}

function Shell({ cartCount, openCart, children, language, toggleLanguage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = decodeUser();
  const text = CUSTOMER_TEXT[language] || CUSTOMER_TEXT.en;
  const [searchText, setSearchText] = useState('');
  const nav = [
    ['/', text.nav[0], Home],
    ['/products', text.nav[1], Store],
    ['/orders', text.nav[2], ClipboardList],
    ['/chat', text.nav[3], MessageCircle],
  ];
  const submitSearch = (event) => {
    event.preventDefault();
    const q = searchText.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };
  return (
    <>
      <header className="site-header">
        <div className="announcement">
          <span>{text.offer}</span>
          <Link to="/products">{text.shopAll} <ArrowRight size={14} /></Link>
        </div>
        <nav className="topbar">
          <BrandLogo />
          <div className="nav-cluster">
            <div className="category-menu">
              <button className="category-trigger" type="button">
                <Menu size={18} />
                {text.categories}
                <ChevronDown size={16} />
              </button>
              <div className="mega-menu">
                <div>
                  <h4>{text.shopByBrand}</h4>
                  {BRANDS.filter((brand) => brand !== 'All').slice(0, 6).map((brand) => <Link key={brand} to={`/products?brand=${brand}`}>{brand}</Link>)}
                </div>
                <div>
                  <h4>{text.shopByPrice}</h4>
                  {PRICE_RANGES.filter((range) => range.id !== 'all').map((range) => <Link key={range.id} to={`/products?price=${range.id}`}>{translatePriceRange(text, range)}</Link>)}
                </div>
                <div>
                  <h4>{text.categories}</h4>
                  {CATEGORY_NAMES.map((category) => <Link key={category} to={`/products?cat=${encodeURIComponent(category)}`}>{translateCategory(text, category)}</Link>)}
                </div>
                <div>
                  <h4>{text.shopByColor}</h4>
                  {COLORS.filter((color) => color !== 'All').map((color) => <Link key={color} to={`/products?color=${color}`}>{translateColor(text, color)}</Link>)}
                </div>
              </div>
            </div>
            <div className="navlinks">
              {nav.map(([to, label, Icon]) => (
                <Link key={to} className={location.pathname === to ? 'active' : ''} to={to}>
                  {createElement(Icon, { size: 16 })}
                  {label}
                </Link>
              ))}
            </div>
            <form className="search-box" onSubmit={submitSearch}>
              <Search size={18} />
              <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder={text.search} />
              <button type="submit" aria-label="Search"><ArrowRight size={16} /></button>
            </form>
          </div>
          <div className="nav-actions">
            <button className="icon-btn cart-button" type="button" onClick={openCart} aria-label={text.cart}>
              <ShoppingCart size={20} />
              {cartCount > 0 ? <span>{cartCount}</span> : null}
            </button>
            {user ? (
              <>
                <span className="user-pill"><User size={15} />{user.username}</span>
                <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label="Switch language">
                  {language === 'vi' ? 'EN' : 'VI'}
                </button>
                <button className="ghost-btn compact" type="button" onClick={logout}><LogOut size={16} />{text.logout}</button>
              </>
            ) : (
              <>
                <Link className="primary compact" to="/login"><User size={16} />{text.signIn}</Link>
                <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label="Switch language">
                  {language === 'vi' ? 'EN' : 'VI'}
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <StoreFooter text={text} />
    </>
  );
}

function StoreFooter({ text }) {
  return (
    <footer className="store-footer">
      <div className="footer-newsletter">
        <BrandLogo />
        <p>{text.footerText}</p>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <Mail size={18} />
          <input placeholder={text.newsletter} />
          <button type="submit">{text.subscribe}</button>
        </form>
      </div>
      <div>
        <h4>{text.usefulLinks}</h4>
        <Link to="/products">{text.shop}</Link>
        <Link to="/orders">{text.tracking}</Link>
        <Link to="/chat">{text.nav[3]}</Link>
      </div>
      <div>
        <h4>{text.support}</h4>
        <span><Phone size={15} />1800 2026</span>
        <span><Mail size={15} />support@kdktech.local</span>
        <span><MapPin size={15} />Ho Chi Minh City, Vietnam</span>
      </div>
      <div>
        <h4>{text.services}</h4>
        <span>{text.authentic}</span>
        <span>{text.payment}</span>
        <span>{text.returns}</span>
        <span>{text.delivery}</span>
      </div>
    </footer>
  );
}

function CartDrawer({ open, close, cart, updateQty, removeItem, subtotal, text }) {
  const navigate = useNavigate();
  return (
    <>
      <div className={`shade ${open ? 'show' : ''}`} onClick={close} />
      <aside className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow">{text.cartStep}</span>
            <h2>{text.selectedGear}</h2>
          </div>
          <button className="icon-btn" type="button" onClick={close} aria-label="Close cart"><X size={20} /></button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty compact-empty">
              <ShoppingCart size={36} />
              <h3>{text.emptyCart}</h3>
              <p>{text.emptyCartText}</p>
            </div>
          ) : cart.map((item) => (
            <div className="cart-line" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <b>{item.name}</b>
                <p>{money(item.price)}</p>
                <div className="qty-row">
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={14} /></button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                  <button className="link-danger" type="button" onClick={() => removeItem(item.id)}>{text.remove}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          <div className="total-row"><span>{text.subtotal}</span><b>{money(subtotal)}</b></div>
          <button className="primary full" type="button" disabled={cart.length === 0} onClick={() => { close(); navigate('/checkout'); }}>
            {text.checkout} <ArrowRight size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

function Rating({ value }) {
  return (
    <span className="rating" aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((item) => <Star key={item} size={14} fill="currentColor" />)}
      <b>{Number(value || 4.5).toFixed(1)}</b>
    </span>
  );
}

function ProductCard({ product, addToCart, addToast, text }) {
  const originalPrice = product.salePercent > 0 ? Math.round(product.price / (1 - product.salePercent / 100)) : null;
  const copy = text.productCopy?.[product.skuCode] || {};
  const badge = copy.tag || (product.tag === 'New' ? text.productTagNew : product.tag);
  return (
    <article className="product-card">
      <div className="product-media">
        <img src={product.imageUrl} alt={product.name} />
        {product.salePercent > 0 ? <span className="sale-badge">{text.sale} {product.salePercent}%</span> : <span className="product-badge">{badge}</span>}
        <button className="wishlist-btn" type="button" onClick={() => addToast?.(`${product.name} ${text.wishlistAdded}`)}>
          <Heart size={18} />
        </button>
      </div>
      <div className="product-info">
        <div className="row between">
          <span className="tag">{translateCategory(text, product.category)}</span>
          <Rating value={product.rating} />
        </div>
        <h3>{product.name}</h3>
        <p>{copy.description || product.description}</p>
        <div className="product-meta">
          <span>{product.brand}</span>
          <span>{translateColor(text, product.color)}</span>
          <span className={product.stockQuantity > 0 ? 'stock-ok' : 'stock-bad'}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} ${text.inStock}` : text.outOfStock}
          </span>
        </div>
        <div className="row between product-actions">
          <div className="price-block">
            {originalPrice ? <span>{money(originalPrice)}</span> : null}
            <b className="price">{money(product.price)}</b>
          </div>
          <button className="primary add-cart" type="button" disabled={product.stockQuantity <= 0} onClick={() => addToCart(product)}>
            <ShoppingCart size={17} />
            {text.add}
          </button>
        </div>
      </div>
    </article>
  );
}

function CategoryTile({ tile, text }) {
  const Icon = CATEGORY_ICONS[tile.name] || Sparkles;
  return (
    <Link className="category-tile" to={`/products?cat=${encodeURIComponent(tile.name)}`}>
      <img src={tile.imageUrl} alt={tile.name} />
      <span><Icon size={20} />{text.categories}</span>
      <h3>{translateCategory(text, tile.name)}</h3>
      <p>{text.categoryDescription?.[tile.name] || tile.description}</p>
      <b>{text.exploreNow} <ArrowRight size={15} /></b>
    </Link>
  );
}

function HomePage({ products, addToCart, addToast, text }) {
  const heroProduct = products.find((product) => product.skuCode === 'ipad_air') || products[0] || fallbackProducts[0];
  const watchProduct = products.find((product) => product.skuCode === 'apple_watch_ultra_2') || products[1] || heroProduct;
  const dealProduct = products.find((product) => product.skuCode === 'vr_gaming_headset') || products[2] || heroProduct;
  const featured = products.slice(0, 8);
  return (
    <section className="page home-page">
      <div className="hero-banner">
        <div className="hero-copy">
          <span className="eyebrow">{text.gadgetShop}</span>
          <h1>{text.heroTitle}</h1>
          <p>{text.heroText}</p>
          <div className="hero-actions">
            <Link className="primary" to="/products">{text.exploreNow} <ArrowRight size={18} /></Link>
            <Link className="ghost-btn" to="/chat"><Bot size={18} />{text.askAi}</Link>
          </div>
        </div>
        <div className="hero-product">
          <img src={heroProduct.imageUrl} alt={heroProduct.name} />
          <div className="hero-floating-card">
            <span>{translateCategory(text, heroProduct.category)}</span>
            <b>{heroProduct.name}</b>
            <strong>{money(heroProduct.price)}</strong>
          </div>
        </div>
      </div>

      <div className="service-ribbon">
        <div><Truck size={23} /><b>{text.fastDeliveryTitle}</b><span>{text.fastDeliveryText}</span></div>
        <div><ShieldCheck size={23} /><b>{text.securePaymentTitle}</b><span>{text.securePaymentText}</span></div>
        <div><PackageCheck size={23} /><b>{text.originalProductsTitle}</b><span>{text.originalProductsText}</span></div>
        <div><BadgePercent size={23} /><b>{text.dailyDealsTitle}</b><span>{text.dailyDealsText}</span></div>
      </div>

      <div className="section-head">
        <div>
          <span className="eyebrow">{text.categories}</span>
          <h2>{text.shopByCategory}</h2>
        </div>
        <Link to="/products">{text.shopAllShort} <ArrowRight size={16} /></Link>
      </div>
      <div className="category-grid">
        {CATEGORY_TILES.map((tile) => <CategoryTile key={tile.name} tile={tile} text={text} />)}
      </div>

      <div className="quick-find">
        <div>
          <span className="eyebrow">{text.quickFind}</span>
          <h2>{text.browsePopular}</h2>
        </div>
        <div>
          {CATEGORY_NAMES.map((category) => <Link key={category} to={`/products?cat=${encodeURIComponent(category)}`}>{translateCategory(text, category)}</Link>)}
          {QUICK_TAGS.map((tag) => <Link key={tag} to={`/products?q=${encodeURIComponent(tag)}`}>{tag}</Link>)}
        </div>
      </div>

      <div className="offer-grid">
        <article className="offer-card">
          <div>
            <span>{translateCategory(text, 'Tablets')}</span>
            <h2>{text.tabletOfferTitle}</h2>
            <p>{text.tabletOfferText}</p>
            <Link className="primary compact" to="/products?cat=Tablets">{text.buyNow}</Link>
          </div>
          <img src={heroProduct.imageUrl} alt={heroProduct.name} />
        </article>
        <article className="offer-card dark">
          <div>
            <span>{translateCategory(text, 'Smart Watches')}</span>
            <h2>{text.watchOfferTitle}</h2>
            <p>{text.watchOfferText}</p>
            <Link className="primary compact" to="/products?cat=Smart%20Watches">{text.buyNow}</Link>
          </div>
          <img src={watchProduct.imageUrl} alt={watchProduct.name} />
        </article>
      </div>

      <div className="section-head">
        <div>
          <span className="eyebrow">{text.popularProducts}</span>
          <h2>{text.freshDeals}</h2>
        </div>
        <Link to="/products">{text.shopAllProducts} <ArrowRight size={16} /></Link>
      </div>
      <div className="product-grid">
        {featured.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} addToast={addToast} text={text} />)}
      </div>

      <div className="deal-panel">
        <div>
          <span className="eyebrow">{text.dealOfDay}</span>
          <h2>{text.vrDealTitle}</h2>
          <p>{text.vrDealText}</p>
          <Link className="primary" to="/products?q=VR">{text.getDeal} <ArrowRight size={18} /></Link>
        </div>
        <div className="deal-product">
          <img src={dealProduct.imageUrl} alt={dealProduct.name} />
          <div className="countdown">
            <span><b>12</b>{text.hour}</span>
            <span><b>42</b>{text.minute}</span>
            <span><b>18</b>{text.second}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsPage({ products, addToCart, addToast, text }) {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('cat') || 'All');
  const [brand, setBrand] = useState(params.get('brand') || 'All');
  const [color, setColor] = useState(params.get('color') || 'All');
  const [priceRange, setPriceRange] = useState(params.get('price') || 'all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setQuery(params.get('q') || '');
    setCategory(params.get('cat') || 'All');
    setBrand(params.get('brand') || 'All');
    setColor(params.get('color') || 'All');
    setPriceRange(params.get('price') || 'all');
  }, [params]);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((item) => item.id === priceRange) || PRICE_RANGES[0];
    let next = products.filter((product) => {
      const haystack = `${product.name} ${product.description} ${product.brand} ${product.category} ${product.color} ${product.tag}`.toLowerCase();
      return haystack.includes(query.toLowerCase())
        && (category === 'All' || product.category === category)
        && (brand === 'All' || product.brand === brand)
        && (color === 'All' || product.color === color)
        && product.price >= range.min
        && product.price < range.max;
    });
    if (sort === 'price-asc') next = [...next].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') next = [...next].sort((a, b) => b.price - a.price);
    if (sort === 'rating') next = [...next].sort((a, b) => b.rating - a.rating);
    if (sort === 'name') next = [...next].sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }, [products, query, category, brand, color, priceRange, sort]);

  const resetFilters = () => {
    setQuery('');
    setCategory('All');
    setBrand('All');
    setColor('All');
    setPriceRange('all');
    setSort('featured');
  };

  return (
    <section className="page">
      <div className="catalog-hero">
        <div>
          <span className="eyebrow">{text.nav[1]}</span>
          <h1>{text.catalogTitle}</h1>
          <p>{text.catalogText}</p>
        </div>
        <div className="catalog-promo">
          <BadgePercent size={26} />
          <b>TECH10</b>
          <span>{text.checkoutDiscount}</span>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="shop-sidebar">
          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <b>{text.filters}</b>
            <button type="button" onClick={resetFilters}>{text.reset}</button>
          </div>
          <FilterGroup title={text.categories} items={categoryFilterItems(text)} active={category} onChange={setCategory} />
          <FilterGroup title={text.shopByBrand} items={BRANDS.map((item) => item === 'All' ? { label: text.categoryLabel.All, value: item } : item)} active={brand} onChange={setBrand} />
          <FilterGroup title={text.shopByPrice} items={priceFilterItems(text)} active={priceRange} onChange={setPriceRange} />
          <FilterGroup title={text.shopByColor} items={colorFilterItems(text)} active={color} onChange={setColor} />
          <div className="sidebar-banner">
            <Sparkles size={24} />
            <b>{text.needMatch}</b>
            <span>{text.aiMatchText}</span>
            <Link to="/chat">{text.openAi}</Link>
          </div>
        </aside>

        <div className="catalog-results">
          <div className="toolbar">
            <label className="search-field">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchByFeature} />
            </label>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">{text.sortFeatured}</option>
              <option value="rating">{text.sortRating}</option>
              <option value="price-asc">{text.sortPriceAsc}</option>
              <option value="price-desc">{text.sortPriceDesc}</option>
              <option value="name">{text.sortName}</option>
            </select>
          </div>
          <div className="result-line">
            <span>{filtered.length} {text.productsFound}</span>
            <div>
              {QUICK_TAGS.map((tag) => <button key={tag} type="button" onClick={() => setQuery(tag)}>{tag}</button>)}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">
              <Search size={40} />
              <h2>{text.noMatching}</h2>
              <p>{text.noMatchingText}</p>
              <button className="primary" type="button" onClick={resetFilters}>{text.clearFilters}</button>
            </div>
          ) : (
            <div className="product-grid catalog-grid">
              {filtered.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} addToast={addToast} text={text} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ title, items, active, onChange }) {
  const normalized = items.map((item) => typeof item === 'string' ? { label: item, value: item } : item);
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div>
        {normalized.map((item) => (
          <button key={item.value} className={active === item.value ? 'active' : ''} type="button" onClick={() => onChange(item.value)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function totalsFor(cartSubtotal, couponCode) {
  const shipping = cartSubtotal >= 5000000 ? 0 : 30000;
  const coupon = COUPONS[(couponCode || '').trim().toUpperCase()];
  const discount = coupon?.percent ? Math.round(cartSubtotal * coupon.percent) : 0;
  const shippingFee = coupon?.freeShipping ? 0 : shipping;
  return { coupon, discount, shippingFee, total: Math.max(cartSubtotal - discount + shippingFee, 0) };
}

function CheckoutPage({ cart, subtotal, updateQty, removeItem, clearCart, addToast, text }) {
  const navigate = useNavigate();
  const user = decodeUser();
  const [customer, setCustomer] = useState({ customerName: '', phone: '', shippingAddress: '', ward: '', note: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [placing, setPlacing] = useState(false);
  const calculated = totalsFor(subtotal, couponCode);
  const paymentMethods = [
    { id: 'COD', title: text.codTitle, detail: text.codDetail, icon: Truck },
    { id: 'BANK', title: text.bankTitle, detail: text.bankDetail, icon: CreditCard },
    { id: 'MOMO', title: text.momoTitle, detail: text.momoDetail, icon: BadgePercent },
    { id: 'VNPAY', title: text.vnpayTitle, detail: text.vnpayDetail, icon: ShieldCheck },
  ];

  const placeOrder = async () => {
    if (cart.length === 0) return;
    if (!customer.customerName || !customer.phone || !customer.shippingAddress || !customer.ward) {
      addToast(text.completeDelivery, 'warning');
      return;
    }
    const payload = {
      username: user?.username || 'guest',
      ...customer,
      paymentMethod,
      couponCode: couponCode.trim().toUpperCase(),
      subtotal,
      discountAmount: calculated.discount,
      shippingFee: calculated.shippingFee,
      totalAmount: calculated.total,
      orderLineItemsDtoList: cart.map((item) => ({
        skuCode: item.skuCode || makeSku(item.name),
        productName: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.qty,
      })),
    };
    setPlacing(true);
    try {
      const response = await api.post('/order', payload);
      const saved = response.data?.orderNumber ? response.data : {
        ...payload,
        orderNumber: `LOCAL-${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        items: payload.orderLineItemsDtoList,
      };
      saveLocalOrder(saved);
      clearCart();
      addToast(text.orderPlaced);
      navigate('/orders');
    } catch {
      addToast(text.orderFailed, 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <section className="page">
      <PageIntro eyebrow={text.checkout} title={text.checkoutTitle} text={text.checkoutText} />
      {cart.length === 0 ? (
        <div className="empty">
          <ShoppingCart size={42} />
          <h2>{text.emptyCart}</h2>
          <button className="primary" type="button" onClick={() => navigate('/products')}>{text.shopAllProducts}</button>
        </div>
      ) : (
        <>
          <div className="checkout-steps">
            <div className="active"><b>1</b><span>{text.cartStep}</span></div>
            <div className="active"><b>2</b><span>{text.deliveryStep}</span></div>
            <div><b>3</b><span>{text.completeStep}</span></div>
          </div>
          <div className="checkout-grid">
            <div className="panel checkout-panel">
              <h2>{text.deliveryInfo}</h2>
              <div className="form-grid">
                <input placeholder={text.fullName} value={customer.customerName} onChange={(event) => setCustomer({ ...customer, customerName: event.target.value })} />
                <input placeholder={text.phoneNumber} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} />
                <input placeholder={text.deliveryAddress} value={customer.shippingAddress} onChange={(event) => setCustomer({ ...customer, shippingAddress: event.target.value })} />
                <input placeholder={text.ward} value={customer.ward} onChange={(event) => setCustomer({ ...customer, ward: event.target.value })} />
                <input className="span-2" placeholder={text.orderNote} value={customer.note} onChange={(event) => setCustomer({ ...customer, note: event.target.value })} />
              </div>
              <h2>{text.paymentMethod}</h2>
              <div className="payment-grid">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button key={method.id} type="button" className={paymentMethod === method.id ? 'payment active' : 'payment'} onClick={() => setPaymentMethod(method.id)}>
                      <Icon size={22} />
                      <b>{method.title}</b>
                      <span>{method.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="panel sticky-panel">
              <h2>{text.orderSummary}</h2>
              {cart.map((item) => (
                <div className="summary-line" key={item.id}>
                  <img src={item.imageUrl} alt={item.name} />
                  <div>
                    <b>{item.name}</b>
                    <div className="qty-row">
                      <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                      <button className="link-danger" type="button" onClick={() => removeItem(item.id)}>{text.remove}</button>
                    </div>
                  </div>
                  <span>{money(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="coupon-box">
                <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder={text.couponPlaceholder} />
                {couponCode && <p className={calculated.coupon ? 'ok-text' : 'danger-text'}>{couponFeedback(couponCode, calculated, text)}</p>}
              </div>
              <div className="totals">
                <div><span>{text.subtotal}</span><b>{money(subtotal)}</b></div>
                <div><span>{text.discount}</span><b>-{money(calculated.discount)}</b></div>
                <div><span>{text.shipping}</span><b>{calculated.shippingFee === 0 ? text.free : money(calculated.shippingFee)}</b></div>
                <div className="grand"><span>{text.total}</span><b>{money(calculated.total)}</b></div>
              </div>
              <button className="primary full" type="button" disabled={placing} onClick={placeOrder}>
                {placing ? text.creatingOrder : text.placeOrder} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function PageIntro({ eyebrow, title, text, action }) {
  return (
    <div className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

function OrdersPage({ text }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = decodeUser()?.username || 'guest';
  useEffect(() => {
    api.get(`/order?username=${encodeURIComponent(username)}`)
      .then((response) => setOrders(response.data || []))
      .catch(() => setOrders(loadLocalOrders().filter((order) => !order.username || order.username === username)))
      .finally(() => setLoading(false));
  }, [username]);
  return (
    <section className="page">
      <PageIntro eyebrow={text.nav[2]} title={text.orderHistory} text={text.orderHistoryText} />
      {loading ? (
        <div className="loading-line"><RefreshCw size={18} />{text.loadingOrders}</div>
      ) : orders.length === 0 ? (
        <div className="empty">
          <ClipboardList size={42} />
          <h2>{text.noOrders}</h2>
          <Link className="primary" to="/products">{text.shopAllProducts}</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => <OrderCard key={order.orderNumber || order.id} order={order} text={text} />)}
        </div>
      )}
    </section>
  );
}

function OrderCard({ order, text }) {
  const items = order.items || order.orderLineItemsDtoList || [];
  return (
    <article className="order-card">
      <div className="row between">
        <div>
          <h3>{text.order} #{(order.orderNumber || '').slice(0, 8) || order.id}</h3>
          <p className="muted">{order.createdAt ? new Date(order.createdAt).toLocaleString('en-US') : text.justCreated}</p>
        </div>
        <span className="status">{order.status || 'PENDING'}</span>
      </div>
      <div className="order-meta">
        <span>{text.recipient}: <b>{order.customerName || 'Customer'}</b></span>
        <span>{text.ward}: <b>{order.ward || '-'}</b></span>
        <span>{text.paymentMethod}: <b>{order.paymentMethod || 'COD'}</b></span>
        <span>{text.total}: <b>{money(order.totalAmount)}</b></span>
      </div>
      <div className="mini-items">
        {items.map((item, index) => <span key={`${item.skuCode || item.productName}-${index}`}>{item.productName || item.skuCode} x {item.quantity}</span>)}
      </div>
    </article>
  );
}

const emptyProduct = {
  skuCode: '',
  name: '',
  description: '',
  price: '',
  category: CATEGORY_NAMES[0],
  imageUrl: '',
  stockQuantity: 10,
  unit: 'piece',
  lastImportPrice: '',
  profitMarginPercent: 25,
  status: 'VISIBLE',
};

const emptyCategory = {
  code: '',
  name: '',
  description: '',
  imageUrl: '',
  status: 'VISIBLE',
  displayOrder: 0,
};

const emptyUserForm = {
  username: '',
  email: '',
  password: '',
  role: 'USER',
};

const createReceiptLine = () => ({ skuCode: '', productName: '', importPrice: '', quantity: 1 });

const emptyReceiptForm = () => ({
  importDate: new Date().toISOString().slice(0, 16),
  note: '',
  items: [createReceiptLine()],
});

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const VISIBILITY_STATUSES = ['VISIBLE', 'HIDDEN'];

const ADMIN_SECTIONS = [
  ['admin-overview', 'Tổng quan', LayoutDashboard],
  ['admin-users', 'Người dùng', UserPlus],
  ['admin-categories', 'Danh mục', SlidersHorizontal],
  ['admin-products', 'Sản phẩm', PackageCheck],
  ['admin-receipts', 'Nhập hàng', Truck],
  ['admin-pricing', 'Giá bán', BadgePercent],
  ['admin-orders', 'Đơn hàng', ClipboardList],
  ['admin-reports', 'Tồn kho / Báo cáo', ShieldCheck],
];

const formatDateTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : '-');
const dayStart = (value) => (value ? `${value}T00:00:00` : '');
const dayEnd = (value) => (value ? `${value}T23:59:59` : '');
const statusClass = (value) => `status status-${String(value || '').toLowerCase()}`;

function AdminLoginPage({ addToast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: 'admin', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/admin/login', form);
      if (response.data?.role !== 'ADMIN' || !response.data?.token) {
        throw new Error('Forbidden');
      }
      localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ username: response.data.username || form.username, role: response.data.role }));
      addToast('Đăng nhập quản trị thành công');
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error.response
        ? 'Tài khoản quản trị không hợp lệ hoặc đã bị khóa'
        : 'Không kết nối được máy chủ quản trị. Vui lòng kiểm tra backend API.';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">
      <form className="auth-card admin-login-card" onSubmit={submit}>
        <BrandLogo admin />
        <span className="eyebrow">KDKTech web-admin</span>
        <h1>Đăng nhập quản trị</h1>
        <p>Khu vực riêng cho quản trị viên, dùng URL trực tiếp và tài khoản có quyền ADMIN.</p>
        <label>
          Tên đăng nhập
          <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
        </label>
        <label>
          Mật khẩu
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="admin123" required />
        </label>
        <button className="primary full" disabled={loading}>{loading ? 'Đang kiểm tra...' : 'Đăng nhập admin'}</button>
        <p className="muted">Tài khoản mặc định: admin / admin123</p>
      </form>
    </section>
  );
}

function AdminShell({ children, activeSection, onSectionChange }) {
  const navigate = useNavigate();
  const session = getAdminSession();
  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    navigate('/admin/login');
  };
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <BrandLogo admin />
        <nav>
          {ADMIN_SECTIONS.map(([id, label, Icon]) => (
            <button key={id} className={activeSection === id ? 'active' : ''} type="button" onClick={() => onSectionChange(id)}>
              {createElement(Icon, { size: 17 })}
              {label}
            </button>
          ))}
        </nav>
        <button className="ghost-btn full" type="button" onClick={logout}><LogOut size={17} />Đăng xuất</button>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">KDKTech Web Admin</span>
            <h1>Trung tâm quản trị</h1>
          </div>
          <div className="admin-user-badge">
            <ShieldCheck size={20} />
            <span>
              <b>{session?.username || 'admin'}</b>
              <small>{session?.role || 'ADMIN'}</small>
            </span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function AdminPage({ products, reloadProducts, addToast }) {
  const [adminProducts, setAdminProducts] = useState(products);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [receiptForm, setReceiptForm] = useState(emptyReceiptForm());
  const [editingReceiptId, setEditingReceiptId] = useState(null);
  const [priceMargins, setPriceMargins] = useState({});
  const [orderFilters, setOrderFilters] = useState({ from: '', to: '', status: '', ward: '', sort: 'createdAtDesc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stockAt, setStockAt] = useState('');
  const [movementFilters, setMovementFilters] = useState({ from: '', to: '' });
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const resolveAdminSection = () => {
    const hash = window.location.hash.replace('#', '');
    return ADMIN_SECTIONS.some(([id]) => id === hash) ? hash : 'admin-overview';
  };
  const [activeSection, setActiveSection] = useState(resolveAdminSection);
  const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const categoryOptions = categories.length > 0 ? categories.map((item) => item.name) : CATEGORY_NAMES;
  const productBySku = useMemo(() => Object.fromEntries(adminProducts.map((product) => [product.skuCode, product])), [adminProducts]);
  const stockRows = stock.map((item) => ({ ...item, product: productBySku[item.skuCode] }));

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    const [
      productResult,
      categoryResult,
      userResult,
      orderResult,
      receiptResult,
      stockResult,
      movementResult,
      lowStockResult,
    ] = await Promise.allSettled([
      api.get('/product/admin', adminConfig()),
      api.get('/category?includeHidden=true', adminConfig()),
      api.get('/auth/admin/users', adminConfig()),
      api.get('/order', adminConfig()),
      api.get('/inventory/receipts', adminConfig()),
      api.get('/inventory/stock', adminConfig()),
      api.get('/inventory/reports/movement', adminConfig()),
      api.get(`/inventory/low-stock?threshold=${lowStockThreshold}`, adminConfig()),
    ]);
    setAdminProducts(productResult.status === 'fulfilled' ? (productResult.value.data || []).map(enrichProduct) : products);
    setCategories(categoryResult.status === 'fulfilled' ? categoryResult.value.data || [] : []);
    setUsers(userResult.status === 'fulfilled' ? userResult.value.data || [] : []);
    setOrders(orderResult.status === 'fulfilled' ? orderResult.value.data || [] : []);
    setReceipts(receiptResult.status === 'fulfilled' ? receiptResult.value.data || [] : []);
    setStock(stockResult.status === 'fulfilled' ? stockResult.value.data || [] : []);
    setMovements(movementResult.status === 'fulfilled' ? movementResult.value.data || [] : []);
    setLowStock(lowStockResult.status === 'fulfilled' ? lowStockResult.value.data || [] : []);
    setLoading(false);
  }, [lowStockThreshold, products]);

  useEffect(() => { loadAdminData(); }, [loadAdminData]);

  useEffect(() => {
    const onHashChange = () => setActiveSection(resolveAdminSection());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const changeAdminSection = (sectionId) => {
    setActiveSection(sectionId);
    window.history.replaceState(null, '', `${window.location.pathname}#${sectionId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshCatalog = async () => {
    await loadAdminData();
    await reloadProducts();
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      skuCode: product.skuCode || '',
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || CATEGORY_NAMES[0],
      imageUrl: product.imageUrl || '',
      stockQuantity: product.stockQuantity ?? 0,
      unit: product.unit || 'piece',
      lastImportPrice: product.lastImportPrice || '',
      profitMarginPercent: product.profitMarginPercent ?? 25,
      status: product.status || 'VISIBLE',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      skuCode: form.skuCode || makeSku(form.name),
      stockQuantity: Number(form.stockQuantity || 0),
      lastImportPrice: Number(form.lastImportPrice || 0),
      profitMarginPercent: Number(form.profitMarginPercent || 0),
      ...(form.price !== '' ? { price: Number(form.price || 0) } : {}),
    };
    try {
      if (editingId) await api.put(`/product/${editingId}`, payload, adminConfig());
      else await api.post('/product', payload, adminConfig());
      setForm(emptyProduct);
      setEditingId(null);
      await refreshCatalog();
      addToast(editingId ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
    } catch {
      addToast('Không lưu được sản phẩm', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Xóa sản phẩm này? Nếu đã có lịch sử nhập hàng, hệ thống sẽ ẩn sản phẩm khỏi storefront.')) return;
    try {
      await api.delete(`/product/${id}`, adminConfig());
      await refreshCatalog();
      addToast('Đã xử lý xóa sản phẩm');
    } catch {
      addToast('Không xóa được sản phẩm', 'error');
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const payload = { ...categoryForm, displayOrder: Number(categoryForm.displayOrder || 0) };
    try {
      if (editingCategoryId) await api.put(`/category/${editingCategoryId}`, payload, adminConfig());
      else await api.post('/category', payload, adminConfig());
      setCategoryForm(emptyCategory);
      setEditingCategoryId(null);
      await loadAdminData();
      addToast(editingCategoryId ? 'Đã cập nhật danh mục' : 'Đã thêm danh mục');
    } catch {
      addToast('Không lưu được danh mục', 'error');
    }
  };

  const editCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      code: category.code || '',
      name: category.name || '',
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      status: category.status || 'VISIBLE',
      displayOrder: category.displayOrder ?? 0,
    });
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      await api.delete(`/category/${id}`, adminConfig());
      await loadAdminData();
      addToast('Đã xóa danh mục');
    } catch {
      addToast('Không xóa được danh mục', 'error');
    }
  };

  const saveUser = async (event) => {
    event.preventDefault();
    try {
      await api.post('/auth/admin/users', userForm, adminConfig());
      setUserForm(emptyUserForm);
      await loadAdminData();
      addToast('Đã tạo tài khoản');
    } catch (error) {
      addToast(error.response?.data?.message || error.response?.data || 'Không tạo được tài khoản', 'error');
    }
  };

  const setUserLocked = async (user, locked) => {
    try {
      await api.put(`/auth/admin/users/${user.id}/${locked ? 'lock' : 'unlock'}`, null, adminConfig());
      await loadAdminData();
      addToast(locked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
    } catch {
      addToast('Không cập nhật được trạng thái tài khoản', 'error');
    }
  };

  const updateReceiptLine = (index, patch) => {
    setReceiptForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
    }));
  };

  const selectReceiptProduct = (index, skuCode) => {
    const product = productBySku[skuCode];
    updateReceiptLine(index, {
      skuCode,
      productName: product?.name || '',
      importPrice: product?.lastImportPrice || Math.round(Number(product?.price || 0) * 0.8),
    });
  };

  const removeReceiptLine = (index) => {
    setReceiptForm((current) => {
      const nextItems = current.items.filter((_, itemIndex) => itemIndex !== index);
      return { ...current, items: nextItems.length ? nextItems : [createReceiptLine()] };
    });
  };

  const saveReceipt = async (event) => {
    event.preventDefault();
    const payload = {
      importDate: receiptForm.importDate || null,
      note: receiptForm.note,
      items: receiptForm.items.map((item) => ({
        skuCode: item.skuCode,
        productName: item.productName || productBySku[item.skuCode]?.name || item.skuCode,
        importPrice: Number(item.importPrice || 0),
        quantity: Number(item.quantity || 0),
      })),
    };
    try {
      if (editingReceiptId) await api.put(`/inventory/receipts/${editingReceiptId}`, payload, adminConfig());
      else await api.post('/inventory/receipts', payload, adminConfig());
      setReceiptForm(emptyReceiptForm());
      setEditingReceiptId(null);
      await loadAdminData();
      addToast(editingReceiptId ? 'Đã sửa phiếu nhập' : 'Đã tạo phiếu nhập nháp');
    } catch (error) {
      addToast(error.response?.data?.message || 'Không lưu được phiếu nhập', 'error');
    }
  };

  const editReceipt = (receipt) => {
    setEditingReceiptId(receipt.id);
    setReceiptForm({
      importDate: receipt.importDate ? receipt.importDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
      note: receipt.note || '',
      items: receipt.items?.length ? receipt.items.map((item) => ({
        skuCode: item.skuCode,
        productName: item.productName,
        importPrice: item.importPrice || '',
        quantity: item.quantity || 1,
      })) : [createReceiptLine()],
    });
  };

  const completeReceipt = async (receiptId) => {
    try {
      await api.put(`/inventory/receipts/${receiptId}/complete`, null, adminConfig());
      await refreshCatalog();
      addToast('Đã hoàn thành phiếu nhập và cập nhật tồn kho');
    } catch {
      addToast('Không hoàn thành được phiếu nhập', 'error');
    }
  };

  const updateMargin = async (product) => {
    const margin = Number(priceMargins[product.id] ?? product.profitMarginPercent ?? 0);
    const payload = {
      skuCode: product.skuCode,
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      unit: product.unit,
      lastImportPrice: product.lastImportPrice,
      profitMarginPercent: margin,
      status: product.status,
    };
    try {
      await api.put(`/product/${product.id}`, payload, adminConfig());
      await refreshCatalog();
      addToast('Đã cập nhật tỉ lệ lợi nhuận');
    } catch {
      addToast('Không cập nhật được giá bán', 'error');
    }
  };

  const fetchFilteredOrders = async (event) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (orderFilters.from) params.set('from', dayStart(orderFilters.from));
    if (orderFilters.to) params.set('to', dayEnd(orderFilters.to));
    if (orderFilters.status) params.set('status', orderFilters.status);
    if (orderFilters.ward) params.set('ward', orderFilters.ward);
    params.set('sort', orderFilters.sort);
    try {
      const response = await api.get(`/order?${params.toString()}`, adminConfig());
      setOrders(response.data || []);
    } catch {
      addToast('Không tải được đơn hàng', 'error');
    }
  };

  const updateOrderStatus = async (orderNumber, status) => {
    try {
      const response = await api.put(`/order/${orderNumber}/status?status=${status}`, null, adminConfig());
      setOrders((items) => items.map((item) => item.orderNumber === orderNumber ? response.data : item));
      await loadAdminData();
      addToast('Đã cập nhật trạng thái đơn hàng');
    } catch {
      addToast('Không cập nhật được đơn hàng', 'error');
    }
  };

  const fetchStockAt = async () => {
    const query = stockAt ? `?at=${stockAt}` : '';
    try {
      const response = await api.get(`/inventory/stock${query}`, adminConfig());
      setStock(response.data || []);
    } catch {
      addToast('Không tải được tồn kho', 'error');
    }
  };

  const fetchMovements = async (event) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (movementFilters.from) params.set('from', dayStart(movementFilters.from));
    if (movementFilters.to) params.set('to', dayEnd(movementFilters.to));
    try {
      const response = await api.get(`/inventory/reports/movement?${params.toString()}`, adminConfig());
      setMovements(response.data || []);
    } catch {
      addToast('Không tải được báo cáo nhập xuất', 'error');
    }
  };

  const fetchLowStock = async () => {
    try {
      const response = await api.get(`/inventory/low-stock?threshold=${lowStockThreshold}`, adminConfig());
      setLowStock(response.data || []);
    } catch {
      addToast('Không tải được cảnh báo tồn kho', 'error');
    }
  };

  return (
    <AdminShell activeSection={activeSection} onSectionChange={changeAdminSection}>
      {activeSection === 'admin-overview' && (
      <section id="admin-overview" className="admin-section">
        <div className="admin-hero">
          <div>
            <span className="eyebrow">Tổng quan</span>
            <h1>Quản trị vận hành KDKTech</h1>
            <p>Quản lý tài khoản, danh mục, sản phẩm, nhập hàng, giá bán, đơn hàng và báo cáo tồn kho.</p>
          </div>
          {loading ? <span className="loading-line"><RefreshCw size={18} />Đang tải dữ liệu...</span> : null}
        </div>
        <div className="admin-kpi-grid">
          <div><span>Sản phẩm</span><b>{adminProducts.length}</b></div>
          <div><span>Đơn hàng</span><b>{orders.length}</b></div>
          <div><span>Tồn kho hiện tại</span><b>{stock.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</b></div>
          <div><span>Doanh thu đơn</span><b>{money(revenue)}</b></div>
        </div>
      </section>
      )}

      {activeSection === 'admin-users' && (
      <section id="admin-users" className="panel admin-section">
        <div className="admin-section-head">
          <div>
            <span className="eyebrow">Người dùng</span>
            <h2>Quản lý tài khoản</h2>
          </div>
        </div>
        <form className="form-grid compact-form" onSubmit={saveUser}>
          <input placeholder="Tên đăng nhập" value={userForm.username} onChange={(event) => setUserForm({ ...userForm, username: event.target.value })} required />
          <input placeholder="Email" type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required />
          <input placeholder="Mật khẩu khởi tạo" type="password" value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} required />
          <select value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
            <option>USER</option>
            <option>ADMIN</option>
          </select>
          <button className="primary" type="submit"><UserPlus size={17} />Tạo tài khoản</button>
        </form>
        <div className="admin-table">
          {users.map((user) => (
            <div className="admin-table-row user-row" key={user.id}>
              <span><b>{user.username}</b><small>{user.email}</small></span>
              <span>{user.role}</span>
              <span className={statusClass(user.locked ? 'locked' : 'active')}>{user.locked ? 'Đã khóa' : 'Hoạt động'}</span>
              <span>{formatDateTime(user.createdAt)}</span>
              <button className={user.locked ? 'ghost-btn' : 'danger-btn'} type="button" onClick={() => setUserLocked(user, !user.locked)}>
                {user.locked ? 'Mở khóa' : 'Khóa'}
              </button>
            </div>
          ))}
        </div>
      </section>
      )}

      {activeSection === 'admin-categories' && (
      <section id="admin-categories" className="admin-grid admin-section">
        <form className="panel admin-form-panel" onSubmit={saveCategory}>
          <h2>{editingCategoryId ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
          <div className="form-grid">
            <input placeholder="Mã loại" value={categoryForm.code} onChange={(event) => setCategoryForm({ ...categoryForm, code: event.target.value })} required />
            <input placeholder="Tên loại" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} required />
            <input placeholder="Ảnh/Icon URL" value={categoryForm.imageUrl} onChange={(event) => setCategoryForm({ ...categoryForm, imageUrl: event.target.value })} />
            <input placeholder="Thứ tự sắp xếp" type="number" value={categoryForm.displayOrder} onChange={(event) => setCategoryForm({ ...categoryForm, displayOrder: event.target.value })} />
            <select value={categoryForm.status} onChange={(event) => setCategoryForm({ ...categoryForm, status: event.target.value })}>
              {VISIBILITY_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
            <textarea className="span-2" placeholder="Mô tả danh mục" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
          </div>
          <div className="row">
            <button className="primary" type="submit">{editingCategoryId ? <Pencil size={17} /> : <Plus size={17} />}{editingCategoryId ? 'Lưu danh mục' : 'Thêm danh mục'}</button>
            {editingCategoryId && <button className="ghost-btn" type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm(emptyCategory); }}>Hủy</button>}
          </div>
        </form>
        <div className="panel">
          <h2>Danh sách danh mục</h2>
          <div className="admin-table">
            {categories.map((category) => (
              <div className="admin-table-row category-row" key={category.id}>
                <span><b>{category.name}</b><small>{category.code}</small></span>
                <span className={statusClass(category.status)}>{category.status}</span>
                <span>Thứ tự {category.displayOrder ?? 0}</span>
                <button className="ghost-btn" type="button" onClick={() => editCategory(category)}><Pencil size={16} />Sửa</button>
                <button className="danger-btn" type="button" onClick={() => deleteCategory(category.id)}><Trash2 size={16} />Xóa</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeSection === 'admin-products' && (
      <section id="admin-products" className="admin-section">
        <div className="admin-grid">
          <form className="panel admin-form-panel" onSubmit={saveProduct}>
            <h2>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
            <div className="form-grid">
              <input placeholder="Mã sản phẩm" value={form.skuCode} onChange={(event) => setForm({ ...form, skuCode: event.target.value })} />
              <input placeholder="Tên sản phẩm" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categoryOptions.map((item) => <option key={item}>{item}</option>)}</select>
              <input placeholder="Đơn vị tính" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} />
              <input placeholder="Số lượng ban đầu" type="number" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} />
              <input placeholder="Giá nhập mới nhất" type="number" value={form.lastImportPrice} onChange={(event) => setForm({ ...form, lastImportPrice: event.target.value })} />
              <input placeholder="% lợi nhuận" type="number" value={form.profitMarginPercent} onChange={(event) => setForm({ ...form, profitMarginPercent: event.target.value })} />
              <input placeholder="Giá bán" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                {VISIBILITY_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
              <input className="span-2" placeholder="Hình ảnh URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
              <textarea className="span-2" placeholder="Mô tả sản phẩm" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className="row">
              <button className="primary" type="submit">{editingId ? <Pencil size={17} /> : <Plus size={17} />}{editingId ? 'Lưu sản phẩm' : 'Thêm sản phẩm'}</button>
              {editingId && <button className="ghost-btn" type="button" onClick={() => setForm({ ...form, imageUrl: '' })}>Bỏ hình</button>}
              {editingId && <button className="ghost-btn" type="button" onClick={() => { setEditingId(null); setForm(emptyProduct); }}>Hủy</button>}
            </div>
          </form>
          <div className="panel admin-help">
            <h2>Quy tắc sản phẩm</h2>
            <p>Trạng thái VISIBLE sẽ hiển thị trên trang khách, HIDDEN sẽ ẩn khỏi storefront.</p>
            <p>Nếu sản phẩm đã có lịch sử nhập hàng, thao tác xóa sẽ chuyển sang ẩn thay vì xóa khỏi CSDL.</p>
            <p>Giá bán có thể nhập trực tiếp hoặc tính từ giá nhập mới nhất và % lợi nhuận.</p>
          </div>
        </div>
        <div className="panel">
          <h2>Danh sách sản phẩm</h2>
          <div className="admin-table">
            {adminProducts.map((product) => (
              <div className="admin-table-row product-admin-row" key={product.id}>
                <img src={product.imageUrl || FALLBACK_IMAGES[0]} alt={product.name} />
                <span><b>{product.name}</b><small>{product.skuCode}</small></span>
                <span>{product.category}</span>
                <span>{money(product.price)}</span>
                <span>Tồn {product.stockQuantity}</span>
                <span className={statusClass(product.status)}>{product.status}</span>
                <button className="ghost-btn" type="button" onClick={() => startEdit(product)}><Pencil size={16} />Sửa</button>
                <button className="danger-btn" type="button" onClick={() => deleteProduct(product.id)}><Trash2 size={16} />Xóa/Ẩn</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeSection === 'admin-receipts' && (
      <section id="admin-receipts" className="admin-grid admin-section">
        <form className="panel admin-form-panel" onSubmit={saveReceipt}>
          <h2>{editingReceiptId ? 'Sửa phiếu nhập nháp' : 'Tạo phiếu nhập hàng'}</h2>
          <div className="form-grid">
            <input type="datetime-local" value={receiptForm.importDate} onChange={(event) => setReceiptForm({ ...receiptForm, importDate: event.target.value })} />
            <input placeholder="Ghi chú" value={receiptForm.note} onChange={(event) => setReceiptForm({ ...receiptForm, note: event.target.value })} />
          </div>
          <div className="receipt-lines">
            {receiptForm.items.map((item, index) => (
              <div className="receipt-line" key={index}>
                <select value={item.skuCode} onChange={(event) => selectReceiptProduct(index, event.target.value)} required>
                  <option value="">Chọn sản phẩm</option>
                  {adminProducts.map((product) => <option key={product.skuCode} value={product.skuCode}>{product.name}</option>)}
                </select>
                <input placeholder="Giá nhập" type="number" value={item.importPrice} onChange={(event) => updateReceiptLine(index, { importPrice: event.target.value })} required />
                <input placeholder="Số lượng" type="number" value={item.quantity} onChange={(event) => updateReceiptLine(index, { quantity: event.target.value })} required />
                <button className="icon-btn" type="button" onClick={() => removeReceiptLine(index)}><X size={16} /></button>
              </div>
            ))}
          </div>
          <div className="row">
            <button className="ghost-btn" type="button" onClick={() => setReceiptForm((current) => ({ ...current, items: [...current.items, createReceiptLine()] }))}><Plus size={17} />Thêm dòng</button>
            <button className="primary" type="submit">{editingReceiptId ? 'Lưu phiếu nhập' : 'Tạo phiếu nháp'}</button>
            {editingReceiptId && <button className="ghost-btn" type="button" onClick={() => { setEditingReceiptId(null); setReceiptForm(emptyReceiptForm()); }}>Hủy</button>}
          </div>
        </form>
        <div className="panel">
          <h2>Phiếu nhập kho</h2>
          <div className="admin-table">
            {receipts.map((receipt) => (
              <div className="admin-table-row receipt-row" key={receipt.id}>
                <span><b>{receipt.receiptNumber}</b><small>{formatDateTime(receipt.importDate)}</small></span>
                <span>{receipt.items?.length || 0} dòng</span>
                <span className={statusClass(receipt.status)}>{receipt.status}</span>
                <button className="ghost-btn" type="button" disabled={receipt.status === 'COMPLETED'} onClick={() => editReceipt(receipt)}><Pencil size={16} />Sửa</button>
                <button className="primary compact" type="button" disabled={receipt.status === 'COMPLETED'} onClick={() => completeReceipt(receipt.id)}>Hoàn thành</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeSection === 'admin-pricing' && (
      <section id="admin-pricing" className="panel admin-section">
        <div className="admin-section-head">
          <div>
            <span className="eyebrow">Giá bán</span>
            <h2>Quản lý tỉ lệ lợi nhuận</h2>
          </div>
        </div>
        <div className="admin-table">
          {adminProducts.map((product) => (
            <div className="admin-table-row pricing-row" key={`price-${product.id}`}>
              <span><b>{product.name}</b><small>{product.skuCode}</small></span>
              <span>Giá vốn {money(product.lastImportPrice)}</span>
              <input type="number" value={priceMargins[product.id] ?? product.profitMarginPercent ?? 0} onChange={(event) => setPriceMargins({ ...priceMargins, [product.id]: event.target.value })} />
              <span>{money(product.price)}</span>
              <button className="primary compact" type="button" onClick={() => updateMargin(product)}>Lưu %</button>
            </div>
          ))}
        </div>
      </section>
      )}

      {activeSection === 'admin-orders' && (
      <section id="admin-orders" className="panel admin-section">
        <div className="admin-section-head">
          <div>
            <span className="eyebrow">Đơn hàng</span>
            <h2>Quản lý đơn đặt hàng</h2>
          </div>
        </div>
        <form className="filter-bar" onSubmit={fetchFilteredOrders}>
          <input type="date" value={orderFilters.from} onChange={(event) => setOrderFilters({ ...orderFilters, from: event.target.value })} />
          <input type="date" value={orderFilters.to} onChange={(event) => setOrderFilters({ ...orderFilters, to: event.target.value })} />
          <select value={orderFilters.status} onChange={(event) => setOrderFilters({ ...orderFilters, status: event.target.value })}>
            <option value="">Tất cả trạng thái</option>
            {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
          <input placeholder="Lọc theo phường" value={orderFilters.ward} onChange={(event) => setOrderFilters({ ...orderFilters, ward: event.target.value })} />
          <select value={orderFilters.sort} onChange={(event) => setOrderFilters({ ...orderFilters, sort: event.target.value })}>
            <option value="createdAtDesc">Mới nhất</option>
            <option value="createdAtAsc">Cũ nhất</option>
            <option value="ward">Sắp xếp theo phường</option>
          </select>
          <button className="primary" type="submit"><Search size={17} />Lọc</button>
        </form>
        <div className="admin-table">
          {orders.length === 0 ? <p className="muted">Chưa có đơn hàng phù hợp.</p> : orders.map((order) => (
            <div className="admin-table-row order-admin-row" key={order.orderNumber}>
              <span><b>#{order.orderNumber?.slice(0, 8)}</b><small>{order.customerName}</small></span>
              <span>{order.ward || '-'}</span>
              <span>{money(order.totalAmount)}</span>
              <select value={order.status || 'PENDING'} onChange={(event) => updateOrderStatus(order.orderNumber, event.target.value)}>
                {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
              <button className="ghost-btn" type="button" onClick={() => setSelectedOrder(order)}>Chi tiết</button>
            </div>
          ))}
        </div>
      </section>
      )}

      {activeSection === 'admin-reports' && (
      <section id="admin-reports" className="report-layout admin-section">
        <div className="panel">
          <h2>Tồn kho theo thời điểm</h2>
          <div className="filter-bar slim">
            <input type="datetime-local" value={stockAt} onChange={(event) => setStockAt(event.target.value)} />
            <button className="primary" type="button" onClick={fetchStockAt}>Tra cứu</button>
          </div>
          <div className="admin-table">
            {stockRows.map((item) => (
              <div className="admin-table-row stock-row" key={item.skuCode}>
                <span><b>{item.product?.name || item.skuCode}</b><small>{item.product?.category || 'Không rõ loại'}</small></span>
                <span>{item.skuCode}</span>
                <span>{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Cảnh báo sắp hết hàng</h2>
          <div className="filter-bar slim">
            <input type="number" value={lowStockThreshold} onChange={(event) => setLowStockThreshold(event.target.value)} />
            <button className="primary" type="button" onClick={fetchLowStock}>Cập nhật</button>
          </div>
          <div className="admin-table">
            {lowStock.length === 0 ? <p className="muted">Không có sản phẩm dưới ngưỡng.</p> : lowStock.map((item) => (
              <div className="admin-table-row stock-row" key={`low-${item.skuCode}`}>
                <span><b>{productBySku[item.skuCode]?.name || item.skuCode}</b><small>{item.skuCode}</small></span>
                <span>{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel span-panel">
          <h2>Báo cáo nhập - xuất</h2>
          <form className="filter-bar" onSubmit={fetchMovements}>
            <input type="date" value={movementFilters.from} onChange={(event) => setMovementFilters({ ...movementFilters, from: event.target.value })} />
            <input type="date" value={movementFilters.to} onChange={(event) => setMovementFilters({ ...movementFilters, to: event.target.value })} />
            <button className="primary" type="submit"><Search size={17} />Tra cứu</button>
          </form>
          <div className="admin-table">
            {movements.map((movement) => (
              <div className="admin-table-row movement-row" key={movement.id}>
                <span><b>{movement.productName || movement.skuCode}</b><small>{movement.referenceNumber}</small></span>
                <span className={statusClass(movement.type)}>{movement.type}</span>
                <span>{movement.quantity}</span>
                <span>{money(movement.unitPrice)}</span>
                <span>{formatDateTime(movement.occurredAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {selectedOrder && (
        <>
          <div className="shade show" onClick={() => setSelectedOrder(null)} />
          <div className="admin-modal">
            <div className="drawer-head">
              <div>
                <span className="eyebrow">Chi tiết đơn hàng</span>
                <h2>#{selectedOrder.orderNumber}</h2>
              </div>
              <button className="icon-btn" type="button" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p><b>Khách hàng:</b> {selectedOrder.customerName} - {selectedOrder.phone}</p>
              <p><b>Địa chỉ:</b> {selectedOrder.shippingAddress}, {selectedOrder.ward}</p>
              <p><b>Thời gian:</b> {formatDateTime(selectedOrder.createdAt)}</p>
              <p><b>Trạng thái:</b> {selectedOrder.status}</p>
              <div className="mini-items">
                {(selectedOrder.items || selectedOrder.orderLineItemsDtoList || []).map((item, index) => (
                  <span key={`${item.skuCode}-${index}`}>{item.productName || item.skuCode} x {item.quantity}</span>
                ))}
              </div>
              <div className="total-row"><span>Tổng tiền</span><b>{money(selectedOrder.totalAmount)}</b></div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function AuthPage({ mode, addToast, text }) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { username: form.username, password: form.password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', form.username);
        addToast(text.signedIn);
        navigate('/');
      } else {
        await api.post('/auth/register', form);
        addToast(text.accountCreated);
        navigate('/login');
      }
    } catch (error) {
      addToast(error.response?.data || text.requestFailed, 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">{isLogin ? text.welcomeBack : text.join}</span>
        <h1>{isLogin ? text.signIn : text.createAccount}</h1>
        <p>{isLogin ? text.authLoginText : text.authRegisterText}</p>
        <label>
          {text.username}
          <input placeholder={text.username} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
        </label>
        {!isLogin && (
          <label>
            {text.email}
            <input placeholder={text.email} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
        )}
        <label>
          {text.password}
          <input placeholder={text.password} type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <button className="primary full" disabled={loading}>
          {isLogin ? <Lock size={18} /> : <UserPlus size={18} />}
          {loading ? text.processing : isLogin ? text.signIn : text.createAccount}
        </button>
        <Link to={isLogin ? '/register' : '/login'}>{isLogin ? text.needAccount : text.haveAccount}</Link>
      </form>
    </section>
  );
}

function ChatPage({ addToCart, text }) {
  const promptIdeas = text.promptIdeas;
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: text.aiWelcome,
    recommendations: [],
  }]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setMessages((items) => (
      items.length === 1 && items[0].role === 'bot'
        ? [{ role: 'bot', text: text.aiWelcome, recommendations: [] }]
        : items
    ));
  }, [text.aiWelcome]);
  const send = async (preset) => {
    const message = (preset || inputText).trim();
    if (!message) return;
    setInputText('');
    setMessages((items) => [...items, { role: 'user', text: message }]);
    setLoading(true);
    try {
      const response = await api.post('/chatbot/ask', { message });
      setMessages((items) => [...items, {
        role: 'bot',
        text: response.data?.reply || response.data?.message || 'I received your question.',
        recommendations: response.data?.recommendations || [],
      }]);
    } catch {
      setMessages((items) => [...items, { role: 'bot', text: text.chatbotNotReady }]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="page narrow">
      <PageIntro eyebrow={text.nav[3]} title={text.findRightGadget} text={text.aiFinderText} />
      <div className="panel chat-panel">
        <div className="prompt-chips">
          {promptIdeas.map((idea) => <button key={idea} type="button" onClick={() => send(idea)}>{idea}</button>)}
        </div>
        <div className="chat-log">
          {messages.map((message, index) => (
            <div key={index} className={`message-group ${message.role}`}>
              <div className={`bubble ${message.role}`}>{message.text}</div>
              {message.recommendations?.length > 0 && (
                <div className="chat-recommendations">
                  {message.recommendations.map((product, productIndex) => {
                    const item = enrichProduct(product, productIndex);
                    const copy = text.productCopy?.[item.skuCode] || {};
                    return (
                      <article className="chat-product" key={`${item.skuCode}-${item.id || productIndex}`}>
                        <img src={item.imageUrl} alt={item.name} />
                        <div>
                          <span className="tag">{translateCategory(text, item.category)}</span>
                          <b>{item.name}</b>
                          <p>{product.reason || copy.description || item.description}</p>
                          <div className="row between">
                            <strong>{money(item.price)}</strong>
                            <button className="primary compact" type="button" disabled={item.stockQuantity <= 0} onClick={() => addToCart(item)}>{text.addToCart}</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="bubble bot">{text.replying}</div>}
        </div>
        <div className="chat-input">
          <input value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder={text.askProducts} />
          <button className="primary" type="button" onClick={() => send()}><Send size={18} />{text.send}</button>
        </div>
      </div>
    </section>
  );
}

function AppFrame({ products, reloadProducts, addToast, cart, cartOpen, setCartOpen, addToCart, language, toggleLanguage }) {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');
  const text = CUSTOMER_TEXT[language] || CUSTOMER_TEXT.en;

  if (isAdminArea) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/admin/login" element={<AdminLoginPage addToast={addToast} />} />
        <Route path="/admin/dashboard" element={<AdminGate><AdminPage products={products} reloadProducts={reloadProducts} addToast={addToast} /></AdminGate>} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Shell cartCount={cart.count} openCart={() => setCartOpen(true)} language={language} toggleLanguage={toggleLanguage}>
        <Routes>
          <Route path="/" element={<HomePage products={products} addToCart={addToCart} addToast={addToast} text={text} />} />
          <Route path="/products" element={<ProductsPage products={products} addToCart={addToCart} addToast={addToast} text={text} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart.cart} subtotal={cart.subtotal} updateQty={cart.updateQty} removeItem={cart.removeItem} clearCart={cart.clearCart} addToast={addToast} text={text} />} />
          <Route path="/orders" element={<OrdersPage text={text} />} />
          <Route path="/login" element={<AuthPage mode="login" addToast={addToast} text={text} />} />
          <Route path="/register" element={<AuthPage mode="register" addToast={addToast} text={text} />} />
          <Route path="/chat" element={<ChatPage addToCart={addToCart} text={text} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
      <CartDrawer open={cartOpen} close={() => setCartOpen(false)} cart={cart.cart} updateQty={cart.updateQty} removeItem={cart.removeItem} subtotal={cart.subtotal} text={text} />
    </>
  );
}

export default function ShopApp() {
  const { toasts, addToast } = useToast();
  const cart = useCart();
  const [products, setProducts] = useState(fallbackProducts);
  const [cartOpen, setCartOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('kdkt_language') || 'en');

  const reloadProducts = useCallback(async () => {
    try {
      const response = await api.get('/product');
      const loaded = Array.isArray(response.data) && response.data.length > 0
        ? response.data.map(enrichProduct)
        : fallbackProducts;
      setProducts(loaded);
    } catch {
      setProducts(fallbackProducts);
    }
  }, []);

  useEffect(() => { reloadProducts(); }, [reloadProducts]);

  const addToCart = (product) => {
    const text = CUSTOMER_TEXT[language] || CUSTOMER_TEXT.en;
    cart.addItem(product);
    addToast(`${product.name} ${text.productAdded}`);
  };

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === 'vi' ? 'en' : 'vi';
      localStorage.setItem('kdkt_language', next);
      return next;
    });
  };

  return (
    <BrowserRouter>
      <Toasts toasts={toasts} />
      <AppFrame
        products={products}
        reloadProducts={reloadProducts}
        addToast={addToast}
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        addToCart={addToCart}
        language={language}
        toggleLanguage={toggleLanguage}
      />
    </BrowserRouter>
  );
}
