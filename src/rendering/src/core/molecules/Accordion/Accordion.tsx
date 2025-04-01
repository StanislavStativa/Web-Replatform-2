/**
 * A React component that renders a Accordions
 *
 * @param {AccordionProps} props - The props for the Accordion component.
 * @returns {React.ReactElement} - The rendered Accordion list component.
 */

import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type AccordionItem, type AccordionProps } from './Accordion.type';
import AccordianItem from './AccordionItem';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { cn } from '@/utils/cn';
import Head from 'next/head';
import { extractTextFromHTML } from '@/utils/safeJsonParse ';

const Accordion: React.FC<AccordionProps> = (props) => {
  const id = props?.params?.RenderingIdentifier;
  const { fields, params } = props?.rendering;
  const isFaqPage = Boolean(props?.rendering?.params?.IsFaqPage === 'true');
  const generateFaqSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: fields?.AccordionItem?.map((faq) => ({
        '@type': 'Question',
        name: faq?.fields?.Title?.value,
        acceptedAnswer: {
          '@type': 'Answer',
          text: extractTextFromHTML(faq?.fields?.Description?.value),
        },
      })),
    };
  };
  const faqSchema = generateFaqSchema();
  return (
    <>
      {isFaqPage === true && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            data-nscript="afterInteractive"
          />
        </Head>
      )}

      <div className={`component container mx-auto ${props?.params?.styles}`} id={id || undefined}>
        <div className="component-content px-7 md:px-10">
          <Text
            field={fields?.Title}
            tag={params?.HeadingTag || 'h2'}
            className={cn(
              'border-b border-b-gray-mercury pb-2 mb-4 font-latoLight font-normal',
              getHeadingStyles(params.HeadingSize, params?.HeadingTag)
            )}
          />
          {fields?.AccordionItem?.map((accordion: AccordionItem) => (
            <AccordianItem key={accordion.id} {...accordion} params={props?.params} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Accordion;
