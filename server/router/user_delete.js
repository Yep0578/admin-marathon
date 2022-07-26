const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL, UpdateURL, DeleteURL} = require('../config/databaseapi')

router.post('/user_delete',async context=>{
    let {id} = context.request.body
    const query = `db.collection("playerinfo").doc("${id}").remove()`
    //console.log(query)
    try {
        const playerinfo = await new getToken().posteve(DeleteURL,query)
        console.log(playerinfo)
        new result(context,'删除成功',200).answer()
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()