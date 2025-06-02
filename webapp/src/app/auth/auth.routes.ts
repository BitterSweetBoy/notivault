import { Routes } from "@angular/router";
import loginComponent from "./components/login/login.component";
import registerComponent from "./components/register/register.component";


export default [
  {
    path: 'register',
    loadComponent: () => registerComponent
  },
  {
    path: 'login',
    loadComponent: () => loginComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
] as Routes