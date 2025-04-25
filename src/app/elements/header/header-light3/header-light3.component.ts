import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { AlertService } from 'src/app/core/service/services/alert.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import Swal from 'sweetalert2';

interface MenuType {
  title: string;
  menuClass?: string;
  subMenuClass?: string;
  subMenu?: {
    title: string;
    route?: string;
    img?: string;
    themeColor?: string;
    subSubMenu?: {
      title: string;
      route: string;
    }[]
  }[];
}

@Component({
  selector: 'app-header-light3',
  templateUrl: './header-light3.component.html',
  styleUrls: ['./header-light3.component.css']
})
export class HeaderLight3Component {
  cssUrl: any = '';
  collapseToggle: boolean = false;
  searchToggle: boolean = false;
  toggleMenu: string = '';
  toggleSubMenu: string = '';
  currentHref: string = "";
  activeMenu: string = "";
  loggedIn: boolean = false;
  student: any;

  constructor(public router: Router, private backLocation: PlatformLocation, private location: Location, private alertService: AlertService, private authService: AuthenticationService) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.currentHref = location.path();
      } else {
        this.currentHref = 'Home'
      }
    });

    backLocation.onPopState(() => {   // back click get url
      this.handleActiveMenu(window.location.pathname);
    });

    if (this.router.url == '/home-university') {
      this.themeColor('1');
    }
  }

  ngOnInit(): void {
    this.handleActiveMenu(this.currentHref);
    if (localStorage.getItem('student')) {
      this.loggedIn = true;
      this.student = JSON.parse(localStorage.getItem('student')!);
    } else {this.loggedIn = false;}
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../../assets/images/default-profile.png';
  }

  themeColor(itme: any) {
    this.cssUrl = document.getElementById("cssFileUrl");
    this.cssUrl.setAttribute('href', 'assets/css/skin/skin-' + itme + '.css');
  }
  clickEvent() {
    this.collapseToggle = !this.collapseToggle;
  }
  searchOpen() {

    this.searchToggle = !this.searchToggle;
  }
  opneMenu(item: any) {
    if (this.toggleMenu != item.toString()) {
      this.toggleMenu = item.toString();
    } else {
      this.toggleMenu = ' ';
    }
  }
  opneSubMenu(item: any) {
    if (this.toggleSubMenu != item.toString()) {
      this.toggleSubMenu = item.toString();
    } else {
      this.toggleSubMenu = ' ';
    }
  }

 
  handleActiveMenu(val: any) {
    this.sidebarMenu.map((data: any, ind: any) => {

      data.subMenu?.map((item: any, ind: any) => {
        if (item.route == val) {
          this.activeMenu = data.title;
        }
        item.subSubMenu?.map((subTtme: any, ind: any) => {
          if (subTtme.route == val) {
            this.activeMenu = data.title;
          }
        })
      })
    })
  }

  sidebarMenu: MenuType[] = []

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to log out',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#ffb703',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmLogout();
      }
    })
  }

  confirmLogout() {
    this.authService.logout().subscribe({
      next: (res: any) => {
        console.log(res)
      }
    })
    this.alertService.success('See you again', 'You are now successfully Logged out.' );
    localStorage.clear();
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }
}
