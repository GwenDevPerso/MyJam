-- Add latitude and longitude columns to jam_sessions table
ALTER TABLE public.jam_sessions 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Add index for location-based queries (useful for nearby searches)
CREATE INDEX idx_jam_sessions_location ON public.jam_sessions(latitude, longitude);

-- Add comments for documentation
COMMENT ON COLUMN public.jam_sessions.latitude IS 'Latitude coordinate for the jam session location';
COMMENT ON COLUMN public.jam_sessions.longitude IS 'Longitude coordinate for the jam session location'; 