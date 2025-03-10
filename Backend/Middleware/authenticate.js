const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Malformed token header" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from the header

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_test_secret'); // Verify token with fallback
        req.user = decoded; // Attach decoded payload to `req.user`
        console.log("Decoded Token:", decoded); // Debug log for the decoded token
        next(); // Proceed to the next middleware
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Forbidden: Token expired" });
        }
        console.error("JWT Verification Error:", err.message); // Log error for debugging
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

module.exports = authenticate;
