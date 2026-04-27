export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export const truncate = (str, n) => (str.length > n ? str.slice(0, n) + "..." : str);

export const getRatingStars = (rating) => "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

export const ROLES = { TRAVELER: "traveler", BUSINESS: "business", ADMIN: "admin", PROVIDER: "provider" };
