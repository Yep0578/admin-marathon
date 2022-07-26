//自定义的全局异常处理中间件
const result = require('./handle')
const abnormal = async(context,next)=>{
    try{
        await next() //等待到下一步
    }catch(e) {
        const isresult = e instanceof result
        if (isresult){
            //已知错误
            context.body = {
                msg:e.msg
            }
            context.status = e.code
        }else {
            //未知错误
            context.body = {
                msg:'unknow'
            }
            context.status = 500
        }
    }
}

module.exports = abnormal