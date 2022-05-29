import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementDetailComponent } from './method-element-detail.component';

describe('MethodElementDetailComponent', () => {
  let component: MethodElementDetailComponent;
  let fixture: ComponentFixture<MethodElementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodElementDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
