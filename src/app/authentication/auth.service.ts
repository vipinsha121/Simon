import { Component } from '@angular/core';
import { AdalService } from 'ng2-adal/dist/core';
import { Injectable  } from '@angular/core';

@Injectable()

export class AuthService {

 constructor(private adalService : AdalService){

 }

public getToken(): string {
    return sessionStorage.getItem('adal.idtoken');
  }

}