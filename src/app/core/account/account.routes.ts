import { Routes } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component"
import { RegisterPageComponent } from "./pages/register-page/register-page.component";

const routes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: 'register',
        component: RegisterPageComponent
    }
]

export default routes;