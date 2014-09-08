router.get('/register', function(req, res) {
  res.render('register', {
  	currentUser: undefined });
});

router.post("/register", function(req, res) {

	var userModel = mongoose.model("users");

	// Put into db
	var body = req.body;
	var username = req.body.username;
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;
	var email = req.body.email;

	// Input verification
	if(username == ""){
		res.status(500);
		res.send("Username cannot be empty");
	} else if(password == ""){
		res.status(500);
		res.send("Password cannot be empty")
	} else if(confirmPassword != password){
		res.status(500);
		res.send("Password confirmation does not match")
	} else if(email == ""){
		res.status(500);
		res.send("Email cannot be empty");
	} else{
		// Hash password
		var hashedPassword = bcrypt.hashSync(password);
		console.log("Hashed password: " + hashedPassword);

		var data = {
			username: username,
			password: hashedPassword,
			email: email
		};
		
		var entry = new userModel(data);
		entry.save(function(error, user){
			if(error){
				console.log(error);
			} else{
				console.log("User successfully created");
				console.log(user);
				userModel.login(username, password, function(error, data){
					if(error){
						console.log(error);
					} else{
						// Put currentUser object in session
						req.session.currentUser = user;
						console.log("User login successful");
						res.redirect("/");
					}
				});
				
			}
		});
	}

});

module.exports = router;