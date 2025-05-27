import { Text, useSitecoreContext, LinkField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from '@/core/atoms/Link/Link';

interface Fields {
  data: {
    datasource: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          editable?: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
    contextItem: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          editable?: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
  };
}

type TitleProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id?: string;
  styles?: string;
  children: JSX.Element;
};

const ComponentContent = ({ id, styles, children }: ComponentContentProps): JSX.Element => (
  <div className={`component title ${styles || ''}`.trim()} id={id || undefined}>
    <div className="component-content container mx-auto pl-3 pr-5 md:pr-0 md:pl-0 lg:py-3">
      <div className="field-title">{children}</div>
    </div>
  </div>
);

export const Default = (props: TitleProps): JSX.Element => {
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const { sitecoreContext } = useSitecoreContext();

  const text: TextField = datasource?.field?.jsonValue || {};
  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title: datasource?.field?.jsonValue?.value,
    },
  };

  if (sitecoreContext.pageState !== 'normal') {
    link.value.querystring = `sc_site=${datasource?.url?.siteName}`;
    if (!text?.value) {
      text.value = 'Title field';
      link.value.href = '#';
    }
  }

  return (
    <ComponentContent styles={props.params?.styles} id={props.params?.RenderingIdentifier}>
      <>
        {sitecoreContext.pageEditing ? (
          <Text field={text} />
        ) : (
          <Link field={link}>
            <Text field={text} />
          </Link>
        )}
      </>
    </ComponentContent>
  );
};
