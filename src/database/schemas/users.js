import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    emailVerified: Boolean,
});

export default mongoose.model('users', userSchema);
