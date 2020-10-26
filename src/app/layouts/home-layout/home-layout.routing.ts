import { Routes } from '@angular/router';
import { ComponentsComponent } from 'app/components/components.component';
import { NucleoiconsComponent } from 'app/components/nucleoicons/nucleoicons.component';
import { LandingComponent } from 'app/examples/landing/landing.component';
import { ProfileComponent } from 'app/examples/profile/profile.component';
import { SignupComponent } from 'app/examples/signup/signup.component';
import { HomeComponent } from 'app/pages/home/home.component';



export const HomeLayoutRoutes: Routes = [
    { path: 'home',             component: HomeComponent },
    { path: 'home2',            component: ComponentsComponent },
    { path: 'user-profile',     component: ProfileComponent },
    { path: 'signup',           component: SignupComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'nucleoicons',      component: NucleoiconsComponent }
];
