import formidable from "formidable";
import cloudinary from "cloudinary";
import { getTokenFromServerCookie } from "../../lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data = await new Promise<any>((resolve, reject) => {
      const form = new formidable.IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }

        resolve({ fields, files });
      });
    });

    const file = data?.files?.inputFile.filepath;
    const { user_id } = data.fields;

    try {
      const response = await cloudinary.v2.uploader.upload(file, {
        public_id: user_id,
      });

      const { public_id } = response;
      const jwt = getTokenFromServerCookie(req);
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            avatar: public_id,
          }),
        }
      );

      const data = await userResponse.json();
      return res.json({ message: "success" });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return res.json({ message: JSON.stringify(error, null, 2) });
    }
  } else {
    return res.status(403).send("Forbidden");
  }
};

export default upload;
