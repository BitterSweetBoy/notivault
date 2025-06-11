import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApiTokenComponent } from './add-api-token.component';

describe('AddApiTokenComponent', () => {
  let component: AddApiTokenComponent;
  let fixture: ComponentFixture<AddApiTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddApiTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApiTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
