import csv from "csv-parse/lib";
import fs from "fs";
import { resolve, join } from "path";

import Transaction from "../models/Transaction";
import CreateTransactionService from "./CreateTransactionService";

interface Response {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class ImportTransactionsService {
  private async deleteFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }

  async execute(filename: string): Promise<Transaction[]> {
    const csvPath = join(resolve(__dirname, "..", "..", "tmp"), filename);
    const datas: Response[] = [];

    const createTransaction = new CreateTransactionService();

    const parse = fs.createReadStream(csvPath).pipe(
      csv({
        delimiter: ",",
        columns: ["title", "type", "value", "category"],
        from_line: 2,
        trim: true,
      }),
    );

    parse.on("data", raw => {
      datas.push(raw);
    });

    await new Promise(resolve => parse.on("end", resolve));

    await this.deleteFile(csvPath);

    const transactions = await Promise.all(
      await datas.map(async transaction =>
        createTransaction.execute(transaction),
      ),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
