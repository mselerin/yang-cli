import { TestBed, inject } from '@angular/core/testing';

import { <%=classify_name%>Service } from './<%=dasherize_name%>.service';

describe('<%=classify_name%>Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [<%=classify_name%>Service]
        });
    });

    it('should be created', inject([<%=classify_name%>Service], (service: <%=classify_name%>Service) => {
        expect(service).toBeTruthy();
    }));
});
