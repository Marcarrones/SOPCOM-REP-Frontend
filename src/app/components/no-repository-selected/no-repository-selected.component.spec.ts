import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRepositorySelectedComponent } from './no-repository-selected.component';

describe('NoRepositorySelectedComponent', () => {
  let component: NoRepositorySelectedComponent;
  let fixture: ComponentFixture<NoRepositorySelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoRepositorySelectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRepositorySelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
