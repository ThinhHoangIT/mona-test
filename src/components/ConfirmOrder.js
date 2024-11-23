import { Modal } from "antd";

export default function ConfirmOrder({
  isOpen,
  onOkConfirm,
  onCancelConfirm,
  children,
  title,
}) {
  return (
    <>
      <Modal
        title={title}
        open={isOpen}
        onOk={onOkConfirm}
        onCancel={onCancelConfirm}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        {children}
      </Modal>
    </>
  );
}
