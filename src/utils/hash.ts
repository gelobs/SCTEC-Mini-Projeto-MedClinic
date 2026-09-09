// TODO: substituir por hash real com bcrypt (ver próximo commit).
export async function hashPassword(plainPassword: string): Promise<string> {
  return plainPassword;
}

export async function comparePassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  return plainPassword === passwordHash;
}
