import { Component, OnInit, Input } from '@angular/core';
import { DealDto, DealServiceProxy,UserServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';

@Component({
    selector: 'events-modal',
    templateUrl: './events-modal.component.html',
    styleUrls: ['./events-modal.component.scss']
})
export class EventModalComponent implements OnInit {

    eventscount: number = 1;
    @Input() currentDeal: any;
    events : Array<any> = [];

    constructor(private dealService: DealServiceProxy,
    private userService: UserServiceProxy
    ,private store: Store<AppState>) 
    {

         store.select(state => state.deal).subscribe(result => {
            this.currentDeal = result.filter(x => x.active == true)[0];
        });

     }
   
    ngOnInit() {
        this.dealService.getDealEvents(this.currentDeal.dealId).subscribe(data => {
            this.events = data;
               this.userService.getUserProfileImageUrl().subscribe( url => {
                        this.events.forEach(e => {
                            if (url != null && e.assignedUser != null) {
                                e.userProfileImage = url.replace('@UserID', e.assignedUser);
                            }
                        })
                    });
        });
    }

}
