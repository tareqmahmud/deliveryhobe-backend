export default () => ({
  email_host: process.env.EMAIL_HOST,
  email_port: parseInt(process.env.EMAIL_PORT),
  email_secure: process.env.EMAIL_SECURE.toLowerCase() === 'true',
  email_username: process.env.EMAIL_USERNAME,
  email_password: process.env.EMAIL_PASSWORD,
});
