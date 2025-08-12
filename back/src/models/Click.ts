import mongoose, { Document, Schema } from 'mongoose';

export interface IClick extends Document {
    productId: mongoose.Schema.Types.ObjectId;
    ipAddress: string;
}

const ClickSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    ipAddress: { type: String, required: true },
}, {
    timestamps: { createdAt: true, updatedAt: false }, 
});

const Click = mongoose.model<IClick>('Click', ClickSchema);
export default Click;