import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteendashboardComponent } from './canteendashboard.component';

describe('CanteendashboardComponent', () => {
  let component: CanteendashboardComponent;
  let fixture: ComponentFixture<CanteendashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanteendashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteendashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
