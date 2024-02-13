import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: process.env.NODE_ENV === 'production',
  captureUnhandledRejections: process.env.NODE_ENV === 'production',
  environment: process.env.NODE_ENV,
});

export default rollbar;
