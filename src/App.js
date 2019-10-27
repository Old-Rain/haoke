// App.js相当于Vue的App.vue

import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <Router>
      <div className="App">

        {/* Redirect 重定向组件 实现默认首页的功能 */}
        <Route exact path="/" render={() => (<Redirect to="/home" />)} />
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
      </div>
    </Router>
  )
}

export default App
