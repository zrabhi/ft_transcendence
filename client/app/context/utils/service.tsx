export const baseUrlAuth = "http://127.0.0.1:8080/api/auth";
export const baseUrlUsers = "http://127.0.0.1:8080/api";
import axios from "axios";

export const postRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  // let message;
  // if (response.status != 200)
  // {
  //   message = "AN Error occurred...";
  //   if (response.data?.message)
  //       message = response.data.message;
  //   return ({error:true, message});
  // }
  // return (response.data);
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
