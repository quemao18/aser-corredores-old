import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthAdminGuard } from './services/auth/auth-admin.guard';

const routes: Routes =[
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { 
      path: '', component: HomeLayoutComponent,
      children: [
        {path: '', loadChildren: './layouts/home-layout/home-layout.module#HomeLayoutModule'},
      ]
    },
    { path: 'admin', redirectTo: 'dashboard', pathMatch: 'full', }, 
    { 
      path: '', component: AdminLayoutComponent,
      canActivate: [AuthGuard, AuthAdminGuard],
      children: [
        {path: '', loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'},
      ]
    },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true,
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
