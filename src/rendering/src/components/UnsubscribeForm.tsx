import { type UnsubscribeFormProps } from '../core/molecules/UnsubscribeForm/UnsubscribeForm.types';
import UnsubscribeForm from '@/core/molecules/UnsubscribeForm/UnsubscribeForm';
export const Default = (props: UnsubscribeFormProps): JSX.Element => {
  return <UnsubscribeForm rendering={props?.rendering} />;
};
