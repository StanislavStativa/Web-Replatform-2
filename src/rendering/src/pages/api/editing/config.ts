import { EditingConfigMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/editing';
import { components } from 'temp/componentBuilder';
import metadata from 'temp/metadata.json';
import { EditMode } from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * This Next.js API route is used by Sitecore editors (Pages) in XM Cloud
 * to determine feature compatibility and configuration.
 */

const handler = new EditingConfigMiddleware({
  components,
  metadata,
  pagesEditMode: EditMode.Metadata, // Newer, recommended method (default)
}).getHandler();

export default handler;
