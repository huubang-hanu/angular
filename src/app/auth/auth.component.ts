import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  onSwitchMode(){
    this.isLoginMode  = !this.isLoginMode;
  }

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver:  ComponentFactoryResolver) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){
    this.isLoading = true;
    if(!form.valid){
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode){
      authObs = this.authService.signIn(email, password);

    }else{
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(
      resData =>{
        console.log(resData);
        this.isLoading=false;
        this.router.navigate(['/recipes'])
      },
      errorMessage =>{
        console.log(errorMessage);
        // this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    )
    form.reset();
  }

  onHandleError(){
    this.error = null;
  }

  private showErrorAlert(message: string){
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver
                                .resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const compRef = hostViewContainerRef.createComponent(alertCmpFactory);
    compRef.instance.message = message;
    this.closeSub = compRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear()
    });
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }
}

