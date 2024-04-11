import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Meal } from '../../../models/meal';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [PriceFormatPipe],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {
  @Input() mealInfo?: Meal;

}
