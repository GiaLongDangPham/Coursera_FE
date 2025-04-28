import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = 'http://localhost:8080/users';

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    insertUser(user: User): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    updateUser(user: User): Observable<any> {
        return this.http.put(this.apiUrl, user);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
