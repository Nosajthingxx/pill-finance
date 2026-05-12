'use client';

import { useFormStatus } from 'react-dom';
import { deleteAccountAction } from '@/app/account/actions';

export default function DeleteAccountButton() {
  return (
    <form
      action={deleteAccountAction}
      onSubmit={(e) => {
        if (
          !confirm(
            'Delete your account?\n\n' +
              "Your account will be marked for deletion and you'll be logged out.\n" +
              'For 30 days you can sign back in with the same email to recover everything.\n' +
              'After 30 days, all your data is permanently deleted.\n\n' +
              'Are you sure?'
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <DeleteSubmit />
    </form>
  );
}

function DeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="account-delete-btn" disabled={pending}>
      {pending ? 'Deleting…' : 'Delete my account'}
    </button>
  );
}
