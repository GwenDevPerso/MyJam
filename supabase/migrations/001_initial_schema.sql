-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    city TEXT NOT NULL,
    instruments TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jam_sessions table
CREATE TABLE public.jam_sessions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    style TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    city TEXT NOT NULL,
    location TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jam_participants table (junction table for many-to-many relationship)
CREATE TABLE public.jam_participants (
    id SERIAL PRIMARY KEY,
    jam_session_id INTEGER REFERENCES public.jam_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(jam_session_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jam_participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Jam sessions policies
CREATE POLICY "Anyone can view jam sessions" ON public.jam_sessions 
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create jam sessions" ON public.jam_sessions 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own jam sessions" ON public.jam_sessions 
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own jam sessions" ON public.jam_sessions 
    FOR DELETE USING (auth.uid() = created_by);

-- Jam participants policies
CREATE POLICY "Anyone can view jam participants" ON public.jam_participants 
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join jam sessions" ON public.jam_participants 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can leave jam sessions" ON public.jam_participants 
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER jam_sessions_updated_at
    BEFORE UPDATE ON public.jam_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically update participant count
CREATE OR REPLACE FUNCTION public.update_jam_participants_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.jam_sessions 
        SET participants = (
            SELECT COUNT(*) 
            FROM public.jam_participants 
            WHERE jam_session_id = NEW.jam_session_id
        )
        WHERE id = NEW.jam_session_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.jam_sessions 
        SET participants = (
            SELECT COUNT(*) 
            FROM public.jam_participants 
            WHERE jam_session_id = OLD.jam_session_id
        )
        WHERE id = OLD.jam_session_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update participant count
CREATE TRIGGER jam_participants_count_trigger
    AFTER INSERT OR DELETE ON public.jam_participants
    FOR EACH ROW EXECUTE FUNCTION public.update_jam_participants_count();

-- Create indexes for better performance
CREATE INDEX idx_jam_sessions_date ON public.jam_sessions(date);
CREATE INDEX idx_jam_sessions_city ON public.jam_sessions(city);
CREATE INDEX idx_jam_sessions_style ON public.jam_sessions(style);
CREATE INDEX idx_jam_sessions_created_by ON public.jam_sessions(created_by);
CREATE INDEX idx_jam_participants_jam_session_id ON public.jam_participants(jam_session_id);
CREATE INDEX idx_jam_participants_user_id ON public.jam_participants(user_id); 