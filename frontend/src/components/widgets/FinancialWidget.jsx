import React from 'react';

const FinancialWidget = ({ data }) => {
  const totalFee      = data?.totalFee ?? 0;
  const totalPaid     = data?.totalPaid ?? 0;
  const totalDues     = data?.totalDues ?? 0;
  const paymentStatus = data?.paymentStatus ?? '—';
  const dueDate       = data?.dueDate ?? '—';

  const isPaid        = paymentStatus === 'PAID' || totalDues === 0;

  return (
    <div className="w-full text-white/90 text-[15px] font-light leading-relaxed tracking-wide space-y-4">
      <ul className="list-none space-y-1">
        <li>• <strong className="font-medium text-white">Total Fee:</strong> ₹{totalFee.toLocaleString()}</li>
        <li>• <strong className="font-medium text-white">Total Fees Paid:</strong> ₹{totalPaid.toLocaleString()}</li>
        <li>
          • <strong className="font-medium text-white">Pending Balance:</strong>{' '}
          <span className={totalDues > 0 ? 'text-red-400 font-medium' : 'text-emerald-400 font-medium'}>
            ₹{totalDues.toLocaleString()}
          </span>
        </li>
        <li>
          • <strong className="font-medium text-white">Payment Status:</strong>{' '}
          <span className={isPaid ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
            {paymentStatus}
          </span>
        </li>
      </ul>

      {!isPaid && totalDues > 0 && (
        <p className="pt-1 text-[#d1d5db]">
          <em>Payment Reminder:</em> A payment of{' '}
          <strong className="text-white">₹{totalDues.toLocaleString()}</strong> is due by{' '}
          <strong className="text-white">{dueDate}</strong>. Please make the payment to avoid late fees.
        </p>
      )}

      {isPaid && (
        <p className="pt-1 text-emerald-400/80">
          ✅ All fees have been cleared. No pending dues.
        </p>
      )}
    </div>
  );
};

export default FinancialWidget;
