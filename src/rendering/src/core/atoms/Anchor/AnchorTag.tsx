/**
 * A React component that renders a Anchor with customizable styles.
 *
 * @param {AnchorTagProps} props - The props for the Anchor component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the Anchor.
 * @param {string} [props.className] - Additional CSS classes to be applied to the Anchor.
 * @returns {React.ReactElement} - The rendered Anchor component.
 */

import { AnchorTagProps } from './Anchor.type';

const AnchorTag: React.FC<AnchorTagProps> = ({ children, className, href, target, ...props }) => {
  return (
    <a href={href} target={target} className={className} {...props}>
      {children}
    </a>
  );
};

export default AnchorTag;
