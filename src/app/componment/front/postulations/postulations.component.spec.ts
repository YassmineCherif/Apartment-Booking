import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulationsComponent } from './postulations.component';

describe('PostulationsComponent', () => {
  let component: PostulationsComponent;
  let fixture: ComponentFixture<PostulationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostulationsComponent]
    });
    fixture = TestBed.createComponent(PostulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
