import { Request, Response } from 'express';
import User from '../../models/User';


// @desc    Получить профиль пользователя
// @route   GET /api/users/profile
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        // Находим первого попавшегося пользователя, т.к. он у нас один
        const user = await User.findOne(); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Обновить профиль пользователя
// @route   PUT /api/users/profile
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne();
        
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.avatar = req.body.avatar || user.avatar;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};