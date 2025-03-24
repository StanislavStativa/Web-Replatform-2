export type ITypesNotificationMessage = {
  message?: string;
  className?: string;
  onCancel?: () => void;
  isCloseable?: boolean;
};
