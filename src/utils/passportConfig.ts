// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { createClient } from '@supabase/supabase-js';
// import supabase from '../config/supabaseClient';



// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   const { data, error } = await supabase.auth.getUser();
//   done(error, data.user);
// });

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID!,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   callbackURL: process.env.GOOGLE_CALLBACK_URL!
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: { accessToken }
//     });
//     if (error) throw error;
//     done(null, data.user);
//   } catch (error) {
//     done(error);
//   }
// }));

// export default passport;