import { useModal } from "react-modal-navigator";

export default function App() {
  const { push, clear } = useModal({
    cancel_booking: () => (
      <div className="flex flex-col gap-8">
        <p className="text-lg text-center font-semibold">
          Are you sure that you wish to cancel this booking?
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="p-2 rounded-xl w-28 bg-white text-gray-500 hover:text-gray-600 shadow-lg hover:shadow-xl transition-all"
            onClick={() => clear()}
          >
            No
          </button>

          <button
            className="p-2 rounded-xl w-28 bg-white text-red-500 hover:text-red-600 shadow-lg hover:shadow-xl transition-all"
            onClick={() => {
              push({
                id: "cancelation_reason",
                modal: {
                  title: "Cancelation Reason",
                  style: {
                    modalContent: {
                      width: "500px",
                      height: "500px",
                    },
                  },
                },
              });
            }}
          >
            Yes
          </button>
        </div>
      </div>
    ),
    cancelation_reason: () => (
      <div className="flex flex-col items-center gap-8">
        <p className="text-lg text-center font-semibold">
          What is the reason for canceling?
        </p>

        <input className="p-2 w-full rounded-xl bg-white shadow-lg hover:shadow-xl transition-all" />

        <button
          className="p-2 rounded-xl w-28 bg-white text-blue-400 hover:text-blue-500 shadow-lg hover:shadow-xl transition-all"
          onClick={() => clear()}
        >
          Submit
        </button>
      </div>
    ),
  });

  const handleCancelBooking = () => {
    push({
      id: "cancel_booking",
      modal: {
        title: "Cancel Booking",
        leading: undefined,
        trailing: undefined,
        disablePadding: undefined,
        disableScroll: undefined,

        // Define your own styles here will override the default styles
        style: {
          modalContainer: undefined,
          modalContent: undefined,
          modalHeader: undefined,
          modalTitle: undefined,
          modalDivider: undefined,
          modalBody: undefined,
        },
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Your component */}
      <button
        className="rounded-xl shadow-lg p-4 text-blue-500"
        onClick={handleCancelBooking}
      >
        Cancel Booking
      </button>
    </div>
  );
}
