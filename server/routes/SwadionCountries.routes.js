import express from "express";
import { CreateCountries, deleteCountrie, editTheCountrie, getAllCountries } from "../controller/Swadioncountries.controller.js";


const route = express.Router();

//http://localhost:9502/app/swadion/countries/CreateCountries
route.post("/CreateCountries",CreateCountries);
//http://localhost:9502/app/swadion/countries/GetAllCountries
route.get("/GetAllCountries",getAllCountries);
//http://localhost:9502/app/swadion/countries/EditCountrie:id
route.put("/EditCountrie/:id",editTheCountrie);
//http://localhost:9502/app/swadion/countries/DeleteCountries:id
route.delete("/DeleteCountries/:id",deleteCountrie);

export default route;