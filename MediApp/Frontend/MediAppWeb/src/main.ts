import { enableProdMode, importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import 'hammerjs';
import { platformBrowser } from '@angular/platform-browser';
// Import compiler if using JIT compilation
import '@angular/compiler';

if (environment.production) {
  enableProdMode();
}

// Use the platformBrowser function (recommended for Angular 20)
platformBrowser().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Alternative: Standalone component approach (commented for future reference)
// bootstrapApplication(AppComponent, {
//   providers: [
//     importProvidersFrom(AppModule)
//   ]
// }).catch(err => console.error(err));