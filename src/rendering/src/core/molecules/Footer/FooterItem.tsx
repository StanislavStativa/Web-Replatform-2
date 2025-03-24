import { type FooterItems } from './Footer.type';
import Link from '@/core/atoms/Link/Link';

const FooterItem: React.FC<FooterItems> = ({ fields }) => {
  return (
    <Link
      field={fields?.Link}
      className="no-underline hover:underline text-sm block md:inline-flex hover:font-normal"
    />
  );
};

export default FooterItem;
