/**
 * Queue-it connector configuration settings
 *
 */
type connectorSettings = {
  /**
   * @property {string} customerId - The ID of the account assigned to you in the GO Platform.
   */
  customerId: string;

  /**
   * @property {string} secretKey - The secret key from your account to be used for encrypting / decrypting information.
   */
  secretKey: string;

  /**
   * @property {string} apiKey - The API key from your account for accessing the Integration Configuration.
   */
  apiKey: string;

  /**
   * @property {boolean} isEnqueueTokenEnabled - If enabled, generates the enqueue token and adds it to the redirect URL.
   */
  isEnqueueTokenEnabled: boolean;

  /**
   * @property {boolean} isEnqueueTokenEnabled - To be documented...
   */
  isEnqueueTokenKeyEnabled: boolean;

  /**
   * @property {number} enqueueTokenValidityTime - The validity time of the enqueue token in seconds.
   */
  enqueueTokenValidityTime: number;

  /**
   * @property {boolean} isRequestBodyCheckEnabled - If enabled, the connector will also use the request body to match the triggers.
   */
  isRequestBodyCheckEnabled: boolean;
};

export default connectorSettings;
