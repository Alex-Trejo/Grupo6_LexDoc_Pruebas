import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AccountRepository } from '../repositories/AccountRepository.js';
import { ProfileRepository } from '../repositories/ProfileRepository.js';

const accountRepo = new AccountRepository();
const profileRepo = new ProfileRepository();

export class AccountService {
  async register(account) {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    account.password = hashedPassword;
    const createdAccount = await accountRepo.create(account);
    await profileRepo.create({
      account_id: createdAccount.account_id,
      content: null,
    });

    return createdAccount;
  }

  async login(username, password) {
    try {
      const user = await accountRepo.findByUsername(username);
      if (!user) {
        console.log('❌ Usuario no encontrado:', username);
        throw new Error('User not found');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        console.log('❌ Contraseña incorrecta para:', username);
        throw new Error('Invalid password');
      }

      const secret = process.env.JWT_SECRET || 'AAAAAAAAABBBBBCCCC';
      if (!secret) {
        console.error('❗ JWT_SECRET no está definido.');
        throw new Error('Server misconfiguration');
      }

      const token = jwt.sign(
        { id: user.account_id, username: user.username, role: user.role },
        secret,
        { expiresIn: '1h' }
      );

      console.log('✅ Login exitoso:', username);
      return { user, token };
    } catch (err) {
      console.error('⚠️ Error en login:', err.message);
      throw err;
    }
  }

  async recoverPassword(email) {
    const user = await accountRepo.findByEmail(email);
    if (!user) throw new Error('Email not found');
    // Aquí agregar lógica para enviar email de recuperación
    return true;
  }

  async modifyProfile(account_id, profileData) {
    const account = await accountRepo.findById(account_id);
    if (!account) throw new Error('Account not found');

    const email = profileData.email?.trim() || account.email;
    const phone_number =
      profileData.phone_number?.trim() || account.phone_number;

    let password = account.password;
    if (profileData.password?.trim()) {
      password = await bcrypt.hash(profileData.password, 10);
    }

    const updatedAccount = {
      ...account,
      email,
      phone_number,
      password,
      account_id,
    };

    await accountRepo.update(updatedAccount);

    let updatedProfile = null;
    if (profileData.content !== undefined) {
      const profile = await profileRepo.findByAccountId(account_id);
      if (profile) {
        updatedProfile = await profileRepo.update({
          profile_id: profile.profile_id,
          content: profileData.content,
        });
      }
    }

    return {
      account: updatedAccount,
      ...(updatedProfile && { profile: updatedProfile }),
    };
  }
}
