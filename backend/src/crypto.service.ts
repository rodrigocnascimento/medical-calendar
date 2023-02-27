import { Injectable } from "@nestjs/common";
import * as crypto from "node:crypto";

const CIPHER_TOKEN = "d1ea33aa-8614-4fae-b2b9-ec7982c961be";

@Injectable()
export class CryptoService {
  private readonly algorithm = "aes-256-cbc"; //Using AES encryption
  private readonly key = crypto.randomBytes(32);
  private readonly iv = crypto.randomBytes(16);

  encrypt(text: string) {
    const cipher = crypto.createCipher("aes192", CIPHER_TOKEN);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  decrypt(encrypted) {
    const decipher = crypto.createDecipher("aes192", CIPHER_TOKEN);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
