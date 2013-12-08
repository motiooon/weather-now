var memory = {};

var __chrome={
	storage: {
		local:{
			get : function(key, cb){
				if(memory[key]){
					cb(memory[key]);
				}else{
					cb({});
				}
			},
			set: function(key, cb){
				memory[key] = key;
				cb();
			}
		}
	}
};

