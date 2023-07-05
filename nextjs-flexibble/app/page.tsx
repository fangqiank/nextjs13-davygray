import { Categories } from "@/components/Categories"
import { LoadMore } from "@/components/LoadMore"
import { ProjectCard } from "@/components/ProjectCard"
import {fetchAllProjects} from '@/lib/actions'
import { ProjectInterface } from "@/types"

interface SearchParams {
  category?: string | null,
  endCursor?: string | null
}

type SearchProps = {
  searchParams: SearchParams 
}

interface ProjectSearch {
  projectSearch: {
    edges: {
      node: ProjectInterface 
    }[],
    pageInfo: {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
      startCursor: string,
      endCursor: string
    }
  }
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export  default async function Home({searchParams: {
  category,
  endCursor
}}: SearchProps ) {
  const data = await fetchAllProjects(category, endCursor) as ProjectSearch
  // console.log(data);

  const projectsTodisplay = data?.projectSearch?.edges || []

  if(projectsTodisplay.length === 0){
    return (
      <section className="flexStart flex-col paddings">
        <Categories />

        <p className="no-result-text text-center">No projects found</p>
      </section>
    )
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />

      <section className="projects-grid">
        {projectsTodisplay.map(({node}: {node: ProjectInterface}) => (
          <ProjectCard
            key={`${node?.id}`}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy.name}
            avatarUrl={node?.createdBy.avatarUrl}
            userId={node?.createdBy.id} 
          />
        ))}
      </section>  

      <LoadMore
        startCursor={data?.projectSearch?.pageInfo?.startCursor}
        endCursor={data?.projectSearch?.pageInfo?.endCursor}
        hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage}
        hasNextPage={data?.projectSearch?.pageInfo?.hasNextPage} 
      />
    </section>
  )
}
