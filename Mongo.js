
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient; 
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
var url = "mongodb://localhost:27017/TestUser";
var _db = null;

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
function InsertProfile(user, id){
    var profileCollection = _db.collection('profile');
    var profile = {
        name : user.name,
        email: user.email,
        sex: user.sex,
        number : user.number,
        data : "extent data"
    }
    var myProfile = { id: id, profile: profile};
    profileCollection.insertOne(myProfile, function(err, res) {
      if (err) 
        throw err;
      console.log("1 profile inserted");
    });
}
async function InsertUser(user){
    var userCollection = _db.collection('user');
    var Id = uuid();
    var myUser = { name: user.name, pass: user.pass , guid : Id, isActive : true};
    //console.log(myUser);

    const result = await userCollection.insertOne(myUser);
    if(result)
        return Id;
    return null;
}

async function ResgisterNewUser(user)
{
    var userCollection = _db.collection('user');
    const query = { name: user.name };
    const options = {};
    var result = await userCollection.findOne(query, options);
    if(null === result)
        {
            //insert user
            var guid = await InsertUser(user);
            //insert Profile
            console.log('new Guid', guid);
            InsertProfile(user, guid);
            return guid;
        }
        else
        return null;
}
module.exports.ResgisterNewUser = ResgisterNewUser;

var ObjectID = require('mongodb').ObjectId;
async function UserLogin(user)
{
    var userCollection = _db.collection('user');
    const query = { name: user.name, pass: user.pass};
    const options = {};
    var result = await userCollection.findOne(query, options);
    if(result)
        {
            var state = result.isActive;
            var guid = result.guid;
            if(state === false)
            {
                result.isActive = true;
                var myquery = { "_id": ObjectID(result._id)};//{ guid: guid };
                var newvalues = { $set: {isActive: true}};
                await userCollection.updateOne(myquery, newvalues);
                //console.log("update", res);
                return guid;
            }
            return guid;
        }
        else
        return null;
}
module.exports.UserLogin = UserLogin;
async function UserLogout(user)
{
    var userCollection = _db.collection('user');
    const query = { name: user.name, pass: user.pass};
    const options = {};
    var result = await userCollection.findOne(query, options);
    if(result)
        {
            var state = result.isActive;
            var guid = result.guid;
            if(state === true)
            {
                var myquery = { "_id": ObjectID(result._id)};//{ guid: guid };
                var newvalues = { $set: {isActive: false}};
                var res = await userCollection.updateOne(myquery, newvalues);
                //console.log("update", res);
                return guid;
            }
            return guid;
        }
        else
        return null;
}
module.exports.UserLogout = UserLogout;

async function IsLogin(user){
    var userCollection = _db.collection('user');
    if(!user.name || !user.pass)
        return null;

    const query = { name: user.name, pass: user.pass};
    const options = {};
    var result = await userCollection.findOne(query, options);
    if(result)
        {
           if(true === result.isActive)
                return result.guid;
        }
        else
            return null;
}
module.exports.checkUserIsLogin = IsLogin;

async function IsLoginBuyGuid(guid){
    var userCollection = _db.collection('user');
    //console.log(guid);
    if(!guid)
        return null;

    const query = { guid: guid };
    const options = {};
    var result = await userCollection.findOne(query, options);
    //console.log(result);
    if(result)
        {
           if(true === result.isActive)
                return guid;
        }
        else
            return null;
}
module.exports.checkUserIsLoginByGuid = IsLoginBuyGuid;
async function getUserProfile(guid){
    var profileCollection = _db.collection('profile');
    if(!guid)
        return null;

    const query = { id: guid};
    const options = {};
    var result = await profileCollection.findOne(query, options);
    if(result)
        {
           return result.profile;
        }
        else
            return null;
}
module.exports.getUserProfile = getUserProfile;

async function InitMongo(){
    try {
        await MongoClient.connect(url, function (err, client) {
            if (err) {
              console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
              console.log('Connection established to', url);
              var db  = client.db('TestUser');
              _db = db;
              db.listCollections({}, { nameOnly: true }).toArray().then(
                  colections => {
                    if(undefined === colections.find(x => x.name === 'user' ))
                        db.createCollection('user');
                    if(undefined === colections.find(x => x.name === 'profile' ))
                        db.createCollection('profile');
                  }
              )
            return true;
          }
        });
    } catch (e) {
        console.error(e);
    }
    return false;
}
module.exports.InitMongo = InitMongo;
