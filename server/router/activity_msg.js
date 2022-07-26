const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL, UpdateURL} = require('../config/databaseapi')

router.post('/activity_msg',async context=>{
    let {id,msg} = context.request.body
    const query = `db.collection("activityinfo").doc("${id}").update({data:{msg:"${msg}"}})`
    //console.log(query)
    try {
        const activity = await new getToken().posteve(UpdateURL,query)
        new result(context,'留言成功！',200).answer()
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()