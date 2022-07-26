const multer = require("@koa/multer")
var COS = require('cos-nodejs-sdk-v5')
var cos = new COS({
  SecretId: '',
  SecretKey: '',
  Protocol: 'https:'
})

let cosfun = function(fileName,filePath) {
    return new Promise((resolve,reject)=>{
        cos.uploadFile({
          Bucket: '',
          Region: 'ap-shanghai',
          Key: 'image/' + fileName,       /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          FilePath: filePath,                /* 必须 */
        })
        .then(res=>{
          console.log(res)
          resolve(res.Location)
        })
        .catch(err=>{
          reject(err)
        })
    })
}

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'uploads')
    },
    filename: (req, file, cb)=> {
      //防止文件重名
      let fileFormat = (file.originalname).split(".")
      let fname = fileFormat[0] + Date.now() + '.' +fileFormat[1]
      console.log(fname)
      cb(null, fname)
    }
})

const upload = multer({ storage: storage })

module.exports = {upload,cosfun}