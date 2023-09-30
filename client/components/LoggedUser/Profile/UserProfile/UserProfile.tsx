import React from 'react'
import { useState, useEffect } from 'react';
import { baseUrlUsers, getRequest } from '@/app/context/utils/service';
import ProfileCard from '../ProfileCard/ProfileCard';
import Image from 'next/image';

export default function UserProfile({ username }: { username: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getRequest(`${baseUrlUsers}/users`);
        const currentUser = allUsers.filter((user: any) => user.username === username );
        console.log(currentUser.length);
        if (currentUser.length === 0) return setUser(null)
        else {
          // setUser(currentUser);
          // // console.log(user.length)
          console.log(currentUser[0].username);
          setUser(currentUser[0]);
          // console.log(user.username);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    const debouncedFetchUsers = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => {
      clearTimeout(debouncedFetchUsers);
    };
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  return (
    <div className='text-slate-50'>
      UserProfile
      <h1>the user is : {user.username}</h1>
      <Image
        src={user.avatar}
        alt="User Avatar"
        width={100}
        height={100}
      />
    </div>
  )
}
