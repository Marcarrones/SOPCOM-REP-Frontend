import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodChunkComponent } from './method-chunk.component';

describe('MethodChunkComponent', () => {
  let component: MethodChunkComponent;
  let fixture: ComponentFixture<MethodChunkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodChunkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodChunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
