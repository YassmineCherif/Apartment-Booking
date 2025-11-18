import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondreclamationComponent } from './respondreclamation.component';

describe('RespondreclamationComponent', () => {
  let component: RespondreclamationComponent;
  let fixture: ComponentFixture<RespondreclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RespondreclamationComponent]
    });
    fixture = TestBed.createComponent(RespondreclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
