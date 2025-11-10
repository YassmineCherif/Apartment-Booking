import { Component } from '@angular/core';

@Component({
  selector: 'app-residence',
  templateUrl: './residence.component.html',
  styleUrls: ['./residence.component.css']
})
export class ResidenceComponent {activeTab = 0;

  apartments = [
    {
      title: 'Modern Loft',
      image: '/assets/images/app1.png',
      description: 'A modern apartment in the city center with 2 bedrooms and a balcony.'
    },
    {
      title: 'Cozy Studio',
      image: '/assets/images/app2.png',
      description: 'Perfect for singles or couples, this cozy studio offers comfort and convenience.'
    },
    {
      title: 'Family Apartment',
      image: '/assets/images/app3.png',
      description: 'Spacious 3-bedroom apartment ideal for families, close to schools and parks.'
    },
     {
      title: 'Family Apartment',
      image: '/assets/images/app4.png',
      description: 'Spacious 3-bedroom apartment ideal for families, close to schools and parks.'
    },
     {
      title: 'Family Apartment',
      image: '/assets/images/app5.png',
      description: 'Spacious 3-bedroom apartment ideal for families, close to schools and parks.'
    },
     {
      title: 'Family Apartment',
      image: '/assets/images/app6.png',
      description: 'Spacious 3-bedroom apartment ideal for families, close to schools and parks.'
    },
     {
      title: 'Family Apartment',
      image: '/assets/images/Fig.png',
      description: 'Spacious 3-bedroom apartment ideal for families, close to schools and parks.'
    },
     {
      title: 'Family Apartment',
      image: '/assets/images/Fig.png',
      description: 'Spacious 3-bedroom apartment ideal for families, close to schools and parks.'
    },
     {
      title: 'Family Apartment',
      image: '/assets/images/Fig.png',
      description: 'Spacious 3-bedroom apartment ideal for families, close to schools and parks.'
    }
  ];

  selectTab(index: number) {
    this.activeTab = index;
  }

  bookApartment(name: string) {
    alert(`Booking request sent for: ${name}`);
  }

}
