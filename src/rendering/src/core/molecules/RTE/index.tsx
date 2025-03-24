import { RichText, Text, LinkField, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { type LinkVariant } from '@/core/atoms/Link/Link.type';
import Link from '@/core/atoms/Link/Link';
import { VARIANT, type RTEProps } from './RTE.types';
import { SIZE, THEME } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { useEditor } from '@/hooks/useEditor';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { getHeadingStyles } from '@/utils/StyleHeadings';

export const RichTextData = atom<RichTextField | undefined>({
  value: '',
});
const RTE: React.FC<RTEProps> = (props) => {
  const [, setRTEDescription] = useAtom(RichTextData);
  const id = props?.params?.RenderingIdentifier;
  const isEditing = useEditor();

  const {
    params: { HeadingTag = 'h2', HeadingSize, CTAColor, CTASize, styles, Styles, variant } = {},
    fields: { Title, Description, CTA } = {},
  } = props?.rendering;

  useEffect(() => {
    if (Description?.value?.length) {
      setRTEDescription(Description);
    }
  }, []);

  const textStyles = cn({
    'text-white': CTAColor === THEME.LIGHT,
    'text-dark-gray': CTAColor === THEME.DARK,
  });

  return (
    <div
      className={cn(`flex flex-col container mx-auto ${props?.params?.styles}`, {
        'justify-center items-center pt-13 px-13 pb-24': variant === VARIANT.ConfirmationRTE,
      })}
      id={id || undefined}
    >
      <div className={cn({ 'flex flex-col gap-3 mb-4': variant !== VARIANT.ConfirmationRTE })}>
        {(isEditing || HeadingTag) && (
          <Text
            className={cn(
              getHeadingStyles(HeadingSize, HeadingTag),
              variant === VARIANT.ConfirmationRTE
                ? 'mb-4.5 font-normal md:mb-8 md:font-latoLight'
                : textStyles
            )}
            tag={HeadingTag || 'h2'}
            field={Title}
          />
        )}
        {(isEditing || Description) && (
          <RichText
            className={
              variant === VARIANT.ConfirmationRTE
                ? 'mb-27 text-base font-normal md:mb-13 hover:[&_a]:text-black'
                : textStyles
            }
            field={Description}
          />
        )}
      </div>
      {(isEditing || CTA) && (
        <Link
          field={CTA as LinkField}
          variant={CTAColor as LinkVariant}
          size={CTASize as SIZE}
          className={`hover:font-latoBold hover:shadow-sm ${styles} ${Styles}`}
          isCTATextInCaps={props?.params?.IsCTATextInCaps}
        />
      )}
    </div>
  );
};

export default RTE;
