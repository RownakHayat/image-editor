import { ChevronRight, Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";



type Crumb = {
  title: string;
  slug: string;
};

type Props = {
  slug: Crumb[];
  hideBreadcrumb: boolean;
};

// const Breadcrumb = (props: Props) => {
  const Breadcrumb = ({ slug, hideBreadcrumb }: Props) => {
  const router = useRouter()
  // const { slug } = props || {}
  if (hideBreadcrumb) return null;

  return (
    <div className="flex space-x-1 items-center text-sm">
      <div>
        <button onClick={() => router.back()} className="border-r pr-2 mr-2">
          <Undo2 className="w-5 h-5" />
        </button>
      </div>
      {slug.map((crumb, index) => (
        <div key={crumb.slug} className="flex">
          {/* <Link href={"#"} className="last:font-bold"> */}
          <Link href={`/${crumb.slug}`} className="last:font-bold">
            {crumb.title}
          </Link>
          {index < slug.length - 1 && (
            <div>
              <ChevronRight className="w-5 h-5" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Breadcrumb
