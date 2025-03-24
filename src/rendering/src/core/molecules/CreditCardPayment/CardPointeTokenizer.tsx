import { useEffect, useState } from 'react';
import { CardPointeTokenizerProps } from './CardPointeTokenizer.types';
import { useI18n } from 'next-localization';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
const CardPointeTokenizer = (props: CardPointeTokenizerProps) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const baseUrl = `https://${props.site}.cardconnect.com${props.port ? `:${props.port}` : ''}`;
  const url = `${baseUrl}/itoke/ajax-tokenizer.html`;
  const { t } = useI18n();
  const handleTokenEvent = (event: MessageEvent) => {
    if (event.origin === baseUrl) {
      const token = JSON.parse(event.data);
      const mytoken = document.getElementById('mytoken') as HTMLInputElement;
      const cardType = document.getElementById('type') as HTMLInputElement;
      mytoken.value = token.message;
      const expField = token.expiry;
      const type = cardType?.value;
      const tkn = mytoken.value;
      const dte = expField;

      const emvData = {
        token: tkn,
        expiryDate: dte,
        type: type,
      };

      props.tokenProps.userEmvData(emvData);
      event.preventDefault();
      setError(token.validationError);
      props?.getCartError && props?.getCartError(token.validationError);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleTokenEvent, false);

    return () => {
      window.removeEventListener('message', handleTokenEvent, false);
    };
  }, []);

  const cssStyle =
    'css=.error{color:red;border-color:red;}label{font-family:Arial;}input,select{font-size:16px;margin-bottom:12px;border-radius:6px;border-width:1px;border-color:%233d3935a6;border-style:solid;height:24px;padding:12px}select{height:49px}body{margin:0px;height:100%}';

  const params = new URLSearchParams({
    maskfirsttwo: props.tokenProps.maskfirsttwo ? 'true' : 'false',
    useexpiry: props.tokenProps.useexpiry ? 'true' : 'false',
    usemonthnames: props.tokenProps.usemonthnames ? 'true' : 'false',
    usecvv: props.tokenProps.usecvv ? 'true' : 'false',
    cardnumbernumericonly: props.tokenProps.cardnumbernumericonly ? 'true' : 'false',
    orientation: props.tokenProps.orientation,
    invalidinputevent: props.tokenProps.invalidinputevent ? 'true' : 'false',
    enhancedresponse: props.tokenProps.enhancedresponse ? 'true' : 'false',
    formatinput: props.tokenProps.formatinput ? 'true' : 'false',
    tokenizewheninactive: props.tokenProps.tokenizewheninactive ? 'true' : 'false',
    inactivityto: props.tokenProps.inactivityto ? 'true' : 'false',
    placeholdercvv: 'CVV',
    cvvlabel: '',
    expirylabel: '',
    placeholdermonth: '00',
    placeholderyear: '0000',
    placeholder: `CardNumber`,
    cardtitle: '',
    cardlabel: '',
  });

  const iFrameUrl = url + '?' + params + '&' + encodeURI(cssStyle);

  return (
    <div className="!ml-0 !mr-0 max-w-full pl-0 pr-0">
      {/* Start Form for step 1 here!! */}
      {/* onSubmit={ this.handleSubmit } */}
      <form className="form-renewals" name="order" method="post" id="tokenform">
        {isLoading && <LoaderSpinner />}
        {/* This is the Number FG */}
        <div className={`m-0 ${props?.tokenProps?.height} md:h-auto max-w-full relative`}>
          <iframe
            title="CardPointeTokenizer"
            id="tokenframe"
            name="tokenframe"
            src={iFrameUrl}
            frameBorder="0"
            scrolling="no"
            width="100%"
            height="100%"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          >
            <input type="hidden" name="token" id="mytoken" />
          </iframe>
          {error && (
            <li className="text-error-red absolute bottom-1 md:hidden">
              {t('invalid_card_details')}
            </li>
          )}
        </div>
      </form>
      {error && <li className="text-error-red  hidden md:block">{t('invalid_card_details')}</li>}
    </div>
  );
};

export default CardPointeTokenizer;
