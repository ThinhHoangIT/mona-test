export const formatPrice = (price) => {
  return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export const calculateDiscountedPrice = (product) => {
  const { price, discountType, discountValue } = product;
  let discountedPrice = Number(price);

  if (discountType === "percent") {
    discountedPrice = price - price * (discountValue / 100);
  } else if (discountType === "amount") {
    discountedPrice = price - discountValue;
  }

  return discountedPrice;
};

export const calculateTotalPriceBeforeDiscount = (products) => {
  return products.reduce(
    (sum, product) => sum + Number(product.price) * product.quantity,
    0
  );
};

export const calculateTotalDiscount = (products) => {
  return products.reduce(
    (sum, product) =>
      sum +
      (Number(product.price) - calculateDiscountedPrice(product)) *
        product.quantity,
    0
  );
};
