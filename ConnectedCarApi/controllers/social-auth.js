
var passport 				= require('passport');
var FacebookTokenStrategy 	= require('passport-facebook-token');
var GoogleTokenStrategy 	= require('passport-google-token').Strategy;
var GoogleAuth 				= require('google-auth-library');
const utility				= require('./helpers/utility');

passport.use(new FacebookTokenStrategy({
	clientID: process.env.FACEBOOK_CLIENT_ID, //'1105780666217940', //'1867243686823215',
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET //'2a252e28a1f9b45c041912cf8613921c' //'4f204d6a6818eac8b596b2d4f3bb4908'
	}, function(accessToken, refreshToken, profile, done) {
		const user = {
			'id'        : profile.id,
			'firstName' : profile.name.givenName,
			'lastName'  : profile.name.familyName,
			'username'	: (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '',
			'email'		: (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '',
			//'gender'	: profile.gender,
			'picture'	: profile.photos ? profile.photos[0].value : ''
		}
		
		// Perform actions against User model here
		// the user object we just made gets passed to the route's controller as `req.user`
		return done(null, user); 
		//return done(error, user);
		//User.findOrCreate({facebookId: profile.id}, function (error, user) {
		//	return done(error, user);
		//});
	}
));

passport.use(new GoogleTokenStrategy({
	clientID: process.env.GOOGLE_WEB_CLIENT_ID, 
	clientSecret: process.env.GOOGLE_CLIENT_SECRET 
	}, function(accessToken, refreshToken, profile, done) {
		const user = {
			'id'        : profile.id,
			'firstName' : profile.name.givenName,
			'lastName'  : profile.name.familyName,
			'username'	: (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '',
			'email'		: (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '',
			//'gender'	: profile.gender,
			'picture'	: profile.photos ? profile.photos[0].value : ''
		}
		
		// Perform actions against User model here
		// the user object we just made gets passed to the route's controller as `req.user`
		return done(null, user); 
		//return done(error, user);
		//User.findOrCreate({facebookId: profile.id}, function (error, user) {
		//	return done(error, user);
		//});
	}
));

var socialAuth = {
	
	facebookLogin : (req, res) => {
			passport.authenticate('facebook-token', function (err, user, info) {
				console.log("---------facebook-token--------");
				if(err){
					res.status(401).json({"error": "Failed to authenticate facebook user"}); 
                } else {
					if(user){
						res.json(utility.getToken(user));
					}else{
						res.status(401).json({"error": "Failed to authenticate facebook user."}); 
					}	
                }
        })(req, res);
	},
   
	googleLogin : (req, res) => {
			passport.authenticate('google-token', function (err, user, info) {
				console.log("---------google-token--------");
				console.log("---err ", err);
				if(err){
					res.status(401).json({"error": "Failed to authenticate google user."}); 
                } else {
					if(user){
						res.json(utility.getToken(user));
					}else{
						res.status(401).json({"error": "Failed to authenticate google user."}); 
					}	
                }
        })(req, res);
   },
   googleIdLogin : (req, res) => {
			var headers = req.headers;
			var token = utility.getHeaderAccessToken(headers); // headers.access_token;	
			var auth = new GoogleAuth;
			var client = new auth.OAuth2(process.env.GOOGLE_WEB_CLIENT_ID , '', '');
			client.verifyIdToken(
				token,
				//process.env.GOOGLE_WEB_CLIENT_ID ,
				[process.env.GOOGLE_WEB_CLIENT_ID, process.env.GOOGLE_IOS_CLIENT_ID, process.env.GOOGLE_ANDROID_CLIENT_ID],
				// Or, if multiple clients access the backend:
				//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
				function(e, login) {
				  console.log("---e ", e);
				  //var oauthError = JSON.parse(e.err);
				  //console.log('oauthError ',  oauthError);
				  console.log("---login ", login);
				  if(e){
					 res.status(401).json({"error": "Failed to authenticate google user"}); 
				  }else{
					var payload = login.getPayload();
					if(payload) {
						var userid = payload['sub'];
						var firstName = payload['name'];
						var lastName = '';
						var username = payload['email'];
						var picture = payload['picture'];
						const user = {
							'id'        : userid,
							'firstName' : firstName,
							'lastName'  : lastName,
							'username'	: username,
							'email'		: username,
							//'gender'	: profile.gender,
							'picture'	: picture
						}
						res.json(utility.getToken(user));
					}
				  }
				  //var payload = login.getPayload();
				  //var userid = payload['sub'];
				  //console.log("-----------userid ", userid);
				  // If request specified a G Suite domain:
				  //var domain = payload['hd'];
			});

	}	
}


module.exports = socialAuth;
