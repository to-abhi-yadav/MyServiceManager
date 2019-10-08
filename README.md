# My Service Manager
Angular 7 Front-End interacts with a backend API written in Python

This project was generated with [Angular CLI](https://github.com/angular/angular-cli)

## Install

```
$ npm install
```

```

### Development Server

```
$ nodemon
```

## Structure

This Angular app follows the feature-folder convention, where every folder is intended to be a standalone feature with its own Component, Template, Services, Styles, and Tests all together and similarly named. There are a few exceptions to this but Typescript is helpful with locating dependencies and what is running where.

The hierarchy of files is:

1. app.module.ts
2. app-routing.module.ts
3. app.component.ts
  - header.component.ts

From here the main 'app' component is driven from the routes, which you can see in `app-routing.module.ts`. The various features are:

- Dashboard
- Login
- Admin


There are several sub-components that support these views

Dashboard:

  - all-call-forwarding
  - anonymous-call-rejection
  - call-forwarding-busy
  - call-records
  - do-not-disturb
  - find-me-follow-me
  - selective-call-acceptance
  - selective-call-rejection
  - speed-dialing
  - unavailable-call-forwarding
  - voicemail

Admin: 

  - user-registration

## Styling

This repo uses [Bootstrap 4.1](https://getbootstrap.com/) single-purpose classes for styling most of the components throughout the site. Each class represents one (or a small handful of) CSS properties. Use [this link](https://hackerthemes.com/bootstrap-cheatsheet/) to lookup properties you want to add and what Bootstrap classes are available for you to use.

When you can't find a single-purpose class for the styling you're looking to do, it is best to add the styling in the component's individual `.scss` file, for example `transform`, `top`, `bottom`, `left`, `right`, custom `transition`s, `animation`, and so on. *NOTE*: make sure you understand how [component styling and view encapsulation](https://angular.io/guide/component-styles) works in Angular or else you may run into unexpected issues with the page.

## Creating New Components

Using `ng g <thing>` you can scaffold a number of different new pieces for the app, but some require you to add `-m app.module.ts` to the end because there are two main modules for the app. (`server.module.ts` is some boilerplate for server-side rendering of the app, which we could likely get to)

## VSCode Setup

Angular and Typescript are best edited in VSCode. If you haven't seen or heard of it, now's a great opportunity to discover it. Here are a list of Extensions used to make this repo even more enjoyable:

- Angular Language Service
- HTML CSS Support
- TSLint
- Typescript Hero
- Angular Language Service
- Angular V7 Snippets
- Angular2-inline
- ESLint
- Javascript (ES6) code snippets
- npm 
- npm intellisense
- path intellisense
- TSLInt (vnext)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
