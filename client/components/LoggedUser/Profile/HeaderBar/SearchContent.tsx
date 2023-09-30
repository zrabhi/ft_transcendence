import React, { useState, useEffect } from 'react';
import { baseUrlUsers, getRequest } from '@/app/context/utils/service';
import Image from 'next/image';
import Link from 'next/link'

export default function SearchContent({data}: any) {
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (searchValue === '') return setUsers([]);
    const fetchUsers = async () => {
      try {
        const allUsers = await getRequest(`${baseUrlUsers}/users`);
        const filteredUsers = allUsers.filter((user: any) => {
          return user.username.toLowerCase().includes(searchValue.toLowerCase()) && user.username !== data.username;
          }
        );
        setUsers(filteredUsers);
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
  }, [searchValue]);

  return (
    <div className="search-content">
      <div className="input">
        <input
          type="text"
          placeholder="Enter the username"
          className="w-full px-2 py-2 mx-auto rounded-[.5rem] bg-slate-300
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50
            block placeholder-capitalize text-black font-semibold"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div
        className={`${users.length === 0 ? 'hidden' : ''} user-list 
          mt-4 bg-gray-800 bg-opacity-50 rounded-[.5rem] p-2
        `}
      >
        <ul className='flex flex-col'>
          {users.map((user: any) => (
            <div key={user.id} className="user">
              <Link href={`/profile/${user.username}`}>
                <li
                  key={user.username}
                  className='flex items-center space-x-2 cursor-pointer hover:bg-slate-400 
                  hover:bg-opacity-50 rounded-[.5rem] p-2'
                >
                  <div className="w-8 h-8 relative overflow-hidden rounded-full">
                    <Image
                      src={user.avatar}
                      alt="avatar"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <span className="text-md font-medium">{user.username}</span>
                </li>
              </Link>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
