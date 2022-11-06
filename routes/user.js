import express from 'express';
import {register,login,deposit,withdrawal,getme} from '../controller/userController.js';
import auth from '../middleware/auth.js';

const route=express.Router()

route.post('/register',register)
route.post('/login',login)
route.post('/deposit',auth,deposit)
route.post('/withdraw',auth,withdrawal)
route.get('/getme',auth,getme)

export default route;