import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementDialogComponent } from './method-element-dialog.component';

describe('MethodElementDialogComponent', () => {
  let component: MethodElementDialogComponent;
  let fixture: ComponentFixture<MethodElementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodElementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
