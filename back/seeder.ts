import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { products } from './src/data/products';
import Product from './src/models/Products';
import User from './src/models/User';
import connectDB from './src/config/db';

dotenv.config({ path: '../.env' });

connectDB();

const importData = async () => {
    try {
        // Очищаем коллекцию перед импортом
        await Product.deleteMany();

        await User.deleteMany(); 

        // Создаем одного пользователя
        await User.create({
            name: 'Фитнес-Блогер',
            email: 'pro_blogger@fit.com',
            avatar: 'https://i.pravatar.cc/150'
        });

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

// process.argv - это массив аргументов командной строки
// process.argv[2] будет '-d', если мы запустим скрипт с этим флагом
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}