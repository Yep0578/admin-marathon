const axios = require('axios')
const qs = require('querystring')
const result = require('../config/handle')

//拼接token的url地址
let param = qs.stringify({
    grant_type: 'client_credential',
    appid: '',
    secret: ''
})

//获取token地址，才能操作云开发数据库
let url = 'https://api.weixin.qq.com/cgi-bin/token?' + param
//云环境ID
let env = 'yclouds-6ghqon7ye1f280dd'
//数据库URL
let AddURL = 'https://api.weixin.qq.com/tcb/databaseadd?access_token='
let SearchURL = 'https://api.weixin.qq.com/tcb/databasequery?access_token='
let UpdateURL = 'https://api.weixin.qq.com/tcb/databaseupdate?access_token='
let DeleteURL = 'https://api.weixin.qq.com/tcb/databasedelete?access_token='
//存储
let UploadURL = 'https://api.weixin.qq.com/tcb/uploadfile?access_token='

class getToken {
    constructor() {}

    //获取token
    async gettoken() {
       try {
           let token = await axios.get(url)
           if (token.status == 200) {
               //console.log(token.data.access_token)
               return token.data.access_token
           }else{
               throw '获取token错误'
           }
       }catch(e) {
            throw new result(e,500)
       }
    }

    //调用云开发HTTP API接口
    async posteve(dataurl, query) {
        try {
            let token = await this.gettoken()
            let data = await axios.post(dataurl+token, {env, query})
            console.log(data.data.errcode)
            console.log(data.data.errmsg)
            if (data.data.errcode == 0)
                return data.data
            else throw '请求出错'
        }catch(e) {
            throw new result(e,500)
        }
    }
}

module.exports = {getToken, AddURL, SearchURL, UpdateURL, DeleteURL, UploadURL} 