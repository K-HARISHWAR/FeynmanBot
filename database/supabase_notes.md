# Supabase Setup Notes

1. Create a new Supabase project.
2. Go to the SQL Editor and run the contents of `schema.sql`.
3. Go to Project Settings -> API to find your `Project URL`, `anon public` key, and `service_role` secret.
4. Add the `Project URL` and `anon public` key to your frontend `.env`.
5. Add the `Project URL` and `service_role` key to your backend `.env`.

> [!NOTE]
> Make sure Auth is enabled. We are using email/password login. Users will automatically be inserted into the `auth.users` table by Supabase, but we must handle syncing them to our `profiles` table, or use a trigger on `auth.users` creation.
