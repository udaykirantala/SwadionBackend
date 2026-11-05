    import mongoose from "mongoose";



    const SwadiorecipesSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref:"Category",
            required: true
        },
        country: {
            type: mongoose.Types.ObjectId,
            ref:"Country",
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        prepTimeMinutes: {
            type: String,
            required: true
        },
        cookTimeMinutes: {
            type: String,
            required: true
        },
        totalTimeMinutes: {
            type: String,
            required: true
        },
        baseServings: {
            type: String,
            required: true
        },
        nutrition: {
            type: {},
            required: true
        },
        ingredients: {
            type: [],
            required: true
        },
        instructions: {
            type: [],
            required: true
        },
        tags: {
            type: [],
            required: true
        },
        isVegetarian: {
            type:Boolean,
            required: true
        },
        isVegan: {
            type: Boolean,
            required: true
        },
        isTrending:{
            type:Boolean,
            default:false
        },
        createdAt: {
            type: Date,
            default:Date.now,
            required: true
        },
        updatedAt:{
            type: Date,
            default:Date.now,
            required: true
        }
    })



export default mongoose.model("Recipe",SwadiorecipesSchema);