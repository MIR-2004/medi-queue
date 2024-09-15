import mongoose from "mongoose";

const doctorModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    about: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    specialization: {
        type: String,
        required: true
    },
    yearOfExperience: {
        type: Number,
        required: true,
    },
    hospitalId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: false
    }],
    timings: [{
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],
    duration: {
        type: Number,
        required: true,
        default: 15
    }
});

export const Doctor = mongoose.model('Doctor', doctorModel);
