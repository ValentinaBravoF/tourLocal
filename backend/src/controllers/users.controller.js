import db from "../db.js";

export function registerUser(req, res) {
  const { nombre, email, password, telefono, ciudad, fechaRegistro, foto } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO users (nombre, email, password, telefono, ciudad, fechaRegistro, foto) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      nombre,
      email,
      password,
      telefono || "",
      ciudad || "",
      fechaRegistro || "",
      foto || "",
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      nombre,
      email,
      telefono,
      ciudad,
      fechaRegistro,
      foto: foto || "",
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

export function updateProfile(req, res) {
  const { id, email, nombre, telefono, ciudad, foto } = req.body;
  const headerUserId = req.get("X-User-Id")?.trim();

  try {
    let user;
    if (id) {
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    }
    if (!user && headerUserId && !isNaN(Number(headerUserId))) {
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(headerUserId));
    }
    if (!user && email) {
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    }
    if (!user) {
      // Tomamos el primer usuario como fallback activo si existe
      user = db.prepare("SELECT * FROM users LIMIT 1").get();
    }

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const updatedNombre = nombre !== undefined ? nombre : user.nombre;
    const updatedTelefono = telefono !== undefined ? telefono : user.telefono;
    const updatedCiudad = ciudad !== undefined ? ciudad : user.ciudad;
    const updatedFoto = foto !== undefined ? foto : user.foto;

    db.prepare(`
      UPDATE users 
      SET nombre = ?, telefono = ?, ciudad = ?, foto = ?
      WHERE id = ?
    `).run(updatedNombre, updatedTelefono, updatedCiudad, updatedFoto, user.id);

    const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id);
    const { password: _, ...userWithoutPassword } = updated;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil del usuario" });
  }
}

export function getProfile(req, res) {
  const headerUserId = req.get("X-User-Id")?.trim();
  const email = req.query.email;

  try {
    let user;
    if (headerUserId && !isNaN(Number(headerUserId))) {
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(headerUserId));
    }
    if (!user && email) {
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    }
    if (!user) {
      user = db.prepare("SELECT * FROM users LIMIT 1").get();
    }

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil del usuario" });
  }
}
