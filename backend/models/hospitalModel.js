import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    location: {
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    phoneNumber: [{
        type: String,
        required: true,
        unique: true
    }],
    doctorsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    bedsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bed'
    }]
});

hospitalSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

hospitalSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

hospitalSchema.methods.token = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export const Hospital = mongoose.model('Hospital', hospitalSchema);