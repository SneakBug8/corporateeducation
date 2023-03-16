export const authProvider = {
  login: ({ username, password }: any) =>
  {
    return new Promise((resolve, reject) =>
    {
      if (username === "admin" && password === "admin") {
        localStorage.setItem("role", "admin");
        resolve(true);
      }
      else if (username === "user" && password === "user") {
        localStorage.setItem("role", "user");
        resolve(true);
      }
      else if (username === "manager" && password === "manager") {
        localStorage.setItem("role", "manager");
        resolve(true);
      } else {
        reject("Wrong login or password");
      };
      console.log(`Role is ${localStorage.getItem("role")}`);
    });
  },
  checkAuth: () =>
  {
    return localStorage.getItem("role") ? Promise.resolve() : Promise.reject();
  },
  getPermissions: () =>
  {
    return Promise.resolve(localStorage.getItem("role") || "");
  },
  logout: () =>
  {
    localStorage.removeItem("role");
    return Promise.resolve("/login");
  },
  getIdentity: () =>
  {
    try {
      const fullName = localStorage.getItem("role") + "";

      return Promise.resolve({ fullName, id: 0, avatar: "" });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  checkError: (error: any) => Promise.resolve(),
};