import { Pipe, PipeTransform } from '@angular/core';

interface Filter {
	[key: string]: boolean
}

@Pipe({
  name: 'flexibleList'
})
export class FlexibleListPipe implements PipeTransform {

	transform<T>(value: T[], fields: Filter[]): T[] { return value.filter(v => fields.every(([f, s]) => v[f] === s)) }

}
