import { getCustomRepository } from "typeorm";

import Category from "../models/Category";
import CategoriesRepository from "../repositories/CategoriesRepository";

interface Request {
  title: string;
}

export default class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepository.findOneOrCreate(title);

    return category;
  }
}
