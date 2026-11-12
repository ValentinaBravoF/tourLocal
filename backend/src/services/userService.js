export function getUsers() {
  const users = localStorage.getItem("tourlocal_users");
  return users ? JSON.parse(users) : [];
}

export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("tourlocal_users", JSON.stringify(users));
}

export function findUser(email, password) {
  const users = getUsers();
  return users.find((u) => u.email === email && u.password === password);
}

export function setCurrentUser(user) {
  localStorage.setItem("tourlocal_currentUser", JSON.stringify(user));
}

export function getCurrentUser() {
  const user = localStorage.getItem("tourlocal_currentUser");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("tourlocal_currentUser");
}

export function updateUser(updatedUser) {
  let users = getUsers();

  const currentUser = getCurrentUser();

  users = users.map((u) =>
    u.email === currentUser.email ? { ...u, ...updatedUser } : u,
  );
  localStorage.setItem("tourlocal_users", JSON.stringify(users));

  setCurrentUser(updatedUser);
}
