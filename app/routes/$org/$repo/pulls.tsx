import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix/node';
import { octokit } from '~/lib/octokit';
import { removeGithubFromUrl } from '~/lib/utils';

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
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Pull Requests</h1>
      <ul className="border rounded-md divide-y">
        {pullRequests.map((pr) => (
          <li className=" p-4">
            <Link
              to={removeGithubFromUrl(pr.html_url)}
              prefetch="intent"
              className="block font-semibold hover:text-blue-600"
            >
              {pr.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
