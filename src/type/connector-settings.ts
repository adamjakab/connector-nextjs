/**
 * Queue-it connector configuration settings
 *
 */
type ConnectorSettings = {
  /**
   * @property customerId - The ID of the account assigned to you in the GO Platform.
   */
  customerId: string;

  /**
   * @property secretKey: The secret key from your account to be used for encrypting / decrypting information
   */
  secretKey: string;
  apiKey: string;
  isEnqueueTokenEnabled: boolean;
  isEnqueueTokenKeyEnabled: boolean;
  enqueueTokenValidityTime: number;
  isRequestBodyCheckEnabled: boolean;
};

export default ConnectorSettings;
