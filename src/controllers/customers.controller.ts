import { Request, Response, NextFunction } from "express";
import BasicError from "../errors/BasicError";
import { PrismaClient } from "@prisma/client";

const customersClient = new PrismaClient().customers;

const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const allCustomers = await customersClient.findMany();
    res.status(200).send(allCustomers);
  } catch (error) {
    console.error(error);
  }
};

const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await customersClient.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).send(customer);
  } catch (err) {
    next(err);
  }
};

const createCustomer = async (req: Request, res: Response) => {
  const { firstname, lastname, address, email } = req.body;
  try {
    const customer = await customersClient.create({
      data: {
        firstname,
        lastname,
        address,
        email,
      },
    });
    res.status(201).send(customer);
  } catch (error) {
    console.error(error);
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstname, lastname, address, email } = req.body;
  try {
    const customer = await customersClient.update({
      where: { id: parseInt(id) },
      data: {
        firstname,
        lastname,
        address,
        email,
      },
    });
    res.status(200).send(customer);
  } catch (error) {
    console.error(error);
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customer = await customersClient.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).send(customer);
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
