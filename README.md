# Ecom-Admin-Dashboard

Description:An admin (or signed-in user) can manage a list of products.
Core Features:
* Auth system (register/login/logout).
* Product CRUD:
    * Add a product (name, price, description, image).
    * Edit / delete products.
    * View product list.
* Use Zod for validation.
* Protected routes for dashboard and CRUD pages.
* Public /shop page to list products for all visitors.
* Suspense while loading product lists.

## Firebase Setup

Create `.env.local` in the project root, alongside `package.json`:

```dotenv
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-example@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

Use the `project_id`, `client_email`, and `private_key` values from a Firebase
service-account JSON key (Firebase Console > Project settings > Service accounts >
Generate new private key). Replace the example values above with those values;
keep the private key quoted with its `\n` escapes. Never commit service-account
keys or expose the email/private key through `NEXT_PUBLIC_` variables.

`NEXT_PUBLIC_FIREBASE_PROJECT_ID` is also supported for existing configurations;
`FIREBASE_PROJECT_ID` takes precedence. `FIREBASE_DATABASE_URL` is optional for
this Firestore setup. In production, configure these variables in your hosting
environment. Restart the development server after changing `.env.local`.

## Supabase Authentication (Google)

Use Node.js 22 or newer with the installed Supabase SDK. Add these values to
`.env.local` and restart the development server:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Set `NEXT_PUBLIC_SITE_URL` to your canonical HTTPS origin in production. Use the
actual local origin if the development server runs on another port.

1. In Google Cloud Console, configure the OAuth consent screen and create an
    OAuth client of type **Web application**. If the app is in testing mode, add
    your Google account as a test user.
2. Add `https://your-project-ref.supabase.co/auth/v1/callback` as an authorized
    redirect URI on the Google OAuth client. Use the exact callback URL shown by
    Supabase if your project uses a custom auth domain.
3. In Supabase **Authentication > Sign In / Providers > Google**, enable Google
    and enter the Google client ID and client secret. Keep the secret in the
    Supabase dashboard; never put it in a `NEXT_PUBLIC_` variable or commit it.
4. In Supabase **Authentication > URL Configuration**, set the Site URL to the
    app origin and allow `http://localhost:3000/auth/callback` plus your production
    `https://your-domain/auth/callback` in Redirect URLs. Include any additional
    development ports or preview URLs you actually use.
5. Open `/login` and choose **Continue with Google**. A successful sign-in returns
    to `/shop`. Cancellation or an expired callback returns to `/login` with an
    error message.

Email/password sign-in now uses Supabase Auth, not the Firebase `users`
collection. Existing Firebase username/password accounts and the legacy custom
auth cookie do not authenticate a Supabase session; provision or migrate those
users separately, or sign in with Google. Google sign-in creates a Supabase user
when sign-ups are allowed by the project settings.

Authentication does not assign an admin role. Configure database RLS policies
for your intended product read/write permissions; no access policies are changed
by this integration. Firebase product storage is unchanged.

## Supabase Cart

Client Components must call the Server Actions in
`src/app/actions/supabase/` rather than import `src/db/supabase/query.ts`
directly. The query module uses `next/headers` to access the authenticated
request's cookies and must remain on the server.

Apply [src/db/supabase/cart.sql](src/db/supabase/cart.sql) in the Supabase SQL
Editor before using the cart. It uses the existing `cart`, `cart_items`, and
`products` tables; it does not copy browser storage or create product data.

The setup adds unique indexes for one cart per user and one item per product
per cart, and an `add_cart_item` database function. The upserts explicitly
target `user_id` and `cart_id,product_id`;
without an explicit conflict target, upsert uses the primary key, so a new
generated ID inserts another row rather than matching the existing cart/item.
The database indexes also prevent duplicates from concurrent requests.

Reconcile existing duplicate carts/items before running the script; it fails
rather than deleting duplicates automatically. Find affected records with:

```sql
SELECT user_id, count(*)
FROM public.cart
WHERE user_id IS NOT NULL
GROUP BY user_id
HAVING count(*) > 1;

SELECT cart_id, product_id, count(*)
FROM public.cart_items
WHERE cart_id IS NOT NULL AND product_id IS NOT NULL
GROUP BY cart_id, product_id
HAVING count(*) > 1;
```

Before removing duplicate carts, move or merge their items into the retained
cart; deleting a cart cascades to its items. Resolve repeated products according
to the intended quantities before applying the unique indexes.

This script does not change RLS policies. Existing policies must allow the
signed-in owner to select, insert, and update their cart and cart items, since
upsert updates the existing row when a conflict is found.

Your `cart.user_id` foreign key references `public.users(id)`. Ensure each
signed-in user has a matching row there whose ID equals their Supabase Auth user
ID. The code does not insert profiles because the `public.users` schema is not
defined in this repository. Ownership always uses the authenticated ID, never the
random `user_id` default from the original table definition.

`createCartAction(productId, quantity)` requires sign-in and upserts the user's
cart before calling `add_cart_item`. Adding an existing product increments its
quantity atomically: a saved quantity of 2 plus an added quantity of 3 becomes 5,
including when requests run concurrently. A legacy null quantity is treated as
zero. The function requires a positive integer quantity, checks cart ownership,
and runs with the caller's RLS permissions. Integer overflow fails rather than
silently truncating the quantity. The cart and item writes remain separate
operations, not a single transaction.

Re-run `src/db/supabase/cart.sql` in Supabase SQL Editor before using this
version, even if the unique indexes are already installed; the application now
requires the `add_cart_item` function.

The `/cart` page loads the signed-in user's cart through
`getCartByUserIdAction()` and its product details through
`getCartItemsByCartIdAction(cartId)`. Users without a cart see the empty state;
signed-out visitors see a sign-in link. Load failures show an error and retry
button rather than an empty cart.

Cart reads run in the `/cart` Server Component before rendering. The interactive
component receives the saved items as props; it does not fetch cart data in a
client-side effect. Cart queries run inside an async component under Suspense,
so the page heading remains visible while a responsive cart-and-summary skeleton
is streamed during loading. The route-level loading state uses the same skeleton,
with a screen-reader status and reduced-motion support.

`getCartItemsAction(cartId)` validates the nested Supabase product relation for
the `CartItem` view model. Its `id` identifies the cart-item row for edits
and removal; `products.id` identifies the product for links. Product names,
images, and prices are read from `item.products`. Prices are converted
to numbers, and missing products, invalid prices, or null/non-positive/fractional
quantities produce an error rather than silently displaying incorrect totals.

Quantity edits and removals use ownership-checked Server Actions and update
only the selected cart item, then revalidate `/cart` so the server reloads
the saved items and totals. Quantity updates use `useOptimistic` inside a React
transition so the selector, line totals, and order summary update immediately
while the Server Action runs. Controls are disabled while saving. Failed quantity
saves revert to the server-provided values and display an error.
Adding a product also revalidates `/cart`. Quantity
edits set an absolute positive PostgreSQL integer value, allowing totals above
10 from repeated additions. Cart RLS policies must allow owners to delete
their items as well as select, insert, and update them.

# Login Page
![alt text](login.png)

# Product CRUD Feature For Admin ***

*** View ***
![alt text](view-admin.png)
*** Add Product ***
![alt text](add-product.png)
*** Update Product ***
![alt text](update-product.png)

# Guest User Shop View
*** View ***
![alt text](guest-user-shop-view.png)

# Empty Product List View
![alt text](empty-product-list.png)
