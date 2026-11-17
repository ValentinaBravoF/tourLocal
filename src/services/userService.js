const USERS_KEY = "tourlocal_users";
const CURRENT_USER_KEY = "tourlocal_currentUser";

export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  const parsedUsers = users ? JSON.parse(users) : [];
  let migrated = false;
  const usersWithIds = parsedUsers.map((user) => {
    if (user.id) return user;

    migrated = true;
    return { ...user, id: crypto.randomUUID() };
  });

  if (migrated) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usersWithIds));
  }

  return usersWithIds;
}

export function saveUser(user) {
  const users = getUsers();
  users.push({ ...user, id: user.id || crypto.randomUUID() });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUser(email, password) {
  return getUsers().find((user) => user.email === email && user.password === password);
}

export function setCurrentUser(user) {
  const savedUser = user.id
    ? null
    : getUsers().find((item) => item.email === user.email);
  const currentUser = user.id
    ? user
    : savedUser || { ...user, id: crypto.randomUUID() };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
}

export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  if (!user) return null;

  const parsedUser = JSON.parse(user);
  if (parsedUser.id) return parsedUser;

  const savedUser = getUsers().find((item) => item.email === parsedUser.email);
  const currentUser = savedUser
    ? { ...savedUser, ...parsedUser, id: savedUser.id }
    : { ...parsedUser, id: parsedUser.id || crypto.randomUUID() };

  if (currentUser.id !== parsedUser.id) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  return currentUser;
}

export function getUserHeaders() {
  const userId = getCurrentUser()?.id;
  return userId ? { "X-User-Id": String(userId) } : {};
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export async function updateUser(updatedUser) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error("No hay un usuario activo para actualizar.");
  }

  const mergedUser = { ...currentUser, ...updatedUser };
  const users = getUsers().map((user) =>
    user.email === currentUser.email ? mergedUser : user,
  );

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setCurrentUser(mergedUser);

  try {
    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getUserHeaders(),
      },
      body: JSON.stringify({
        id: mergedUser.id,
        email: mergedUser.email,
        nombre: mergedUser.nombre,
        telefono: mergedUser.telefono,
        ciudad: mergedUser.ciudad,
        foto: mergedUser.foto,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setCurrentUser({ ...mergedUser, ...data });
    }
  } catch {
    // Si la API no está disponible, los datos ya están resguardados en localStorage
  }

  return mergedUser;
}
