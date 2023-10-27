import { fileURLToPath } from "url";
import { dirname } from "path";

import config from "./configInternals.json";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export default config