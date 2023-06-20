import { getInvoicesFromDate } from "../controllers/invoices.controller";

let idNumber: null | string;

const getInvoiceIdNumber = async () => {
  try {
    // Set Date as the present day at 00:00
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Add the date to `idNumber`
    idNumber =
      `${today.getFullYear()}_` +
      `${today.getMonth().toString().padStart(2, "0")}_` +
      `${today.getDate().toString().padStart(2, "0")}-`;

    // Get the count of today's invoices
    const todaysInvoices = await getInvoicesFromDate(today);
    const todaysInvoicesCount = await todaysInvoices?.length;

    // Add the number to `idNumber`
    idNumber += !todaysInvoicesCount
      ? "001"
      : (todaysInvoicesCount + 1).toString().padStart(3, "0");
  } catch (err) {
    console.error(err);
  }

  // Only return `idNumber` if it is the right length
  return idNumber?.length === 14 ? idNumber : null;
};

export default getInvoiceIdNumber;
