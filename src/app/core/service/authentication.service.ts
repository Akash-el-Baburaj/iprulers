import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, register, otpVarification } from '../model/auth.model';

import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: any | null = null;

  constructor(private http: HttpClient, public router: Router) { }

  private baseUrl = environment.apiUrl;

  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}/user/login`, user);
  }

  // otpVerification(otp: any) {
  //   return this.http.post<any>(`${this.baseUrl}/user/verify_otp`, otp);
  // }
  

  getUserProfile() {
    return this.http.get<any>(`${this.baseUrl}/user/profile`);
  }

  updateToken(token: string) {
    if (token && token.length) {
        localStorage.setItem('token', token);
    }
  }

  logout() {
    return this.http.get<any>(`${this.baseUrl}/user/logout`)
  }

  forceLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.logout().subscribe()
  }
}
