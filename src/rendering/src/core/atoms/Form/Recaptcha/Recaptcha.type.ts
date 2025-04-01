export interface RecaptchaProps {
  name: string;
  className?: string;
  errorClassName?: string;
  getValue?: (reCaptcha: string | null) => void;
}

export interface RecaptchaChangeHandler {
  (value: string): void;
}
