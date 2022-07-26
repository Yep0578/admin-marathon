//统一给前端返回的body响应
class result {
    constructor(context, msg='success', code=200, data=null, extra=null) {
        this.context = context
        this.msg = msg
        this.code = code
        this.data = data
        this.extra = extra
    }

    //统一返回json格式
    answer() {
        this.context.body = {
            msg: this.msg,
            data: this.data,
            extra: this.extra,
            code: this.code
        }
    }
}

module.exports = result