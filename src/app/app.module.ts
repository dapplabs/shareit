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
import { MatToolbarModule, MatOptionModule, MatFormFieldModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatSelectModule, MatPaginatorModule, MatTreeModule, MatTooltipModule, MatTabsModule, MatTableModule, MatStepperModule, MatSortModule, MatSnackBarModule, MatSlideToggleModule, MatSliderModule, MatRippleModule, MatRadioModule, MatProgressSpinnerModule, MatProgressBarModule, MatNativeDateModule, MatInputModule, MatExpansionModule, MatDividerModule, MatDialogModule, MatDatepickerModule, MatChipsModule, MatCheckboxModule, MatButtonToggleModule, MatBottomSheetModule, MatBadgeModule, MatAutocompleteModule } from '@angular/material';
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
import { PlayComponent } from './navigation/play/play.component';
import { MatVideoModule } from 'mat-video';
import { ReactiveFormsModule } from '@angular/forms';

//Translate dependencies
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LoadingBarModule } from '@ngx-loading-bar/core';


export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,'./assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DirectoryComponent,
    HomeComponent,
    NewsComponent,
    UploadComponent,
    AboutComponent,
    PlayComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatAutocompleteModule,
    MatIconModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    InfiniteScrollModule,
    MatVideoModule,
    BrowserModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule,
    AppRoutingModule,
    MatOptionModule,
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
      { path: '', component: DirectoryComponent },
      { path: 'Home', component: HomeComponent },
      { path: 'Directory', component: DirectoryComponent },
      { path: 'News', component: NewsComponent },
      { path: 'Upload', component: UploadComponent },
      { path: 'About', component: AboutComponent },
      { path: 'Play/:author/:permlink', component: PlayComponent },
      { path: '**', redirectTo: '' }
    ]),
    LoadingBarModule
  ],
  providers: [AccountService, DirectoryService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
