const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKey.apiKeyPrefix['api-key'] = "Token"

module.exports = {
  sendInBlueApiInstance: new SibApiV3Sdk.TransactionalEmailsApi(),
  sendSmtpEmail: new SibApiV3Sdk.SendSmtpEmail(),
}