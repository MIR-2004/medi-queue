import mongoose from "mongoose";

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
})

export const Hospital = mongoose.model('Hospital', hospitalSchema);