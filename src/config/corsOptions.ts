import { whitelist } from "./whitelist";

type Origin = boolean | string | RegExp;
type StaticOrigin = Origin | Origin[];
type CustomOrigin = (err: Error | null, origin?: StaticOrigin) => void;

export const corsOptions = {
  origin: (requestOrigin: string | undefined, callback: CustomOrigin) => {
    if (!requestOrigin || whitelist.indexOf(requestOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
};
