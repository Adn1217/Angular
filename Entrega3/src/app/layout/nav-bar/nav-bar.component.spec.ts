import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavBarComponent } from './nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

describe('NavBarComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [RouterTestingModule, MatToolbarModule, MatIconModule],
        declarations: [NavBarComponent],
        providers: [MatToolbarModule, MatIconModule]
    }))

    it('should create the navBar', () => {
        const fixture = TestBed.createComponent(NavBarComponent);
        const navBar = fixture.componentInstance;

        expect(navBar).toBeTruthy();
    })
    
    it(`should have initial title empty`, () => {
        const fixture = TestBed.createComponent(NavBarComponent);
        const navBar = fixture.componentInstance;

        expect(navBar.title).toEqual('');
    })
    
    it(`should have initial auth user emtpy`, () => {
        const fixture = TestBed.createComponent(NavBarComponent);
        const navBar = fixture.componentInstance;

        expect(navBar.authUserEmail).toEqual('');
    })
    
    it(`should render initial title empty`, () => {
        const navBar = TestBed.createComponent(NavBarComponent);
        navBar.detectChanges();
        const compiled = navBar.nativeElement as HTMLElement;

        expect(compiled.querySelector('.toolBar span')?.textContent).toBe('');
    })
    
    it(`if menu is clicked, the icon and side-nav property have to change accordingly `, () => {
        const fixture = TestBed.createComponent(NavBarComponent);
        const navBar = fixture.componentInstance;
        navBar.changeSideNav();

        expect(navBar.sideBarOpen).toBeTruthy();
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('div span mat-icon')?.textContent).toBe('expand_more');
    })
})
