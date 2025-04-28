import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/auth/login'; // URL backend của bạn

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const body = {
            username: username,
            password: password
        };
        return this.http.post(this.apiUrl, body);
    }
}
