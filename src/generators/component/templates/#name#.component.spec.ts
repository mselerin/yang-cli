import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { <%=classify_name%>Component } from './<%=dasherize_name%>.component';

describe('<%=classify_name%>Component', () => {
    let component: <%=classify_name%>Component;
    let fixture: ComponentFixture<<%=classify_name%>Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ <%=classify_name%>Component ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(<%=classify_name%>Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
