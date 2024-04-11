import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  backEndAddress: string = "https://backendcloudfunc-x3adwyscpa-uc.a.run.app/";

  constructor(private http: HttpClient) { }

  postFeedback(feedback: string): Observable<any>{
    const data = { "review": feedback }
    return this.http.post(this.backEndAddress + "sentiment-api", data);
  }
}
