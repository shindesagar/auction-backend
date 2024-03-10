jwt = require("jsonwebtoken");
app = express();
app.get("/protected", async (req, res) => {
  //extract our JWT Token
  //Jwt verify
  //run some logic
  //bearer token
  token = req.headers.authToken.split(" ")[1];
  if (!token) res.status(500).send("No token found");
  jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
    if (err) res.status(500).send("token is not verified");
    res.status(400).send(user.userid);
    try {
      payload = jwt.verify(token, process.env.JWT_SECRETKEY);
      res.status(400).send(user.userid);
      //write any algorithm  with the user id.
    } catch (error) {
      res.status(500).send("token is not verified");
    }
  });
});