import React from 'react'
import Signup from "./components/signup"
import Dashboard from "./components/dashboard"
import Login from "./components/login"
import Home from "./components/home"

const routes = [
    {
      path : '/',
      exact : true,
      main : () => <Home />
    },
    {
      path : '/dashboard',
      exact : true,
      main : ({location}) => <Dashboard location={location}/>
    },
    {
      path : '/signup',
      exact : false,
      main : ({location}) => <Signup location={location} />
    },
    {
      path : '/login',
      exact : false,
      main : ({location}) => <Login location={location} />
    }
];

export default routes;
