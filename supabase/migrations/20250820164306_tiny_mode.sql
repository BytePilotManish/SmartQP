/*
  # Create question papers table

  1. New Tables
    - `question_papers`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subject` (text)
      - `total_marks` (integer)
      - `exam_type` (text, either 'CIE' or 'SEE')
      - `modules_covered` (integer)
      - `questions` (jsonb, stores the question structure)
      - `created_by` (uuid, references profiles)
      - `status` (text, enum for draft/sent_for_approval/approved/rejected)
      - `rejection_reason` (text, nullable)
      - `approved_by` (uuid, nullable, references profiles)
      - `approved_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `question_papers` table
    - Add policies for CRUD operations based on user roles
*/

CREATE TABLE IF NOT EXISTS question_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  total_marks integer NOT NULL DEFAULT 100,
  exam_type text NOT NULL CHECK (exam_type IN ('CIE', 'SEE')),
  modules_covered integer NOT NULL DEFAULT 1,
  questions jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent_for_approval', 'approved', 'rejected')),
  rejection_reason text,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;

-- Faculty can CRUD their own question papers
CREATE POLICY "Faculty can manage own question papers"
  ON question_papers
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

-- HODs can read all question papers in their department
CREATE POLICY "HODs can read department question papers"
  ON question_papers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p1, profiles p2
      WHERE p1.id = auth.uid()
      AND p1.role = 'hod'
      AND p2.id = question_papers.created_by
      AND p1.department = p2.department
    )
  );

-- HODs can update question papers for approval/rejection
CREATE POLICY "HODs can approve/reject department question papers"
  ON question_papers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p1, profiles p2
      WHERE p1.id = auth.uid()
      AND p1.role = 'hod'
      AND p2.id = question_papers.created_by
      AND p1.department = p2.department
    )
  );

CREATE TRIGGER update_question_papers_updated_at
  BEFORE UPDATE ON question_papers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();