import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showActiveReq' })
export class FilterReqbyStage implements PipeTransform {
    filteredRequirement = [];
    transform(items: any, filter: any): any {
        if (!filter) {
            return items;
        }
        if (!Array.isArray(items)) {
            return items;
        }
        if (filter && Array.isArray(items)) {

            this.filteredRequirement = [];
            items.forEach(data => {
                if (filter.openreq && filter.openreq == true && data.complete != true) {
                    return this.filteredRequirement.push(data);

                }
                else if (filter.attentionreq && filter.attentionreq == true && data.isAttention == true) {
                    return this.filteredRequirement.push(data);

                }
                else if (filter.closereq && filter.closereq == true && (data.apReqNeededforclosing == true || data.coProcessNeededforclosing == true)) {
                    return this.filteredRequirement.push(data);

                }
                else if (filter.hardstopreq && filter.hardstopreq == true && data.hardstop == true && data.statusType == "A") {
                    return this.filteredRequirement.push(data);

                }
            })
            if (!filter.openreq && !filter.attentionreq && !filter.closereq && !filter.hardstopreq) {
                return items = items;
            }
            else {
                return items = this.filteredRequirement;
            }

        }
    }
}