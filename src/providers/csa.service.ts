import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable() 
export class CsaService {
    
    http:               any;
    strAuthUrl:         string;
    strToken:           string;
    strUserName:        string
    strPassword:        string;
    strWebServiceUrl:   string;

    constructor( http:Http ) {
        this.http = http;
        this.strAuthUrl         = 'http://csc-crowddynamics.com/csa/login/token.php?service=moodle_mobile_app';
        this.strWebServiceUrl   = 'http://csc-crowddynamics.com/csa/webservice/rest/server.php?&moodlewsrestformat=json';
    }
    
    handleInit() {

        this.strUserName = 'cv.raman';
        this.strPassword = 'Password@12345';

        return this.http
            .post( this.strAuthUrl + '&username=' + this.strUserName + '&password=' + this.strPassword )
            .map( objResponse => objResponse.json() );
    }

    handleStoreToken( strToken )  {
        this.strToken = strToken; 
        console.log( this.strToken );
    }

    handleGetAllCourses( strToken ) {
        return this.http
        .post( this.strWebServiceUrl + '&wstoken=' + strToken + '&wsfunction=core_course_get_courses_by_field' )
        .map( res => res.json() );         
    }

    handleGetCourseById( strToken, intCourseId ) {
        return this.http
            .post( this.strWebServiceUrl + '&wstoken=' + strToken + '&courseid=' + intCourseId + '&wsfunction=core_course_get_contents' )
            .map( objResponse => objResponse.json() );     
    }

    handleGetUsersData( strToken ) {
        return this.http
            .post( this.strWebServiceUrl + '&wstoken=' + strToken + '&values[]=' + this.strUserName + '&wsfunction=core_user_get_users_by_field&field=username' )
            .map( objResponse => objResponse.json() );     
    }

    handleGetAllEnrolledCoursesByUserId( strToken, intUserid ) {
        return this.http
            .post( this.strWebServiceUrl + '&wstoken=' + strToken + '&userid=' + intUserid + '&wsfunction=core_enrol_get_users_courses' )
            .map( objResponse => objResponse.json() );  
    }
}

