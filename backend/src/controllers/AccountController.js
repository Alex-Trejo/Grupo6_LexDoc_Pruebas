import { AccountService } from '../services/AccountService.js';

const accountService = new AccountService();

export class AccountController {
  async register(req, res) {
    try {
      const account = req.body;
      const newAccount = await accountService.register(account);
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await accountService.login(username, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async recoverPassword(req, res) {
    try {
      const { email } = req.body;
      await accountService.recoverPassword(email);
      res.status(200).json({ message: 'Recovery email sent' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async modifyProfile(req, res) {
    try {
      const account_id = req.params.id;
      const profileData = req.body;
      const updated = await accountService.modifyProfile(account_id, profileData);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
