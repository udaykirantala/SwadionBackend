import mongoose from "mongoose";
import SwadioncountriesModel from "../model/Swadioncountries.model.js"


export const CreateCountries = async (req, res, next) => {

    const { name, slug, description, flagIcon } = req.body

    try {

        const data = new SwadioncountriesModel({ name, slug, description, flagIcon });

        await data.save()

        return res.status(201).json({ success: true, message: "Countrie is Created...!", data })

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

export const getAllCountries = async (req, res, next) => {
    try {
        const countrie = await SwadioncountriesModel.find()
        if (!countrie) {
            return res.status(404).json({ success: false, message: "Countries are Not Found" })
        }
        return res.status(200).json({ success: true, message: "Countries are found....", data: countrie })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Intenal Server Error" })
    }
}

export const editTheCountrie = async (req, res, next) => {
    const countrieId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(countrieId)) {
            return res.status(404).json({ success: false, message: "Countrie ID is not valid" })
        }
        const countrie = await SwadioncountriesModel.findById(countrieId);

        if (!countrie) {
            return res.status(404).json({ success: false, message: "Countrie is Not Found" })
        }

        const data = await SwadioncountriesModel.findByIdAndUpdate(countrieId, { $set: req.body }, { new: true,runValidators:true})

        return res.status(200).json({ success: true, message: "Countrie is Updated", data })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Intenal Server Error" })
    }
}

export const deleteCountrie = async (req, res, next) => {
    const countrieId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(countrieId)) {
            return res.status(404).json({ success: false, message: "Countrie Id is Not Valid" })
        }
        const data = await SwadioncountriesModel.findById(countrieId);
        if (!data) {
            return res.status(404).json({ success: false, message: "Countrie is Not Found" })
        }
        await SwadioncountriesModel.findByIdAndDelete(countrieId)
        return res.status(200).json({ success: true, message: "Countrie is Deleted",data })

    } catch (error) {

        return res.status(500).json({ success: false, message: "Intenal Server Error...!", error })

    }
}
