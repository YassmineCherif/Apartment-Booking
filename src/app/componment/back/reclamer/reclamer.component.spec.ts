import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamerComponent } from './reclamer.component';

describe('ReclamerComponent', () => {
  let component: ReclamerComponent;
  let fixture: ComponentFixture<ReclamerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamerComponent]
    });
    fixture = TestBed.createComponent(ReclamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
