import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondReservationComponent } from './respond-reservation.component';

describe('RespondReservationComponent', () => {
  let component: RespondReservationComponent;
  let fixture: ComponentFixture<RespondReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RespondReservationComponent]
    });
    fixture = TestBed.createComponent(RespondReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
