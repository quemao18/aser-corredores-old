import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeLayoutRoutes } from './home-layout.routing';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbdModalContent } from 'app/shared/navbar/navbar.component';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    NgbdModalContent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule.forChild(HomeLayoutRoutes),
  ]
})
export class HomeLayoutModule { }
