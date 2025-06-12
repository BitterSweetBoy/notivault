import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTokenDetailsComponent } from './api-token-details.component';

describe('ApiTokenDetailsComponent', () => {
  let component: ApiTokenDetailsComponent;
  let fixture: ComponentFixture<ApiTokenDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTokenDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiTokenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
