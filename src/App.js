// App.js（根组件）相当于Vue的App.vue

import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Home from './pages/Home' // Home这种一进来就加载的组件，就不用懒加载了
// import CityList from './pages/CityList'
// import ShowMap from './pages/ShowMap'
// import Detail from './pages/Detail'
// import Login from './pages/Login'
import AuthRoute from './components/AuthRoute' // 鉴权路由及相关组件就也不做懒加载了
import MyCollect from './pages/MyCollect'
import MyRent from './pages/MyRent'
import Publish from './pages/MyRent/Publish'
import Search from './pages/MyRent/Search'
// import VirtualizedList from './pages/virtualized'

// 懒加载
const CityList = React.lazy(() => import('./pages/CityList'))
const ShowMap = React.lazy(() => import('./pages/ShowMap'))
const Detail = React.lazy(() => import('./pages/Detail'))
const Login = React.lazy(() => import('./pages/Login'))
const VirtualizedList = React.lazy(() => import('./pages/virtualized'))
function App() {
  return (
    // 懒加载需要配合Suspense组件使用，fallback属性接受一个组件作为加载组件过渡期间的渲染
    <React.Suspense fallback={<div>Loading...</div>}>
      <Router>
        <div className="App">
          {/* Redirect 重定向组件 实现默认首页的功能 */}
          <Route exact path="/" render={() => <Redirect to="/home" />} />

          {/* tabbar页 */}
          <Route path="/home" component={Home} />

          {/* 城市列表 */}
          <Route path="/citylist" component={CityList} />

          {/* 地图 */}
          <Route path="/showmap" component={ShowMap} />

          {/* 房屋详情 */}
          <Route path="/detail/:id" component={Detail} />

          {/* 登录 */}
          <Route path="/login" component={Login} />

          {/* 我的收藏 */}
          <AuthRoute path="/mycollect" component={MyCollect} />

          {/* 我的出租 */}
          <AuthRoute exact path="/myrent" component={MyRent} />

          {/* 发布房源 */}
          <AuthRoute path="/myrent/publish" component={Publish} />

          {/* 发布房源搜索 */}
          <AuthRoute path="/myrent/search" component={Search} />

          {/* 测试virtualized */}
          <Route path="/virtualizedlist" component={VirtualizedList} />
        </div>
      </Router>
    </React.Suspense>
  )
}

export default App
