import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    avatar: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
}, {
    timestamps: true,
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;