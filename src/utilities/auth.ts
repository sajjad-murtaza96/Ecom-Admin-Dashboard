export const isAuthenticated = async (cookies: {
  get: (name: string) => { value: string } | undefined;
}) => {
  const authCookie = cookies.get("ecom-admin-dashboard-auth");
  return authCookie?.value === "true";
};

export const removeAuth = async (cookies: { delete: (name: string) => void }) => {
  cookies.delete("ecom-admin-dashboard-auth");
};

export const setAuth = async (cookies: {
  set: (name: string, value: string) => void;
}) => {
  cookies.set("ecom-admin-dashboard-auth", "true");
};
