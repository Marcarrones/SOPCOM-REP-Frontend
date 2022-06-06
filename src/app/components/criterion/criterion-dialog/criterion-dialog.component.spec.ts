import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterionDialogComponent } from './criterion-dialog.component';

describe('CriterionDialogComponent', () => {
  let component: CriterionDialogComponent;
  let fixture: ComponentFixture<CriterionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriterionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
