import {
  ImageField,
  Field,
  LinkField,
  NextImage as JssImage,
  Link as JssLink,
  RichText as JssRichText,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  PromoIcon: ImageField;
  PromoText: Field<string>;
  PromoLink: LinkField;
  PromoText2: Field<string>;
}

type PromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`.trimEnd()}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

export const Default = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <div
        className={`component promo ${props.params.styles}`.trimEnd()}
        id={props.params.RenderingIdentifier || undefined}
      >
        <div className="component-content">
          <div className="field-promoicon">
            <JssImage field={props.fields.PromoIcon} />
          </div>
          <div className="promo-text">
            <div className="field-promotext">
              <JssRichText field={props.fields.PromoText} />
            </div>
            <div className="field-promolink">
              <JssLink field={props.fields.PromoLink} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

export const WithText = (props: PromoProps): JSX.Element => {
  if (props.fields) {
    return (
      <div
        className={`component promo ${props.params.styles}`.trimEnd()}
        id={props.params.RenderingIdentifier || undefined}
      >
        <div className="component-content">
          <div className="field-promoicon">
            <JssImage field={props.fields.PromoIcon} />
          </div>
          <div className="promo-text">
            <div className="field-promotext">
              <JssRichText field={props.fields.PromoText} />
            </div>
            <div className="field-promotext2">
              <JssRichText field={props.fields.PromoText2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
