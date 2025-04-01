import { type FooterProps } from './Footer.type';
import { Link, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { useState } from 'react';

const FooterSubscription = (props: FooterProps): JSX.Element => {
  const [subscriptionEmail, setSubscriptionEmail] = useState<string>('');
  const id = props?.params?.RenderingIdentifier;
  const { LeftDescription, RightDescription, FormPlaceholderText, FormBoxLink } =
    props?.rendering?.fields || {};

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSubscriptionEmail(event.target.value);
  };
  return (
    <section key={id}>
      <div className="bg-dark-gray text-white flex flex-col md:flex-row items-center justify-center lg:justify-between py-5 lg:pl-10 w-full font-latoRegular">
        <div className="flex items-center justify-center flex-col lg:flex-row w-full lg:w-1/2">
          <div className="w-3/5 lg:w-full flex flex-col lg:flex-row">
            {LeftDescription ? (
              <RichText
                field={LeftDescription}
                className="lg:px-5 lg:w-fit text-center [&>p]: text-sm leading-none"
              />
            ) : null}
            <div className="flex items-center flex-wrap md:flex-nowrap gap-1 w-full justify-center lg:w-1/2 mt-5 md:mt-1 lg:mt-0">
              {FormPlaceholderText ? (
                <input
                  placeholder={FormPlaceholderText?.value}
                  className="focus-visible:outline-none text-black py-1.5 px-2.5 rounded-m text-sm max-w-300 w-85p border border-tonal-gray shadow focus:shadow-cyanBlue"
                  value={subscriptionEmail}
                  onChange={handleChange}
                />
              ) : null}
              {props?.rendering?.fields?.FormBoxLink?.value.text ? (
                <Link
                  field={{
                    href: FormBoxLink?.value?.href,
                    querystring: `email=${subscriptionEmail}`,
                  }}
                  editable={false}
                  className={`no-underline text-white border border-white p-1 rounded-none mt-5 sm:mt-0 text-base ${!subscriptionEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    if (!subscriptionEmail) {
                      e.preventDefault();
                    }
                  }}
                >
                  {props?.rendering?.fields?.FormBoxLink?.value?.text}
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        {RightDescription ? (
          <RichText
            field={RightDescription}
            className="hidden lg:flex w-1/4 rich-text [&>p]:text-sm [&>p]:text-center [&>p]:leading-4.5"
          />
        ) : null}
      </div>
    </section>
  );
};
export default FooterSubscription;
