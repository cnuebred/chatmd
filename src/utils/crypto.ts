import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

type algorithm_t = "aes-256-cbc"
type encrypt_message_t = {
  iv: string,
  data: string
}

const key = process.env.BACKEND_AUTH_SECRET

export const encrypt = (text: string, algorithm: algorithm_t) => {
  const iv = randomBytes(16);
  let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}

export const decrypt = (message: encrypt_message_t, algorithm: algorithm_t) => {
  let iv = Buffer.from(message.iv, "hex");
  let encryptedText = Buffer.from(message.data, "base64");
  let decipher = createDecipheriv(
    algorithm,
    Buffer.from(key, "base64"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}