import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { Ng2PaginationModule } from 'ng2-pagination';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MaterializeDirective } from 'angular2-materialize';
import { AppComponentService } from './app.component.service';
import { FileDropModule } from "angular2-file-drop";
import { RatingModule } from "ngx-rating";


import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { STORES_DECLARATIONS } from './stores';
import { SHARED_DECLARATIONS } from './shared';
import { AUTH_DECLARATIONS } from "./auth/index";
import { MENU_DECLARATIONS } from './menu/index';
import { HOME_DECLARATIONS } from './home/index';


 
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AccountsModule,
    Ng2PaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDaeL6AHMfBLvCTLvQV-qeaa4YkvAkqBfk',
      libraries: ['places'] 
    }),
    InfiniteScrollModule,
    FileDropModule,
    RatingModule
  ],
  declarations: [
    AppComponent,
    STORES_DECLARATIONS,
    SHARED_DECLARATIONS,
    AUTH_DECLARATIONS,
    MENU_DECLARATIONS,
    HOME_DECLARATIONS,
    MaterializeDirective
  ],
  providers : [
    ROUTES_PROVIDERS,
    AppComponentService
  ],
  bootstrap: [
    AppComponent
    
  ]
})
export class AppModule {}