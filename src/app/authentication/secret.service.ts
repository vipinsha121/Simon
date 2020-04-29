import { Injectable } from '@angular/core';

@Injectable()

export class SecretService{
private endpoints: any = {
'http://localhost:4200':
'https://anaradfs.ddnsking.com/'
};
// all config values should be fetched dyanmically or should be changed while releasing to live environment
    public get adalConfig() : any {
        return{
            instance: 'https://anaradfs.ddnsking.com/',
            tenant : 'adfs',
            clientId : '2f6622b8-4d4f-4f88-af39-8928ca0a5d84',
            redirectUri : window.location.origin + '/',
            postLogoutRedirectUri : window.location.origin + '/',
            response_type : 'code id_token token',
            scope: 'openid profile email voucher',
            endpoints: this.endpoints
        };
    }
}
