import { Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList  } from '@angular/core';
import { meals } from '../../test-menu/menu-data';
import { Meal, MealCategory } from '../../models/meal';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MealRecommendationService } from '../../services/meal-recommendation.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  @ViewChildren('categorySection') categoriesSectionEls?: QueryList<ElementRef<HTMLSpanElement>>;
  categorizedMeals: { category: MealCategory, meals: Meal[] }[];

  constructor(private recommendationService: MealRecommendationService) {
    this.categorizedMeals = [];
  }

  ngOnInit(): void {
    this.recommendationService.getMenuData().subscribe(menu => {
      this.formatMenuData(menu)
    })
    this.recommendationService.selectedMeals$.subscribe(meals => {
      this.categoriesSectionEls?.forEach(section => {
        const categoryName = section.nativeElement.innerText;
        const disableHover = meals.some(meal => meal.Category === categoryName);
        if (disableHover || meals.length>1) {
          section.nativeElement.parentElement?.classList.add("disabled-hover");
        } else {
          section.nativeElement.parentElement?.classList.remove("disabled-hover");
        }
      });
    })
  }

  formatMenuData(menu : { string : string[] }){
    
    Object.entries(menu).forEach(([category, dishes], i) => {
      this.categorizedMeals.push( { category: this.getDishCategory(category), meals: []})
      dishes.forEach(dishName => {
        const newMealItem: Meal = { Name: this.capitalizeFirstLetter(dishName) , Price: "3", Category: this.getDishCategory(category)}
        this.categorizedMeals[i].meals.push(newMealItem);
      })

    })
  }

  capitalizeFirstLetter(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getDishCategory(dishCategory: string){
    switch(dishCategory){
      case "desserts":
        return MealCategory.dessert
      case "drinks":
        return MealCategory.drink
      case "main_dishes":
        return MealCategory.main_dish
      default:
        return MealCategory.main_dish
    }
  }

  onMealItemClick(meal: Meal){
    const currentSelectedMeals = this.recommendationService.selectedMeals
    if(currentSelectedMeals?.length > 0 && currentSelectedMeals?.some(item => item.Category == meal.Category)) {
      return
    }  
    this.recommendationService.addSelectedMeal(meal);
  }

}
