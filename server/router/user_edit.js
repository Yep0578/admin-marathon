const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL, UpdateURL} = require('../config/databaseapi')

router.post('/user_edit',async context=>{
    let {id,playernum,playername,img,sex, openid, nickname} = context.request.body
    const query = `db.collection("playerinfo").doc("${id}").update({data:{playernum:"${playernum}", playername:"${playername}",img:"${img}", sex:"${sex}", openid:"${openid}", nickname:"${nickname}"}})`
    try {
        const userinfo = await new getToken().posteve(UpdateURL,query)
        console.log(userinfo)
        new result(context,'修改成功',200).answer()
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()