import bcrypt from "bcrypt";
import { CustomError } from "./CustomError";

const checkMissingFields = ({ ...fields }) => {
  // Filter missing fields
  const missingFields = Object.entries(fields)
    ?.filter((field) => field[1] == (null || undefined || ""))
    ?.map((missingField) => missingField[0]);

  // Return 400 error if any field is missing, else return null
  if (missingFields?.length) {
    const error = new CustomError(
      missingFields.length > 1
        ? `Fields ${missingFields.join(", ")} required`
        : `Field ${missingFields[0]} required`,
      400,
    );

    return error;
  } else return null;
};

// Check matching password
const checkPassword = async (submittedPassword: string, password: string) => {
  const match = await bcrypt.compare(submittedPassword, password);
  return match;
};

// Decode JWT
const decodeJWT = (token: string) => {
  try {
    const base64URL = token.split(".")[1];
    const decodedData = atob(base64URL);
    const payload = JSON.parse(decodedData);
    return payload;
  } catch (err) {
    console.error("Error while decoding the token:", err);
    return null;
  }
};

export { checkMissingFields, checkPassword, decodeJWT };
