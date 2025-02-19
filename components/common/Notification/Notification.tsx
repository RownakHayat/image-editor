import { useChatNotificationQuery } from '@/store/features/helpDesk';

function Notification() {
  const refreshPage = () => {
    window.location.reload();
  };
  // const { data: listQuery } = useChatNotificationQuery({})
  return (
    <>
      {
        // listQuery?.data?.unread_message != 0 && <span className="w-6 h-6 rounded-3xl bg-red-600  flex items-center justify-center font-bold text-white absolute -top-2 -right-1 ">{listQuery?.data?.unread_message}</span>
      }
      {/* <button onClick={refreshPage}>
      <RefreshCw/>
      </button> */}
    </>
  );
}

export default Notification;

