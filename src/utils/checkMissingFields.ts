import CustomError from "./CustomError";

const checkMissingFields = ({ ...fields }) => {
  // Filter missing fields
  const missingFields = Object.entries(fields)
    ?.filter((field) => field[1] == (null || undefined || ""))
    ?.map((missingField) => missingField[0]);

  // Return 400 error if any field is missing, else return false
  if (missingFields?.length) {
    const error = new CustomError(
      missingFields.length > 1
        ? `Fields ${missingFields.join(", ")} required`
        : `Field ${missingFields[0]} required`,
      400
    );

    return error;
  } else return false;
};

export default checkMissingFields;
