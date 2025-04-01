import { type SVGProps } from './Icons.types';

const Delete: React.FC<SVGProps> = ({ className, ...props }) => {
  const { width, height } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 17 18"
      role="presentation"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M11.5385 3V0H5.07692V3H0V3.92308H2.12289L3.50751 18H13.108L14.4926 3.92308H16.6155V3H11.5385ZM6 0.923077H10.6154V3H6V0.923077ZM12.2767 17.0769H4.33869L3.04602 3.92308H13.5696L12.2767 17.0769Z"
        fill="#FF2632"
      />
      <path d="M7.84613 6.69231H8.76921V13.8462H7.84613V6.69231Z" fill="#FF2632" />
      <path d="M5.53845 6.69231H6.46153V13.8462H5.53845V6.69231Z" fill="#FF2632" />
      <path d="M10.1539 6.69231H11.0769V13.8462H10.1539V6.69231Z" fill="#FF2632" />
    </svg>
  );
};

export default Delete;
