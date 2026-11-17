import db from "../db.js";

export function registerUser(req, res) {
  const { nombre, email, password, telefono, ciudad, fechaRegistro } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO users (nombre, email, password, telefono, ciudad, fechaRegistro) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      nombre,
      email,
      password,
      telefono || "",
      ciudad || "",
      fechaRegistro || "",
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      nombre,
      email,
      telefono,
      ciudad,
      fechaRegistro,
    });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
    .get(email, password);

  if (!user) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
}
