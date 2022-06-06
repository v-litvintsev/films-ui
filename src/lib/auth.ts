import Router from "next/router";
import Cookies from "js-cookie";
import { fetcher } from "./fetcher";

export const setToken = (data: any) => {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.set("id", data.user.id);
  Cookies.set("username", data.user.username);
  Cookies.set("jwt", data.jwt);

  if (Cookies.get("username")) {
    Router.reload();
  }
};

export const unsetToken = () => {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.remove("id");
  Cookies.remove("jwt");
  Cookies.remove("username");

  Router.reload();
};

export const getUserFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();
  if (jwt) {
    return fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((data) => {
        return data.username;
      })
      .catch((error) => console.error(error));
  } else {
    return;
  }
};

export const getIdFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();
  if (jwt) {
    return fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((data) => {
      return data.id;
    });
  } else {
    return;
  }
};

export const getTokenFromLocalCookie = () => {
  return Cookies.get("jwt");
};

export const getTokenFromServerCookie = (req: any) => {
  if (!req.headers.cookie || "") {
    return undefined;
  }
  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c: string) => c.trim().startsWith("jwt="));
  if (!jwtCookie) {
    return undefined;
  }
  const jwt = jwtCookie.split("=")[1];
  return jwt;
};

export const getIdFromServerCookie = (req: any) => {
  if (!req.headers.cookie || "") {
    return undefined;
  }
  const idCookie = req.headers.cookie
    .split(";")
    .find((c: string) => c.trim().startsWith("id="));
  if (!idCookie) {
    return undefined;
  }
  const id = idCookie.split("=")[1];
  return id;
};
