import { Meal, MealCategory } from "../models/meal";

export const meals: Meal[] = [
    { Name: "Casado", Price: "6000", Category: MealCategory.main_dish },
    { Name: "Pasta de Queso", Price: "4500", Category: MealCategory.main_dish },
    { Name: "Olla de Carne", Price: "5500", Category: MealCategory.main_dish },
    { Name: "Arroz con Pollo", Price: "5500", Category: MealCategory.main_dish },
    { Name: "Ceviche", Price: "7000", Category: MealCategory.main_dish },
    //
    { Name: "Fresco de Cas", Price: "1500", Category: MealCategory.drink },
    { Name: "Agua de Pipa", Price: "2000", Category: MealCategory.drink },
    { Name: "Té Verde", Price: "1200", Category: MealCategory.drink },
    { Name: "Café", Price: "1000", Category: MealCategory.drink },
    { Name: "Jugo de Frutas", Price: "1800", Category: MealCategory.drink },
    //
    { Name: "Tres Leches", Price: "2500", Category: MealCategory.dessert },
    { Name: "Arroz con Leche", Price: "2000", Category: MealCategory.dessert },
    { Name: "Flan de Coco", Price: "2200", Category: MealCategory.dessert },
    { Name: "Helado de Fresa", Price: "1800", Category: MealCategory.dessert },
    { Name: "Empanada de Plátano", Price: "1800", Category: MealCategory.dessert }
  ];