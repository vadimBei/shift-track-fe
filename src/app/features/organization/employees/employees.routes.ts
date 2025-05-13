import { Routes } from "@angular/router";
import {ContactsPageComponent} from "./pages/contacts-page/contacts-page.component";

const routes: Routes = [
    { path: 'contact-list', component: ContactsPageComponent, pathMatch: 'full' }
]

export default routes;
