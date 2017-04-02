import 'angular2-meteor-polyfills';

//import "materialize-css";
import "angular2-materialize";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './imports/app/app.module';

Meteor.startup(() => {
    const platform = platformBrowserDynamic();
    platform.bootstrapModule(AppModule);
});