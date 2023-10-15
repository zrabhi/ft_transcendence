import React from 'react'

interface User {
  username: string;
  status: string;
  avatar: string;
}

interface FriendsDataProps {
  friendList: User[];
}

export default function FriendsData({friendList}: FriendsDataProps) {
  return (
    <div className="friends-list">
      <table className='w-full text-left mt-4'>
        <tbody>
          {friendList.length === 0 && (
            <tr className=''>
              <td className='text-center text-2xl' >No friends yet! </td>
            </tr>
          )}
          {friendList.map((user: any, index: number) => (
            <tr key={index} className=''>
              <td className='p-4' >
                <div className="flex items-center gap-4">
                  <div className="avatar w-16 h-16 rounded-full overflow-hidden">
                    <img src={user.avatar} alt="avatar" />
                  </div>
                  <div className="username">{user.username}</div>
                </div>
              </td>
              <td className='p-4' >
                <div className="status text-sm font-semibold tracking-wide">
                  {user.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
