import { Injectable } from '@angular/core';
import { Meal } from '../models/meal';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MealRecommendationService {

  private _selectedMeals: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);
  selectedMeals$: Observable<Meal[]> = this._selectedMeals.asObservable();

  backEndAddress: string = "https://backendcloudfunc-x3adwyscpa-uc.a.run.app/";
  
  constructor(private http: HttpClient) { }

  set selectedMeals(value: Meal[]) {
    this._selectedMeals.next(value);
  }
  get selectedMeals() {
    return this._selectedMeals.getValue()
  }
  
  addSelectedMeal(meal: Meal): void {
    const meals = [...this._selectedMeals.getValue(), meal];
    this.selectedMeals = meals;
  }

  removeMeal(mealToDelete: Meal): void {
    const meals = this._selectedMeals.getValue();
    const uptMeals = meals.filter(meal => meal !== mealToDelete)
    this.selectedMeals = uptMeals;
  }

  getMenuData(): Observable<any>{
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get(this.backEndAddress + "get-menu", {headers: headers});
  }

  getMealRecommendation(body: any): Observable<any> {
    return this.http.post(this.backEndAddress + "get-recommendation", body);
  }

}
