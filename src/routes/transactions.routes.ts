import { Router } from "express";
import { getCustomRepository } from "typeorm";

import multer from "multer";

import multerConfig from "../config/multer";
import TransactionsRepository from "../repositories/TransactionsRepository";
import CreateTransactionService from "../services/CreateTransactionService";
import DeleteTransactionService from "../services/DeleteTransactionService";
import ImportTransactionsService from "../services/ImportTransactionsService";

const upload = multer(multerConfig);

const transactionsRouter = Router();

transactionsRouter.get("/", async (req, res) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const balance = await transactionsRepository.getBalance();
  const transactions = await transactionsRepository.find();

  return res.status(200).json({
    transactions,
    balance,
  });
});

transactionsRouter.post("/", async (req, res) => {
  const { title, value, type, category } = req.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return res.status(201).json(transaction);
});

transactionsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return res.status(200).send();
});

transactionsRouter.post("/import", upload.single("file"), async (req, res) => {
  const { filename } = req.file;
  const importTransactions = new ImportTransactionsService();

  const transactions = await importTransactions.execute(filename);

  return res.status(201).json(transactions);
});

export default transactionsRouter;
