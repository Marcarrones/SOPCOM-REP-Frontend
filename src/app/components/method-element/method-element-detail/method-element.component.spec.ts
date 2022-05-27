import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodElementComponent } from './method-element.component';

describe('MethodElementComponent', () => {
  let component: MethodElementComponent;
  let fixture: ComponentFixture<MethodElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
