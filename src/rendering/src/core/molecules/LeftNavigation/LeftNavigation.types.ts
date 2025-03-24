import {
  type ComponentParams,
  type ComponentRendering,
  type Field,
  type LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface LeftNavigationProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: LeftNavigationFieldProps;
  };
  params: ComponentParams;
}

export interface LeftNavigationFieldProps {
  data: {
    datasource: {
      CTA: {
        jsonValue: LinkField;
      };
      Title: Field<string>;
      Links: LinkProps;
    };
  };
}
export interface LinkProps {
  targetItems: [
    {
      CTA: {
        jsonValue: LinkField;
      };
      IsVsibleForProUser: {
        jsonValue: LinkField;
      };
      IsVsibleOnlyForNT30ProUser: {
        jsonValue: LinkField;
      };
      Title: Field<string>;
      SecondaryLinks: {
        targetItems: [
          {
            CTA: {
              jsonValue: LinkField;
            };
            Title: Field<string>;
            IsVsibleForProUser: {
              jsonValue: LinkField;
            };
          },
        ];
      };
    },
  ];
}

export interface ITypesTargetItem {
  CTA: {
    jsonValue: LinkField;
  };
  Title: Field<string>;
  SecondaryLinks: {
    targetItems: [
      {
        CTA: {
          jsonValue: LinkField;
        };
        Title: Field<string>;
        IsVsibleForProUser: {
          jsonValue: LinkField;
        };
      },
    ];
  };
}
export interface ITypesSecondaryTargetItem {
  CTA: {
    jsonValue: LinkField;
  };
  Title: Field<string>;
  IsVsibleForProUser: {
    jsonValue: LinkField;
  };
}

export interface ITypesSecondaryTargetArray {
  targetItems: ITypesSecondaryTargetItem[];
}

export interface LinkItemsProp extends SecondaryLinkProps {
  CTA: {
    jsonValue: LinkField;
  };
  Title: Field<string>;
}

export interface PrimaryLinkProps extends SecondaryLinkProps {
  CTA: {
    jsonValue: LinkField;
  };
  Title: Field<string>;
  HeadingTag: string;
  HeadingSize: string;
  MyAccountPages?: string;
}

export interface SecondaryLinkProps {
  SecondaryLinks: {
    targetItems: [
      {
        CTA: {
          jsonValue: LinkField;
        };
        Title: Field<string>;
        IsVsibleForProUser: {
          jsonValue: LinkField;
        };
      },
    ];
  };
  MyAccountPages?: string;
}

export interface SecondaryLinksNav {
  CTA: {
    jsonValue: LinkField;
  };
  Title: Field<string>;
  IsVsibleForProUser: {
    jsonValue: LinkField;
  };
}

export interface LeftNavigationMobileProps {
  CTA: {
    jsonValue: LinkField;
  };
  Title: Field<string>;
  Links: LinkProps;
  HeadingTag: string;
}
