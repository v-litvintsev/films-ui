import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../components/Layout";
import { getIdFromLocalCookie, getTokenFromServerCookie } from "../lib/auth";
import { useUser } from "../lib/authContext";
import { fetcher } from "../lib/fetcher";

interface IProps {
  avatar: string;
}

const ProfilePage: NextPage<IProps> = ({ avatar }) => {
  const router = useRouter();
  const { user } = useUser() as { user: any };
  const [image, setImage] = useState<Blob | null>(null);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const tmpImage = event.target.files[0];
      setImage(tmpImage);
    }
  };

  const uploadToServer = async () => {
    if (!image) {
      alert("Choose image");
      return;
    }

    const formData = new FormData();
    formData.append("inputFile", image);
    formData.append("user_id", await getIdFromLocalCookie());

    try {
      const response = await fetcher("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log("sending data");

      if (response.message === "success") {
        router.reload();
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <Layout>
      <>
        <h1 className="text-5xl font-bold">
          Welcome back{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            {user}
          </span>
          <span>👋</span>
        </h1>
        {avatar === "default_avatar" && (
          <div>
            <h4>Select an image to upload</h4>
            <input type="file" onChange={uploadToClient} />
            <button
              className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
              type="submit"
              onClick={uploadToServer}
            >
              Set Profile Image
            </button>
          </div>
        )}
        {avatar && (
          <img
            src={`https://res.cloudinary.com/v-litvintsev/image/upload/f_auto,q_auto,w_150,h_150,g_face,c_thumb,r_max/v1654495782/${avatar}`}
            alt="Profile"
          />
        )}
      </>
    </Layout>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const jwt = getTokenFromServerCookie(req);

  if (!jwt) {
    return {
      redirect: {
        destination: "/",
      },
      props: {},
    };
  } else {
    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const avatar = responseData.avatar ?? "default_avatar";

    return {
      props: { avatar },
    };
  }
};
