-- ===================================
-- SUPABASE COMPLETE SCHEMA - PRODUCTION READY
-- ERY CURSOS - ARQUITECTURA DE SOFTWARE
-- ===================================
-- ===================================
-- 1. USERS TABLE (EXTENDED PROFILE)
-- ===================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (
        role IN (
            'administrator',
            'student',
            'evaluator',
            'assistant'
        )
    ),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT role_email_check CHECK (
        (
            role = 'administrator'
            AND email = 'dobleeimportaciones@gmail.com'
        )
        OR (
            role = 'student'
            AND email != 'dobleeimportaciones@gmail.com'
        )
    )
);
-- Index for faster queries
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_role ON public.usuarios(role);
CREATE INDEX idx_usuarios_user_id ON public.usuarios(user_id);
-- ===================================
-- 2. SETTINGS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.usuarios(id)
);
-- Insert default settings
INSERT INTO public.settings (key, value, description)
VALUES (
        'max_file_size_mb',
        '10',
        'Maximum file size in megabytes'
    ),
    (
        'allow_late_submissions',
        'false',
        'Allow submissions after deadline'
    ),
    (
        'system_name',
        'ERY CURSOS - Arquitectura de Software',
        'System name'
    ),
    (
        'admin_email',
        'dobleeimportaciones@gmail.com',
        'Administrator email'
    ) ON CONFLICT (key) DO NOTHING;
-- ===================================
-- 3. UNITS TABLE (COURSE STRUCTURE)
-- ===================================
CREATE TABLE IF NOT EXISTS public.units (
    id SERIAL PRIMARY KEY,
    unit_key TEXT UNIQUE NOT NULL,
    -- 'unidad1', 'unidad2', etc.
    unit_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    total_weeks INTEGER DEFAULT 4,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Insert units
INSERT INTO public.units (unit_key, unit_number, title, description)
VALUES (
        'unidad1',
        1,
        'Fundamentos de Arquitectura de Software',
        'Conceptos fundamentales, estándares internacionales, diseño arquitectónico y evaluación'
    ),
    (
        'unidad2',
        2,
        'Patrones y Estilos Arquitectónicos',
        'Patrones de diseño, estilos arquitectónicos y casos de uso'
    ),
    (
        'unidad3',
        3,
        'Diseño y Modelado de Arquitecturas',
        'UML, C4, documentación arquitectónica y modelado'
    ),
    (
        'unidad4',
        4,
        'Evaluación y Optimización',
        'Métricas, rendimiento, escalabilidad y mantenibilidad'
    ) ON CONFLICT (unit_key) DO NOTHING;
-- ===================================
-- 4. ASSIGNMENTS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id INTEGER REFERENCES public.units(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (
        week_number >= 1
        AND week_number <= 4
    ),
    assignment_key TEXT UNIQUE NOT NULL,
    -- 'unidad1_semana1'
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    lock_on_complete BOOLEAN DEFAULT true,
    is_required BOOLEAN DEFAULT true,
    max_file_size_mb INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.usuarios(id),
    UNIQUE(unit_id, week_number)
);
-- Insert assignments (4 units x 4 weeks = 16 assignments)
INSERT INTO public.assignments (
        unit_id,
        week_number,
        assignment_key,
        title,
        description,
        is_required
    )
VALUES -- Unidad 1
    (
        1,
        1,
        'unidad1_semana1',
        'Semana 01 - Conceptos fundamentales',
        'Mapa conceptual sobre arquitectura de software',
        true
    ),
    (
        1,
        2,
        'unidad1_semana2',
        'Semana 02 - Estándares internacionales',
        'Informe técnico con estándares aplicados',
        true
    ),
    (
        1,
        3,
        'unidad1_semana3',
        'Semana 03 - Diseño arquitectónico',
        'Diseño con diagramas UML o C4',
        true
    ),
    (
        1,
        4,
        'unidad1_semana4',
        'Semana 04 - Evaluación de arquitectura',
        'Informe con métricas y mejoras',
        true
    ),
    -- Unidad 2
    (
        2,
        1,
        'unidad2_semana1',
        'Semana 05 - Patrones de diseño',
        'Implementación de patrones arquitectónicos',
        true
    ),
    (
        2,
        2,
        'unidad2_semana2',
        'Semana 06 - Estilos arquitectónicos',
        'Análisis comparativo de estilos',
        true
    ),
    (
        2,
        3,
        'unidad2_semana3',
        'Semana 07 - Casos de uso',
        'Documentación de casos de uso',
        true
    ),
    (
        2,
        4,
        'unidad2_semana4',
        'Semana 08 - Aplicación práctica',
        'Proyecto integrador',
        true
    ),
    -- Unidad 3
    (
        3,
        1,
        'unidad3_semana1',
        'Semana 09 - UML avanzado',
        'Diagramas UML completos',
        true
    ),
    (
        3,
        2,
        'unidad3_semana2',
        'Semana 10 - Modelo C4',
        'Implementación modelo C4',
        true
    ),
    (
        3,
        3,
        'unidad3_semana3',
        'Semana 11 - Documentación',
        'Documentación arquitectónica',
        true
    ),
    (
        3,
        4,
        'unidad3_semana4',
        'Semana 12 - Modelado completo',
        'Proyecto de modelado',
        true
    ),
    -- Unidad 4
    (
        4,
        1,
        'unidad4_semana1',
        'Semana 13 - Métricas',
        'Análisis de métricas de calidad',
        true
    ),
    (
        4,
        2,
        'unidad4_semana2',
        'Semana 14 - Rendimiento',
        'Optimización de rendimiento',
        true
    ),
    (
        4,
        3,
        'unidad4_semana3',
        'Semana 15 - Escalabilidad',
        'Diseño escalable',
        true
    ),
    (
        4,
        4,
        'unidad4_semana4',
        'Semana 16 - Proyecto final',
        'Proyecto final integrador',
        true
    ) ON CONFLICT (assignment_key) DO NOTHING;
-- Index for faster queries
CREATE INDEX idx_assignments_unit ON public.assignments(unit_id);
CREATE INDEX idx_assignments_deadline ON public.assignments(deadline);
-- ===================================
-- 5. SUBMISSIONS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    file_id UUID,
    -- Reference to files table
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (
        status IN ('submitted', 'completed', 'reopened', 'locked')
    ),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    reopened_at TIMESTAMP WITH TIME ZONE,
    reopened_by UUID REFERENCES public.usuarios(id),
    notes TEXT,
    UNIQUE(assignment_id, user_id)
);
-- Index for faster queries
CREATE INDEX idx_submissions_user ON public.submissions(user_id);
CREATE INDEX idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
-- ===================================
-- 6. FILES TABLE (UPDATED)
-- ===================================
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    size BIGINT NOT NULL,
    type TEXT NOT NULL,
    unit TEXT NOT NULL,
    lesson TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    url TEXT NOT NULL,
    -- New fields for user tracking
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE
    SET NULL,
        submission_id UUID REFERENCES public.submissions(id) ON DELETE
    SET NULL,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'locked', 'deleted')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index for faster queries
