export enum MealCategory {
    main_dish = "Main Dish",
    drink = "Drink",
    dessert = "Dessert"
}

export class Meal {
    Name: string = "";
    Price: string = "";
    Category: MealCategory = MealCategory.main_dish;
}
