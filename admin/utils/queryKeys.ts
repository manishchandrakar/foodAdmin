// src/lib/queryKeys.ts

const queryKeys = {
  users: {
    all: ["users"],                     // All users list
    detail: (id: string) => ["users", id],  // Single user by id
  },

  posts: {
    all: ["posts"],
    detail: (id: string) => ["posts", id],
  },

  roles: {
    all: ["roles"],
    detail: (id: string) => ["roles", id],
  },

  permissions: {
    all: ["permissions"],
    detail: (id: string) => ["permissions", id],
  },

  products: {
    all: ["products"],
    detail: (id: string) => ["products", id],
  },
  carts: {
  all: ["carts"] ,
  detail: (id: string) => ["carts", id] ,
},

  orders: {
    all: ["orders"],
    detail: (id: string) => ["orders", id],
  },
    payments: {   
    all: ["payments"],
    detail: (id: string) => ["payments", id],
  },

  categories: {
    all: ["categories"],
    detail: (id: string) => ["categories", id],
  },

  gstRates: {
    all: ["gstRates"],
    detail: (id: string) => ["gstRates", id],
  },

  customers: {
    all: ["customers"],
    detail: (id: string) => ["customers", id],
  },

  settings: {
    all: ["settings"],
    detail: (id: string) => ["settings", id],
  },

  notifications: {
    all: ["notifications"],
    detail: (id: string) => ["notifications", id],
  },
};

export default queryKeys;