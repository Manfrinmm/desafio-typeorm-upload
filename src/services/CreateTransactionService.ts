import { getCustomRepository } from "typeorm";

import AppError from "../errors/AppError";
import Transaction from "../models/Transaction";
import TransactionsRepository from "../repositories/TransactionsRepository";
import CreateCategoryService from "./CreateCategoryService";

interface Request {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const createCategory = new CreateCategoryService();

    if (!["income", "outcome"].includes(type)) {
      throw new AppError(
        `Transaction with type ${type} is invalid. It should be 'income' or 'outcome'`,
      );
    }

    const { total } = await transactionsRepository.getBalance();

    if (total < value && type === "outcome") {
      throw new AppError(
        `Transaction not allowed. You need more ${(
          value - total
        ).toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })} to make this transaction`,
      );
    }

    const transactionCategory = await createCategory.execute({
      title: category,
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
