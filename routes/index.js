const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const commentRouter = require('./commentRouter');
const reviewRouter = require('./reviewRouter');
const imageRouter = require('./imageRouter');
const tagRouter = require('./tagRouter');
const socialNetworkRouter = require('./socialNetworkRouter');
const ratingRouter = require('./ratingRouter');
const typeRouter = require('./typeRouter');
const productRouter = require('./productRouter');

const searchRouter = require('./searchRouter')


router.use('/user', userRouter);
router.use('/comment', commentRouter);
router.use('/review', reviewRouter);
router.use('/image', imageRouter);
router.use('/tag', tagRouter);
router.use('/authSocial', socialNetworkRouter);
router.use('/rating', ratingRouter);
router.use('/type', typeRouter);
router.use('/product', productRouter);

router.use('/search', searchRouter)




module.exports = router;