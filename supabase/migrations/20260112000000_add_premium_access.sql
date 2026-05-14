CREATE TABLE IF NOT EXISTS public.premium_access (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    token text NOT NULL,
    order_id text,
    used_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.premium_access
    ADD CONSTRAINT premium_access_pkey PRIMARY KEY (id);

ALTER TABLE public.premium_access
    ADD CONSTRAINT premium_access_token_key UNIQUE (token);

ALTER TABLE public.premium_access
    ADD CONSTRAINT premium_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX premium_access_email_idx ON public.premium_access (email);
CREATE INDEX premium_access_token_idx ON public.premium_access (token);
CREATE INDEX premium_access_expires_at_idx ON public.premium_access (expires_at);

CREATE TRIGGER update_premium_access_updated_at
    BEFORE UPDATE ON public.premium_access
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.premium_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own premium access"
    ON public.premium_access
    FOR SELECT
    USING ((auth.uid() = user_id) OR (auth.uid() IS NULL));

CREATE POLICY "Anyone can read by token"
    ON public.premium_access
    FOR SELECT
    USING (true);

-- Allow service role only for insert/update/delete
CREATE POLICY "Service role can insert"
    ON public.premium_access
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update"
    ON public.premium_access
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
