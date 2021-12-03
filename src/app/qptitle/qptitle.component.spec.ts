import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QptitleComponent } from './qptitle.component';

describe('QptitleComponent', () => {
  let component: QptitleComponent;
  let fixture: ComponentFixture<QptitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QptitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QptitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
