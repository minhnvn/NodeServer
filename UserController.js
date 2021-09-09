// var ResgisterNewUser = require("./Mongo").ResgisterNewUser;
// var UserLogin = require("./Mongo").UserLogin;
var Mongo = require("./Mongo");

async function register(req, res){
        var body  = req.body;
        //check info body
        if(body.name && body.pass)
        {
            var id = await Mongo.ResgisterNewUser(body);
            res.send(id);
        }
        else
            res.send('not constrain field name, pass')
        // console.log('name: ', body.name);
        // console.log('pass: ', body.pass);
    };
module.exports.register = register;

async function login(req, res){
        var body  = req.body;
        if(body.name && body.pass)
        {
            //check name pass is login or not
            var guid = await Mongo.UserLogin(body)
            //console.log(guid);
            if(guid)
                res.send(guid);
            else
                res.send("not found user");
        }
        else
            res.send(404)
    };
    module.exports.login = login;

    async function logout(req, res){
        //check name pass is login => logout
        var user  = req.body;
        if(!user)
        {
            res.send("no body");
            return;
        }
        if(user.name && user.pass)
        {
            var isLogin = await Mongo.checkUserIsLogin(user);
            if(isLogin)
            {
                var tmp = await Mongo.UserLogout(user);
                res.send(tmp);
            }
            else
                res.send('not login');
        }
        else
            res.send('error')
    };
    module.exports.logout = logout;

    async function getUserProfile(req, res){
        //console.log('getUserProfile1', req.body);
        var guidCheck  = req.body;
        if(guidCheck)
        {
            var guid = await Mongo.checkUserIsLoginByGuid(guidCheck);
            //console.log('getUserProfile2', guid);
            if(guid)
                res.send(await Mongo.getUserProfile(guid));
            else
                res.send('not login');
        }
        else
            res.send('error')
    };
    module.exports.getUserProfile = getUserProfile;
