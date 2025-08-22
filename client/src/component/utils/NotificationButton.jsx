import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

const NotificationButton = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = useCallback(() => {
    enqueueSnackbar('Transaction Confirmed!', {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      className:
        'p-4 rounded-lg shadow-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold animate-fadeIn',
      persist: false,
      autoHideDuration: 3000,
    });
  }, [enqueueSnackbar]);

  return (
    <button
      onClick={showNotification}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Trigger Notification
    </button>
  );
};

export default NotificationButton;