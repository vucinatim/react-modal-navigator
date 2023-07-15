
# react-use-modal

react-use-modal is a highly customizable and easy-to-use Modal library for React. This library offers a built-in routing system that allows for multi-step modal dialogs. It comes with a provider to be wrapped around your application that gives access to the useModal() hook, which simplifies setting and accessing modals.

## Installation

You can install react-use-modal using npm or yarn.

If you are using npm:

```bash
npm install react-use-modal
```

If you are using yarn:

```bash
yarn add react-use-modal
```

## Usage

Firstly, wrap your application with the ModalActionsProvider:

```jsx
import { ModalActionsProvider } from 'react-use-modal';

function App() {
  return (
    <ModalActionsProvider>
      {/* Your app */}
    </ModalActionsProvider>
  );
}
```

You can then use the useModal hook in your components:

```jsx
import { useModal } from 'react-use-modal';

function ExampleComponent() {
  const { push, back, clear } = useModal();

  return (
    /* Your component */
  );
}
```

The useModal hook provides three methods:

- `push`: Opens a new modal page.
- `back`: Navigates back in the modal navigation stack.
- `clear`: Closes the modal and clears the navigation stack.

Based on the code you have provided, here is a simplified example that demonstrates the usage of the `useModal` hook. This example can be added to the readme file under the 'Example Usage' section:


# Example Usage

Here's a basic usage example of the `useModal` hook in a component:

```jsx
import { useModal } from 'react-use-modal';

const MyComponent = () => {
  const { push, clear } = useModal({
    cancel_booking: () => (
      <div>
        <p>Are you sure that you wish to cancel this booking?</p>

        <button onClick={() => clear()}>
          No
        </button>

        <button onClick={() => {
          // cancel booking logic
          clear();
        }}>
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
      <button onClick={handleCancelBooking}>
        Cancel Booking
      </button>
    </div>
  );
};
```

In this example, when the 'Cancel Booking' button is clicked, the `handleCancelBooking` function is invoked, which uses the `push` function provided by the `useModal` hook to open a new modal page. The modal page is defined by the `cancel_booking` key in the object passed to `useModal`. The modal contains a confirmation message and two buttons - one to close the modal without doing anything (No button) and the other to perform some cancel booking logic and then close the modal (Yes button).

## Options

This library provides multiple options to customize your Modals:

- `onClose`: Function that gets called when the modal is closed.
- `title`: The title of the modal.
- `leading`: A JSX element that is placed at the leading of the modal.
- `trailing`: A JSX element that is placed at the trailing of the modal.
- `children`: The content inside the modal.
- `disablePadding`: If set to true, the padding around the modal content is disabled.
- `disableScroll`: If set to true, scrolling inside the modal is disabled.
- `className`: A string that gets added to the className of the modal container.
- `backdropClassName`: A string that gets added to the className of the modal backdrop.

PageRoute options include:

- `id`: Unique id of the page.
- `title`: Title of the page.
- `actions`: An object of actions for the page, where the key is the action name, and the value is a ReactNode.
- `props`: Props for the page.
- `indismissable`: If set to true, the modal can't be dismissed by the user.
- `disablePadding`: If set to true, the padding of the modal page content is disabled.
- `disableScroll`: If set to true, scrolling inside the modal page is disabled.