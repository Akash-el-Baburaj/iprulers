import { Component } from '@angular/core';
declare  var jQuery:  any;

@Component({
  selector: 'app-events3',
  templateUrl: './events3.component.html',
  styleUrls: ['./events3.component.css']
})
export class Events3Component {
  ngOnInit(): void {
		(function ($) {
			jQuery('.blog-carousel').owlCarousel({
				loop:true,
				autoplaySpeed: 1000,
				navSpeed: 1000,
				paginationSpeed: 1000,
				slideSpeed: 1000,
				smartSpeed: 1000,
				autoplay: 1000,
				margin:30,
				nav:true,
				dots: false,
				navText: ['<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>'],
				responsive:{
					0:{
						items:1
					},
					480:{
						items:2
					},			
					991:{
						items:2
					},
					1000:{
						items:3
					}
				}
			});
		})(jQuery);
	}
}
