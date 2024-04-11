import { TestBed } from '@angular/core/testing';

import { MealRecommendationService } from './meal-recommendation.service';

describe('MealRecommendationService', () => {
  let service: MealRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
