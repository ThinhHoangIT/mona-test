import { useEffect } from "react";
import { Table, InputNumber, Button, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import {
  calculateTotalPriceBeforeDiscount,
  formatPrice,
} from "../utils/helper";
import { promoCodes } from "../utils/mock-data";

const renderSummaryRow = (title, value) => (
  <Table.Summary.Row>
    <Table.Summary.Cell index={0} colSpan={4}>
      <strong>{title}</strong>
    </Table.Summary.Cell>
    <Table.Summary.Cell index={1} colSpan={4}>
      <strong>{formatPrice(value)}</strong>
    </Table.Summary.Cell>
  </Table.Summary.Row>
);

export default function CartTable({
  selectProducts,
  setSelectProducts,
  onTotalPriceChange,
  form,
}) {
  const handleQuantityChange = (value, id) => {
    const updatedProducts = selectProducts.map((product) =>
      product.id === id ? { ...product, quantity: value } : product
    );
    setSelectProducts(updatedProducts);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = selectProducts.filter(
      (product) => product.id !== id
    );

    setSelectProducts(updatedProducts);

    form.setFieldsValue({
      order: updatedProducts.map((product) => product.id),
    });
  };

  const handlePromoCodeChange = (code, id) => {
    const promo = promoCodes.find((p) => p.code === code);
    const updatedProducts = selectProducts.map((product) =>
      product.id === id
        ? {
            ...product,
            promoCode: code,
            discountType: promo ? promo.type : null,
            discountValue: promo ? promo.value : null,
          }
        : product
    );
    setSelectProducts(updatedProducts);
  };

  const calculateDiscountedPrice = (product) => {
    const promoCode = product.promoCode;
    const promo = promoCodes.find((p) => p.code === promoCode);

    if (!promo) return product.price;

    if (promo.type === "percent") {
      return product.price * (1 - promo.value / 100);
    } else if (promo.type === "amount") {
      return Math.max(0, product.price - promo.value);
    }
    return product.price;
  };

  const calculateTotalPrice = () => {
    return selectProducts.reduce((total, product) => {
      const discountedPrice = calculateDiscountedPrice(product);
      return total + discountedPrice * product.quantity;
    }, 0);
  };

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    onTotalPriceChange(totalPrice);
  }, [selectProducts]);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name) => <p className="capitalize">{name}</p>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity, record) => (
        <InputNumber
          allowClear
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(value, record.id)}
        />
      ),
    },
    {
      title: "Mã khuyến mãi",
      key: "promoCode",
      align: "center",
      render: (_, record) => (
        <Select
          placeholder="Chọn mã khuyến mãi"
          value={record.promoCode || ""}
          onChange={(value) => handlePromoCodeChange(value, record.id)}
          style={{ width: "100%" }}
        >
          {promoCodes.map((promo) => (
            <Select.Option key={promo.code} value={promo.code}>
              {promo.code}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      align: "right",
      render: (_, record) => {
        const discountedPrice = calculateDiscountedPrice(record);
        const total = discountedPrice * record.quantity;
        return <span>{formatPrice(total)}</span>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteProduct(record.id)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={selectProducts}
      pagination={false}
      scroll={{ x: "100%" }}
      style={{ width: "100%" }}
      summary={() => {
        const totalPriceBeforeDiscount =
          calculateTotalPriceBeforeDiscount(selectProducts);
        const totalPriceAfterDiscount = calculateTotalPrice();

        return (
          <>
            {renderSummaryRow(
              "Tổng tiền (chưa giảm)",
              totalPriceBeforeDiscount
            )}
            {renderSummaryRow(
              "Giảm giá",
              totalPriceBeforeDiscount - totalPriceAfterDiscount
            )}
            {renderSummaryRow("Tổng tiền", totalPriceAfterDiscount)}
          </>
        );
      }}
    />
  );
}
