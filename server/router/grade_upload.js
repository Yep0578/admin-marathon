const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL, UpdateURL} = require('../config/databaseapi')

router.post('/grade_upload',async context=>{
    let {title,playernum, rank, grade} = context.request.body
    const query = `db.collection("gradeinfo").where({playernum:"${playernum}",title:"${title}"}).update({data:{rank:"${rank}", grade:"${grade}"}})`
    //console.log(query)
    try {
        const gradeinfo = await new getToken().posteve(UpdateURL,query)
        console.log(gradeinfo)
        new result(context,'上传成功',200).answer()
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()