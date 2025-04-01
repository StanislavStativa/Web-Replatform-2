import React, { useEffect, useState } from 'react';
import { useI18n } from 'next-localization';
import { RegistrationConfirmationProps } from './RegistrationConfirmation.types';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { SIZE } from '@/utils/constants';
import LinkButton from '@/core/atoms/Link/Link';
import { useRouter } from 'next/router';
import { triggerEvent } from '@/utils/eventTracking';
import { event } from '@/config';

const RegistrationConfirmation = (props: RegistrationConfirmationProps) => {
  const router = useRouter();
  const { CTA, Description, Title } = props?.rendering?.fields;
  const { HeadingTag, CTAColor, CTASize } = props?.params;
  const { t } = useI18n();
  const [custId, setCustId] = useState('');

  useEffect(() => {
    if (router?.query?.id) {
      setCustId(router?.query?.id as string);
      triggerEvent({
        event: event.SIGNUP,
      });
      // Ensure custId is a string
    }
  }, [router?.query?.id]);

  const descriptionHtml = Description?.value || '';
  const updatedDescription = descriptionHtml.replace('{{customerId}}', custId);

  // Create a content object to pass to RichText
  const content = {
    value: updatedDescription,
  };
  return (
    <div className="w-full flex justify-center pt-7 md:pt-12 pb-11 md:pb-12 px-5">
      <div className="md:w-621">
        <div className="flex flex-col gap-y-4 text-center">
          <Text
            tag={HeadingTag || 'h2'}
            field={Title}
            className="text-3xl md:text-5xl text-dark-gray lato-h1"
          />

          {/* Use updatedDescription instead of Description */}
          <RichText className="text-base flex flex-col gap-y-4" field={content} />

          <div className="flex md:justify-center">
            <LinkButton
              field={CTA}
              className="group-hover:font-bold md:w-414 w-full text-lg"
              variant={CTAColor as LinkVariant}
              isCTATextInCaps={props?.params?.IsCTATextInCaps}
              size={CTASize as SIZE}
            >
              {t('Labels_GoBackToHome')}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
