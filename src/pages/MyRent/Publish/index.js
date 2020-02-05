import React from 'react'

import { API } from '../../../utils/api'

import { Modal, List, Picker, ImagePicker, Toast } from 'antd-mobile'

import NavBar from '../../../components/NavBar'
import HousePackage from '../../../components/HousePackage'
import FooterButton from '../../../components/FooterButton'

import styles from './index.module.scss'

// 输入型信息
const inputInfo = [
  {
    name: '租金',
    nameEn: 'price',
    placeholder: '请输入租金',
    extra: '￥/月'
  },
  {
    name: '建筑面积',
    nameEn: 'size',
    placeholder: '请输入面积',
    extra: '㎡'
  }
]

// 选择型信息
const pickerInfo = [
  {
    name: '户型',
    nameEn: 'roomType',
    data: [
      { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
      { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
      { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
      { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
      { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
    ]
  },
  {
    name: '所在楼层',
    nameEn: 'floor',
    data: [
      { label: '高层楼', value: 'FLOOR|1' },
      { label: '中层楼', value: 'FLOOR|2' },
      { label: '低层楼', value: 'FLOOR|3' }
    ]
  },
  {
    name: '朝向',
    nameEn: 'oriented',
    data: [
      { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
      { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
      { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
      { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
      { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
      { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
      { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
      { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
    ]
  }
]

class Publish extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      community: '', // 小区id
      communityName: '', // 小区中文名
      price: '', // 租金
      size: '', // 面积
      roomType: '', // 户型id
      floor: '', // 楼层id
      oriented: '', // 朝向id
      title: '', // 房屋标题
      houseImgFile: [], // 房屋图片文件
      supporting: '', // 房屋配置项
      description: '' // 房屋描述
    }
  }

  // 房源信息
  houseInfo = () => {
    const { history } = this.props
    const { communityName } = this.state
    return (
      <List renderHeader={() => '房源信息'} className={styles.list}>
        {/* 输入小区 */}
        <List.Item
          extra={communityName ? communityName : '请输入小区名称'}
          arrow="horizontal"
          onClick={() => {
            history.push('/myrent/search')
          }}
        >
          <div className={styles.key}>
            {'小区名称'.split('').map(str => (
              <span key={str}>{str}</span>
            ))}
          </div>
        </List.Item>

        {/* 输入型信息 */}
        {inputInfo.map(item => (
          <List.Item key={item.nameEn}>
            <div className={styles.key}>
              {item.name.split('').map(str => (
                <span key={str}>{str}</span>
              ))}
            </div>
            <div className={styles.inputWrap}>
              <input
                value={this.state[item.nameEn]}
                type="number"
                className={styles.input}
                placeholder={item.placeholder}
                onChange={e => this.setState({ [item.nameEn]: e.target.value })}
              />
            </div>
            <div className={styles.extra}>{item.extra}</div>
          </List.Item>
        ))}

        {/* 选择型信息 */}
        {pickerInfo.map(item => (
          <Picker
            title={item.name}
            data={item.data}
            cols={1}
            value={[this.state[item.nameEn]]}
            onOk={v => this.setState({ [item.nameEn]: v[0] })}
            key={item.nameEn}
          >
            <List.Item arrow="horizontal">
              <div className={styles.key}>
                {item.name.split('').map(str => (
                  <span key={str}>{str}</span>
                ))}
              </div>
            </List.Item>
          </Picker>
        ))}
      </List>
    )
  }

  // 房屋标题
  houseTitle = () => (
    <List renderHeader={() => '房屋标题'} className={styles.list}>
      <List.Item>
        <input
          className={styles.houseTitle}
          placeholder="请输入房屋标题 （例如：整租 小区名 2室 5000元）"
          onChange={e => this.setState({ title: e.target.value })}
        />
      </List.Item>
    </List>
  )

  // 房屋图像
  houseImgUpdate = () => {
    const { houseImgFile } = this.state
    return (
      <List renderHeader={() => '房屋图像'} className={styles.list}>
        <List.Item>
          <ImagePicker
            multiple
            files={houseImgFile}
            onChange={files => this.setState({ houseImgFile: files })}
            selectable={houseImgFile.length < 7}
          />
        </List.Item>
      </List>
    )
  }

  // 房屋配置
  housePackage = () => (
    <List renderHeader={() => '房屋配置'} className={styles.list}>
      <div className={styles.emptyLine_h10px}></div>
      <HousePackage
        isPublish
        onSelect={item => this.setState({ supporting: item.join('|') })}
      />
      <div className={styles.emptyLine_h4px}></div>
    </List>
  )

  // 房屋描述
  houseDescription = () => (
    <List renderHeader={() => '房屋描述'} className={styles.list}>
      <List.Item>
        <textarea
          className={styles.houseTitle}
          placeholder="请输入房屋描述信息"
          value={this.state.description}
          onChange={e => this.setState({ description: e.target.value })}
        />
      </List.Item>
    </List>
  )

  render() {
    return (
      <div className={styles.publish}>
        <NavBar navWrapClass={styles.navWrap}>发布房源</NavBar>
        {this.houseInfo()}
        {this.houseTitle()}
        {this.houseImgUpdate()}
        {this.housePackage()}
        {this.houseDescription()}
        <FooterButton
          enterName="提交"
          onCancel={this.cancle}
          onSave={this.publish}
          wrapCSS={styles.footer}
        />
      </div>
    )
  }

  // 初始化
  init = async () => {
    const { data: res } = await API.get('/user')
    // console.log(res)
    if (res.status === 200) {
      const { state } = this.props.location

      if (!state) return

      // 设置小区名称
      const { community, communityName } = state
      this.setState({ community, communityName })
      return
    }

    const { history, location } = this.props
    Modal.alert('提示', '身份验证已过期，请重新登录', [
      { text: '取消', onPress: () => history.push('/home/my') },
      {
        text: '登录',
        onPress: () => history.push('/login', { from: location, reLogin: true })
      }
    ])
  }

  // 提交
  publish = async () => {
    // console.log(this.state)

    // 图片上传
    let houseImg = ''
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      houseImgFile,
      supporting,
      description
    } = this.state
    if (houseImgFile.length) {
      const form = new FormData()
      for (const item of houseImgFile) {
        form.append('file', item.file)
      }
      const { data: res } = await API.post('/houses/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      houseImg = res.body.join('|')
    }

    // 发布
    const { data: res } = await API.post('/user/houses', {
      title,
      description,
      houseImg,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    })
    // console.log(res)
    if (res.status !== 200) return Toast.fail('发布失败，请稍后再试', 2)

    Toast.success('发布成功', 1, () => {
      this.props.history.push('/myrent')
    })
  }

  // 取消发布
  cancle = () => {
    const { history } = this.props
    Modal.alert('提示', '是否放弃房源发布', [
      { text: '取消', onPress: () => history.go(-1) },
      { text: '继续编辑' }
    ])
  }

  componentDidMount() {
    this.init()
  }
}

export default Publish
