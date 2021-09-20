export default () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_DATABASE || 'tstore',
  dbMigration: process.env.DB_RUN_MIGRATIONS || false,
});
