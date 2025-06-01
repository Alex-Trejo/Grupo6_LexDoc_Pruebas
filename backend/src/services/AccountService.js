import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AccountRepository } from '../repositories/AccountRepository.js';

const accountRepo = new AccountRepository();

export class AccountService {
  async register(account) {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    account.password = hashedPassword;
    return await accountRepo.create(account);
  }

  async login(username, password) {
    const user = await accountRepo.findByUsername(username);
    if (!user) throw new Error("User not found");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign(
      { id: user.account_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { user, token };
  }

  async recoverPassword(email) {
    const user = await accountRepo.findByEmail(email);
    if (!user) throw new Error("Email not found");
    // Prox lógica para enviar correo de recuperación con token
    return true;
  }

  async modifyProfile(account_id, profileData) {
    // Obtener cuenta actual
    const account = await accountRepo.findById(account_id);
    if (!account) throw new Error("Account not found");
    const updatedAccount = {
      ...account,
      ...profileData,
      account_id,
    };
    return await accountRepo.update(updatedAccount);
  }
}
