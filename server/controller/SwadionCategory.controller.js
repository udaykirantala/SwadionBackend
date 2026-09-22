import mongoose from "mongoose";
import SwadionCategoryModel from "../model/SwadionCategory.model.js"

export const CreateCategorys = async (req, res, next) => {
    const { name, slug, description, icon, colorTheme } = req.body

    try {
        const data = new SwadionCategoryModel({ name, slug, description, icon, colorTheme })

        await data.save()

        return res.status(201).json({ success: true, message: "Swadion Category is Created...!", data })

    } catch (error) {

        if (error.code === 11000) {
            // duplicate key error — e.g. slug or name already exists
            return res.status(400).json({ success: false, message: "Category with this name/slug already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });

    }
};

export const getAllCategorys = async (req, res, next) => {
    try {
        const category = await SwadionCategoryModel.find()
        if (!category) {
            return res.status(404).json({ success: false, message: "Categorys are Not Found" })
        }
        return res.status(200).json({ success: true, message: "Categorys are found....", data: category })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Intenal Server Error" })
    }
}

export const editTheCategorys = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(404).json({ success: false, message: "Category ID is not valid" })
        }
        const category = await SwadionCategoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category is Not Found" })
        }

        const data = await SwadionCategoryModel.findByIdAndUpdate(categoryId, { $set: req.body }, { new: true, runValidators: true })

        return res.status(200).json({ success: true, message: "Category is Updated", data })

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}


export const deleteCategorys = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(404).json({ success: false, message: "Category Id is Not Valid" })
        }
        const data = await SwadionCategoryModel.findById(categoryId);
        if (!data) {
            return res.status(404).json({ success: false, message: "Category is Not Found" })
        }
        await SwadionCategoryModel.findByIdAndDelete(categoryId)
        return res.status(200).json({ success: true, message: "Category is Deleted", data })

    } catch (error) {

        return res.status(500).json({ success: false, message: "Intenal Server Error...!", error })

    }
}

