import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodChunkListComponent } from './method-chunk-list.component';

describe('MethodChunkListComponent', () => {
  let component: MethodChunkListComponent;
  let fixture: ComponentFixture<MethodChunkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodChunkListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodChunkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
