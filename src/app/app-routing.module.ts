import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared/common/auth/auth.guard';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: '**', redirectTo: ''
    },
    {
      path: '',
      loadChildren: 'src/app/main/main.module#MainModule', // Lazy load main module
      data: { preload: true }
    }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
