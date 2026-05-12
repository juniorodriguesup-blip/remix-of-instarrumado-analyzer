-- Create leads table for email capture
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    instagram_handle text,
    profile_type text,
    niche text,
    goal text,
    source text DEFAULT 'organic'::text,
    status text DEFAULT 'new'::text,
    converted_to_user boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);

ALTER TABLE public.leads
    ADD CONSTRAINT leads_email_key UNIQUE (email);

CREATE INDEX leads_email_idx ON public.leads (email);
CREATE INDEX leads_status_idx ON public.leads (status);
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
