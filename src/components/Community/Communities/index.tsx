import { gql, useQuery } from '@apollo/client'
import { GridItemFour, GridLayout } from '@components/GridLayout'
import { PageLoading } from '@components/UI/PageLoading'
import SEO from '@components/utils/SEO'
import { CommunityFields } from '@gql/CommunityFields'
import { SparklesIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import React from 'react'
import { APP_NAME } from 'src/constants'
import Custom500 from 'src/pages/500'

import List from './List'

const COMMUNITY_QUERY = gql`
  query (
    $topCommented: ExplorePublicationRequest!
    $topCollected: ExplorePublicationRequest!
    $latest: ExplorePublicationRequest!
  ) {
    topCommented: explorePublications(request: $topCommented) {
      items {
        ... on Post {
          ...CommunityFields
        }
      }
    }
    topCollected: explorePublications(request: $topCollected) {
      items {
        ... on Post {
          ...CommunityFields
        }
      }
    }
    latest: explorePublications(request: $latest) {
      items {
        ... on Post {
          ...CommunityFields
        }
      }
    }
  }
  ${CommunityFields}
`

const Communities: NextPage = () => {
  const { data, loading, error } = useQuery(COMMUNITY_QUERY, {
    variables: {
      topCommented: {
        sources: `${APP_NAME} Community`,
        sortCriteria: 'TOP_COMMENTED',
        publicationTypes: ['POST'],
        limit: 8
      },
      topCollected: {
        sources: `${APP_NAME} Community`,
        sortCriteria: 'TOP_COLLECTED',
        publicationTypes: ['POST'],
        limit: 8
      },
      latest: {
        sources: `${APP_NAME} Community`,
        sortCriteria: 'LATEST',
        publicationTypes: ['POST'],
        limit: 8
      }
    },
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched 10 TOP_COMMENTED, TOP_COLLECTED and LATEST communities`
      )
    }
  })

  if (error) return <Custom500 />
  if (loading || !data) return <PageLoading message="Loading community" />

  return (
    <GridLayout>
      <SEO title={`Communities • ${APP_NAME}`} />
      <GridItemFour>
        <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
          <SparklesIcon className="w-5 h-5 text-green-500" />
          <div>Latest</div>
        </div>
        <List communities={data?.latest.items} />
      </GridItemFour>
    </GridLayout>
  )
}

export default Communities
