import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaneTokenConfigComponent } from './plane-token-config.component';

describe('PlaneTokenConfigComponent', () => {
  let component: PlaneTokenConfigComponent;
  let fixture: ComponentFixture<PlaneTokenConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneTokenConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaneTokenConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
