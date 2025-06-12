import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTokenRowComponent } from './api-token-row.component';

describe('ApiTokenRowComponent', () => {
  let component: ApiTokenRowComponent;
  let fixture: ComponentFixture<ApiTokenRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTokenRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiTokenRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
