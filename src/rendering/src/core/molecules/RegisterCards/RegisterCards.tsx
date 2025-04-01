import { RichText, Text as SitecoreText } from '@sitecore-jss/sitecore-jss-nextjs';
import { RegistrationCard, type RegisterCardsProps } from './RegisterCards.types';
import Card from './Card';
import { useEffect } from 'react';
import useLocalStorage from '@/utils/useLocalStorage';
import RegisterEmailSearch from './RegisterEmailSearch/RegisterEmailSearch';

export const RegisterCards = (props: RegisterCardsProps): JSX.Element => {
  const id = props?.params?.RenderingIdentifier;
  const { fields } = props?.rendering;
  const params = props?.params;
  const { SubTitle, Title, SubHeadline, SecondaryCTATitle, Text } = props?.rendering?.fields || {};
  const { HeadingTag } = props?.params || {};
  const { removeData } = useLocalStorage();
  useEffect(() => {
    removeData('userInfo');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${props?.params?.styles} container mx-auto px-5 md:px-10`}
      id={id ? id : undefined}
    >
      <div className="component-content grid grid-cols-10 pt-6 md:pt-8 md:pb-24  pb-8 ">
        <div className="col-span-10 lg:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-9 lg:gap-y-12">
          <div className="lg:col-span-2 flex flex-col md:gap-y-6">
            <SitecoreText
              tag={HeadingTag || 'h2'}
              className="text-center font-latoRegular lg:font-latoLight"
              field={Title}
            />
            <div className="w-full flex align-middle justify-center">
              <RichText field={SubTitle} className="text-center w-1/2 " />
            </div>
          </div>
          {fields?.RegistrationCards.map((list: RegistrationCard) => {
            return <Card key={list?.id} fields={list.fields} params={params} />;
          })}
          <div className="lg:col-span-2">
            <RegisterEmailSearch title={SubHeadline} btnLabel={SecondaryCTATitle} subText={Text} />
          </div>
        </div>
      </div>
    </div>
  );
};
