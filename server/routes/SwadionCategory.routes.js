import express from "express";
import { CreateCategorys, deleteCategorys, editTheCategorys, getAllCategorys } from "../controller/SwadionCategory.controller.js";




const route = express.Router();


//http://localhost:9502/app/swadion/category/CreateCategory
route.post("/CreateCategory",CreateCategorys);
//http://localhost:9502/app/swadion/category/GetAllCategorys
route.get("/GetAllCategorys",getAllCategorys);
//http://localhost:9502/app/swadion/category/EditCategory:id
route.put("/EditCategory/:id",editTheCategorys);
//http://localhost:9502/app/swadion/category/DeleteCategory:id
route.delete("/DeleteCategory/:id",deleteCategorys);


export default route;