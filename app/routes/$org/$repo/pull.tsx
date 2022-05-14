import { Link, NavLink, useLoaderData, Outlet } from '@remix-run/react';
import type { LoaderFunction } from '@remix/node';
import { octokit } from '~/lib/octokit';
import { removeGithubFromUrl } from '~/lib/utils';
import clsx from 'clsx';

export const loader: LoaderFunction = async ({ params }) => {
  const { org, repo } = params;

  const { data, status } = await octokit.rest.pulls.list({
    owner: org,
    repo,
  });

  if (status !== 200) {
    throw new Response('Not found', { status: 404 });
  }

  return { org, repo, pullRequests: data };
};

export default function () {
  const { org, repo, pullRequests } = useLoaderData();
  return (
    <div className="flex h-screen overflow-x-auto">
      <div className="p-4 h-full overflow-auto max-w-lg w-full shrink-0">
        <h1 className="text-sm font-semibold mb-1">Pull Requests</h1>
        <ul className="border rounded-md divide-y divide-gray-300 border-gray-300">
          {pullRequests.map((pr, i) => (
            <li className="" key={pr.url}>
              <NavLink
                to={removeGithubFromUrl(pr.html_url)}
                prefetch="intent"
                className={({ isActive }) =>
                  clsx('px-4 py-3 block font-semibold hover:text-blue-600', {
                    'bg-neutral-100 text-blue-600': isActive,
                    'rounded-t-md': i === 0,
                    'rounded-b-md': i === pullRequests.length - 1,
                  })
                }
              >
                {pr.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-full overflow-auto border-l border-gray-300 shrink-0">
        <Outlet />
      </div>
    </div>
  );
}
