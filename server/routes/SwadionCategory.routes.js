import express from "express";
import { CreateCategorys, deleteCategorys, editTheCategorys, getAllCategorys } from "../controller/SwadionCategory.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";




const route = express.Router();


//http://localhost:9502/app/swadion/category/CreateCategory
route.post("/CreateCategory",protect,adminOnly,CreateCategorys);
//http://localhost:9502/app/swadion/category/GetAllCategorys
route.get("/GetAllCategorys",getAllCategorys);
//http://localhost:9502/app/swadion/category/EditCateg ory:id
route.put("/EditCategory/:id",protect,adminOnly,editTheCategorys);
//http://localhost:9502/app/swadion/category/DeleteCategory:id
route.delete("/DeleteCategory/:id",protect,adminOnly,deleteCategorys);


export default route;