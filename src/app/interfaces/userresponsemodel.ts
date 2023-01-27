export interface IUserResponseModel {
  user_id: number
  is_verify_user: string;
  user_nicename: string;
  profileusername: string;
  display_name: string;
  user_email: string;
  roles: string[];
  role: string;
  last_name: string;
  first_name: string;
  full_name: string;
  artist_name: string;
  user_avatar: string;
  wp_user_avatar: string;
  followers: number
  following: number
  average_rating: string;
  nickname: string;
  zipcode: string;
  gender: string;
  other_gender: string;
  profession: string;
  other_profession: string;
  bio: string;
  my_ref_code: string;
  active_status: string;
  cometchat_user_id: string;
  token: string;
}
