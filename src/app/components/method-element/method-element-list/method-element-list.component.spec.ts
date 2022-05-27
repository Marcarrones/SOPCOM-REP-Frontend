import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementListComponent } from './method-element-list.component';

describe('MethodElementListComponent', () => {
  let component: MethodElementListComponent;
  let fixture: ComponentFixture<MethodElementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodElementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
