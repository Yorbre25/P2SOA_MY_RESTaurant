import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealRecommendationComponent } from './meal-recommendation.component';

describe('MealRecommendationComponent', () => {
  let component: MealRecommendationComponent;
  let fixture: ComponentFixture<MealRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealRecommendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
