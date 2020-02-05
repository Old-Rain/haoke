import React from 'react'

import { API } from '../../utils/api'
import { setToken } from '../../utils/token'

import { Toast } from 'antd-mobile'
import { withFormik } from 'formik'
import * as yup from 'yup'

import NavBar from '../../components/NavBar'

import styles from './index.module.scss'

const RexUsername = /^.{5,12}$/
const RexPassword = /^\w{5,12}$/

class Login extends React.Component {
  // 登录
  login = async info => {
    const {
      data: { status, description, body }
    } = await API.post('/user/login', info)

    if (status !== 200) return Toast.info(description, 2)

    setToken(body.token)

    // 如果从某不知名页面直接进入到login页，那登录后直接进入my页面
    // 鉴权页面进入到login页，那登录后回到鉴权页
    const pathname = this.props.location.state ? this.props.location.state.from.pathname : ''

    // 是否鉴权页面重新登录
    const reLogin = this.props.location.state && this.props.location.state.reLogin

    // push会将当前路由保存在历史中           /home/my -> /login -> [pathname]
    // replace则会把当前路由直接进行替换      /home/my -> [/login -> [pathname]]
    // 这样历史中不会对login进行保留，返回的时候直接就可以回到登录前的页面
    !pathname || reLogin ? this.props.history.go(-1) : this.props.history.replace(pathname)
  }

  MyForm = props => {
    // withFormik高阶组件传递给UI组件的参数，直接官网复制
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit
    } = props
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <p>
          <input
            name="username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
            type="text"
            placeholder="请输入账号"
          />
        </p>
        <span className={styles.error}>
          {errors.username && touched.username ? errors.username : ''}
        </span>
        <p>
          <input
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            type="password"
            placeholder="请输入密码"
          />
        </p>
        <span className={styles.error}>
          {errors.password && touched.password ? errors.password : ''}
        </span>
        <input type="submit" value="登 录" />
      </form>
    )
  }

  MyEnhancedForm = withFormik({
    displayName: 'MyEnhancedForm',
    mapPropsToValues: () => ({ username: '', password: '' }),

    // 校验表单方式1
    // validate: values => {
    //   const errors = {}

    //   // 账号校验
    //   if (!values.username) {
    //     errors.username = '账号不能为空'
    //   } else if (!RexUsername.test(values.username)) {
    //     errors.username = '账号应在于5位与12位之间'
    //   }

    //   //密码校验
    //   if (!values.password) {
    //     errors.password = '密码不能为空'
    //   }else if (!RexPassword.test(values.password)) {
    //     errors.password = '密码应在于5位与12位之间'
    //   }
    //   return errors
    // },

    // 校验表单方式2
    validationSchema: yup.object().shape({
      username: yup.string().required('账号不能为空').matches(RexUsername, '账号应在于5位与12位之间'),
      password: yup.string().required('密码不能为空').matches(RexPassword, '密码应在于5位与12位之间')
    }),
    
    handleSubmit: (values) => {
      this.login(values)
    }
  })(this.MyForm)

  render() {
    return (
      <div className={styles.login}>
        <NavBar
          navWrapClass={styles.navWrapClass}
          navContentClass={styles.navContent}
        >
          账号登录
        </NavBar>
        <this.MyEnhancedForm />
        <div className={styles.toLogin}>
          <span>还没有账号，去</span>
          <i className={styles.green}>注册</i>
          <span>~</span>
        </div>
      </div>
    )
  }
}

export default Login
