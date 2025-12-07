import supabase from "../config/supabaseClient";
import { createSupabase, verifyUser } from "../config/supabaseClientAuth";
import type { ServiceResult } from "../Data/serviceResult";

class AuthService {
  async GetUser(token: string): Promise<ServiceResult<any>> {
    const supabase = createSupabase(token);
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return { success: false, error: "failed to find user" };
    }
    return { success: true, data: user };
  }

  async GetProfile(token: string): Promise<ServiceResult<any>> {
    const supabase = createSupabase(token);
    const user = await verifyUser(token);

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      const { data: newProfile, error: insertError } = await supabase
        .from("profile")
        .insert({
          id: user.id,
          firstname: null,
          lastname: null,
        })
        .select("*")
        .single();

      if (insertError) {
        return { success: false, error: "Error creating profile" };
      }

      console.log("Profile created successfully.");
      return { success: false, data: newProfile };
    }

    if (error) {
      console.error("Error fetching profile:", error.message);
      return { success: false, error: "Error fetching profile:" };
    }
    return { success: true, data: data };
  }

  async CreateUserProfile(profile: any): Promise<ServiceResult<any>> {
    const { data, error } = await supabase
      .from("profile")
      .insert(profile)
      .select();

    if (error) {
      console.log(error);
    }
    return { success: true, data: data };
  }
}

export default new AuthService();
