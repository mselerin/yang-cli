import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: '<%=kebabName%>' })
export class <%=pascalName%>Pipe implements PipeTransform {
   transform(input: string|any): string|any {
      return input;
   }
}
