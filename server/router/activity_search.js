const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/activity_search',async context=>{
    let {id,creatorid,creator,title} = context.request.body
    let query
    if(id == 1)
        query = `db.collection("activityinfo").where({creatorid:db.RegExp({
                                                                    regexp: '${creatorid}',
                                                                    options:'i',
                                                                })
                                                            }).get()`
    else if(id == 2)
        query = `db.collection("activityinfo").where({creator:db.RegExp({
                                                                    regexp: '${creator}',
                                                                    options:'i',
                                                                })
                                                            }).get()`
    else if(id == 3)
        query = `db.collection("activityinfo").where({title:db.RegExp({
                                                                    regexp: '${title}',
                                                                    options:'i',
                                                                })
                                                            }).get()`                                       

    try {
        const activity = await new getToken().posteve(SearchURL,query)
        if(activity.data.length == 0)
            new result(context,'未找到相关比赛',201).answer()
        else {
            let data = activity.data.map(item=>{return JSON.parse(item)})
            console.log(data)
            new result(context,'查询成功',200,data).answer()
        }
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()