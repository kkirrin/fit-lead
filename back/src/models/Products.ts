import mongoose, { Document, Schema } from "mongoose";
import { nanoid } from "nanoid";

export interface IProduct extends Document {
    title: string;
    description: string;
    category: 'спортпит' | 'оборудование' | 'одежда' | 'гаджеты';
    price: number;
    commissionPercent: number;
    referralCode: string; 
    originalUrl: string;
    clicks: number;
}


const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String, 
        required: true,
        enum: ['спортпит', 'оборудование', 'одежда', 'гаджеты'],
    },

    price: { type: Number, required: true },
    commissionPercent: { type: Number, required: true },
    referralCode: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(8),
    },

    originalUrl: { type: String, required: true },
        clicks: { type: Number, default: 0 },
    }, {
        timestamps: true,
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
