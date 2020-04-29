import { Inbox } from 'src/app/shared/models/inbox.model';
import { Deal } from 'src/app/shared/models/deal.model';
import { SelectedMenuModel } from './menu.model';
import { UserFullProfileDto } from '../services/service-proxy/service-proxies';
import { Permission } from 'src/app/shared/models/permission.model';

export interface AppState {
  readonly inbox: Inbox[];
  readonly recentMenu: SelectedMenuModel;
  readonly deal: Deal[];
  readonly selectedMenu: SelectedMenuModel;
  readonly currentUser: UserFullProfileDto
  readonly permissions: Permission[] ;
}