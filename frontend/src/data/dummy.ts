import type {
  IUnit,
  ICategory,
  IGstRate,
  IProduct,
  IUser,
  IReview,
  IOrder,
  ICoupon,
} from "@/types";

// ─── Units ────────────────────────────────────────────────────────────────────
export const units: IUnit[] = [
  { id: 1, name: "Kilogram", symbol: "kg", createdAt: "2024-01-01T00:00:00Z" },
  { id: 2, name: "Gram", symbol: "g", createdAt: "2024-01-01T00:00:00Z" },
  { id: 3, name: "Piece", symbol: "pc", createdAt: "2024-01-01T00:00:00Z" },
  { id: 4, name: "Dozen", symbol: "dz", createdAt: "2024-01-01T00:00:00Z" },
];

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories: ICategory[] = [
  {
    id: 1,
    name: "Tropical",
    description: "Exotic tropical fruits from warm climates",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Citrus",
    description: "Tangy and refreshing citrus fruits",
    image:
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Berries",
    description: "Sweet and nutritious berries",
    image:
      "https://www.drckennedychiro.com/wp-content/uploads/2017/04/Berries-450x300.jpg",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Seasonal",
    description: "Fresh seasonal fruits",
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Exotic",
    description: "Rare and exotic fruits from around the world",
    image:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "Dry Fruits",
    description: "Premium quality dry fruits and nuts",
    image:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// ─── GST Rates ────────────────────────────────────────────────────────────────
export const gstRates: IGstRate[] = [
  { id: 1, name: "GST 0%", percentage: 0, createdAt: "2024-01-01T00:00:00Z" },
  { id: 2, name: "GST 5%", percentage: 5, createdAt: "2024-01-01T00:00:00Z" },
  { id: 3, name: "GST 12%", percentage: 12, createdAt: "2024-01-01T00:00:00Z" },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const users: IUser[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    role: "customer",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "9876543211",
    role: "customer",
    isActive: true,
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "9876543212",
    role: "customer",
    isActive: true,
    createdAt: "2024-03-05T00:00:00Z",
  },
  {
    id: 4,
    name: "Sneha Singh",
    email: "sneha@example.com",
    phone: "9876543213",
    role: "customer",
    isActive: true,
    createdAt: "2024-04-20T00:00:00Z",
  },
  {
    id: 5,
    name: "Vikram Joshi",
    email: "vikram@example.com",
    phone: "9876543214",
    role: "customer",
    isActive: true,
    createdAt: "2024-05-12T00:00:00Z",
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews: IReview[] = [
  {
    id: 1,
    rating: 5,
    comment: "Extremely fresh and sweet! Loved it.",
    createdAt: "2024-06-01T00:00:00Z",
    userId: 1,
    user: users[0],
    productId: 1,
  },
  {
    id: 2,
    rating: 4,
    comment: "Good quality, delivered on time.",
    createdAt: "2024-06-05T00:00:00Z",
    userId: 2,
    user: users[1],
    productId: 1,
  },
  {
    id: 3,
    rating: 5,
    comment: "Best mangoes I have ever had!",
    createdAt: "2024-06-10T00:00:00Z",
    userId: 3,
    user: users[2],
    productId: 1,
  },
  {
    id: 4,
    rating: 4,
    comment: "Fresh and juicy. Will order again.",
    createdAt: "2024-06-12T00:00:00Z",
    userId: 4,
    user: users[3],
    productId: 2,
  },
  {
    id: 5,
    rating: 3,
    comment: "Average quality. Expected better.",
    createdAt: "2024-06-15T00:00:00Z",
    userId: 5,
    user: users[4],
    productId: 2,
  },
  {
    id: 6,
    rating: 5,
    comment: "Super fresh bananas, great for daily use!",
    createdAt: "2024-07-01T00:00:00Z",
    userId: 1,
    user: users[0],
    productId: 3,
  },
  {
    id: 7,
    rating: 4,
    comment: "Nice quality at a fair price.",
    createdAt: "2024-07-05T00:00:00Z",
    userId: 2,
    user: users[1],
    productId: 4,
  },
  {
    id: 8,
    rating: 5,
    comment: "Perfectly ripe strawberries!",
    createdAt: "2024-07-10T00:00:00Z",
    userId: 3,
    user: users[2],
    productId: 5,
  },
  {
    id: 9,
    rating: 4,
    comment: "Good packaging, fruit was fresh.",
    createdAt: "2024-07-15T00:00:00Z",
    userId: 4,
    user: users[3],
    productId: 6,
  },
  {
    id: 10,
    rating: 5,
    comment: "Excellent taste! Highly recommended.",
    createdAt: "2024-07-20T00:00:00Z",
    userId: 5,
    user: users[4],
    productId: 7,
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const products: IProduct[] = [
  {
    id: 1,
    name: "Alphonso Mango",
    description:
      "Premium Alphonso mangoes from Ratnagiri. Known for their rich, creamy texture and exceptional sweetness. The king of mangoes, perfect for eating fresh or making desserts.",
    price: 450,
    mrp: 550,
    stock: 100,
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    categoryId: 1,
    category: categories[0],
    unitId: 1,
    unit: units[0],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: reviews.filter((r) => r.productId === 1),
    avgRating: 4.7,
    totalReviews: 3,
  },
  {
    id: 2,
    name: "Watermelon",
    description:
      "Large, juicy watermelons freshly sourced from farms. Sweet, refreshing and perfect for summer. High water content keeps you hydrated during hot days.",
    price: 35,
    mrp: 45,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=500&q=80",
    status: "active",
    createdAt: "2024-01-02T00:00:00Z",
    categoryId: 4,
    category: categories[3],
    unitId: 1,
    unit: units[0],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: reviews.filter((r) => r.productId === 2),
    avgRating: 3.5,
    totalReviews: 2,
  },
  {
    id: 3,
    name: "Robusta Banana",
    description:
      "Fresh and ripe Robusta bananas, rich in potassium and natural energy. Perfect for breakfast, smoothies, or a quick snack anytime. Sourced directly from South Indian farms.",
    price: 60,
    mrp: 80,
    stock: 200,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80",
    status: "active",
    createdAt: "2024-01-03T00:00:00Z",
    categoryId: 1,
    category: categories[0],
    unitId: 4,
    unit: units[3],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: reviews.filter((r) => r.productId === 3),
    avgRating: 5,
    totalReviews: 1,
  },
  {
    id: 4,
    name: "Kinnow Orange",
    description:
      "Juicy and sweet Kinnow oranges from Punjab. Packed with Vitamin C and antioxidants. Thin skin with lots of pulp, ideal for juicing or eating fresh.",
    price: 80,
    mrp: 100,
    stock: 150,
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80",
    status: "active",
    createdAt: "2024-01-04T00:00:00Z",
    categoryId: 2,
    category: categories[1],
    unitId: 1,
    unit: units[0],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: reviews.filter((r) => r.productId === 4),
    avgRating: 4,
    totalReviews: 1,
  },
  {
    id: 5,
    name: "Fresh Strawberries",
    description:
      "Bright red, farm-fresh strawberries bursting with natural sweetness. Rich in antioxidants and Vitamin C. Perfect for desserts, jams, or eating fresh.",
    price: 120,
    mrp: 150,
    stock: 80,
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80",
    status: "active",
    createdAt: "2024-01-05T00:00:00Z",
    categoryId: 3,
    category: categories[2],
    unitId: 2,
    unit: units[1],
    gstRateId: 2,
    gstRate: gstRates[1],
    reviews: reviews.filter((r) => r.productId === 5),
    avgRating: 5,
    totalReviews: 1,
  },
  {
    id: 6,
    name: "Green Grapes",
    description:
      "Seedless green grapes, crisp and refreshing. Grown in Nashik vineyards using sustainable farming. Excellent source of natural sugars and vitamins.",
    price: 90,
    mrp: 120,
    stock: 120,
    image:
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80",
    status: "active",
    createdAt: "2024-01-06T00:00:00Z",
    categoryId: 4,
    category: categories[3],
    unitId: 1,
    unit: units[0],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: reviews.filter((r) => r.productId === 6),
    avgRating: 4,
    totalReviews: 1,
  },
  {
    id: 7,
    name: "Dragon Fruit",
    description:
      "Vibrant pink dragon fruit with white flesh. Rich in fiber, antioxidants, and essential vitamins. A superfood that is as delicious as it is nutritious.",
    price: 250,
    mrp: 320,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1527325678964-54921661f888?w=500&q=80",
    status: "active",
    createdAt: "2024-01-07T00:00:00Z",
    categoryId: 5,
    category: categories[4],
    unitId: 3,
    unit: units[2],
    gstRateId: 2,
    gstRate: gstRates[1],
    reviews: reviews.filter((r) => r.productId === 7),
    avgRating: 5,
    totalReviews: 1,
  },
  {
    id: 8,
    name: "Pomegranate",
    description:
      "Juicy, ruby-red pomegranate seeds packed with antioxidants. Known for their heart-healthy properties and vibrant sweet-tart flavor. Perfect for juices and salads.",
    price: 160,
    mrp: 200,
    stock: 90,
    image:
      "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=500&q=80",
    status: "active",
    createdAt: "2024-01-08T00:00:00Z",
    categoryId: 4,
    category: categories[3],
    unitId: 3,
    unit: units[2],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: [],
    avgRating: 4.5,
    totalReviews: 0,
  },
  {
    id: 9,
    name: "Kiwi",
    description:
      "Fresh New Zealand kiwis with bright green flesh. High in Vitamin C, K, and dietary fiber. Sweet yet tangy flavor that elevates any fruit salad or smoothie.",
    price: 200,
    mrp: 250,
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1618897996318-5a901fa696ca?w=500&q=80",
    status: "active",
    createdAt: "2024-01-09T00:00:00Z",
    categoryId: 5,
    category: categories[4],
    unitId: 3,
    unit: units[2],
    gstRateId: 2,
    gstRate: gstRates[1],
    reviews: [],
    avgRating: 4.3,
    totalReviews: 0,
  },
  {
    id: 10,
    name: "Sweet Lime (Mosambi)",
    description:
      "Fresh and sweet mosambi, a staple of Indian households. Mild and refreshing citrus flavor. Perfect for juicing and boosting your daily Vitamin C intake.",
    price: 60,
    mrp: 80,
    stock: 180,
    image:
      "https://images.unsplash.com/photo-1590502593747-42a996133562?w=500&q=80",
    status: "active",
    createdAt: "2024-01-10T00:00:00Z",
    categoryId: 2,
    category: categories[1],
    unitId: 1,
    unit: units[0],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: [],
    avgRating: 4.2,
    totalReviews: 0,
  },
  {
    id: 11,
    name: "Papaya",
    description:
      "Ripe and golden papaya, rich in papain enzyme which aids digestion. Natural source of Vitamins A, C, and folate. Sweet flavor with a buttery texture.",
    price: 45,
    mrp: 60,
    stock: 100,
    image:
      "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500&q=80",
    status: "active",
    createdAt: "2024-01-11T00:00:00Z",
    categoryId: 1,
    category: categories[0],
    unitId: 3,
    unit: units[2],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: [],
    avgRating: 4.0,
    totalReviews: 0,
  },
  {
    id: 12,
    name: "Pineapple",
    description:
      "Tropical pineapple with intense sweet-sour flavor. Rich in bromelain, manganese, and Vitamin C. Excellent for digestion and immunity. Great fresh or in smoothies.",
    price: 80,
    mrp: 100,
    stock: 70,
    image:
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&q=80",
    status: "active",
    createdAt: "2024-01-12T00:00:00Z",
    categoryId: 1,
    category: categories[0],
    unitId: 3,
    unit: units[2],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: [],
    avgRating: 4.4,
    totalReviews: 0,
  },
  {
    id: 13,
    name: "Blueberries",
    description:
      "Premium fresh blueberries, one of the most nutrient-dense superfoods. Rich in antioxidants, Vitamin K, and fiber. Perfect for smoothies, baking, or snacking.",
    price: 280,
    mrp: 350,
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&q=80",
    status: "active",
    createdAt: "2024-01-13T00:00:00Z",
    categoryId: 3,
    category: categories[2],
    unitId: 2,
    unit: units[1],
    gstRateId: 2,
    gstRate: gstRates[1],
    reviews: [],
    avgRating: 4.8,
    totalReviews: 0,
  },
  {
    id: 14,
    name: "Black Grapes",
    description:
      "Sweet and juicy black grapes loaded with resveratrol and antioxidants. Known to support heart health and brain function. Seedless variety for easy snacking.",
    price: 100,
    mrp: 130,
    stock: 110,
    image:
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500&q=80",
    status: "active",
    createdAt: "2024-01-14T00:00:00Z",
    categoryId: 4,
    category: categories[3],
    unitId: 1,
    unit: units[0],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: [],
    avgRating: 4.1,
    totalReviews: 0,
  },
  {
    id: 15,
    name: "Cashew (Kaju)",
    description:
      "Premium quality whole cashews, creamy and buttery in taste. Rich in healthy fats, protein, and minerals. Perfect for snacking, cooking, or desserts.",
    price: 750,
    mrp: 900,
    stock: 50,
    image: "https://m.media-amazon.com/images/I/619KyzbJqjL._SX679_.jpg",
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
    categoryId: 6,
    category: categories[5],
    unitId: 1,
    unit: units[0],
    gstRateId: 3,
    gstRate: gstRates[2],
    reviews: [],
    avgRating: 4.9,
    totalReviews: 0,
  },
  {
    id: 16,
    name: "Guava",
    description:
      "Fresh green guavas with pink flesh. One of the richest sources of Vitamin C among all fruits. Sweet and slightly tart, perfect for eating fresh with a pinch of salt.",
    price: 50,
    mrp: 70,
    stock: 150,
    image:
      "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=500&q=80",
    status: "active",
    createdAt: "2024-01-16T00:00:00Z",
    categoryId: 4,
    category: categories[3],
    unitId: 1,
    unit: units[0],
    gstRateId: 1,
    gstRate: gstRates[0],
    reviews: [],
    avgRating: 4.3,
    totalReviews: 0,
  },
];

// ─── Coupons ──────────────────────────────────────────────────────────────────
export const coupons: ICoupon[] = [
  {
    id: 1,
    code: "FRESH10",
    discountPercent: 10,
    expiryDate: "2025-12-31T00:00:00Z",
    status: "active",
  },
  {
    id: 2,
    code: "FRUIT20",
    discountPercent: 20,
    expiryDate: "2025-06-30T00:00:00Z",
    status: "active",
  },
  {
    id: 3,
    code: "WELCOME15",
    discountPercent: 15,
    expiryDate: "2025-12-31T00:00:00Z",
    status: "active",
  },
  {
    id: 4,
    code: "SAVE5",
    discountPercent: 5,
    expiryDate: "2024-12-31T00:00:00Z",
    status: "inactive",
  },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders: IOrder[] = [
  {
    id: 1,
    totalAmount: 1340,
    status: "delivered",
    paymentMethod: "upi",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    couponCode: "FRESH10",
    createdAt: "2024-05-15T10:30:00Z",
    userId: 1,
    user: users[0],
    orderItems: [
      {
        id: 1,
        quantity: 2,
        price: 450,
        orderId: 1,
        productId: 1,
        product: products[0],
        unitId: 1,
        unit: units[0],
      },
      {
        id: 2,
        quantity: 2,
        price: 250,
        orderId: 1,
        productId: 6,
        product: products[6],
        unitId: 1,
        unit: units[0],
      },
    ],
    payments: [
      {
        id: 1,
        transactionId: "TXN123456",
        paymentStatus: "paid",
        paidAt: "2024-05-15T10:35:00Z",
        orderId: 1,
      },
    ],
  },
  {
    id: 2,
    totalAmount: 680,
    status: "shipped",
    paymentMethod: "online",
    address: "456 Linking Road, Mumbai, Maharashtra 400050",
    createdAt: "2024-06-20T14:00:00Z",
    userId: 1,
    user: users[0],
    orderItems: [
      {
        id: 3,
        quantity: 1,
        price: 200,
        orderId: 2,
        productId: 9,
        product: products[8],
        unitId: 3,
        unit: units[2],
      },
      {
        id: 4,
        quantity: 2,
        price: 120,
        orderId: 2,
        productId: 5,
        product: products[4],
        unitId: 2,
        unit: units[1],
      },
    ],
    payments: [
      {
        id: 2,
        transactionId: "TXN789012",
        paymentStatus: "paid",
        paidAt: "2024-06-20T14:05:00Z",
        orderId: 2,
      },
    ],
  },
  {
    id: 3,
    totalAmount: 450,
    status: "confirmed",
    paymentMethod: "cod",
    address: "789 Anna Salai, Chennai, Tamil Nadu 600002",
    createdAt: "2024-07-01T09:00:00Z",
    userId: 1,
    user: users[0],
    orderItems: [
      {
        id: 5,
        quantity: 1,
        price: 450,
        orderId: 3,
        productId: 1,
        product: products[0],
        unitId: 1,
        unit: units[0],
      },
    ],
    payments: [{ id: 3, paymentStatus: "pending", orderId: 3 }],
  },
];

// ─── Featured Products ────────────────────────────────────────────────────────
export const featuredProducts = products.filter((p) =>
  [1, 3, 5, 7, 13, 15].includes(p.id),
);

// ─── Deal Products (highest discount) ────────────────────────────────────────
export const dealProducts = products
  .filter((p) => p.mrp)
  .sort((a, b) => {
    const discA = a.mrp ? ((a.mrp - a.price) / a.mrp) * 100 : 0;
    const discB = b.mrp ? ((b.mrp - b.price) / b.mrp) * 100 : 0;
    return discB - discA;
  })
  .slice(0, 6);

// ─── Helper Functions ─────────────────────────────────────────────────────────
export const getDiscountPercent = (price: number, mrp?: number): number => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

export const validateCoupon = (code: string): ICoupon | null => {
  const coupon = coupons.find(
    (c) => c.code.toLowerCase() === code.toLowerCase(),
  );
  if (!coupon || coupon.status !== "active") return null;
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date())
    return null;
  return coupon;
};
