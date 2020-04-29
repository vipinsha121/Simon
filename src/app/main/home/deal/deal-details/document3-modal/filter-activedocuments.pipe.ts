import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'activeDocuments' })
export class SearchActiveDocuments implements PipeTransform {
    transform(items: any, filter: any): any {
        if (!filter) {
            return items;
        }
        if (!Array.isArray(items)) {
            return items;
        }
        if (filter && Array.isArray(items)) {
            return items.filter(item => {
                return item.active == true;
            });
        }

    }
}
