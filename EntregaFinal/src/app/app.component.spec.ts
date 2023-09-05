import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';


describe('AppComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [AppComponent]
    }))

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;

        expect(app).toBeTruthy();
    })
    
    it(`should have as title 'Entrega 3'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;

        expect(app.title).toEqual('Entrega 3');
    })
    
})
