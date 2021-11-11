import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";


export interface AuthResponseData{
    idToken:string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean
  }



@Injectable({
    providedIn:'root'
})
export class AuthService {
    constructor(private http: HttpClient,
                private router: Router){}
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    signUp(email: string, password: string){
        return  this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCddvnuHJSlDtXcL1apnb_ca9gNkSi3ps0',
                        {
                            email,
                            password,
                            returnSecureToken: true
                        }).pipe(
                            catchError(this.errorHandler)
                        );
    }

    signIn(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCddvnuHJSlDtXcL1apnb_ca9gNkSi3ps0',
                        {
                            email,
                            password,
                            returnSecureToken: true
                        }).pipe(catchError(this.errorHandler), tap( resData =>{
                            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                        }));
    }

    autoLogin(){
        const userData:{
            id: string,
            email: string,
            _token: string,
            _tokenExpirationDate:string
        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData){
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

        if(loadedUser.token){
            this.user.next(loadedUser);
            const expireDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expireDuration);
        }

    }



    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
    }


    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration);
    }

    private handleAuthentication(email: string, id: string, token: string, expiresIn: number){
        const expireDate = new Date(new Date().getTime() + +expiresIn*1000);
        const user = new User(email, id, token, expireDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private errorHandler(errorRes: HttpErrorResponse){
        let errorMessage = 'An unknown error occurred!';
        if(!errorRes.error||!errorRes.error.error){
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted!';            
                break;
                          
            case 'INVALID_PASSWORD':
                errorMessage ='The password is invalid or the user does not have a password!';
                break;
                          
            case 'USER_DISABLED':
                errorMessage ='The user account has been disabled by an administrator!';
                break;
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account!';            
                break;
      
            case 'OPERATION_NOT_ALLOWED':
                errorMessage ='Password sign-in is disabled for this project';
                break;
      
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage ='We have blocked all requests from this device due to unusual activity. Try again later.';
                break;
            default:
                break;
        }
        return throwError(errorMessage);
    }
}