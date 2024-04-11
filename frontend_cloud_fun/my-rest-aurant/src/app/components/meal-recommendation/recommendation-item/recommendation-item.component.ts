import { Component, Input } from '@angular/core';
import { Meal } from '../../../models/meal';
import { MealRecommendationService } from '../../../services/meal-recommendation.service';

@Component({
  selector: 'app-recommendation-item',
  standalone: true,
  imports: [],
  templateUrl: './recommendation-item.component.html',
  styleUrl: './recommendation-item.component.css'
})
export class RecommendationItemComponent {
  @Input() mealInfo?: Meal;

  constructor(private recommendaionService: MealRecommendationService){ }
  
  removeRecItem(){
    if(this.mealInfo){
      this.recommendaionService.removeMeal(this.mealInfo);
    }
  }
}
