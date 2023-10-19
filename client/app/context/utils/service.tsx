export const baseUrlAuth = process.env.NEXT_PUBLIC_BACKEND_HOST +  "/api/auth";
export const baseUrlUsers = process.env.NEXT_PUBLIC_BACKEND_HOST + "/api";
export const baseChatUrl = process.env.NEXT_PUBLIC_BACKEND_HOST +  "/chat";
import { showSnackbar } from "./showSnackBar";


export const postRequest = async (url: string, body: any) => {
  try{
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body,
  });

  const data = await response.json();
  if (response?.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}catch(err)
{
  showSnackbar("Something Went Wrong", false);
  return {error: true}
}
};
export const getQrCode = async (url:string) =>
{
  try{
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  if (response?.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}catch(err)
{
  showSnackbar("Something Went Wrong", false);
  return {error: true}
}
}

export const postFileRequest = async (url: string, body: any) => {
  try{
  const response = await fetch(url, {
    method: "POST",
    body,
    credentials: "include",
  });

  const data = await response.json();
  if (response?.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}catch(err)
{
  showSnackbar("Something Went Wrong", false);
  return {error: true}
}
};

export const putRequest = async (url: string, body: any) => {
  try{
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    credentials: "include",
  });
  const data = await response.json();
  if (response?.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}catch(err)
{
  showSnackbar("Something Went Wrong", false);
  return {error: true}
}
};

export const getRequest = async (url: string) => {
  try{
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (response?.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}catch(err)
{
  showSnackbar("Something Went Wrong", false);
  return {error:true}
}
};

export const getRequestBody = async (url: string, body: any) => {
  try{
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    credentials: "include",
  });

  const data = await response.json();
  if (response?.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}catch(err)
{
  showSnackbar("Something Went Wrong", false);
  return {error: true}
}
};

export const postCheckRequest = async (url: string, body : any) =>
{
  try{
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    credentials: "include",
  },);

  const data = await response.json();
  if (response?.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}catch(err)
{
  showSnackbar("Something Went Wrong", false);
  return {error: true}
}

}
