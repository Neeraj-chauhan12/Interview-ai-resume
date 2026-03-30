const {Router}=require("express");
const { register, login, logout, getUser } = require("../controllers/AuthController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");

const router=Router()

router.post("/register",register);
router.post("/login",login)
router.get("/logout",logout)
router.get("/getme",AuthMiddleware,getUser)


module.exports=router