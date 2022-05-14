import type { LoaderFunction } from '@remix/node';
import invariant from 'tiny-invariant';
import { octokit } from '~/lib/octokit';
import { useMatchesData } from '~/lib/utils';
import {
  Link,
  useLoaderData,
  PrefetchPageLinks,
  useLocation,
} from '@remix-run/react';
import snarkdown from 'snarkdown';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useMemo } from 'react';
import { removeGithubFromUrl } from '~/lib/utils';

export const loader: LoaderFunction = async ({ params }) => {
  const { org: owner, repo, pull_number } = params;
  const [
    { data: reviews, status: reviewsStatus },
    { data: pullRequest, status: pullRequestStatus },
  ] = await Promise.all([
    octokit.rest.pulls.listReviews({
      owner,
      repo,
      pull_number,
    }),
    octokit.rest.pulls.get({
      owner,
      repo,
      pull_number,
    }),
  ]);

  if (reviewsStatus !== 200 || pullRequestStatus !== 200) {
    throw new Response('Not found', { status: 404 });
  }

  return { owner, repo, reviews, pullRequest };
};

// function GithubComment() {

// }

export default function () {
  const { owner, repo, reviews, pullRequest } = useLoaderData();
  const { pullRequests } = useMatchesData('routes/$org/$repo/pull');
  const location = useLocation();
  console.log("hoya",reviews)
  // const prefetchRoutes = useMemo(() => {
  //   const urls = pullRequests.map((pr) => removeGithubFromUrl(pr.html_url));
  //   const result = [];
  //   for (const url of urls) {
  //     if (result.length === 3) {
  //       break;
  //     }
  //     if (result.length > 0 || url === location.pathname) {
  //       result.push(url);
  //       continue;
  //     }
  //   }
  //   return result;
  // }, [pullRequests]);

  return (
    <>
      <div className="p-4 max-w-lg">
        <div className="border rounded-md border-gray-300">
          <div className="px-4 py-2 border-b bg-neutral-100 border-gray-300 rounded-t-md">
            <div className="flex text-sm whitespace-nowrap">
              <span className="font-semibold">{pullRequest.user.login}</span>{' '}
              <span className="text-neutral-600 ml-2 whitespace-nowrap">
                commented{' '}
                {formatDistance(new Date(pullRequest.created_at), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <div
            className="p-4 prose"
            dangerouslySetInnerHTML={{ __html: snarkdown(pullRequest.body) }}
          ></div>
        </div>

        {reviews.map(r => (
          <div className="border rounded-md border-gray-300">
            <div className="px-4 py-2 border-b bg-neutral-100 border-gray-300 rounded-t-md">
              <div className="flex text-sm whitespace-nowrap">
                <span className="font-semibold">{pullRequest.user.login}</span>{' '}
                <span className="text-neutral-600 ml-2 whitespace-nowrap">
                  commented{' '}
                  {formatDistance(new Date(pullRequest.created_at), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div
              className="p-4 prose"
              dangerouslySetInnerHTML={{ __html: snarkdown(pullRequest.body) }}
              ></div>
          </div> 
      ))}
      {/* {prefetchRoutes.map((r) => (
        <PrefetchPageLinks key={r} page={r} />
      ))} */}
    </>
  );
}
