import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="p-4">
      <Link to="/trpc/trpc/pulls" prefetch="intent">
        trpc
      </Link>
    </div>
  );
}
