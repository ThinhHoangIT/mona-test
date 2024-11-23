import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, Select } from "antd";

import CartTable from "./CartTable";
import ConfirmOrder from "./ConfirmOrder";
import { calculateDiscountedPrice, formatPrice } from "../utils/helper";
import { productsOption, productList } from "../utils/mock-data";

export default function CreateOrder() {
  const [selectProducts, setSelectProducts] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [customerMoney, setCustomerMoney] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [change, setChange] = useState(null);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setCheckoutProduct({
      customerInfo: {
        name: values.name,
        email: values.email,
        phone: values.phone,
      },
      products: selectProducts,
      paymentMethod: paymentMethod,
      customerMoney: values.customer_money,
      totalPrice: totalPrice,
      back_money: change,
    });
    setOpenConfirm(true);
  };

  const handleReset = () => {
    form.resetFields();
    setSelectProducts(null);
    setCustomerMoney(null);
    setTotalPrice(0);
    setChange(null);
  };

  const handleTotalPriceChange = (newTotalPrice) => {
    setTotalPrice(newTotalPrice);
  };

  const handleChangeSelectProduct = (selectedValues) => {
    if (selectedValues?.length <= 0) {
      setSelectProducts([]);
      return;
    }

    const result = selectedValues.map((value) => {
      return productList.find((item) => value === item.id);
    });
    setSelectProducts(result);
  };

  const handleChangePaymentType = (e) => {
    setPaymentMethod(e.target.value);
  };

  useEffect(() => {
    if (customerMoney !== null && totalPrice !== null) {
      const calculatedChange = +customerMoney - totalPrice;
      setChange(calculatedChange > 0 ? calculatedChange : 0);
    }
  }, [customerMoney, totalPrice]);

  const onOkConfirm = () => {
    handleReset();
    setOpenConfirm(false);
  };

  const onCancelConfirm = () => {
    setOpenConfirm(false);
  };

  console.log(checkoutProduct);

  return (
    <div className="space-y-8 min-h-screen max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-semibold pt-6">Tạo đơn hàng</h1>
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 bg-white rounded-md p-6 flex flex-col gap-y-6">
            <h3 className="text-xl font-medium">Chi tiết giỏ hàng</h3>
            <div className="flex-1">
              {selectProducts ? (
                <CartTable
                  selectProducts={selectProducts}
                  setSelectProducts={setSelectProducts}
                  onTotalPriceChange={handleTotalPriceChange}
                  form={form}
                />
              ) : (
                <div className="text-center italic">Giỏ hàng trống!</div>
              )}
            </div>
            <div>
              <Form.Item name="paymentMethod" label="Phương thức thanh toán:">
                <Radio.Group
                  onChange={handleChangePaymentType}
                  defaultValue={1}
                >
                  <Radio value={1}>Tiền mặt</Radio>
                  <Radio value={2}>Thẻ</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="customer_money"
                label="Tiền khách đưa:"
                rules={[
                  {
                    required: paymentMethod === 1,
                    message: "Hãy nhập số tiền khách đưa!",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "không đúng định dạng là số",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value || parseFloat(value) >= totalPrice) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Số tiền khách đưa phải lớn hơn hoặc bằng tổng tiền!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input
                  disabled={paymentMethod === 2}
                  placeholder="Nhập số tiền khách đưa..."
                  onChange={(e) => setCustomerMoney(e.target.value)}
                />
              </Form.Item>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Tổng tiền thanh toán:</strong> {formatPrice(totalPrice)}
              </p>
              <p>
                <strong>Tiền thừa trả khách:</strong>{" "}
                {paymentMethod === 1 ? formatPrice(change) : formatPrice(0)}
              </p>
            </div>
            <div className="w-full flex items-center">
              <Form.Item className="w-full flex items-center justify-end">
                <Button
                  type="default"
                  className=" h-12 font-semibold"
                  onClick={handleReset}
                >
                  Xóa giỏ hàng
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="ml-4 h-12 font-semibold"
                >
                  Thanh toán
                </Button>
              </Form.Item>
            </div>
          </div>
          <div className="col-span-4">
            <div className="sticky top-12 space-y-8">
              <div className="bg-white p-6 rounded-md">
                <Form.Item
                  label="Tên khách hàng"
                  name="name"
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên khách hàng!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên khách hàng..." />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      type: "email",
                      message: "Email không đúng định dạng!",
                    },
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email..." />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không đúng định dạng!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại..." />
                </Form.Item>
                <div className="bg-white rounded-md">
                  <Form.Item
                    name="order"
                    label="Sản phẩm"
                    labelCol={{ span: 24 }}
                    rules={[
                      { required: true, message: "Vui lòng chọn sản phẩm!" },
                    ]}
                  >
                    <Select
                      placeholder="Vui lòng chọn sản phẩm"
                      mode="multiple"
                      allowClear
                      onChange={handleChangeSelectProduct}
                      style={{ width: "100%" }}
                      options={productsOption}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
      {openConfirm && (
        <ConfirmOrder
          title="Xác nhận đơn hàng"
          onOkConfirm={onOkConfirm}
          onCancelConfirm={onCancelConfirm}
          isOpen={openConfirm}
        >
          <div className="space-y-4">
            <div>
              <div className="text-xs">
                <p>
                  Họ và tên KH:
                  <span className="capitalize ml-1">
                    {checkoutProduct.customerInfo.name}
                  </span>
                </p>
                <p>Sdt: {checkoutProduct.customerInfo.phone}</p>
                <p>Email: {checkoutProduct.customerInfo.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              {checkoutProduct?.products.map((item) => (
                <div
                  className="capitalize grid grid-cols-4 gap-2"
                  key={item.id}
                >
                  <div className="col-span-1">
                    <p>{item.name}</p>
                  </div>
                  <div className="col-span-1">
                    <p>{item.quantity}</p>
                  </div>
                  <div className="col-span-1">
                    <p>
                      {item.promoCode && (
                        <span className="text-blue-500 text-xs">
                          Mã : {item.promoCode}
                        </span>
                      )}
                    </p>
                    <p>
                      {item.discountType === "percent" && (
                        <span className="text-red-500 text-xs">
                          - {item.discountValue}%
                        </span>
                      )}
                      {item.discountType === "amount" && (
                        <span className="text-red-500 text-xs">
                          - {formatPrice(item.discountValue)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p>{formatPrice(item.price * item.quantity)}</p>
                    {formatPrice(
                      calculateDiscountedPrice(item) * item.quantity
                    )}
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">Tổng tiền</div>
              <div className="col-span-1">
                {formatPrice(checkoutProduct.totalPrice)}
              </div>
              {paymentMethod === 1 ? (
                <>
                  <div className="col-span-3">Tiền khách trả:</div>
                  <div className="col-span-1">
                    {formatPrice(+checkoutProduct.customerMoney)}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-3">Thanh toán bằng thẻ:</div>
                  <div className="col-span-1">
                    {formatPrice(checkoutProduct.totalPrice)}
                  </div>
                </>
              )}
              <div className="col-span-3">Tiền thừa:</div>
              <div className="col-span-1">
                {paymentMethod === 1
                  ? formatPrice(checkoutProduct.back_money)
                  : formatPrice(0)}
              </div>
            </div>
          </div>
        </ConfirmOrder>
      )}
    </div>
  );
}
