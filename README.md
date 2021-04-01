# PurdueChat

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Firebase Setup

1. Create a Firebase Project
2. Enable Firebase Authentication with Email/Password
3. Setup Firestore in the desired region
4. From project settings, register a wep app.
Copy and paste the firebaseConfig into the  src/environments/environment.ts.  
Example environment.ts:
```json
export const environment = {
    production: false,
    firebase: firebaseConfig,
    profileImage: defaultProfileImageUrl,
};
```
5. (optional) Configure a new Bucket
6. Setup firebase hosting using the Firebase CLI following the instructions in the Firebase Console Hosting tab. Deploy app using `firebase deploy` or `ng deploy`