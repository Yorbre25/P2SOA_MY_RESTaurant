import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
   standalone: true
})
export class PriceFormatPipe implements PipeTransform {
  transform(price: string): string {
    const formattedPrice = Number(price).toLocaleString('en-US');
    return formattedPrice;
  }
}
