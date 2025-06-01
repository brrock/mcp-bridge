import { createConsola, LogLevels } from 'consola/core';

const IS_DEV = process.env.NODE_ENV !== 'production';
const logger = createConsola({
  level: IS_DEV ? LogLevels.debug : LogLevels.info,
  defaults: {
    tag: 'mcp-bridge',
  },
});

export default logger;
