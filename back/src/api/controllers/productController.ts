import { Request, Response } from "express";
import Product from '../../models/Products';


// @desc    Получить все товары
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, sortBy, order } = req.query;

        // --- ФИЛЬТРАЦИЯ ---
        const filter: any = {};
        if (category) {
            filter.category = category;
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        // --- СОРТИРОВКА ---
        const sortOptions: any = {};
        if (sortBy) {
            sortOptions[sortBy as string] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1;
        }

        const products = await Product.find(filter).sort(sortOptions);
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Создать товар
// @route   POST /api/products

export const createProduct = async (req: Request, res: Response) => {
    try {
        // 1. Добавляем originalUrl в деструктуризацию
        const { title, description, category, price, commissionPercent, originalUrl } = req.body;

        // 2. Добавляем простую серверную валидацию
        if (!title || !description || !category || !price || !commissionPercent || !originalUrl) {
            return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля' });
        }

        // 3. Передаем originalUrl в новый объект Product
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
        // 4. Добавляем осмысленную обработку ошибок
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
            product.originalUrl = originalUrl || product.originalUrl; // <--- ДОБАВЛЯЕМ ЭТУ СТРОКУ

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