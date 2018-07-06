const router = require('koa-router')()
const multer = require('koa-multer')
const path = require('path')
const moment = require('moment');
const qiniu = require('../model/Qiniu.js')
const fsfun = require('../model/fs.js')


/**
 * Shorthand for:
 *
 *    上传配置
 *
 * @api public
 */

const storage = multer.diskStorage({
    destination:'public/uploads/'+new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' +  new Date().getDate(),
    filename(ctx,file,cb){
        const filenameArr = file.originalname.split('.');
        cb(null,'okayplus' + Date.now() + '.' + filenameArr[filenameArr.length-1]);
    }
});

//初始化上传配置
const upload = multer({storage});


/**
 * Shorthand for:
 *
 *    后台发登录页面
 *
 */

router.get('/admin/login', async (ctx, next) => {

    let data = {
        title: 'OKAY+包管理平台'
    };

    await ctx.render('login', data);

})


/**
 * Shorthand for:
 *
 *    后台首页
 *
 */

router.get('/admin/index', async (ctx, next) => {

    let data = {
        title: 'OKAY+包管理平台'
    };

    await ctx.render('index', data);
})


/**
 * Shorthand for:
 *
 *    后台首页桌面
 *
 */
router.get('/admin/desktop', async (ctx, next) => {


    let info = fsfun.ReadFileSync();
    let data = {
        title: 'OKAY+包管理平台',
        moment: moment,
        PackageInfo: JSON.parse(fsfun.BufferToJson(info))
    };

    await ctx.render('welcome', data);

})


/**
 * Shorthand for:
 *
 *    后台上传OKAY+包
 *
 */

router.get('/admin/package', async (ctx, next) => {

    let info = fsfun.SelectLastVersion();
    let data = {
        title: 'OKAY+包管理平台',
        crumbs: 'OKAY+下载页包上传',
        lastPackageInfo: info
    };

    await ctx.render('packageUploads', data);
})

/**
 * Shorthand for:
 *
 *   OKAY+包列表信息
 *
 */

router.get('/admin/packageList', async (ctx, next) => {

    let info = fsfun.ReadFileSync();
    let data = {
        title: 'OKAY+包管理平台',
        crumbs: 'OKAY+包列表信息',
        moment: moment,
        PackageInfo: JSON.parse(fsfun.BufferToJson(info))
    };

    await ctx.render('packageList', data);
})


/**
 * Shorthand for:
 *
 *    上传OKAY+包
 *    @Post
 *    @Param {
 *          packageName : 包名
 *          packageMark : 备注
 *          packageFile : 包文件 ( 仅支持.bak文件 )
 *          packageVice : 包版本
 *    }
 *
 */

router.post('/admin/package/upload', upload.single('packageFile'), async(ctx, next) => {

    if( !ctx.req.file.filename ){

        ctx.body = {
            code: 404 ,
            msg : '请选择上传文件'
        }

    }

    let filename = ctx.req.file.filename.split('.')
    filename = ctx.req.body.packageTend + '.' + filename[filename.length-1]

    /** 上传七牛 */
    let data = await qiniu({
        bucket: 'temp',
        filePath: ctx.req.file.path,
        qiniuFileName: filename
    });

    /** 写入json */
    fsfun.updatePackageVersion({
        hash        : data.hash,
        key         : data.key,
        channelName : ctx.req.body.channelName,
        channelNum  : ctx.req.body.channelNum,
        packageVice : ctx.req.body.packageVice,
        packageMark : ctx.req.body.packageMark,
        packageTend : ctx.req.body.packageTend
    });


    ctx.body = {
        code: data.error ? 10404 : 200 ,
        msg : data.error ? data.error : '文件上传完成'
    }

})



module.exports = router
