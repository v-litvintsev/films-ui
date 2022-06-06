import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEventHandler, FormEventHandler, useRef } from "react";
import Layout from "../../components/Layout";
import {
  getTokenFromLocalCookie,
  getTokenFromServerCookie,
  getUserFromLocalCookie,
} from "../../lib/auth";
import { useUser } from "../../lib/authContext";
import { fetcher } from "../../lib/fetcher";

const Film: NextPage<{ film: any; jwt: string }> = ({ film, jwt }) => {
  const router = useRouter();
  const { user } = useUser() as { user: any };
  const reviewInputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {};

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              review: reviewInputRef.current?.value ?? "",
              reviewer: await getUserFromLocalCookie(),
              film: film.id,
            },
          }),
        }
      );
      router.reload();
    } catch (error) {
      console.log("error with request", error);
    }
  };

  return !film ? (
    <Layout>
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
          Film not found
        </span>
      </h1>
    </Layout>
  ) : (
    <Layout>
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
          {film.attributes.title}
        </span>
      </h1>
      <p>
        Directed by{" "}
        <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          {film.attributes.director}
        </span>
      </p>
      {user && (
        <>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter mb-4 mt-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
              Reviews
            </span>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full text-sm px-3 py-2 text-gray-700 border border-2 border-teal-400 rounded-lg focus:outline-none"
                rows={4}
                ref={reviewInputRef}
                onChange={handleChange}
                placeholder="Add your review"
              ></textarea>
              <button
                className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
                type="submit"
              >
                Add Review
              </button>
            </form>
          </h2>
          <ul>
            {!film.attributes.reviews.data.length && (
              <span>No reviews yet</span>
            )}
            {film.attributes.reviews.data &&
              film.attributes.reviews.data.map((review: any) => {
                return (
                  <li key={review.id}>
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                      {review.attributes.reviewer}
                    </span>{" "}
                    said &quot;{review.attributes.review}&quot;
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </Layout>
  );
};

export default Film;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params as any;
  const jwt =
    typeof window !== "undefined"
      ? getTokenFromLocalCookie
      : getTokenFromServerCookie(req);
  const filmResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/films?filters[slug]=${slug}&populate=*`,
    jwt
      ? {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      : {}
  );

  return {
    props: {
      film: filmResponse.data[0] ?? null,
      jwt: jwt ?? null,
    },
  };
};