CREATE INDEX idx_files_user ON public.files(user_id);
CREATE INDEX idx_files_assignment ON public.files(assignment_id);
CREATE INDEX idx_files_unit_lesson ON public.files(unit, lesson);
CREATE INDEX idx_files_upload_date ON public.files(upload_date DESC);
-- ===================================
-- 7. PROGRESS TRACKING TABLE (BACKEND-DRIVEN)
-- ===================================
CREATE TABLE IF NOT EXISTS public.progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES public.units(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, assignment_id)
);
-- Index for faster queries
CREATE INDEX idx_progress_user ON public.progress_tracking(user_id);
CREATE INDEX idx_progress_unit ON public.progress_tracking(unit_id);
CREATE INDEX idx_progress_completed ON public.progress_tracking(completed);
-- ===================================
-- 8. AUDIT LOG TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.usuarios(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index for faster queries
CREATE INDEX idx_audit_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_created ON public.audit_log(created_at DESC);
-- ===================================
-- 9. ENABLE ROW LEVEL SECURITY (RLS)
-- ===================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
-- ===================================
-- 10. RLS POLICIES - ADMINISTRATOR
-- ===================================
-- Administrator has FULL ACCESS to all tables
-- Check: auth.email() = 'dobleeimportaciones@gmail.com'
-- usuarios table
CREATE POLICY "Admin full access to usuarios" ON public.usuarios FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- settings table
CREATE POLICY "Admin full access to settings" ON public.settings FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- assignments table
CREATE POLICY "Admin full access to assignments" ON public.assignments FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- submissions table
CREATE POLICY "Admin full access to submissions" ON public.submissions FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- files table
CREATE POLICY "Admin full access to files" ON public.files FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- progress_tracking table
CREATE POLICY "Admin full access to progress" ON public.progress_tracking FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- audit_log table
CREATE POLICY "Admin full access to audit" ON public.audit_log FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- ===================================
-- 11. RLS POLICIES - STUDENT
-- ===================================
-- Students can read their own usuario record
CREATE POLICY "Students read own profile" ON public.usuarios FOR
SELECT TO authenticated USING (user_id = auth.uid());
-- Students can update their own profile (limited fields)
CREATE POLICY "Students update own profile" ON public.usuarios FOR
UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- Students can read all units (public information)
CREATE POLICY "Students read units" ON public.units FOR
SELECT TO authenticated USING (active = true);
-- Students can read all assignments (public information)
CREATE POLICY "Students read assignments" ON public.assignments FOR
SELECT TO authenticated USING (true);
-- Students can read settings (limited)
CREATE POLICY "Students read settings" ON public.settings FOR
SELECT TO authenticated USING (
        key IN (
            'max_file_size_mb',
            'allow_late_submissions',
            'system_name'
        )
    );
-- Students can insert their own submissions
CREATE POLICY "Students insert own submissions" ON public.submissions FOR
INSERT TO authenticated WITH CHECK (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
-- Students can read their own submissions
CREATE POLICY "Students read own submissions" ON public.submissions FOR
SELECT TO authenticated USING (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
-- Students can update their own submissions (before locked)
CREATE POLICY "Students update own submissions" ON public.submissions FOR
UPDATE TO authenticated USING (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
        AND status != 'locked'
    );
-- Students can insert their own files
CREATE POLICY "Students insert own files" ON public.files FOR
INSERT TO authenticated WITH CHECK (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
-- Students can read their own files
CREATE POLICY "Students read own files" ON public.files FOR
SELECT TO authenticated USING (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
-- Students can delete their own files (if not locked)
CREATE POLICY "Students delete own files" ON public.files FOR DELETE TO authenticated USING (
    user_id IN (
        SELECT id
        FROM public.usuarios
        WHERE user_id = auth.uid()
    )
    AND status = 'active'
);
-- Students can read their own progress
CREATE POLICY "Students read own progress" ON public.progress_tracking FOR
SELECT TO authenticated USING (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
-- Students can update their own progress
CREATE POLICY "Students update own progress" ON public.progress_tracking FOR
INSERT TO authenticated WITH CHECK (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
CREATE POLICY "Students update own progress existing" ON public.progress_tracking FOR
UPDATE TO authenticated USING (
        user_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
-- ===================================
-- 12. PUBLIC READ POLICIES
-- ===================================
-- Allow public read for units (course structure)
CREATE POLICY "Public read units" ON public.units FOR
SELECT TO public USING (active = true);
-- Allow public read for assignments (course structure)
CREATE POLICY "Public read assignments" ON public.assignments FOR
SELECT TO public USING (true);
-- ===================================
-- 13. HELPER FUNCTIONS
-- ===================================
-- Function to calculate unit progress for a user
CREATE OR REPLACE FUNCTION calculate_unit_progress(p_user_id UUID, p_unit_id INTEGER) RETURNS NUMERIC AS $$
DECLARE total_assignments INTEGER;
completed_assignments INTEGER;
progress NUMERIC;
BEGIN -- Get total required assignments for this unit
SELECT COUNT(*) INTO total_assignments
FROM public.assignments
WHERE unit_id = p_unit_id
    AND is_required = true;
-- Get completed assignments for this user
SELECT COUNT(*) INTO completed_assignments
FROM public.progress_tracking
WHERE user_id = p_user_id
    AND unit_id = p_unit_id
    AND completed = true;
-- Calculate progress
IF total_assignments > 0 THEN progress := (
    completed_assignments::NUMERIC / total_assignments::NUMERIC
) * 100;
ELSE progress := 0;
END IF;
-- Ensure not over 100%
progress := LEAST(progress, 100);
RETURN ROUND(progress, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to calculate overall progress for a user
CREATE OR REPLACE FUNCTION calculate_overall_progress(p_user_id UUID) RETURNS NUMERIC AS $$
DECLARE total_assignments INTEGER;
completed_assignments INTEGER;
progress NUMERIC;
BEGIN -- Get total required assignments
SELECT COUNT(*) INTO total_assignments
FROM public.assignments
WHERE is_required = true;
-- Get completed assignments for this user
SELECT COUNT(*) INTO completed_assignments
FROM public.progress_tracking
WHERE user_id = p_user_id
    AND completed = true;
-- Calculate progress
IF total_assignments > 0 THEN progress := (
    completed_assignments::NUMERIC / total_assignments::NUMERIC
) * 100;
ELSE progress := 0;
END IF;
-- Ensure not over 100%
progress := LEAST(progress, 100);
RETURN ROUND(progress, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to check if user can upload to assignment
CREATE OR REPLACE FUNCTION can_upload_to_assignment(p_user_id UUID, p_assignment_id UUID) RETURNS BOOLEAN AS $$
DECLARE submission_status TEXT;
assignment_deadline TIMESTAMP WITH TIME ZONE;
allow_late BOOLEAN;
BEGIN -- Get assignment deadline
SELECT deadline INTO assignment_deadline
FROM public.assignments
WHERE id = p_assignment_id;
-- Get system setting for late submissions
SELECT value::BOOLEAN INTO allow_late
FROM public.settings
WHERE key = 'allow_late_submissions';
-- Check if deadline passed and late submissions not allowed
IF assignment_deadline IS NOT NULL
AND NOW() > assignment_deadline
AND NOT allow_late THEN RETURN false;
END IF;
-- Get submission status if exists
SELECT status INTO submission_status
FROM public.submissions
WHERE user_id = p_user_id
    AND assignment_id = p_assignment_id;
-- If no submission yet, allow upload
IF submission_status IS NULL THEN RETURN true;
END IF;
-- If locked or completed, don't allow upload
IF submission_status IN ('locked', 'completed') THEN RETURN false;
END IF;
-- Otherwise allow
RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- ===================================
-- 14. TRIGGERS
-- ===================================
-- Trigger to update updated_at on usuarios
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_usuarios_updated_at BEFORE
UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE
UPDATE ON public.progress_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ===================================
-- 15. GRADES TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    grade NUMERIC(4, 2) NOT NULL CHECK (
        grade >= 0
        AND grade <= 20
    ),
    -- Scale 0-20
    feedback TEXT,
    graded_by UUID REFERENCES public.usuarios(id),
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(submission_id)
);
-- Index for faster queries
CREATE INDEX idx_grades_student ON public.grades(student_id);
CREATE INDEX idx_grades_assignment ON public.grades(assignment_id);
CREATE INDEX idx_grades_graded_by ON public.grades(graded_by);
-- ===================================
-- 16. NOTIFICATIONS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    recipients TEXT [] NOT NULL,
    -- Array of user roles or 'all'
    created_by UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE
);
-- Index for faster queries
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_sent ON public.notifications(sent);
-- ===================================
-- 17. ENABLE RLS ON NEW TABLES
-- ===================================
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
-- ===================================
-- 18. RLS POLICIES - EVALUATOR ROLE
-- ===================================
-- Evaluators can read all usuarios (students and other evaluators)
CREATE POLICY "Evaluators read usuarios" ON public.usuarios FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'evaluator'
        )
    );
-- Evaluators can read all units
CREATE POLICY "Evaluators read units" ON public.units FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'evaluator'
        )
    );
-- Evaluators can read all assignments
CREATE POLICY "Evaluators read assignments" ON public.assignments FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'evaluator'
        )
    );
-- Evaluators can read all submissions
CREATE POLICY "Evaluators read submissions" ON public.submissions FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'evaluator'
        )
    );
