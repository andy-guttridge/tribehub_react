import { rest } from "msw";

const baseURL = 'https://tribehub-drf.herokuapp.com/';

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 2,
        username: "chief1",
        email: "",
        first_name: "",
        last_name: "",
        profile_image: "https://res.cloudinary.com/dfp40peh5/image/upload/v1679074228/ae0nylntf74lpev87rl9.webp",
        display_name: "Chief 1",
        is_admin: true,
        tribe_name: "Tribe1"
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) =>{
    return res(ctx.status(200));
  })
]