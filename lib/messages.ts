/**
 * Tất cả câu thông báo lỗi / trạng thái dùng trong frontend.
 * Tập trung tại một file để dễ quản lý, đổi ngôn ngữ hoặc thống nhất nội dung.
 */

// ─── API / chung ───
export const msg = {
  // api.ts
  serverUnavailable: "SERVER_UNAVAILABLE",
  unableToConnect: "Unable to connect to the server.",
  sessionExpired: "Session expired.",
  noPermission: "You do not have permission.",
  resourceNotFound: "Resource not found.",
  tooManyAttempts: "Too many attempts. Please try again later.",
  internalServerError: "Internal server error.",
  requestFailed: "Request failed.",
  somethingWentWrong: "Something went wrong.",

  // auth proxy route
  proxyConnectionError: "Proxy Connection Error",

  // ─── Auth (login / register) ───
  enterEmailPassword: "Please enter email/password",
  fillAllFields: "Please fill in all fields",
  passwordMin8: "Password must be at least 8 characters",

  // ─── Product ───
  loadProductsFailed: "Failed to load products. Please try again.",
  productNotFound: "Product not found",

  // ─── Order ───
  loadOrderFailed: "Failed to load order.",
  orderNotFound: "Order not found.",
  noOrders: "No orders found.",

  // ─── Checkout ───
  cartEmpty: "Your cart is empty.",
  selectShippingAddress: "Please select or add a shipping address.",

  // ─── Admin: User ───
  loadRolesFailed: "Failed to load roles",
  fullNameLength: "Full name must be between 2 and 100 characters",
  invalidEmailFormat: "Invalid email format",
  passwordLength: "Password must be between 8 and 100 characters",
  selectRole: "Please select a role",

  // ─── Admin: Product ───
  atLeastOneVariant: "At least one variant is required.",
  saveProductFailed: "Could not save product. Check the fields and try again.",
  failedToUpdateVariant: "Failed to update variant",
  failedToAddVariant: "Failed to add variant",
  uploadImageFailed: "Failed to upload image",
  addImageFailed: "Failed to add image",

  // ─── Admin: Promotion ───
  loadProductsForPromotionFailed: "Failed to load products",
  savePromotionFailed: "Could not save promotion",
};
