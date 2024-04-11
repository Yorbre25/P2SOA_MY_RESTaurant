import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  selectedDateTime?: Date;
  @ViewChild('message') message!: ElementRef<HTMLParagraphElement>;
  @ViewChild('alternative_date') alternative_date!: ElementRef<HTMLParagraphElement>;
  @ViewChild('alternative_time') alternative_time!: ElementRef<HTMLParagraphElement>;

  constructor(private reservationService: ReservationService) {}
  CheckReservation(){
    console.log(this.selectedDateTime)
    const inputDate = new Date(this.selectedDateTime ?? "");
    const datePipe = new DatePipe('en-US');
    const dateSection = datePipe.transform(inputDate, 'yyyy-MM-dd');
    const timeSection = datePipe.transform(inputDate, 'HH:mm');

    this.reservationService.getReservationInfo({ "fecha": dateSection ?? "", "hora": timeSection ?? "" }).subscribe((data: { "available" : boolean, "message" : string, "alternative_date"?: string, "alternative_time"?: string }) => {
      console.log({data})
      this.message.nativeElement.innerText = data.message;
      this.alternative_date.nativeElement.innerText = data.alternative_date ? "Alternative date: "+data.alternative_date : "";
      this.alternative_time.nativeElement.innerText = data.alternative_time ? "Alternative time: "+data.alternative_time : "";
    })
  }
}
