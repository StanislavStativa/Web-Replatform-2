import React, { useEffect, useState } from 'react';
import {
  ITypesHeadingGroup,
  type SubTitleListProps,
  type TableOfContentProps,
} from './TableOfContent.type';
import { Text, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { RichTextData } from '../RTE';
import { useAtom } from 'jotai';
import { getStyles } from '@/utils/StyleParams';
import { useRouter } from 'next/router';
import {
  anchorIdRegex,
  headingRegex,
  accordionSectionRegex,
  subTitleRegex,
  subAnchorRegex,
} from '@/utils/regex';

const TableOfContent: React.FC<TableOfContentProps> = (props) => {
  const [RTEDescription] = useAtom(RichTextData);
  const id = props?.params?.RenderingIdentifier;
  const { fields, params } = props?.rendering;
  const router = useRouter();

  const [anchors, setAnchors] = useState<ITypesHeadingGroup[]>([]);
  // Extract anchor tag IDs
  const anchorIds = RTEDescription?.value?.match(anchorIdRegex) || [];
  const filteredAnchorNames = anchorIds.filter((anchor: string) => anchor.includes('Rich'));
  // Extract h2 tags
  const headings = RTEDescription?.value?.match(headingRegex) || [];

  // Extract accordion sections
  const accordionSections = RTEDescription?.value?.match(accordionSectionRegex) || [];
  const tableOfContents = headings?.map((heading, index) => {
    const title = { value: heading };
    const id = filteredAnchorNames[index]?.match(/name="([^"]+)" id="([^"]+)"/)?.[2];
    const subTitleList: SubTitleListProps[] = [];

    if (accordionSections?.length > index) {
      // Extract accordion id and title
      const subTitle = accordionSections[index]?.match(subTitleRegex);
      const subAnchors = accordionSections[index]?.match(subAnchorRegex);
      const subTitleId: string[] = [];
      subAnchors?.map((subAnchor) => {
        const matches = subAnchor?.match(/(?<=").*?(?=")/)?.[0];
        if (matches?.includes('Accordion')) subTitleId?.push(matches);
      });

      subTitle?.map((item, index) =>
        subTitleList?.push({ title: { value: item }, id: subTitleId[index] })
      );
    }
    return {
      id,
      title,
      subTitleList,
    };
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -76; // Adjust this value to account for any fixed headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      console.warn(`Element with ID "${id}" not found.`); // Debugging log
    }
  };

  useEffect(() => {
    function getHeadings(): ITypesHeadingGroup[] {
      try {
        const allHeadings = document?.querySelectorAll('h2, h3');
        const result: ITypesHeadingGroup[] = [];

        let currentH2: ITypesHeadingGroup | null = null;
        allHeadings?.forEach((heading) => {
          const tag = heading?.tagName;
          const text = heading?.textContent?.trim() || '';
          const id = heading?.id;

          // Filter out headings without 'table-content' in id
          if (!id?.includes('table-content')) return;

          if (tag === 'H2') {
            // If it's an H2, start a new group
            currentH2 = {
              tag: 'H2',
              text,
              id,
              subHeadings: [], // Initialize subHeadings for this H2
            };
            result.push(currentH2); // Add the H2 to the result array
          } else if (tag === 'H3' && currentH2) {
            // If it's an H3 and we have a current H2, add it to the subHeadings
            currentH2.subHeadings.push({
              tag: 'H3',
              text,
              id,
            });
          }
        });

        return result;
      } catch (error) {
        return [];
      }
    }

    setAnchors(getHeadings()); // Set the grouped headings to state
  }, [router?.asPath]); // Update when the route path changes

  return (
    <div className={`flex justify-center mt-10  ${getStyles(props)}`} id={id ? id : undefined}>
      {tableOfContents && (
        <div className="p-10 border rounded-xl w-fit border-dark-gray border-opacity-30">
          <Text
            field={fields?.Title}
            tag={params?.HeadingTag || 'h2'}
            className="text-2xl font-normal mb-3"
          />
          {anchors?.length > 0 && (
            <ul className="pl-1 text-base font-bold">
              {anchors.map((anchor, index) => (
                <li key={index}>
                  <button
                    onClick={() => anchor.id && scrollToSection(anchor.id)}
                    className="pb-3 h-auto hover:underline flex"
                  >
                    <span className="">{index + 1}.</span>&nbsp;
                    <span className="text-base hover:underline text-left">{anchor.text}</span>
                  </button>
                  {anchor?.subHeadings?.length > 0 && (
                    <ul className="list-disc ml-10 font-normal hidden md:block">
                      {anchor?.subHeadings?.map((item, index) => (
                        <li key={index} className="mb-2.5">
                          <button onClick={() => scrollToSection(item?.id)}>
                            <span className="text-base hover:underline text-left hover:font-bold">
                              {item?.text}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          {tableOfContents?.length > 0 && (
            <ul className="pl-1 text-base font-bold">
              {tableOfContents.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => item?.id && scrollToSection(item?.id)}
                    className="pb-3 h-auto hover:underline flex"
                  >
                    <span className="">{index + 1}.</span>&nbsp;
                    <RichText
                      field={item.title}
                      className="[&>h2]:!text-base hover:underline text-left "
                    />
                  </button>
                  {item?.subTitleList?.length > 0 && (
                    <ul className="list-disc ml-10 font-normal hidden md:block">
                      {item?.subTitleList?.map((subtitle: SubTitleListProps) => (
                        <li key={subtitle?.id} className="mb-2.5">
                          <button onClick={() => scrollToSection(subtitle?.id)}>
                            <RichText
                              field={subtitle?.title}
                              className="[&>h3]:!text-base hover:underline text-left hover:[&>h3]:font-bold"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
export default TableOfContent;
