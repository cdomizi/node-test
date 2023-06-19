const getInvoiceIdNumber = (idNum: number, idDate: Date) => {
  // Reset idNum for the first invoice of the day
  if (new Date() > idDate || idDate === undefined) {
    idDate = new Date();
    idNum = 0;
  }

  // Increment the ID number
  ++idNum;
  // Set the right format for the ID date
  const month = idDate.getMonth() + 1;
  const date = `${idDate.getFullYear()}-${month
    .toString()
    .padStart(2, "0")}-${idDate.getDate()}`;
  // Set the right format for the ID number
  const num = String(idNum).padStart(3, "0");

  const idNumber = `${date}/${num}`;
  return { idNumber, idNum, idDate };
};

export default getInvoiceIdNumber;
