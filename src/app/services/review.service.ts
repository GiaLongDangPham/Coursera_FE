import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = 'http://localhost:8080/reviews'; // đổi nếu API backend khác

    constructor(private http: HttpClient) { }

    getTopRatedReviews(subjectKeyword: string, courseKeyword: string, minRating: number): Observable<Review[]> {
        // Tạo đối tượng HttpParams để truyền các tham số vào URL
        let params = new HttpParams()
            .set('minRating', minRating)
            .set('subjectKeyword', subjectKeyword)
            .set('courseKeyword', courseKeyword);
        
        // Gửi yêu cầu GET với các tham số đã được thêm vào
        return this.http.get<Review[]>(this.apiUrl, { params });
    }
}
