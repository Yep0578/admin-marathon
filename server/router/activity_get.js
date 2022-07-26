const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/activity_get',async context=>{
    const query = `db.collection("activityinfo").limit(20).orderBy("time","asc").get()`
    
    try {
        const activity = await new getToken().posteve(SearchURL,query)
        if(activity.data.length == 0)
            new result(context,'最近暂无活动',201).answer()
        else {
                let data = activity.data.map(item=>{return JSON.parse(item)})
                //console.log(data)
                new result(context,'查询成功',200,data).answer()
        }
    } catch (error) {
        throw new result(e,500)
    }
})

module.exports = router.routes()