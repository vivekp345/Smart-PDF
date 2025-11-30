import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Check if we are in production (Render)
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction, // Must be true in production (HTTPS)
    sameSite: isProduction ? 'none' : 'lax', // Must be 'none' for cross-site cookies
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;