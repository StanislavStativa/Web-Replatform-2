import { type FeaturedTilesProps } from './FeaturedTiles.types';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Tile from './Tile';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { cn } from '@/utils/cn';

const FeaturedTiles = (props: FeaturedTilesProps): JSX.Element => {
  const id = props?.rendering?.params.RenderingIdentifier;
  const { Title, Description } = props?.rendering?.fields;
  const { HeadingTag, HeadingSize } = props?.rendering?.params;
  const tiles = props?.rendering?.fields?.Tiles || [];
  const tileCount = tiles?.length;

  const justifyContentStyle =
    tileCount < 1 ? 'md:grid-cols-1' : tileCount < 3 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <div
      className={`component container mx-auto md:px-10 ${props?.rendering?.params?.Styles}`}
      id={id ? id : undefined}
    >
      <div className="component-content pt-10 pb-3 px-10 my-10 container mx-auto md:border border-1 border-black">
        <div className="flex flex-col text-center px-1 md:px-6">
          {Title?.value !== '' && (
            <Text
              className={cn('mb-7 text-dark-gray', getHeadingStyles(HeadingSize, HeadingTag))}
              tag={HeadingTag || 'h2'}
              field={Title}
            />
          )}
          {Description?.value !== '' && <RichText className="mb-14 mx-1" field={Description} />}
        </div>
        <div className={`tiles-container grid grid-cols-1 ${justifyContentStyle}`}>
          {tiles?.map((tile, index) => <Tile key={index} {...tile?.fields} />)}
        </div>
        {props?.rendering?.fields?.Text?.value !== '' && (
          <RichText className="mb-14 mx-1" field={props?.rendering?.fields?.Text} />
        )}
      </div>
    </div>
  );
};
export default FeaturedTiles;