-- Evaluators can read all files
CREATE POLICY "Evaluators read files" ON public.files FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'evaluator'
        )
    );
-- Evaluators can read all progress
CREATE POLICY "Evaluators read progress" ON public.progress_tracking FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'evaluator'
        )
    );
-- Evaluators can insert grades
CREATE POLICY "Evaluators insert grades" ON public.grades FOR
INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role IN ('evaluator', 'administrator')
        )
    );
-- Evaluators can read all grades
CREATE POLICY "Evaluators read grades" ON public.grades FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role IN ('evaluator', 'administrator')
        )
    );
-- Evaluators can update grades they created
CREATE POLICY "Evaluators update own grades" ON public.grades FOR
UPDATE TO authenticated USING (
        graded_by IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
                AND role IN ('evaluator', 'administrator')
        )
    );
-- Evaluators can read settings
CREATE POLICY "Evaluators read settings" ON public.settings FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'evaluator'
        )
        AND key IN (
            'max_file_size_mb',
            'allow_late_submissions',
            'system_name'
        )
    );
-- ===================================
-- 19. RLS POLICIES - ASSISTANT ROLE
-- ===================================
-- Assistants can read all usuarios
CREATE POLICY "Assistants read usuarios" ON public.usuarios FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- Assistants can insert new students
CREATE POLICY "Assistants insert students" ON public.usuarios FOR
INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
        AND role = 'student'
    );
