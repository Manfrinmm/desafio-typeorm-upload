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

    const { id } = await createCategory.execute({ title: category });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
