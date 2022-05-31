import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterionDetailComponent } from './criterion-detail.component';

describe('CriterionDetailComponent', () => {
  let component: CriterionDetailComponent;
  let fixture: ComponentFixture<CriterionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriterionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
