import { useGetNotificationCountQuery, useGetUserBasedNotificationListQuery } from '@/store/features/notification';
import { Bell } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Specify the type for the ref

  const { data: listQuery, refetch, isLoading } = useGetUserBasedNotificationListQuery();
  const { data: notification, refetch: notificationRefetch } = useGetNotificationCountQuery();

  useEffect(() => {
    if (isOpen) {
      refetch();
      notificationRefetch(); // Refetch the notification count when the dropdown is open
    }
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        <Bell />
        {notification?.data?.total_notification > 0 && (
          <span
            className='absolute top-[-10px] right-[-10px] w-[20px] h-[20px] bg-red-700 text-white flex justify-center items-center rounded-full text-[10px] font-extrabold'>
            {notification?.data?.total_notification}
          </span>
        )}
      </button>

      {notification?.data?.total_notification > 0 && isOpen && (
        <div ref={dropdownRef}
          className="absolute mt-2  w-[250px] md:w-[400px] md:-left-96 bg-white border rounded-lg shadow-lg z-10"
        >
          <div className='pl-5 pt-2 pb-2'>
            Notification
          </div>
          <div className='border border-t-1'></div>
          <ul className="max-h-[49vh] hide-scrollbar pt-4 pb-5 overflow-y-scroll px-5">
            <style jsx>{`
              ul::-webkit-scrollbar {
                width: 4px;
              }

              ul::-webkit-scrollbar-track {
                background: transparent;
              }

              ul::-webkit-scrollbar-thumb {
                background: #a7afce;
                border-radius: 10px;
              }

              ul::-webkit-scrollbar-thumb:hover {
                background: #8c9fc8;
              }

              ul::-webkit-scrollbar {
                display: block;
              }
            `}</style>
            {listQuery?.data?.map((notification: any, index: any) => {

              const createdAt = moment(notification?.created_at);
              const currentDate = moment(new Date());
              const differenceInDays = currentDate.diff(createdAt, 'days');

              return (
                <Link key={index} href={`/admin/notification/${notification?.id}/view`} onClick={() => setIsOpen(!isOpen)}>
                  <li className="px-4 py-2 bg-gray-200 hover:bg-[#206c6b] mb-2 cursor-pointer rounded-lg hover:text-white group">
                    <p className="truncate overflow-hidden whitespace-nowrap text-ellipsis"> {notification?.body}</p>
                    <p className='text-xs pt-3 text-[#9b9090] font-semibold hover:text-white group-hover:text-white'>
                      {differenceInDays > 10
                        ? moment(notification?.created_at).format('Do MMMM YYYY, h:mm:ss a')
                        : moment(notification?.created_at).startOf('hour').fromNow()}
                    </p>
                    <p className='text-xs text-[#9b9090] font-semibold hover:text-white group-hover:text-white'>{notification?.sender?.name}</p>
                  </li>
                </Link>
              )
            })}
          </ul>
          <div className='text-lg p-4 mt-3 text-center shadow-2xl text-blue-500 cursor-pointer'>
            <Link href="/admin/notification" onClick={() => setIsOpen(!isOpen)}>
              See All
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
