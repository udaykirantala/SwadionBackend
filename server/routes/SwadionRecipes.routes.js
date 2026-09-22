import express from "express";
import { CreateRecipes, deleteRecipe, editTheRecipe, GetAllRecipes, GetRecipeBySlug, SearchRecipes } from "../controller/SwadionRecipes.controller.js";


const route = express.Router();


//http://localhost:9502/app/swadion/recipes/createRecipes
route.post("/createRecipes",CreateRecipes);
//http://localhost:9502/app/swadion/recipes/getAllRecipes
route.get("/getAllRecipes",GetAllRecipes);
//http://localhost:9502/app/swadion/recipes/EditRecipes:id
route.put("/EditRecipes/:id",editTheRecipe);
//http://localhost:9502/app/swadion/recipes/DeleteRecipes:id
route.delete("/DeleteRecipes/:id",deleteRecipe);
//http://localhost:9502/app/swadion/recipes/search?q=chicken
route.get("/search", SearchRecipes);
//http://localhost:9502/api/swadion/recipes/butter-chicken
route.get("/:slug", GetRecipeBySlug);

export default route;