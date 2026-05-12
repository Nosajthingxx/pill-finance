'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateAccountAction } from '@/app/account/actions';
import type { ActionResult } from '@/app/portfolio/actions';

interface Props {
  defaultName: string | null;
}

export default function AccountForm({ defaultName }: Props) {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    updateAccountAction,
    null
  );
  return (
    <form action={formAction} className="tx-form" style={{ maxWidth: 420 }}>
      <div className="tx-field">
        <label className="tx-label" htmlFor="displayName">Display name (optional)</label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          maxLength={50}
          className="tx-input"
          placeholder="How should we address you?"
          defaultValue={defaultName ?? ''}
        />
      </div>
      {state?.ok === false && <div className="tx-error">{state.error}</div>}
      {state?.ok === true && <div className="account-saved">Saved.</div>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="tx-submit" disabled={pending} style={{ width: 'auto', padding: '10px 18px' }}>
      {pending ? 'Saving…' : 'Save'}
    </button>
  );
}
