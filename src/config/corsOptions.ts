import whitelist from "./whitelist";

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];
type CustomOrigin = (err: Error | null, origin?: StaticOrigin) => void;

const corsOptions = {
  origin: (requestOrigin: string | undefined, callback: CustomOrigin) => {
    if (!requestOrigin || whitelist.indexOf(requestOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
};

export default corsOptions;
