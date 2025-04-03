import { Configuration } from 'ordercloud-javascript-sdk';
import { getEnv } from 'src/config/get-env';
import * as auth from './auth.service';

class OrderCloudService {
  auth: typeof auth;

  constructor() {
    Configuration.Set({
      baseApiUrl: getEnv('NEXT_PUBLIC_ORDERCLOUD_API_ENDPOINT') as string,
    });

    this.auth = auth;
  }
}

const OrderCloudServiceInstance = new OrderCloudService();
export default OrderCloudServiceInstance;
