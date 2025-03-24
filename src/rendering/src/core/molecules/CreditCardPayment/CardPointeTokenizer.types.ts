export type CardPointeTokenizerProps = {
  tokenProps: TokenProps;
  site: string;
  port: string;
  getCartError?: (isError?: string | undefined | null) => void;
};

export type EmvData = {
  token: string;
  expiryDate: string;
};

export enum Orientation {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export type TokenProps = {
  userEmvData: (emvData: EmvData) => void;
  maskfirsttwo: boolean;
  useexpiry: boolean;
  usemonthnames: boolean;
  usecvv: boolean;
  cardnumbernumericonly: boolean;
  orientation: Orientation;
  invalidinputevent: boolean;
  enhancedresponse: boolean;
  formatinput: boolean;
  tokenizewheninactive: boolean;
  inactivityto: number;
  height: string;
};
