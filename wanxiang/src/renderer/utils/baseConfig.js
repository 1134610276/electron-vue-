export default {
    baseUrl:"http://dev-test.allonyun.com/api",    //设置域名
    cookieData:{     							  //设置cookie的参数
	    date :Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,   //30天有效期
    },
}