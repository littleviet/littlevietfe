import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  menuOpen: boolean = false;
  numberOfPeople = Array(15).fill(0);
  hours = ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00"];
  
  constructor() { }

  ngOnInit() {
  }

  clickBtn() {
    this.menuOpen = !this.menuOpen;
  }

}
