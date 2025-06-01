<<<<<<< HEAD
import { createConsola, LogLevels } from "consola/core";

const IS_DEV = process.env.NODE_ENV !== "production";
const logger = createConsola({
  level: IS_DEV ? LogLevels.debug : LogLevels.info,
  defaults: {
    tag: "mcp-bridge",
=======
import { createConsola, LogLevels } from 'consola/core';

const IS_DEV = process.env.NODE_ENV !== 'production';
const logger = createConsola({
  level: IS_DEV ? LogLevels.debug : LogLevels.info,
  defaults: {
    tag: 'mcp-bridge',
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
  },
});

export default logger;
