import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrendCourseResponse } from '../models/trend-course';


@Injectable({
    providedIn: 'root'
})
export class TrendCourseService {
    private baseUrl = 'http://localhost:8080/courses';

    constructor(private http: HttpClient) { }

    getTrendingCourses(date?: string, top: number = 100, subjectName?: string): Observable<TrendCourseResponse[]> {
        let params = new HttpParams();

        if (date) params = params.set('date', date); // date dạng "yyyy-MM-dd"
        if (top) params = params.set('top', top.toString());
        if (subjectName) params = params.set('subjectName', subjectName);

        return this.http.get<TrendCourseResponse[]>(`${this.baseUrl}/trending`, { params });
    }
}
