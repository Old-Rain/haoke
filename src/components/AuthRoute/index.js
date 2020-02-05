import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// import { API } from '../../utils/api'
import { isAuth } from '../../utils/token'

// class AuthRoute extends React.Component {
//   state = {
//     isLogin: true
//   }
//   render() {
//     const { component: Component, path } = this.props
//     const { isLogin } = this.state

//     return (
//       <Route
//         path={path}
//         render={props => {
//           return isLogin ? (
//             <Component {...props} />
//           ) : (
//             <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//           )
//         }}
//       />
//     )
//   }
//   async componentDidMount() {
//     const { data: res } = await API.get('/user')
//     this.setState({
//       isLogin: res.status === 200
//     })
//   }
//   componentDidUpdate(prevProps, prevState) {}
// }

const AuthRoute = ({ component: Component, ...other }) => {
  return (
    <Route
      {...other}
      render={props => {
        return isAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }}
    />
  )
}

export default AuthRoute