-- Assistants can update student profiles
CREATE POLICY "Assistants update students" ON public.usuarios FOR
UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
        AND role = 'student'
    );
-- Assistants can read all units
CREATE POLICY "Assistants read units" ON public.units FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- Assistants can read all assignments
CREATE POLICY "Assistants read assignments" ON public.assignments FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- Assistants can update assignment deadlines
CREATE POLICY "Assistants update assignments" ON public.assignments FOR
UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- Assistants can read all submissions
CREATE POLICY "Assistants read submissions" ON public.submissions FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- Assistants can read all files
CREATE POLICY "Assistants read files" ON public.files FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- Assistants can read all progress
CREATE POLICY "Assistants read progress" ON public.progress_tracking FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- Assistants can read settings
CREATE POLICY "Assistants read settings" ON public.settings FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND u.role = 'assistant'
        )
    );
-- ===================================
-- 20. RLS POLICIES - NOTIFICATIONS
-- ===================================
-- Admins can do everything with notifications
CREATE POLICY "Admin full access to notifications" ON public.notifications FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'dobleeimportaciones@gmail.com'
    )
);
-- Students can read their notifications
CREATE POLICY "Students read notifications" ON public.notifications FOR
SELECT TO authenticated USING (
        'student' = ANY (recipients)
        OR 'all' = ANY (recipients)
    );
