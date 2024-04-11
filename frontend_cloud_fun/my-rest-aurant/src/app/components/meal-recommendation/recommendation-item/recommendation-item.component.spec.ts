import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationItemComponent } from './recommendation-item.component';

describe('RecommendationItemComponent', () => {
  let component: RecommendationItemComponent;
  let fixture: ComponentFixture<RecommendationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
