import React, { useEffect } from 'react'
import { useState } from 'react'
import { baseUrlUsers, getRequest } from '@/app/context/utils/service'

export default function ProfileData({data}: {data: any}) {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getRequest(`${baseUrlUsers}/users`);
        setUsers(allUsers);
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
  }, []);

  return (
    <div className="profile-data">
      <div className="leaderboard rounded-lg overflow-hidden">
        <table className='w-full text-left mt-2'>
          <thead className='text-sm tracking-wide capitalize font-light bg-purple-700 bg-blend-darken bg-opacity-25'>
            <tr className='' >
              <th className='p-4' >rank</th>
              <th className='p-4' >username</th>
              <th className='p-4' >points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index: number) => (
              <tr key={index} className='hover:bg-purple-700 rounded-md hover:bg-opacity-20'>
                <td className='p-4' >{index + 1}</td>
                <td className='p-4' >{user.username}</td>
                <td className='p-4' >{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