-- Evaluators and Assistants can read notifications for their roles
CREATE POLICY "Evaluators read notifications" ON public.notifications FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.usuarios u
            WHERE u.user_id = auth.uid()
                AND (
                    u.role = ANY (recipients)
                    OR 'all' = ANY (recipients)
                )
        )
    );
-- ===================================
-- 21. RLS POLICIES - STUDENTS CAN READ GRADES
-- ===================================
-- Students can read their own grades
CREATE POLICY "Students read own grades" ON public.grades FOR
SELECT TO authenticated USING (
        student_id IN (
            SELECT id
            FROM public.usuarios
            WHERE user_id = auth.uid()
        )
    );
-- ===================================
-- 22. INITIAL USERS (MUST BE CREATED AFTER AUTH)
-- ===================================
-- NOTE: With the trigger below, users are automatically linked when created
-- Just create users in Supabase Authentication and the trigger will handle the rest
-- ===================================
-- 23. AUTOMATIC USER PROFILE CREATION TRIGGER †⃣ IMPORTANT
-- ===================================
-- This trigger automatically creates a profile in public.usuarios 
-- whenever a user is created in auth.users
-- This solves the RLS session-switching bug when admins create users
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
DECLARE user_role TEXT;
user_full_name TEXT;
BEGIN -- Get role and name from user_metadata (passed in signUp)
user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
-- Insert into public.usuarios table
INSERT INTO public.usuarios (user_id, email, full_name, role, active)
VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        user_role,
        true
    );
RETURN NEW;
EXCEPTION
WHEN unique_violation THEN -- User already exists in usuarios table, skip
RETURN NEW;
WHEN OTHERS THEN -- Log error but don't fail user creation
RAISE WARNING 'Could not create profile for user %: %',
NEW.id,
SQLERRM;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ===================================
-- SCHEMA CREATION COMPLETE
-- ===================================
-- Next steps:
-- 1. Create auth users in Supabase Authentication (trigger will auto-link them)
-- 2. Set up Storage buckets with proper policies
-- 3. Test RLS policies
-- 4. Test user creation from admin dashboard
-- ===================================