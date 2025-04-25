import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from 'src/app/core/service/services/alert.service';
import { ToastService } from 'src/app/core/service/services/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  banner : any = {
		pagetitle: "Login",
		bg_image: "assets/images/banner/bnr-9.png",
		title: "Login",
	}

  loginForm!: FormGroup;

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthenticationService,
    private alertService: AlertService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    localStorage.clear()
    this._init_Form();
  }

  _init_Form() {
    this.loginForm = this.fb.group({
      userName: ['' , Validators.required],
      password: ['', Validators.required]
    })
  }

  navigateToCourse(){
    this.router.navigate(['/courses-details'])
  }

  signin() {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('userName', this.loginForm.value.userName);
      formData.append('password', this.loginForm.value.password);
      formData.append('checkLoginUser', 'false');
      this.authService.login(formData).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('studentID', res.data.user_id);
            localStorage.setItem('token', res.data.api_key);
            this.getStudentProfile();
            if (res.data.logout){
              Swal.fire({
                title: 'Are you sure?',
                text: res.message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#ffb703',
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {
                  this.forceFullSignin();
                }
              });
            } else{this.alertService.success('Success!', res.message);}
            
          } else {
            this.alertService.error('Error!', res.message);
          }
        }
      })
    }

  }

  forceFullSignin() {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('userName', this.loginForm.value.userName);
      formData.append('password', this.loginForm.value.password);
      formData.append('checkLoginUser', 'true');
      this.authService.login(formData).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.alertService.success('Success!', res.message);
            localStorage.setItem('studentID', res.data.user_id);
            localStorage.setItem('token', res.data.api_key);
            this.getStudentProfile();
          } else {
            this.alertService.error('Error!', res.message);
          }
        }
      })
    }
  }

  getStudentProfile() {
    this.authService.getUserProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          localStorage.setItem('student', JSON.stringify(res.data));
          this.navigateToCourse();
           
        } else if (res.message.includes('Invalid user')) {
          this.authService.forceLogout()
          this.alertService.warn('Signed Out!', 'You have been signed out because your account was accessed from another device.');
        }
      }
    })
  }

}
