export type UsersData = {
  userName: string;
  password: string;
};

export type Error = {
  origin: string
  code: string
  minimum: number
  inclusive: boolean
  path: string[]
  message: string
}