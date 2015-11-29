/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function(req,res){
		res.send({
			id:1,
			title:'Hello world'
		});
	}
};

