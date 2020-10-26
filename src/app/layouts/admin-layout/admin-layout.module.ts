import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

import { NgxSpinnerModule } from 'ngx-spinner';

import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
  ],
  declarations: [


  ],
  entryComponents: [ 

  ],
})

export class AdminLayoutModule {}
