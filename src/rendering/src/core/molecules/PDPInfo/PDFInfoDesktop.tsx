import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { IoDocumentOutline } from 'react-icons/io5';
import { useI18n } from 'next-localization';
import { cn } from '@/utils/cn';
import { type PDPInfoProps } from './PDPInfo.types';
import { CiCircleInfo } from 'react-icons/ci';
import { RichText, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from '@/core/atoms/Link/Link';
import AnchorTag from '@/core/atoms/Anchor/AnchorTag';

const PDPInfoDesktop: React.FC<PDPInfoProps> = ({ data, fields }) => {
  const { t } = useI18n();
  const text: RichTextField = {
    value: data?.ProductDescription as string,
  };
  const imageUrl = fields?.Image?.value?.toString();
  const tabs = [
    {
      title: t('PDPInfo_Description'),
      content: (
        <div className="content">
          {text && <RichText className={cn('text-base', 'mb-6 mt-12')} field={text} />}
          <div dangerouslySetInnerHTML={{ __html: fields?.Prop65Warning?.value }} />
          {fields?.CTA && <Link field={fields?.CTA} className="pt-2.5 underline cursor-pointer" />}
          <div className="flex flex-wrap gap-5 mt-12">
            {fields?.Image?.value && (
              <img alt="description" src={imageUrl} className="w-auto h-auto flex-1" />
            )}
            {fields?.VideoURL?.value && (
              <iframe
                id="ytplayer"
                width="100%"
                allowFullScreen
                height="auto"
                title={'Video'}
                className={'w-full aspect-video print:hidden  flex-1'}
                src={`https://www.youtube.com/embed/${fields?.VideoURL.value}?autoplay=0&controls=1&rel=0`}
              ></iframe>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('PDPInfo_Specifications'),
      content: (
        <div className="content flex flex-col justify-center items-stretch gap-10 w-full">
          {data?.Specifications?.PDPInfo_Dimensions && (
            <div className="w-full mb-6 mt-12">
              <p className="font-latoBold text-xl mb-6 text-dark-gray">
                {Object.keys(data?.Specifications).map(
                  (keyValue, index) => index === 0 && t(keyValue)
                )}
              </p>
              <div className="grid grid-flow-row gap-x-6 grid-cols-2 w-full">
                {data?.Specifications?.PDPInfo_Dimensions?.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex justify-between flex-wrap px-3 py-3 border-b border-light-gray',
                      index % 4 === 2 || index % 4 === 3 ? 'bg-zinc-50' : ''
                    )}
                  >
                    <div className="text-dark-gray font-latoBold text-base leading-6">
                      {t(item.Key)}
                      {fields?.EnableiIcon?.value === true ? (
                        <CiCircleInfo
                          size={20}
                          className="inline ml-2"
                          title="product description"
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="max-w-64 text-right">{item.Value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.Specifications?.PDPInfo_DesignInstallation && (
            <div className="w-full">
              <p className="font-latoBold text-xl mb-6 text-dark-gray">
                {Object.keys(data.Specifications).map(
                  (keyValue, index) => index === 1 && t(keyValue)
                )}
              </p>
              <div className="grid grid-flow-row gap-x-6 grid-cols-2 w-full">
                {data?.Specifications?.PDPInfo_DesignInstallation?.map((item, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      'flex justify-between flex-wrap px-3 py-3 border-b border-light-gray',
                      index % 4 === 2 || index % 4 === 3 ? 'bg-zinc-50' : ''
                    )}
                  >
                    <div className="text-dark-gray font-latoBold text-base leading-6">
                      {t(item.Key)}
                      {fields?.EnableiIcon?.value === true ? (
                        <CiCircleInfo
                          size={20}
                          className="inline ml-2"
                          title="product description"
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="max-w-64 text-right">{item.Value}</div>
                    <p className="basis-full mt-[5px] text-left text-sm italic">
                      {item?.Key === 'PDPInfo_Applications' ? t('PDPInfo_application_callout') : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.Specifications?.PDPInfo_TechnicalDetails && (
            <div className="w-full">
              <p className="font-latoBold text-dark-gray text-xl mb-6">
                {Object.keys(data.Specifications).map(
                  (keyValue, index) => index === 2 && t(keyValue)
                )}
              </p>
              <div className="grid grid-flow-row gap-x-6 grid-cols-2 w-full">
                {data?.Specifications?.PDPInfo_TechnicalDetails?.map((item, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      'flex justify-between flex-wrap px-3 py-3 border-b border-light-gray',
                      index % 4 === 2 || index % 4 === 3 ? 'bg-zinc-50' : ''
                    )}
                  >
                    <div className=" text-dark-gray font-latoBold text-base leading-6">
                      {t(item.Key)}
                      {fields?.EnableiIcon?.value === true ? (
                        <CiCircleInfo
                          size={20}
                          className="inline ml-2"
                          title="product description"
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="max-w-64 text-right">{item.Value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('PDPInfo_Resources'),
      content: (
        <div className="content">
          <div className="w-full mb-6 mt-12">
            <div className="grid grid-flow-row gap-x-6 grid-cols-2 w-full">
              {data?.Documents?.map((item, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'flex justify-between flex-wrap px-3 py-3 border-b border-light-gray',
                    index % 4 === 2 || index % 4 === 3 ? 'bg-zinc-50' : ''
                  )}
                >
                  <div className="text-dark-gray font-latoBold text-base leading-6">
                    {t(item.Key)}
                    {fields?.EnableiIcon?.value === true ? (
                      <CiCircleInfo
                        size={20}
                        className="inline ml-2 cursor-pointer"
                        title="product description"
                      />
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="flex items-center">
                    <IoDocumentOutline className="mr-2" size={20} title="product description" />
                    <a
                      href={item.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline cursor-pointer"
                    >
                      <div className="max-w-64 text-right">
                        {item.Name}
                        &nbsp;({t('PDF')})
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pt-0 pr-10 pb-6 pl-20">
      <div className="pdp-info-component">
        <div className="hidden md:block">
          <Tabs className="react-tabs" selectedTabClassName="border-b-2 border-black">
            <TabList className="flex space-x-4">
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  className="cursor-pointer pb-1.5 border-b-2 border-transparent hover:border-black focus:outline-none"
                >
                  <span className="text-xl font-latoBold text-dark-gray hover:text-black">
                    <AnchorTag href={`#${tab?.title?.toLowerCase()}`}>{tab?.title}</AnchorTag>
                  </span>
                </Tab>
              ))}
            </TabList>
            {tabs.map((tab, index) => (
              <TabPanel key={index}>{tab.content}</TabPanel>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PDPInfoDesktop;
