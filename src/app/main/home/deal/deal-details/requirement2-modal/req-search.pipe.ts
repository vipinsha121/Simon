import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reqSearch'
})
export class Requirement2SearchPipe implements PipeTransform {

  itemslength: number = 0;
  transform(items: any, filter: any, defaultFilter: boolean): any {
    this.itemslength = items.length;
    if (!filter) {
      return items;
    }
    if ((filter.assignedTo) && (filter.assignedToFullName) && (filter.name) && (filter.type) && (filter.statusDescription)) {
      items = [];
      items = filter.totalItems;
      if (!Array.isArray(items)) {
        return items;
      }
      if (filter && Array.isArray(items)) {
        let filterKeys = Object.keys(filter);

        if (defaultFilter) {
          return items.filter(item =>
            filterKeys.reduce((x, keyName) =>
              (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true)).slice(0, this.itemslength);
        }
        else {
          return items.filter(item => {
            return filterKeys.some((keyName) => {
              if (keyName == 'displayValue') {
                var array = item.attachedRequirements.map(({ displayValue, statusDescription }) => ({ displayValue, statusDescription }))
                return JSON.stringify(array).toLowerCase().includes(filter[keyName]);
              }
              else {
                return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
              }
            });
          }).slice(0, this.itemslength);
        }
      }
    }
    else { return items; }
  }

}
