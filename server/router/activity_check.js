const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL, UpdateURL} = require('../config/databaseapi')

router.post('/activity_check',async context=>{
    let {id,condition} = context.request.body
    const query = `db.collection("activityinfo").doc("${id}").update({data:{condition:${condition}}})`
    try {
        const activity = await new getToken().posteve(UpdateURL,query)
        console.log(activity)
        new result(context,'修改成功',200).answer()
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()