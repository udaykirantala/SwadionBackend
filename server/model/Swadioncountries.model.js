import mongoose from "mongoose";


const SwadioncountriesSchema = mongoose.Schema({
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
    flagIcon: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})



export default mongoose.model("Country", SwadioncountriesSchema)