import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryModalComponent } from './repository-modal.component';

describe('RepositoryModalComponent', () => {
  let component: RepositoryModalComponent;
  let fixture: ComponentFixture<RepositoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepositoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
