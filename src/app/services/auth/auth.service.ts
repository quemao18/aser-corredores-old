import { Injectable, NgZone } from '@angular/core';
import { User } from "../user/user";
// import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../notification/notification.service';

import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagingService } from '../notification/messaging.service';
import { NavbarComponent } from 'app/shared/navbar/navbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  userDataAuth: any; // Save logged in user data
  isAdmin: boolean = false;
  userDB: any ;
  userLogged: any = null;
  userExist: boolean = false;
  token: any;
  tokenFCM: any;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public notification: NotificationService,
    public spinner: NgxSpinnerService,
    private http: HttpClient,
    private messagingService: MessagingService,
    // private navbarComponent: NavbarComponent,
    private modalService: NgbModal
  ) {    
      // this.checkAuthFirebase();
  }

  generateHeaders() {
    console.log(this.getAccessToken());
    const headers = new HttpHeaders( { authorization: `Bearer ${this.getAccessToken()}` } );
    return headers;
  }

  getAccessToken() {
    return (localStorage.getItem('access_token'));
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    this.spinner.show();
    return await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async (result) => { 
        await result.user.getIdToken(false).then((token: any) => this.token = token); 
        await this.getUserDBApi(result.user);
        await this.saveUserDBApi(result.user);
        this.modalService.dismissAll();
        this.spinner.hide();
      }).catch((error) => {
        this.spinner.hide();
        this.notification.showNotification('top', 'center', 'danger', 'fa-exclamation-triangle', '¡Usuario o password inválido!');
      })
  }

  // Sign up with email/password
  async signUp(email: string, password: string) {
    try {
      this.spinner.show();
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      /* Call the SendVerificaitonMail() function when new user sign
      up and returns promise */
      this.notification.showNotification('top', 'center', 'success', 'check', '¡Registro exitoso, verifica tu Email!');
      this.sendVerificationMail();
      await result.user.getIdToken(false).then((token: any) => this.token = token); 
      await this.saveUserDBApi(result.user);
      this.spinner.hide();
      this.modalService.dismissAll();

    }
    catch (error) {
      // window.alert(error.message);
      this.spinner.hide();
      this.notification.showNotification('top', 'center', 'danger', 'fa-exclamation-triangle', 'El usuario ya existe...');

    }
  }

  // Send email verfificaiton when new user sign up
  async sendVerificationMail() {
    return await firebase.auth().currentUser.sendEmailVerification()
    .then(() => {
      // this.router.navigate(['verify-email-address']);
      // this.navbarComponent.close();
      this.notification.showNotification('top', 'center', 'success', 'check', 'Revisa tu Email para continuar...');
      this.router.navigate(['/login']);
    })
  }

  // Reset Forggot password
  async forgotPassword(passwordResetEmail: string) {
    this.spinner.show();
    return await firebase.auth().sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      // window.alert('Password reset email sent, check your inbox.');
      this.spinner.hide();
      // this.navbarComponent.close();
      this.notification.showNotification('top', 'center', 'success', 'check', 'Revisa tu Email para continuar...');
      this.router.navigate(['/login']);
    }).catch((error) => {
      // window.alert(error)
      this.spinner.hide();
      // this.navbarComponent.close();
      this.notification.showNotification('top', 'center', 'danger', 'fa-exclamation-triangle', error);
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
      // return (user !== null && user.emailVerified !== false && this.user.isAdmin !== false) ? true : false;
    return (this.getUserLoggedIn() === null) ? false : true;
  }

  get isAdmindIn(): boolean { 
      // return (user !== null && user.emailVerified !== false && this.user.isAdmin !== false) ? true : false;
    // console.log(this.getUserLoggedIn());
    return (this.getUserLoggedIn() !== null && this.getUserLoggedIn().isAdmin === true) ? true : false;
  }

  get isWaiterdIn(): boolean { 
    // return (user !== null && user.emailVerified !== false && this.user.isAdmin !== false) ? true : false;
  // console.log(this.getUserLoggedIn());
  return (this.getUserLoggedIn() !== null && this.getUserLoggedIn().isWaiter === true) ? true : false;
}

  // Sign in with Google
  async googleAuth() {
    return await this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Sign in with Facebook
  async facebookAuth() {
    return await this.authLogin(new firebase.auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  async authLogin(provider: firebase.auth.AuthProvider) {
    // this.spinner.show();
    return await firebase.auth().signInWithPopup(provider)
    .then(async (result) => {
      // this.spinner.hide();
      await result.user.getIdToken(false).then((token: any) => this.token = token);
      await this.getUserDBApi(result.user);
      this.saveUserDBApi(result.user);
      this.spinner.hide();
      // this.modalService.dismissAll();
    }).catch((error) => {
      // window.alert(error)
      console.log(error);
      this.spinner.hide();
      // this.navbarComponent.close();
      this.notification.showNotification('top', 'center', 'danger', 'fa-exclamation-triangle', 'Error, intenta nuevamente.');
    })
  }


  async saveUserDBApi(user: any) {
    
    setTimeout(async() => {
    console.log(this.messagingService.getTokenFCM())
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      tokenFCM: this.messagingService.getTokenFCM()
    };

      if(!this.userExist)
        await this.http.post(environment.apiUrl+'/users/',
          userData, 
          { headers: this.generateHeaders() }
        )
        .toPromise().then(
          res => console.log(res)
        );
      else
        await this.http.put(environment.apiUrl+'/users/' + userData.email, 
          userData,
          { headers: this.generateHeaders() }
        )
        .toPromise().then(
          res => console.log(res)
        );
    }, 500);
  }

  async getUserDBApi(userData: any) {
    this.spinner.show();
    return await this.http.get(environment.apiUrl+'/users/' + userData.email)
    .toPromise().then(
      async (doc: any) => {
        this.userExist = true;
        this.setUserLoggedIn(doc.data);
        if(doc.data.isAdmin){
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        }else
        if(doc.data.isWaiter){
          this.ngZone.run(() => {
            this.router.navigate(['/waiter']);
          });
        }else
        this.ngZone.run(() => {
        this.notification.showNotification('top', 'center', 'warning', 'fa-exclamation-triangle', '¡No tienes permitido el accesso!' );
        this.spinner.hide(); 
        });
      }
    ).catch(
      (err) => {
        console.log(err);
        this.spinner.hide();
        this.userExist = false;
        console.log("No such document!");
        this.notification.showNotification('top', 'center', 'warning', 'fa-exclamation-triangle', '¡No tienes permitido el accesso!' );
        this.signOut();
      }
    );
  }

  getUserLoggedIn() {
    return JSON.parse(localStorage.getItem('user'));
    // return this.isUserLoggedIn;
  }

  setUserLoggedIn(data: firebase.firestore.DocumentData) { 
    // localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('access_token', this.token);

  }

  checkAuthFirebase() {
    console.log('check')
    if(this.getUserLoggedIn())
    this.getUserDBApi(this.getUserLoggedIn())
  }

  removeUserLocalStore(){
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('fcm_token');
  }
  // Sign out 
  async signOut() {
    this.spinner.show();
    await firebase.auth().signOut().then(() => {
      this.ngZone.run(() => {
        setTimeout(() => {
          console.log('signOut')
          this.removeUserLocalStore();
          this.spinner.hide();
          // this.router.navigateByUrl('/login');
          // location.reload(true);
        }, 500);
      });
    }).catch(function(error) {
      console.log(error);
      this.notification.showNotification('top', 'center', 'warning', 'fa-exclamation-triangle', error );
    });;
  }

}