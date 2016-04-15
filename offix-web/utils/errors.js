var errors = module.exports = {};

errors.MissingFieldsError = {
  statusCode: 400,
  message: 'Missing required fields',
};

errors.InvalidLoginCredentialsError = {
  statusCode: 400,
  message: 'Invalid login credentials',
};
