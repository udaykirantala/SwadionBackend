import express from "express";
import { CreateCountries, deleteCountrie, editTheCountrie, getAllCountries } from "../controller/Swadioncountries.controller.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { protect } from "../middleware/auth.middleware.js";


const route = express.Router();

//http://localhost:9502/app/swadion/countries/CreateCountries
route.post("/CreateCountries",protect,adminOnly,CreateCountries);
//http://localhost:9502/app/swadion/countries/GetAllCountries
route.get("/GetAllCountries",getAllCountries);
//http://localhost:9502/app/swadion/countries/EditCountrie:id
route.put("/EditCountrie/:id",protect,adminOnly,editTheCountrie);
//http://localhost:9502/app/swadion/countries/DeleteCountries:id
route.delete("/DeleteCountries/:id",protect,adminOnly,deleteCountrie);

export default route;