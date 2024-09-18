import { Routes } from "@angular/router";
import { PhonesPageComponent } from "./pages/phones-page/phones-page.component";

const routes: Routes = [
    { path: 'contact-list', component: PhonesPageComponent, pathMatch: 'full' }
]

export default routes;