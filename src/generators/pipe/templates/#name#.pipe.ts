import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: '<%=dasherize_name%>' })
export class <%=classify_name%>Pipe implements PipeTransform {
   transform(input: string|any): string|any {
      return input;
   }
}
