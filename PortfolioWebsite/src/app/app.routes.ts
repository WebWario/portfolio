import {Routes} from '@angular/router';
import { ProjectsComponent } from './pages/projects/projects.component';
import {TxtFieldComponent} from './components/txt-field/txt-field.component';
import {TxtFieldResolver} from './pages/projects/txt-field-resolver';


export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [{
      path: ':id',
      component: TxtFieldComponent,
      resolve: {txtFieldData : TxtFieldResolver}
    }],
  },
  {
    path: '**',
    component: ProjectsComponent,
  }
];
