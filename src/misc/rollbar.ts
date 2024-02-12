import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: '38bd4ac8a4a24e4f90210e4625c050ad',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbar;
