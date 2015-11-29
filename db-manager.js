var Q = require('q');
var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config');

function DBManager(typeName) {
	this.dbName = "basic-data";
	this.typeName = typeName;
	this.docDbClient = new DocumentDBClient(config.host, {
		masterKey: config.authKey
	});
}

DBManager.prototype.initDB = function () {
	var that = this;
	var querySpec = {
		query: 'SELECT * FROM root r WHERE r.id=@id',
		parameters: [{
			name: '@id',
			value: this.dbName
		}]
	};
	var promise = Q.defer();

	this.docDbClient.queryDatabases(querySpec).toArray(function (err, results) {
		if (err) {
			promise.reject(err);
		} else {
			if (results.length === 0) {
				var databaseSpec = {
					id: that.dbName
				};

				that.docDbClient.createDatabase(databaseSpec, function (err, created) {
					promise.resolve(created);
				});

			} else {
				promise.resolve(results[0]);
			}
		}
	});
	return promise.promise;
};

DBManager.prototype.initCollection = function () {
	var that = this;
	var promise = Q.defer();
	var collectionName = this.typeName;

	var querySpec = {
		query: 'SELECT * FROM root r WHERE r.id=@id',
		parameters: [{
			name: '@id',
			value: collectionName
		}]
	};

	this.docDbClient.queryCollections("dbs/" + this.dbName, querySpec).toArray(function (err, results) {
		if (err) {
			promise.reject(err);

		} else {
			if (results.length === 0) {
				var collectionSpec = {
					id: collectionName
				};

				var requestOptions = {
					offerType: 'S1'
				};

				that.docDbClient.createCollection("dbs/" + this.dbName, collectionSpec, requestOptions, function (err, created) {
					promise.resolve(created);
				});

			} else {
				promise.resolve(results[0]);
			}
		}
	});
	return promise.promise;
};

DBManager.prototype.init = function () {
	var promise = Q.defer();
	var that = this;

	this.initDB().then(function (db) {
		that.initCollection().then(function (collection) {
			promise.resolve();
		});
	});

	return promise.promise;
};

DBManager.prototype.queryWithSpec = function (querySpec) {
	var promise = Q.defer();
	this.docDbClient.queryDocuments("dbs/" + this.dbName + "/colls/" + this.typeName, querySpec).toArray(function (err, results) {
		if (err) {
			promise.reject(err);

		} else {
			promise.resolve(results);
		}
	});

	return promise.promise;
};

DBManager.prototype.query = function (paramObj) {
	var baseQuery = "SELECT * FROM root r where ";
	var queryParams = [];
	var parameters = [];
	for (var i in paramObj) {
		queryParams.push("r." + i + "=@" + i);
		parameters.push({
			name: '@' + i,
			value: paramObj[i]
		});
	}
	var query = baseQuery + queryParams.join(" and ");

	var querySpec = {
		query: query,
		parameters: parameters
	};

	return this.queryWithSpec(querySpec);
}

DBManager.prototype.save = function (doc) {
	var promise = Q.defer();

	if (!!doc._self) { //If updating existing document
		this.docDbClient.replaceDocument(doc._self, doc, function (err, replaced) {
			if (err) {
				promise.reject(err);

			} else {
				promise.resolve(doc);
			}
		});
	} else { //If adding new document
		this.docDbClient.createDocument("dbs/" + this.dbName + "/colls/" + this.typeName, doc, function (err, doc) {
			if (err) {
				promise.reject(err);

			} else {
				promise.resolve(doc);
			}
		});
	}
	return promise.promise;
};


module.exports = DBManager;