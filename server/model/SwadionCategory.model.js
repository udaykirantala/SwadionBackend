import mongoose from "mongoose";


const SwadioCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    },
    colorTheme: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})


export default mongoose.model("Category", SwadioCategorySchema)