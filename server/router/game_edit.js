const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL, UpdateURL} = require('../config/databaseapi')

router.post('/game_edit',async context=>{
    let {id,title,time,img,detail,money,type} = context.request.body
    detail = detail.replaceAll("\n", "\\\\n")
    time = time.replaceAll("T", " ")
    time = time + ":00"
    const query = `db.collection("gameinfo").doc("${id}").update({data:{title:"${title}", time:"${time}",img:"${img}", detail:"${detail}", money:${money}, type:${type}}})`
    //console.log(query)
    try {
        const gameinfo = await new getToken().posteve(UpdateURL,query)
        console.log(gameinfo)
        new result(context,'修改成功',200).answer()
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()