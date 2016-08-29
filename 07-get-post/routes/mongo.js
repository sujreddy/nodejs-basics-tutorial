var mongo = require('mongodb');//import mondodb
var assert =require('assert');//to check values 
var indexfile = require('./index');

/* Url to connect mongodb which consists of local host with port number and database name */
var url='mongodb://localhost:27017/local';

/* Object which contains all the methods to post data to mongo and fetch from Mongo */
var mongoObj = {

	postToMongo : function(item){
		//console.log(item);
	  var insertedToMongo=[];	
	  mongo.connect(url, function(err, db){
	  	assert.equal(null, err);
	  	var collectionName=db.collection('bookmark');
	  	collectionName.insert(item, function(err, result){
	  		assert.equal(null, err);
	  		console.log('Item inserted');
	  		insertedToMongo.push(result);
	  		console.log('Inserted data'+JSON.stringify(insertedToMongo));
	  		db.close();
	  	});
	  })	
	  return insertedToMongo;
	},

	fetchFromMongoDB : function(title, privacyType, username, company){

		console.log('Request sending to mongodb ' +title+' '+privacyType);
		var resultArrayFromMongo=[];
		var sort = {'_id': -1}
		//var titleVa=/{title}/i;
		//var titleval=titleVa.replace("{","");
		//console.log('titleVal '+titleVal);	
		//console.log('titleVal '+titleVal);
		mongo.connect(url, function(err, db){
		assert.equal(null, err);
		console.log('successfully connected with mongodb');
		//var insensitivetitle =  '\/'+title + '\/i' ;
		var collection= db.collection('bookmark');
		//.find({Title:{$regex: {title}}/i, "privacyType":privacyType}).sort(sort).limit(10);
		var cursor=collection.find({Title: { $regex: title, $options: "i" }, Username:username, privcyType:privacyType}).sort(sort).limit(10);
		console.log('statistics '+ cursor.explain("executionStats").executionStats);
		console.log('#Pointing to bookmark collection '+cursor);

		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			if(doc != null){
			resultArrayFromMongo.push(doc);
		}else{
			resultArrayFromMongo.push('No results found');
		}
		}, function(){
			db.close();

			console.log('data from mongodb'+JSON.stringify(resultArrayFromMongo));
			console.log('##database has colsed');			
		});
	});
		return resultArrayFromMongo; 
	}
}


module.exports = mongoObj;
