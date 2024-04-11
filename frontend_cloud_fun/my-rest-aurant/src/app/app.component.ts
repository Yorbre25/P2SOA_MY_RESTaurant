import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MealRecommendationComponent } from './components/meal-recommendation/meal-recommendation.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { HttpClientModule  } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
            MenuComponent, 
            MealRecommendationComponent, 
            FeedbackComponent, 
            ReservationComponent,
            NavbarComponent, HttpClientModule
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-rest-taurant';
}
