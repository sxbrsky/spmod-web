import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import { Header } from '../Header'
import { Footer } from '../Footer'
import { Home } from '../Home'
import { Builds } from '../Builds'

import './app.scss'

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className='content'>
        <Route exact path='/' component={Home} />
        <Route exact path='/builds/:id' component={Builds} />
      </div>
      <Footer />
    </BrowserRouter>
  )
}
