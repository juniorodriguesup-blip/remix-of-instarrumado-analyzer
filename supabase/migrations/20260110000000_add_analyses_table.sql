-- Create analyses table to store user analysis history
CREATE TABLE IF NOT EXISTS public.analyses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    instagram_handle text NOT NULL,
    profile_type text NOT NULL,
    niche text NOT NULL,
    goal text NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    diagnostico_content text,
    manual_content text,
    status text DEFAULT 'completed'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.analyses
    ADD CONSTRAINT analyses_pkey PRIMARY KEY (id);

ALTER TABLE public.analyses
    ADD CONSTRAINT analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX analyses_user_id_idx ON public.analyses (user_id);
CREATE INDEX analyses_created_at_idx ON public.analyses (created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON public.analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own analyses"
    ON public.analyses
    FOR INSERT
    WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can view their own analyses"
    ON public.analyses
    FOR SELECT
    USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own analyses"
    ON public.analyses
    FOR DELETE
    USING ((auth.uid() = user_id));
