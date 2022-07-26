const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL, UploadURL} = require('../config/databaseapi')
const {upload,cosfun} = require('../config/cos')

router.post('/upload',upload.single('file'),async context=>{
    try {
        console.log(context)
        const res = await cosfun(context.file.filename,context.file.path)
        //console.log(res)
        new result(context,'上传成功',200,'https://' + res).answer()
    } catch (error) {
        console.log(e)
        new result(context,'上传失败',500,'https://' + res).answer()
    }
    
})

module.exports = router.routes()