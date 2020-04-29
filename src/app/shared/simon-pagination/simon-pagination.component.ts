import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { pageFilter } from 'src/app/shared/models/pagefilter.model';
import { Inbox } from 'src/app/shared/models/inbox.model';



@Component({
    selector: 'simon-pagination',
    templateUrl: './simon-pagination.component.html',
    styleUrls: ['./simon-pagination.component.css']
})

export class simonPaginationComponent implements OnInit {
    @Input() pagination: pageFilter = new pageFilter();
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    currentMenu: Inbox;
    currentPageFilter: pageFilter = new pageFilter();

    ngOnInit() {
    }

    public onPageChange(changedPage): void {
        this.onChange.emit(changedPage);
    }
}