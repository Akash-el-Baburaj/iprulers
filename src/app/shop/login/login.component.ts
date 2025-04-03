import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  banner : any = {
		pagetitle: "Login",
		bg_image: "assets/images/banner/bnr-9.png",
		title: "Login",
	}

  constructor(private router: Router) {}

  navigateToCourse(){
    this.router.navigate(['/courses-details'])
  }

}
