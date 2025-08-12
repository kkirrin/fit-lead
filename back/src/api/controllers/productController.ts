import { Request, Response } from "express";
import Product from '../../models/Products';


// @desc    Получить все товары
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response) => {
    try {
        // Достаем параметры из query
        const { category, search, sortBy, order, limit } = req.query;

        // Валидация входных параметров
        const allowedCategories = ['спортпит', 'оборудование', 'одежда', 'гаджеты', 'all'];
        const allowedSortFields = ['createdAt', 'price', 'commissionPercent', 'clicks', 'title'];
        const allowedOrderValues = ['asc', 'desc'];

        const getString = (v: unknown): string | undefined => {
            if (typeof v === 'string') return v;
            if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
            return undefined;
        };

        const categoryStr = getString(category);
        const searchStr = getString(search);
        const sortByStr = getString(sortBy) ?? 'createdAt';
        const orderStr = getString(order) ?? 'desc';
        const limitStr = getString(limit);

        const validationErrors: string[] = [];
        if (categoryStr && !allowedCategories.includes(categoryStr)) {
            validationErrors.push('Некорректная категория. Допустимые: спортпит, оборудование, одежда, гаджеты, all');
        }
        if (sortByStr && !allowedSortFields.includes(sortByStr)) {
            validationErrors.push('Некорректное поле сортировки. Допустимые: createdAt, price, commissionPercent, clicks, title');
        }
        if (orderStr && !allowedOrderValues.includes(orderStr)) {
            validationErrors.push('Некорректное направление сортировки. Допустимые: asc, desc');
        }
        if (limitStr !== undefined) {
            const numericLimit = Number(limitStr);
            if (!Number.isInteger(numericLimit) || numericLimit <= 0) {
                validationErrors.push('Параметр limit должен быть положительным целым числом');
            }
            if (numericLimit > 100) {
                validationErrors.push('Параметр limit не может превышать 100');
            }
        }
        if (searchStr !== undefined && typeof searchStr === 'string' && searchStr.length > 100) {
            validationErrors.push('Поисковая строка слишком длинная (макс. 100 символов)');
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Некорректные параметры запроса', errors: validationErrors });
        }

        // --- ФИЛЬТРАЦИЯ ---
        const filter: Record<string, unknown> = {};
        
        // Добавляем фильтр по категории, если он есть и это не "все"
        if (categoryStr && categoryStr !== 'all') {
            filter.category = categoryStr;
        }

        if (searchStr) {
            filter.title = { $regex: searchStr, $options: 'i' };
        }

        // --- СОРТИРОВКА (без изменений) ---
        const sortOptions: Record<string, 1 | -1> = {};
        sortOptions[sortByStr] = orderStr === 'desc' ? -1 : 1;

        // Применяем фильтрацию и сортировку, опционально ограничиваем количество
        const productsQuery = Product.find(filter).sort(sortOptions);
        if (limitStr) {
            const numericLimit = Number(limitStr);
            if (!Number.isNaN(numericLimit) && numericLimit > 0) {
                productsQuery.limit(Math.min(numericLimit, 100));
            }
        }
        const products = await productsQuery.exec();
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Создать товар
// @route   POST /api/products

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, description, category, price, commissionPercent, originalUrl } = req.body;

        if (!title || !description || !category || !price || !commissionPercent || !originalUrl) {
            return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля' });
        }

        const product = new Product({
            title,
            description,
            price,
            category,
            commissionPercent,
            originalUrl
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
        
    } catch (error: any) {
        console.error('Ошибка при создании товара:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании товара', error: error.message });
    }
};



// @desc    Обновить товар
// @route   PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { title, description, category, price, commissionPercent, originalUrl } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.title = title || product.title;
            product.description = description || product.description;
            product.category = category || product.category;
            product.price = price || product.price;
            product.commissionPercent = commissionPercent || product.commissionPercent;
            product.originalUrl = originalUrl || product.originalUrl;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Удалить товар
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};