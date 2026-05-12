'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { ASSETS } from '@/lib/slugs';
import type { ActionResult } from '@/app/portfolio/actions';

interface Props {
  action: (
    prev: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult>;
  defaultValues?: {
    assetSlug?: string;
    side?: 'buy' | 'sell' | 'short_open' | 'short_close';
    quantity?: string;
    priceUsd?: string;
    transactionDate?: string;
    note?: string;
  };
  submitLabel?: string;
}

const SIDE_OPTIONS: { value: string; label: string; hint: string }[] = [
  { value: 'buy', label: 'Buy', hint: 'Add to a long position' },
  { value: 'sell', label: 'Sell', hint: 'Reduce or close a long' },
  { value: 'short_open', label: 'Short open', hint: 'Open or add to a short' },
  { value: 'short_close', label: 'Short close', hint: 'Cover or reduce a short' },
];

export default function TransactionForm({
  action,
  defaultValues,
  submitLabel = 'Save transaction',
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    action,
    null
  );

  function fieldErr(field: string): string | undefined {
    if (state?.ok === false && state.fieldErrors) {
      return state.fieldErrors[field]?.[0];
    }
    return undefined;
  }

  return (
    <form action={formAction} className="tx-form">
      <div className="tx-field">
        <label className="tx-label" htmlFor="assetSlug">Asset</label>
        <select
          id="assetSlug"
          name="assetSlug"
          className="tx-input"
          defaultValue={defaultValues?.assetSlug ?? ''}
          required
        >
          <option value="" disabled>Choose an asset</option>
          {ASSETS.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.shortName} — {a.commonName}
            </option>
          ))}
        </select>
        {fieldErr('assetSlug') && <div className="tx-fielderr">{fieldErr('assetSlug')}</div>}
      </div>

      <div className="tx-field">
        <label className="tx-label" htmlFor="side">Action</label>
        <select
          id="side"
          name="side"
          className="tx-input"
          defaultValue={defaultValues?.side ?? 'buy'}
          required
        >
          {SIDE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label} — {o.hint}</option>
          ))}
        </select>
        {fieldErr('side') && <div className="tx-fielderr">{fieldErr('side')}</div>}
      </div>

      <div className="tx-row">
        <div className="tx-field tx-field-half">
          <label className="tx-label" htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="any"
            min="0"
            inputMode="decimal"
            className="tx-input"
            placeholder="e.g. 10"
            defaultValue={defaultValues?.quantity ?? ''}
            required
          />
          {fieldErr('quantity') && <div className="tx-fielderr">{fieldErr('quantity')}</div>}
        </div>
        <div className="tx-field tx-field-half">
          <label className="tx-label" htmlFor="priceUsd">Price (USD)</label>
          <input
            id="priceUsd"
            name="priceUsd"
            type="number"
            step="any"
            min="0"
            inputMode="decimal"
            className="tx-input"
            placeholder="e.g. 950.00"
            defaultValue={defaultValues?.priceUsd ?? ''}
            required
          />
          {fieldErr('priceUsd') && <div className="tx-fielderr">{fieldErr('priceUsd')}</div>}
        </div>
      </div>

      <div className="tx-field">
        <label className="tx-label" htmlFor="transactionDate">Date</label>
        <input
          id="transactionDate"
          name="transactionDate"
          type="date"
          className="tx-input"
          defaultValue={defaultValues?.transactionDate ?? today}
          max={today}
          required
        />
        {fieldErr('transactionDate') && <div className="tx-fielderr">{fieldErr('transactionDate')}</div>}
      </div>

      <div className="tx-field">
        <label className="tx-label" htmlFor="note">Note (optional)</label>
        <textarea
          id="note"
          name="note"
          rows={2}
          maxLength={500}
          className="tx-input tx-textarea"
          placeholder="Anything you want to remember about this trade"
          defaultValue={defaultValues?.note ?? ''}
        />
      </div>

      {state?.ok === false && !state.fieldErrors && (
        <div className="tx-error">{state.error}</div>
      )}

      <div className="tx-actions">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="tx-submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  );
}
