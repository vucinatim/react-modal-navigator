import { useModal } from 'react-modal-navigator';

export default function App() {
  const { push, clear } = useModal({
    cancel_booking: () => (
      <div>
        <p>Are you sure that you wish to cancel this booking?</p>

        <button onClick={() => clear()}>No</button>

        <button
          onClick={() => {
            // cancel booking logic
            clear();
          }}
        >
          Yes
        </button>
      </div>
    ),
  });

  const handleCancelBooking = () => {
    push({
      id: 'cancel_booking',
      title: 'Cancel Booking',
    });
  };

  return (
    <div>
      {/* Your component */}
      <button onClick={handleCancelBooking}>Cancel Booking</button>
    </div>
  );
}