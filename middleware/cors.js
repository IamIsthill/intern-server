import cors from "cors";
import { DEVELOPMENT } from "../config/index.js";

const corsOptions = {
  origin: DEVELOPMENT ? "*" : ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

export const Cors = (options = corsOptions) => {
  return cors(options);
};
