-- BabyGuardian Database Schema
-- Version: 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'parent' CHECK (role IN ('parent', 'caregiver', 'guest', 'admin')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homes (households)
CREATE TABLE homes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    timezone VARCHAR(100) DEFAULT 'America/Santiago',
    country_code VARCHAR(10) DEFAULT 'CL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home members (users linked to homes with roles)
CREATE TABLE home_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'parent', 'caregiver', 'guest')),
    permissions JSONB DEFAULT '{}',
    access_expires_at TIMESTAMP WITH TIME ZONE,
    access_schedule JSONB, -- { days: [1,2,3,4,5], start: "08:00", end: "18:00" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(home_id, user_id)
);

-- Babies
CREATE TABLE babies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    birth_weight_grams INTEGER,
    birth_height_cm DECIMAL(5,2),
    blood_type VARCHAR(10),
    medical_notes TEXT,
    photo_url TEXT,
    country_code VARCHAR(10) DEFAULT 'CL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cameras
CREATE TABLE cameras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    rtsp_url TEXT,
    onvif_host VARCHAR(255),
    onvif_port INTEGER DEFAULT 80,
    onvif_username VARCHAR(255),
    onvif_password_encrypted TEXT,
    is_primary BOOLEAN DEFAULT false,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device tokens (tablets, mobiles)
CREATE TABLE device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    device_type VARCHAR(50) CHECK (device_type IN ('tablet_hub', 'mobile_ios', 'mobile_android')),
    fcm_token TEXT,
    device_name VARCHAR(255),
    device_model VARCHAR(255),
    os_version VARCHAR(50),
    app_version VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feeding records
CREATE TABLE feeding_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES users(id),
    feeding_type VARCHAR(50) CHECK (feeding_type IN ('breastfeeding', 'formula', 'mixed', 'solids')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    amount_ml INTEGER,
    breast_side VARCHAR(20) CHECK (breast_side IN ('left', 'right', 'both')),
    solid_food_description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vaccines catalog (Chile calendar)
CREATE TABLE vaccines_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(10) DEFAULT 'CL',
    vaccine_name VARCHAR(255) NOT NULL,
    diseases_covered TEXT[],
    recommended_age_months INTEGER NOT NULL,
    dose_number INTEGER DEFAULT 1,
    is_mandatory BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Baby vaccine records
CREATE TABLE baby_vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    catalog_id UUID REFERENCES vaccines_catalog(id),
    vaccine_name VARCHAR(255),
    applied_date DATE,
    scheduled_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'skipped', 'delayed')),
    batch_number VARCHAR(100),
    healthcare_provider VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development milestones catalog
CREATE TABLE milestones_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age_months_min INTEGER NOT NULL,
    age_months_max INTEGER NOT NULL,
    category VARCHAR(100) CHECK (category IN ('motor', 'language', 'cognitive', 'social', 'sensory')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tips TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Baby milestone records
CREATE TABLE baby_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    catalog_id UUID REFERENCES milestones_catalog(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'achieved')),
    achieved_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events (cry, person detected, security alert)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    baby_id UUID REFERENCES babies(id),
    camera_id UUID REFERENCES cameras(id),
    event_type VARCHAR(100) NOT NULL CHECK (event_type IN ('cry_detected', 'person_detected', 'security_alert', 'motion_detected', 'face_recognized', 'unknown_face', 'feeding_reminder', 'vaccine_reminder')),
    severity VARCHAR(50) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    confidence DECIMAL(5,4),
    metadata JSONB DEFAULT '{}',
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Face groups (recognized persons)
CREATE TABLE face_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), -- linked user if known
    display_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'unknown' CHECK (category IN ('mother', 'father', 'caregiver', 'family', 'unknown', 'other')),
    is_authorized BOOLEAN DEFAULT false,
    embedding_count INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat sessions
CREATE TABLE ai_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    baby_id UUID REFERENCES babies(id),
    ai_provider VARCHAR(50) CHECK (ai_provider IN ('groq', 'openai', 'anthropic', 'gemini')),
    messages JSONB DEFAULT '[]',
    context_snapshot JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart devices (lights, plugs, etc)
CREATE TABLE smart_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    device_type VARCHAR(100) CHECK (device_type IN ('light', 'plug', 'dimmer', 'rgb_light', 'white_noise_machine', 'sensor')),
    protocol VARCHAR(50) CHECK (protocol IN ('wifi', 'zigbee', 'zwave', 'tuya', 'philips_hue', 'govee')),
    ip_address VARCHAR(50),
    mac_address VARCHAR(50),
    device_id_external VARCHAR(255),
    api_key_encrypted TEXT,
    current_state JSONB DEFAULT '{}',
    automation_rules JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL,
    trigger_conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invite tokens (for device linking)
CREATE TABLE invite_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'guest',
    permissions JSONB DEFAULT '{}',
    access_schedule JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    used_by UUID REFERENCES users(id),
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pairing sessions (hub first pairing flow)
CREATE TABLE pairing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(6) UNIQUE NOT NULL,
    pairing_token VARCHAR(255) UNIQUE NOT NULL,
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    hub_device_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired', 'cancelled')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claimed_by UUID REFERENCES users(id),
    claimed_from_ip VARCHAR(50),
    claimed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pairing sessions indexes
