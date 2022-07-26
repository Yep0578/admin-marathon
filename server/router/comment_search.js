const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/comment_search',async context=>{
    let {id,openid,nickname,detail,title} = context.request.body
    let query
    if(id == 1)
        query = `db.collection("commentinfo").where({openid:db.RegExp({
                                                                    regexp: '${openid}',
                                                                    options:'i',
                                                                })
                                                            }).get()`
    else if(id == 2)
        query = `db.collection("commentinfo").where({name:db.RegExp({
                                                                    regexp: '${nickname}',
                                                                    options:'i',
                                                                })
                                                            }).get()`
    else if(id == 3)
        query = `db.collection("commentinfo").where({detail:db.RegExp({
                                                                    regexp: '${detail}',
                                                                    options:'i',
                                                                })
                                                            }).get()`
    else
        query = `db.collection("commentinfo").where({title:db.RegExp({
                                                                    regexp: '${title}',
                                                                    options:'i',
                                                                })
                                                            }).get()`                                                 

    try {
        const commentinfo = await new getToken().posteve(SearchURL,query)
        if(commentinfo.data.length == 0)
            new result(context,'未找到相关比赛',201).answer()
        else {
            let data = commentinfo.data.map(item=>{return JSON.parse(item)})
            console.log(data)
            new result(context,'查询成功',200,data).answer()
        }
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()