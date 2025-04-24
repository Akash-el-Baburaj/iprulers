import { Component } from '@angular/core';
declare var jQuery: any;
import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { AlertService } from 'src/app/core/service/services/alert.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';

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
  selector: 'app-header-light9',
  templateUrl: './header-light9.component.html',
  styleUrls: ['./header-light9.component.css']
})
export class HeaderLight9Component {

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

    this.themeColor('3');
  }

  ngOnInit(): void {
    (function ($) {

      /* if (jQuery('select').length) { */
      jQuery('select').selectpicker();
      /* } */
    })(jQuery);
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

  logout() {
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

  sidebarMenu: any[] = []
}
