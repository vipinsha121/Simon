import { Injectable  } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AdalService } from 'ng2-adal/dist/core';

@Injectable()

export class LoggedInGuard implements CanActivate{
    constructor(private adalService : AdalService,private router : Router)
    {

    }

    canActivate()
    {
        if(this.adalService.userInfo.isAuthenticated)
        {return true;}
        else
        {return false;}
    }
}