CREATE INDEX idx_pairing_sessions_code ON pairing_sessions(code);
CREATE INDEX idx_pairing_sessions_home_id ON pairing_sessions(home_id);
CREATE INDEX idx_pairing_sessions_status_expires ON pairing_sessions(status, expires_at);
CREATE INDEX idx_pairing_sessions_created_by ON pairing_sessions(created_by);

-- Indexes for performance
CREATE INDEX idx_events_home_id ON events(home_id);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_feeding_baby_id ON feeding_records(baby_id);
CREATE INDEX idx_feeding_start_time ON feeding_records(start_time DESC);
CREATE INDEX idx_face_groups_home_id ON face_groups(home_id);
CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);

-- Seed Chile vaccine calendar
INSERT INTO vaccines_catalog (country_code, vaccine_name, diseases_covered, recommended_age_months, dose_number, is_mandatory) VALUES
('CL', 'BCG', ARRAY['Tuberculosis'], 0, 1, true),
('CL', 'Hepatitis B', ARRAY['Hepatitis B'], 0, 1, true),
('CL', 'Hexavalente', ARRAY['Difteria', 'Tétanos', 'Pertussis', 'Polio', 'Hib', 'Hepatitis B'], 2, 1, true),
('CL', 'Neumocócica 13V', ARRAY['Neumococo'], 2, 1, true),
('CL', 'Rotavirus', ARRAY['Rotavirus'], 2, 1, true),
('CL', 'Hexavalente', ARRAY['Difteria', 'Tétanos', 'Pertussis', 'Polio', 'Hib', 'Hepatitis B'], 4, 2, true),
('CL', 'Neumocócica 13V', ARRAY['Neumococo'], 4, 2, true),
('CL', 'Rotavirus', ARRAY['Rotavirus'], 4, 2, true),
('CL', 'Hexavalente', ARRAY['Difteria', 'Tétanos', 'Pertussis', 'Polio', 'Hib', 'Hepatitis B'], 6, 3, true),
('CL', 'Neumocócica 13V', ARRAY['Neumococo'], 6, 3, true),
('CL', 'Influenza', ARRAY['Influenza'], 6, 1, true),
('CL', 'SRP', ARRAY['Sarampión', 'Rubéola', 'Parotiditis'], 12, 1, true),
('CL', 'Varicela', ARRAY['Varicela'], 12, 1, true),
('CL', 'Hepatitis A', ARRAY['Hepatitis A'], 12, 1, true),
('CL', 'Neumocócica 13V', ARRAY['Neumococo'], 12, 3, true),
('CL', 'DTP + Polio', ARRAY['Difteria', 'Tétanos', 'Pertussis', 'Polio'], 18, 1, true);

-- Seed development milestones
INSERT INTO milestones_catalog (age_months_min, age_months_max, category, title, description, tips) VALUES
(0, 2, 'sensory', 'Sigue objetos con la vista', 'El bebé puede seguir objetos que se mueven lentamente a 20-30 cm de su cara', 'Usa juguetes de colores brillantes'),
(0, 2, 'social', 'Primera sonrisa social', 'Sonríe en respuesta a caras familiares y voces', 'Habla y sonríe frecuentemente al bebé'),
(2, 4, 'motor', 'Sostiene la cabeza', 'Puede mantener la cabeza erguida durante tiempo corto boca abajo', 'Practica tummy time 2-3 veces al día'),
(2, 4, 'language', 'Gorjeos y vocalizaciones', 'Emite sonidos de vocales y gorjeos', 'Responde a sus vocalizaciones para fomentar el lenguaje'),
(4, 6, 'motor', 'Se voltea solo', 'Puede rodar de boca arriba a boca abajo y viceversa', 'Asegura superficies seguras para explorar'),
(4, 6, 'cognitive', 'Busca objetos escondidos', 'Busca un objeto parcialmente escondido', 'Juega al escondite con juguetes'),
(6, 9, 'motor', 'Se sienta sin apoyo', 'Puede sentarse solo por algunos segundos', 'Rodea con almohadas como protección inicial'),
(6, 9, 'language', 'Balbuceo consonántico', 'Emite sílabas como "ba", "ma", "da"', 'Imita sus sonidos y añade nuevas sílabas'),
(9, 12, 'motor', 'Gateo', 'Se desplaza gateando', 'Asegura la casa para exploración segura'),
(9, 12, 'social', 'Ansiedad por separación', 'Muestra angustia cuando el cuidador principal se aleja', 'Normal y esperado, refuerza el apego seguro'),
(12, 15, 'motor', 'Primeros pasos', 'Camina con apoyo y luego solo', 'Ofrece apoyo pero permite explorar'),
(12, 15, 'language', 'Primeras palabras', 'Dice 1-3 palabras con significado claro', 'Nombra objetos cotidianos constantemente'),
(18, 24, 'language', 'Vocabulario de 20+ palabras', 'Usa más de 20 palabras diferentes', 'Lee libros con imágenes a diario'),
(18, 24, 'cognitive', 'Juego simbólico', 'Imita acciones cotidianas en juego (alimentar muñeca)', 'Fomenta el juego de imitación');
