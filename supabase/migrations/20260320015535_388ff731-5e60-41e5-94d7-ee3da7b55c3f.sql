-- Create table for client inquiries (public insert, admin read)
CREATE TABLE public.client_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service_requested TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (the questionnaire is public)
CREATE POLICY "Anyone can submit an inquiry"
ON public.client_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create admin role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Only admins can read inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.client_inquiries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.client_inquiries
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);