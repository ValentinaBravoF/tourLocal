const USERS_KEY = "tourlocal_users";
const CURRENT_USER_KEY = "tourlocal_currentUser";

export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUser(email, password) {
  return getUsers().find((user) => user.email === email && user.password === password);
}

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateUser(updatedUser) {
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
}
