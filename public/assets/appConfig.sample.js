var serviceBaseUrl = window.location.origin;
// or set it to your Twilio Runtime domain:
// serviceBaseUrl = "https://somedomain.twil.io";

var appConfig = {
  serviceBaseUrl: serviceBaseUrl  + "/",
  startEngagementUrl: serviceBaseUrl + "/createchat",
  sso: {
      tokenizerUrl: serviceBaseUrl + "/tokenizer"
  }
}