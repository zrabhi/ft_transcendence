export const baseUrlAuth = "http://192.168.1.128:8080/api/auth";
export const baseUrlUsers = "http://192.168.1.128:8080/api";
export const baseChatUrl = "http://192.168.1.128:8080/chat";
import axios from "axios";

export const postRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body,
  });
  // console.log(response);

  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
};
export const getQrCode = async (url:string) =>
{
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
}

export const postFileRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    body,
    credentials: "include",
  });
  // console.log(response);

  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
};

export const putRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
};

export const getRequest = async (url: string) => {
  console.log("url", url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;
};

export const postCheckRequest = async (url: string, body : any) =>
{
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    credentials: "include",
  },);

  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) message = data.message;
    else message = data;
    return { error: true, message };
  }
  return data;

}
