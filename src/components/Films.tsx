import Link from "next/link";
import { FC } from "react";

interface IProps {
  films: { data: any[] };
}

const Films: FC<IProps> = ({ films }) => {
  return (
    <>
      <ul className="list-none space-y-4 text-4xl font-bold mb-3">
        {films &&
          films.data.map((film) => {
            return (
              <li key={film.id}>
                <Link href={`/film/${film.attributes.slug}`}>
                  {film.attributes.title}
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default Films;
