import mongoose from "mongoose";
import SwadionCategoryModel from "../model/SwadionCategory.model.js"
import SwadioncountriesModel from "../model/Swadioncountries.model.js";
import SwadionRecipesModel from "../model/SwadionRecipes.model.js";



export const CreateRecipes = async (req, res, next) => {
    const {
        name,
        slug,
        category,
        country,
        description,
        image,
        videoUrl,
        prepTimeMinutes,
        cookTimeMinutes,
        totalTimeMinutes,
        baseServings,
        nutrition,
        ingredients,
        instructions,
        tags,
        isVegetarian,
        isVegan,
        isTrending
    } = req.body

    try {
        const categoryExists = await SwadionCategoryModel.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ success: false, message: "Category Not Found" })
        }

        const countryExists = await SwadioncountriesModel.findById(country);
        if (!countryExists) {
            return res.status(404).json({ success: false, message: "Country Not Found..." })
        }

        let data = new SwadionRecipesModel({
            name,
            slug,
            category,
            country,
            description,
            image,
            videoUrl,
            prepTimeMinutes,
            cookTimeMinutes,
            totalTimeMinutes,
            baseServings,
            nutrition,
            ingredients,
            instructions,
            tags,
            isVegetarian,
            isVegan,
            isTrending
        })

        await data.save();

        // populate before sending back, so the response the frontend gets
        // right after creating already has full category/country objects
        data = await data.populate("category");
        data = await data.populate("country");

        return res.status(201).json({ success: true, message: "Recipe is Added...", data })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Category with this name/slug already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

export const GetAllRecipes = async (req, res, next) => {
    try {
        const data = await SwadionRecipesModel.find().populate("category").populate("country");
        return res.status(200).json({ success: true, message: "Recipe is found..!", data })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

export const editTheRecipe = async (req, res, next) => {
    const recipesId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(recipesId)) {
            return res.status(404).json({ success: false, message: "Recipes ID is not valid" })
        }
        const recipes = await SwadionRecipesModel.findById(recipesId);

        if (!recipes) {
            return res.status(404).json({ success: false, message: "Recipes is Not Found" })
        }

        // populate ADDED here — this was the missing piece
        const data = await SwadionRecipesModel.findByIdAndUpdate(
            recipesId,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate("category").populate("country");

        return res.status(200).json({ success: true, message: "Recipes is Updated", data })

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export const deleteRecipe = async (req, res, next) => {
    const recipesId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(recipesId)) {
            return res.status(404).json({ success: false, message: "Recipes Id is Not Valid" })
        }
        const data = await SwadionRecipesModel.findById(recipesId);
        if (!data) {
            return res.status(404).json({ success: false, message: "Recipes is Not Found" })
        }
        await SwadionRecipesModel.findByIdAndDelete(recipesId)
        return res.status(200).json({ success: true, message: "Recipes is Deleted", data })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

export const GetRecipeBySlug = async (req, res, next) => {
    const { slug } = req.params;
    try {
        const data = await SwadionRecipesModel.findOne({ slug }).populate("category").populate("country");

        if (!data) {
            return res.status(404).json({ success: false, message: "Recipe is Not Found..." })
        }

        return res.status(200).json({ success: true, message: "Recipe is found..!", data })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

export const SearchRecipes = async (req, res, next) => {
    const { q } = req.query;
    try {
        if (!q || q.trim() === "") {
            return res.status(400).json({ success: false, message: "Search query is required" })
        }

        const searchRegex = new RegExp(q, "i");

        const data = await SwadionRecipesModel.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { tags: searchRegex }
            ]
        }).populate("category").populate("country");

        return res.status(200).json({ success: true, count: data.length, message: "Search results found", data })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}