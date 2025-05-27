// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
import BYOC from 'src/byoc';
import CdpPageView from 'components/CdpPageView';
import FEAASScripts from 'components/FEAASScripts';
import { EditingScripts } from '@sitecore-jss/sitecore-jss-nextjs';
const Scripts = (): JSX.Element => {
  return (
    <>
      <EditingScripts />
      <BYOC />
      <CdpPageView />
      <FEAASScripts />
    </>
  );
};

export default Scripts;
