import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RecommendationItemComponent } from './recommendation-item/recommendation-item.component';
import { Meal, MealCategory } from '../../models/meal';
import { MealRecommendationService } from '../../services/meal-recommendation.service';

@Component({
  selector: 'app-meal-recommendation',
  standalone: true,
  imports: [RecommendationItemComponent],
  templateUrl: './meal-recommendation.component.html',
  styleUrl: './meal-recommendation.component.css'
})
export class MealRecommendationComponent implements OnInit {
  selectedMeals: Meal[] = []
  @ViewChild('mainDish') mainDish!: ElementRef<HTMLParagraphElement>;
  @ViewChild('drink') drink!: ElementRef<HTMLParagraphElement>;
  @ViewChild('dessert') dessert!: ElementRef<HTMLParagraphElement>;

  constructor(private recommendationService: MealRecommendationService){  }

  ngOnInit(): void {
    this.recommendationService.selectedMeals$.subscribe(meals => {
      this.selectedMeals = meals;
    })
  }

  getRecommendation(){
    //   {
    //     "meal":{
    //         "main_dish":"Pizza",
    //         "drink":"",
    //         "dessert":""
    //     },
    //     "recommendation_of":["drink"]
    // }
    if(this.selectedMeals.length == 0) return
    const recItem:{ meal: { main_dish: string; drink: string; dessert: string }; recommendation_of: string[] } = { "meal": {"main_dish": "", "drink": "", "dessert": ""} , "recommendation_of" : [] };
    this.selectedMeals.forEach(meal => {
      if(meal.Category == MealCategory.main_dish){
        recItem.meal.main_dish = meal.Name;
      }
      if(meal.Category == MealCategory.drink){
        recItem.meal.drink = meal.Name;
      }
      if(meal.Category == MealCategory.dessert){
        recItem.meal.dessert = meal.Name;
      }
    })
    for (const key in recItem.meal) {
      if (recItem.meal.hasOwnProperty(key)) {
        const dish = key as keyof typeof recItem.meal;
        if (recItem.meal[dish] === '') {
          recItem.recommendation_of.push(dish)
        }
      }
    }
    this.recommendationService.getMealRecommendation(recItem).subscribe((data: {"dessert": String, "drink": String, "main_dish": String}) => {
      console.log({data})
      this.mainDish.nativeElement.innerText = data.main_dish ? "Main Dish:  ⇢ "+data.main_dish : "";
      this.drink.nativeElement.innerText = data.drink ? "Drink:  ⇢ "+data.drink : "";
      this.dessert.nativeElement.innerText = data.dessert ? "Dessert:  ⇢ "+data.dessert : "";

    })
  }
}
