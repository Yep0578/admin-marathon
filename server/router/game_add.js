const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/game_add',async context=>{

    let {title,time,img,detail,money,type} = context.request.body
    detail = detail.replaceAll("\n", "\\\\n")
    time = time.replaceAll("T", " ")
    time = time + ":00"
    console.log(type)
    const check = `db.collection("gameinfo").where({title:'${title}'}).get()`
    const query = `db.collection("gameinfo").add({data: {title:'${title}', time:'${time}',img:'${img}', detail:'${detail}', money:${money}, type:${type}}})`
    try {
        const checkInfo = await new getToken().posteve(SearchURL,check)
        //console.log(checkInfo)
        if(checkInfo.data.length == 0 )
        {
            const gameadd = await new getToken().posteve(AddURL,query)
            new result(context,'添加成功！',200).answer()
        }else new result(context,'该数据已存在！',201).answer()
        
    } catch (error) {
        throw new result(error,500)
    }
    
})

module.exports = router.routes()