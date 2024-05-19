//@TODO: post body config missing
type ConnectorSettings = {
  customerId: string;
  secretKey: string;
  apiKey: string;
  isEnqueueTokenEnabled: boolean;
  isEnqueueTokenKeyEnabled: boolean;
  enqueueTokenValidityTime: number;
  isRequestBodyCheckEnabled: boolean;
};

export default ConnectorSettings;
