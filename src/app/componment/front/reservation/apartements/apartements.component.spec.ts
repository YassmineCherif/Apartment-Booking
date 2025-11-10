import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartementsComponent } from './apartements.component';

describe('ApartementsComponent', () => {
  let component: ApartementsComponent;
  let fixture: ComponentFixture<ApartementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApartementsComponent]
    });
    fixture = TestBed.createComponent(ApartementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
