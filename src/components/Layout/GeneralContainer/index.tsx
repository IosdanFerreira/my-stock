import React from 'react';
import GeneralHead from '@/components/Layout/GeneralHead';

export default function GeneralContainer({children}: {children: React.ReactNode}) {
  return (
    <>
      <GeneralHead />
      <div>{children}</div>
    </>
  );
}
