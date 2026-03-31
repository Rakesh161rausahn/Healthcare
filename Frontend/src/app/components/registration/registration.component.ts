import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery'
import { Doctor } from 'src/app/models/doctor';
import { User } from 'src/app/models/user';
import { DoctorService } from 'src/app/services/doctor.service';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {

  user = new User();
  doctor = new Doctor();
  msg = '';

  constructor(private _registrationService : RegistrationService, private _doctorService : DoctorService, private _router : Router) { }

  ngOnInit(): void
  {
    $(".nav1").addClass("highlight1")
    $("#home-tab").click(function(){
      $("#profile").hide();
      $("#home").show();
      $(".nav1").addClass("highlight1")
      $(".nav2").removeClass("highlight2")
    });
    $("#profile-tab").click(function(){
      $("#home").hide();
      $("#profile").show();
      $(".nav2").addClass("highlight2")
      $(".nav1").removeClass("highlight1")
    });
  }

  registerUser() {
    console.log('Submitting user registration', this.user);
    this._registrationService.registerUserFromRemote(this.user).subscribe({
      next: data => {
        console.log('Registration Success', data);
        sessionStorage.setItem('username', this.user.username);
        sessionStorage.setItem('gender', this.user.gender);
        this.msg = '';
        this._router.navigate(['/registrationsuccess']);
      },
      error: err => {
        console.error('Registration Failed', err);
        this.msg = '';  // Clear any previous messages
        
        // Extract error message properly - handle all cases
        try {
          if (err.status === 0) {
            this.msg = 'Cannot connect to server. Please check if backend is running on port 8081.';
          } else if (err.status === 409) {
            this.msg = `User with email ${this.user.email} already exists!`;
          } else if (err.status === 500) {
            // Check for database-related errors
            const errorStr = JSON.stringify(err.error || err);
            if (errorStr.includes('SQLGrammarException') || errorStr.includes('could not extract ResultSet')) {
              this.msg = 'Database error: Please ensure the database tables are created. Check backend console and verify spring.jpa.hibernate.ddl-auto is set to "create-drop" or "update".';
            } else if (errorStr.includes('could not execute statement')) {
              this.msg = 'Database error: Unable to save data. Please check database connection and table structure.';
            } else {
              this.msg = 'Server error occurred. Please check backend logs for details.';
            }
          } else if (typeof err.error === 'string' && err.error.trim() !== '') {
            this.msg = err.error;
          } else if (err.error?.message && typeof err.error.message === 'string') {
            this.msg = err.error.message;
          } else if (err.message && typeof err.message === 'string') {
            this.msg = err.message;
          } else if (err.statusText && typeof err.statusText === 'string') {
            this.msg = `Registration failed: ${err.statusText}`;
          } else {
            this.msg = 'Registration failed. Please check your details and try again.';
          }
        } catch (e) {
          this.msg = 'Registration failed. Please try again.';
        }
        
        console.log('Error message set to:', this.msg);
      }
    });
  }

  registerDoctor() {
    console.log('Submitting doctor registration', this.doctor);
    this._registrationService.registerDoctorFromRemote(this.doctor).subscribe({
      next: data => {
        console.log('Doctor Registration Success', data);
        sessionStorage.setItem('doctorname', this.doctor.doctorname);
        sessionStorage.setItem('gender', this.doctor.gender);
        this.msg = '';
        this._router.navigate(['/registrationsuccess']);
      },
      error: err => {
        console.error('Doctor Registration Failed', err);
        this.msg = '';  // Clear any previous messages
        
        // Extract error message properly - handle all cases
        try {
          if (err.status === 0) {
            this.msg = 'Cannot connect to server. Please check if backend is running on port 8081.';
          } else if (err.status === 409) {
            this.msg = `Doctor with email ${this.doctor.email} already exists!`;
          } else if (typeof err.error === 'string' && err.error.trim() !== '') {
            this.msg = err.error;
          } else if (err.error?.message && typeof err.error.message === 'string') {
            this.msg = err.error.message;
          } else if (err.message && typeof err.message === 'string') {
            this.msg = err.message;
          } else if (err.statusText && typeof err.statusText === 'string') {
            this.msg = `Registration failed: ${err.statusText}`;
          } else {
            this.msg = 'Registration failed. Please check your details and try again.';
          }
        } catch (e) {
          this.msg = 'Registration failed. Please try again.';
        }
        
        console.log('Error message set to:', this.msg);
      }
    });
  }

}
