import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemePreviewComponent } from './theme-preview/theme-preview.component';
import { ThemeBuilderComponent } from './theme-builder/theme-builder.component';

const routes: Routes = [
  { path: 'preview', pathMatch: 'full', component: ThemePreviewComponent },
  { path: '', component: ThemeBuilderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
