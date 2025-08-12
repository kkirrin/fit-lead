// backend/src/api/controllers/statsController.ts
import { Request, Response } from 'express';
import Product from '../../models/Products';
import Click from '../../models/Click';

// @desc    Зарегистрировать клик по реферальной ссылке
// @route   GET /ref/:referralCode
export const handleReferralClick = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ referralCode: req.params.referralCode });

        if (!product) {
            // Если товар не найден, можно редиректить на главную страницу блогера или 404
            return res.status(404).send('Ссылка недействительна');
        }

        product.clicks += 1;
        await product.save();
        
        const newClick = new Click({
            productId: product._id,
            ipAddress: req.ip,
        });
        await newClick.save();

        return res.redirect(301, product.originalUrl);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Получить общую статистику
// @route   GET /api/stats
export const getStats = async (req: Request, res: Response) => {
    try {
        const totalProducts = await Product.countDocuments({});
        const totalClicks = await Click.countDocuments({});

        const topProductsByClicks = await Product.find({ clicks: { $gt: 0 } })
            .sort({ clicks: -1 })
            .limit(5) 
            .select('title clicks'); 

        
        // Используем Aggregation Pipeline для расчета потенциального дохода
        const potentialIncomeData = await Product.aggregate([
            {
                $project: {
                    potentialEarning: { $multiply: ["$price", "$commissionPercent", 0.01, "$clicks"] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$potentialEarning" }
                }
            }
        ]);

        const potentialIncome = potentialIncomeData.length > 0 ? potentialIncomeData[0].total : 0;
        
        // Статистика по категориям
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            totalProducts,
            totalClicks,
            potentialIncome: parseFloat(potentialIncome.toFixed(2)),
            categoryStats,
            topProductsByClicks 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};