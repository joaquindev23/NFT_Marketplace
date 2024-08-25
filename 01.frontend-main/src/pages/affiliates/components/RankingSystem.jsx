const features = [
  {
    name: 'Multi-Level Rewards.',
    description:
      'Earn rewards from direct referrals (Level 1) and indirect referrals up to 5 levels deep. The rewards increase with your rank and referral depth.',
  },
  {
    name: 'Rank Progression.',
    description:
      'Advance through 5 ranks - Bronze, Silver, Gold, Platinum, and Diamond - based on the number of direct referrals and sales volume you achieve.',
  },
  {
    name: 'Reward Basis Points.',
    description:
      'Rewards are calculated in basis points (e.g., 1000 = 10%). The higher your rank, the more rewards you receive from your referrals.',
  },
  {
    name: 'Transparent System.',
    description:
      'Our smart contract ensures a secure and transparent ranking system, keeping track of your referrals, sales volume, and rewards.',
  },
];

const ranks = [
  {
    name: 'Bronze',
    level: 1,
    criteria: '0 Direct Referrals, 0 MATIC Sales Volume',
    reward: '1%, 2%, 4%, 6%, 8%',
  },
  {
    name: 'Silver',
    level: 2,
    criteria: '5 Direct Referrals, 100 MATIC Sales Volume',
    reward: '2%, 4%, 6%, 8%, 10%',
  },
  {
    name: 'Gold',
    level: 3,
    criteria: '10 Direct Referrals, 250 ETH Sales Volume',
    reward: '4%, 6%, 8%, 10%, 12%',
  },
  {
    name: 'Platinum',
    level: 4,
    criteria: '15 Direct Referrals, 500 MATIC Sales Volume',
    reward: '6%, 8%, 10%, 12%, 14%',
  },
  {
    name: 'Diamond',
    level: 5,
    criteria: '20 Direct Referrals, 1000 MATIC Sales Volume',
    reward: '8%, 10%, 12%, 14%, 16%',
  },
];

export default function RankingSystem() {
  return (
    <div className="dark:bg-dark-bg pt-10 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl">
            Rewards & Ranks
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-dark-txt-secondary">
            Affiliate Program Incentive Structure
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name}>
              <dt className="font-semibold text-gray-900 dark:text-dark-txt">{feature.name}</dt>
              <dd className="mt-1 text-gray-600 dark:text-dark-txt-secondary">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
        <table className="mt-12 min-w-full divide-y dark:divide-dark-border divide-gray-300">
          <thead className="dark:bg-dark-second bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-dark-txt text-gray-900 sm:pl-6"
              >
                Rank
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
              >
                Level
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
              >
                Criteria
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold dark:text-dark-txt text-gray-900"
              >
                Reward
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-dark-border divide-gray-200 dark:bg-dark-third bg-white">
            {ranks.map((rank) => (
              <tr key={rank.level}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-dark-txt sm:pl-6">
                  {rank.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-dark-txt-secondary">
                  {rank.level}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-dark-txt-secondary">
                  {rank.criteria}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-dark-txt-secondary">
                  {rank.reward}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-lg leading-8 dark:text-dark-txt-secondary text-gray-600">
          Our affiliate rewards system is designed to incentivize and reward our valued affiliates
          for their efforts in promoting our platform. The rewards are structured in tiers, with
          each tier offering a higher percentage of commission based on the affiliates' rank and
          referral levels. The rewards start at 8% and increase incrementally by 2% (10%, 12%, 14%,
          and 16%) as the affiliate progresses through the ranks. To advance from one reward tier to
          the next, affiliates must meet specific criteria in terms of direct referrals and
          generated sales volume. By consistently reaching these milestones, affiliates can unlock
          higher reward percentages and maximize their earnings from the program. This tiered system
          not only motivates our affiliates to continually strive for better results but also
          ensures a fair distribution of rewards based on their performance and contributions.
        </p>
      </div>
    </div>
  );
}
