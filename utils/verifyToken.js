import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const sessionToken =
    req.headers.authorization || req.cookies["next-auth.session-token"];

  if (!sessionToken) {
    return res.status(401).json({ error: "Session token is missing" });
  }
  try {
    // Verify the session token using the JWT secret key
    const decodedToken = jwt.verify(sessionToken, process.env.JWT_SECRET);

    // Extract user information from the decoded token payload
    const { _id, username, role, phone, country, city, zipCode, address } =
      decodedToken;

    // Attach user information to the request object
    req.user = {
      _id,
      username,
      role,
      phone,
      country,
      city,
      zipCode,
      address,
    };

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid session token" });
  }
  //     try {
  //     // Verify the token using the JWT_SECRET
  //     const decoded = jwt.verify(
  //       token,
  //       "dfgkjdfgbdj85435374534234b32j4jgtnfdjgnfdghfjhCfdjhlgfd"
  //     );
  //     req.user = decoded; // Add decoded user info to request object

  //     // Call the next middleware or route handler
  //     next();
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return res.status(500).json({ error: "Internal server error" });
  //   }
}

export default verifyToken;
