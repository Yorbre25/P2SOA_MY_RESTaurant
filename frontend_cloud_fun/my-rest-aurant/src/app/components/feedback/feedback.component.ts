import { Component, ViewChild, ElementRef } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {

  @ViewChild('userFeedback') userFeedback!: ElementRef;
  @ViewChild('feedbackResponse') feedbackResponse!: ElementRef<HTMLParagraphElement>;
  feedbackReceived: boolean = false;
  resultMsg: string = ""

  constructor(private feedbackService: FeedbackService){}

  sendFeedback(textArea: HTMLTextAreaElement) {
    console.log(textArea.value)
    this.feedbackService.postFeedback(textArea.value).subscribe((result: { msg:string , scale:number }) => {
      console.log({result})
      this.feedbackResponse.nativeElement.innerText = result.msg;
    })
    textArea.value = ""
  }
}
