import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Example data returned from Twitter API
// {
//   "data": [
//     {
//       "category": "Gaming",
//       "post_count": "992 posts",
//       "trend_name": "Goblintown Game Announcement",
//       "trending_since": "6 hours ago"
//     },
//     {
//       "category": "Theatre",
//       "post_count": "78 posts",
//       "trend_name": "Tom Hiddleston and Hayley Atwell in 'Much Ado About Nothing': A West End Sensation",
//       "trending_since": "Trending now"
//     },
//     {
//       "category": "NFTs",
//       "post_count": "1.5K posts",
//       "trend_name": "Kaito Genesis NFTs Gain Voting Power on Yapper Launchpad",
//       "trending_since": "9 hours ago"
//     },
//     {
//       "category": "Finance",
//       "post_count": "811 posts",
//       "trend_name": "Tesla's Bitcoin Holdings: Steady at 11,509, Gain $600M",
//       "trending_since": "2 hours ago"
//     },
//     {
//       "category": "Gaming",
//       "post_count": "1.3K posts",
//       "trend_name": "Roblox Outage Sparks Community Frenzy",
//       "trending_since": "2 hours ago"
//     }
//   ]
// }
export type Trend = {
  category: string;
  post_count: string;
  trend_name: string;
  trending_since: string;
};

type TwitterResponse = {
  data: Array<Trend>;
};

export async function POST() {
  try {
    const twitterUrl = new URL("https://api.x.com/2/users/personalized_trends");

    const twitterResponse = await fetch(twitterUrl.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    });

    if (!twitterResponse.ok) {
      if (twitterResponse.status === 429) {
        // Query the database for trends created today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const trendsData = await prisma.trends.findMany({
          where: {
            createdAt: {
              gte: today,
            },
          },
        });

        return NextResponse.json(trendsData);
      } else {
        throw new Error(
          `Twitter API error: ${twitterResponse.status} ${twitterResponse.statusText}`
        );
      }
    }

    const response = (await twitterResponse.json()) as TwitterResponse;
    const trendsData = response.data;

    // Filter out trends that already exist in the database
    const newTrends = [];

    for (const trend of trendsData) {
      // Check if trend exists
      const existingTrend = await prisma.trends.findFirst({
        where: {
          trend_name: {
            equals: trend.trend_name,
            mode: "insensitive", // Case insensitive comparison
          },
        },
      });

      if (!existingTrend) {
        newTrends.push({
          trend_name: trend.trend_name,
          category: trend.category,
          post_count: trend.post_count,
          trending_since: trend.trending_since,
        });
      }
    }

    if (newTrends.length > 0) {
      // Save only the new trends to the database
      await prisma.trends.createMany({
        data: newTrends,
      });
    }

    console.log("\n New Trends Added:", newTrends.length);

    // Return all trends for today, including both new and existing ones
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allTrendsToday = await prisma.trends.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(allTrendsToday);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
