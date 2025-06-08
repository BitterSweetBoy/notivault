import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MattermostTokenConfigComponent } from './mattermost-token-config.component';

describe('MattermostTokenConfigComponent', () => {
  let component: MattermostTokenConfigComponent;
  let fixture: ComponentFixture<MattermostTokenConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MattermostTokenConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MattermostTokenConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
