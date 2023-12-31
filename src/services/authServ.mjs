import UserManager from '../dao/UserManager.mjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../dao/models/user.model.mjs';
import { ENV_CONFIG } from '../config/config.mjs';

class AuthService {
  constructor() {
    this.userManager = new UserManager();
    this.secretKey = ENV_CONFIG.jwtSecret;  
  }
  
  async login(email, password) {
    const user = await this.userManager.login(email, password);
    if (!user) {
      return null;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      this.secretKey,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  async githubCallback(profile) {
    try {
      if (!profile || !profile._json ) {
        throw new Error("Profile information is incomplete.");
      }
  
      if (!profile._json.email) {
        profile._json.email = 'no-email@example.com';
      }
  
      let user = await userModel.findOne({ email: profile._json.email });
  
      if (!user) {
        user = await userModel.create({
          first_name: profile._json.name || 'Unknown',
          last_name: '',
          email: profile._json.email,
          age: 100,  
          password: '',  
          role: 'user',
        });
      }
  
      return user;
    } catch (error) {
      throw error;
    }
  }
}


export default AuthService;