new Promise(function(resolve, reject) {

  add(() => resolve(3+2));

}).then(function(result) {
	return new Promise((resolve, reject) => {
    multipl(() => resolve(result * 3));
  });

}).then(function(result) {

  console.log(result);

});