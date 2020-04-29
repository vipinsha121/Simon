import {
  Component,
  OnInit,
  HostBinding,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { RxStompService } from '@stomp/ng2-stompjs';


@Component({
  selector: 'inbox-section',
  templateUrl: './inbox-section.component.html',
  styleUrls: ['./inbox-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class inboxSectionComponent implements OnInit {

  @Input() menu: Array<Inbox>;


  constructor(private localStorageService: LocalstorageService) { }

  ngOnInit(): void { }

  showInbox(inbox: Inbox) {
    if (inbox) {
      this.menu.forEach(inb => {
        if(inb.id != inbox.id) {
          inb.active = false
        }
      })
      inbox.active = true;
    }
    this.localStorageService.addInboxToStore(inbox);
  }
}
