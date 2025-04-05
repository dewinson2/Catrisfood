import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionMenuComponent } from './navegacion-menu.component';

describe('NavegacionMenuComponent', () => {
  let component: NavegacionMenuComponent;
  let fixture: ComponentFixture<NavegacionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegacionMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegacionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
