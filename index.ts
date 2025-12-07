import app from "./src/app";
import logger from "./src/config/logger";
const PORT = process.env.PORT || 3000;
const isProduction: boolean = process.env.NODE_ENV === 'production';


const server = Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
