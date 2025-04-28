// subject.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private apiUrl = 'http://localhost:8080/subjects'; // đổi nếu port khác

  constructor(private http: HttpClient) {}

  getAllSubjects(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
