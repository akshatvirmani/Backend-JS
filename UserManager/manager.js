const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
// Add to the top of the page where imports are done
// This module helps to accept input from user
const prompt = require("prompt-sync");
const input = prompt();

/*
 *	addUser = (email: <string>, password: <string>) => { userId: <string>}
 *  Accept email and password of the user to be added
 *	Read get the users from the database
 *	Encrypt user email to get userId
 *	add user to the users database
 * 	return userId
 */
const addUser = (email, password) => {
	const jsonString = fs.readFileSync("users.json"); // Read the users file
	const data = JSON.parse(jsonString); // Parse the text to JSON in the data variable

	// encrypt the user email to create the userId
	const userId = crypto
		.createHash("sha1")
		.update(email, "utf8")
		.digest("hex");

	// add the user to data
	data.users[userId] = {
		email,
		password: password,
	};

	// Write the data to the file
	fs.writeFileSync("users.json", JSON.stringify(data, null, 4));
	return { userId }; // return userId
};


/*
 *	getUser = (email: <string>, password: <string>) => 
 	{ 	emailExists: <boolean>,
		passMatch: <boolean>,
    	userId: null || <string> ,
	}
 *
 *  Accept email and password of the user to be added
 *	Read get the users from the database
 *	Encrypt user email to get userId
 *	add user to the users database
 * 	return userId
 */
const getUser = (email, password) => {
	const jsonString = fs.readFileSync("users.json"); // Read the users file
	const data = JSON.parse(jsonString); // Parse the text to JSON in the data variable

	// Set response Model with default values
	const response = {
		emailExists: false,
		passMatch: false,
		userId: null,
	};

	// Loop through all users
	for (const user in data.users) {
		// if email and password both matched that means it is the same user and
		// we can share userId and say that emailExists and passMatch
		if (
			data.users[user].email === email &&
			data.users[user].password === password
		) {
			response.emailExists = true;
			response.passMatch = true;
			response.userId = user;
			break;
		}
		// if email matched but password mismatch that means user entered wrong password
		// we shouldn't share userId and say that emailExists is true but passMatch is false
		else if (
			data.users[user].email === email &&
			data.users[user].password !== password
		) {
			response.emailExists = true;
			break;
		}
	}
	// return response at the end of the function
	return response;
};

// Encrypt Password so that no one can see it
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    console.log("encrypted password is",hash)
}

// Re-enter password and verification feature in Sign Up
var verify = (password,verifyPassword) => {
    if(password===verifyPassword){
        console.log("Password matched");
		return true;
	}
	else{
		return false;
	}
}

/*
 *	signUp = () => 
 	{ 	userId: null || <string> ,
	}
 *
 *  Accept email and password input of the user to be added
 *	getUsers from the database with email
 * 	If user already exists ask to sign in
 *	Else add the user and return userId
 */
const signUp = () => {
	// Accept email and password input
	const email = input("Enter Your Email: ");
	const password = input("Enter Your Password: ");
	var verifyPassword = input("Verify Password: ");
	// Re-enter password and verification feature in Sign Up
    var v= verify(password,verifyPassword); 
	while(!v)
	{
		console.log("Both passwords do not match");
        verifyPassword = input("Verify Password: ");
		v= verify(password,verifyPassword);
	}

	// getUsers from the database with Email
	const user = getUser(email, "");
	// if user already exists ask to sign in and return userId as null
	if (user.emailExists) {
		console.log("Email Already exists, please sign in");
		return { userId: null };
	}
	// else add the user and return userId
	else {
		const userId = addUser(email, password);
		console.log("SignUp Successful");
		hashPassword(password);
		return { userId };
	}
};

/*
 *	signIn = () => 
 	{ 	userId: null || <string> ,
	}
 *
 *  Accept email and password input of the user to be signed In
 *	getUser with the inputted values and 
 * 	return userId if user is found else return userId as null
 */
const signIn = () => {
	// Accept email and password input
	const email = input("Enter Your Email: ");
	const password = input("Enter Your Password: ");

	// Try to get user with inputted email and password
	const user = getUser(email, password);

	// Log proper message
	if (user.passMatch) console.log("Successfully Signed In");
	else if (user.emailExists){
		var a;
		// If wrong password while sign in ask to repeat up to 3 times
		for(a=0;a<3;a++){
		console.log("Password Mismatch");	
		console.log("Enter details again");
		const email = input("Enter Your Email: ");
		const password = input("Enter Your Password: ");
		const user = getUser(email,password);
		if(user.passMatch)
		{
			console.log("Successfully Signed In");
			break;
		}
		}
		if(a==3 && user.passMatch==false)
		{
			console.log("Chances are over");
		}
	} 
	else console.log("Email don't exist, please sign up");

	// Return userId if user present
	return { userId: user.userId };
};

/*
 * main = () => null
 *
 * menu driven user interaction
 */
const main = () => {
	let ch = input("Enter 'in' for Sign In and 'up' for Sign Up: ");
	ch = ch.toLowerCase();
	let userId;
	switch (ch) {
		case "in":
			userId = signIn().userId;
			break;
		case "up":
			userId = signUp().userId;
			break;
		default:
			console.log("Please SignUp/SignIn");
			main();
	}
};

main();