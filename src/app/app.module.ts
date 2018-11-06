import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule } from '@angular/material';
import { DirectoryComponent } from './navigation/directory/directory.component';
import { DirectoryService } from './services/directory.service';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './navigation/home/home.component';
import { NewsComponent } from './navigation/news/news.component';
import { UploadComponent } from './navigation/upload/upload.component';
import { AboutComponent } from './navigation/about/about.component';
import { AccountService } from './services/account.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DirectoryComponent,
    HomeComponent,
    NewsComponent,
    UploadComponent,
    AboutComponent
  ],
  imports: [
    InfiniteScrollModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'Home', component: HomeComponent},
      { path: 'Directory', component: DirectoryComponent},
      { path: 'News', component: NewsComponent},
      { path: 'Upload', component: UploadComponent},
      { path: 'About', component: AboutComponent},
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [AccountService, DirectoryService, {provide: LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
