-- Repair student-facing actions blocked by the current RLS policies.
-- These functions run a small, authenticated, atomic transaction and validate the caller.
CREATE OR REPLACE FUNCTION public.checkout_library_book(p_book_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_role text;
  v_approval text;
  v_book public.books%ROWTYPE;
  v_record public.borrow_records%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Please sign in before borrowing a book.'; END IF;
  SELECT role, approval_status INTO v_role, v_approval FROM public.profiles WHERE id = v_user_id;
  IF v_role IS DISTINCT FROM 'STUDENT' OR v_approval IS DISTINCT FROM 'APPROVED' THEN
    RAISE EXCEPTION 'Only approved student accounts can borrow books.';
  END IF;
  SELECT * INTO v_book FROM public.books
    WHERE id = p_book_id AND approval_status = 'APPROVED' AND status = 'ACTIVE' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'This book is not currently available in the approved catalogue.'; END IF;
  IF v_book.available_copies <= 0 THEN RAISE EXCEPTION 'No copies are currently available.'; END IF;
  IF EXISTS (SELECT 1 FROM public.borrow_records WHERE student_id = v_user_id AND book_id = p_book_id AND status IN ('BORROWED','OVERDUE','RESERVED')) THEN
    RAISE EXCEPTION 'You already have an active borrowing or reservation for this book.';
  END IF;
  INSERT INTO public.borrow_records (book_id, student_id, issue_date, due_date, status)
    VALUES (p_book_id, v_user_id, CURRENT_DATE, CURRENT_DATE + 14, 'BORROWED') RETURNING * INTO v_record;
  UPDATE public.books SET available_copies = available_copies - 1, updated_at = now() WHERE id = p_book_id;
  RETURN jsonb_build_object('id', v_record.id, 'book_id', v_record.book_id, 'issue_date', v_record.issue_date, 'due_date', v_record.due_date, 'status', v_record.status);
END;
$$;

CREATE OR REPLACE FUNCTION public.return_library_book(p_borrow_record_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_record public.borrow_records%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Please sign in before returning a book.'; END IF;
  SELECT * INTO v_record FROM public.borrow_records WHERE id = p_borrow_record_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Borrowing record not found.'; END IF;
  IF v_record.student_id <> v_user_id AND NOT public.is_admin() THEN RAISE EXCEPTION 'You can only return books borrowed by your account.'; END IF;
  IF v_record.status NOT IN ('BORROWED','OVERDUE') THEN RAISE EXCEPTION 'This borrowing record is not awaiting return.'; END IF;
  UPDATE public.borrow_records SET status = 'RETURNED', return_date = CURRENT_DATE,
    returned_to = CASE WHEN public.is_admin() THEN v_user_id ELSE NULL END, updated_at = now()
    WHERE id = p_borrow_record_id;
  UPDATE public.books SET available_copies = LEAST(total_copies, available_copies + 1), updated_at = now()
    WHERE id = v_record.book_id;
  RETURN jsonb_build_object('id', v_record.id, 'book_id', v_record.book_id, 'status', 'RETURNED');
END;
$$;

CREATE OR REPLACE FUNCTION public.request_book_exchange(p_item_id uuid, p_message text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_item public.book_exchange_items%ROWTYPE;
  v_request public.book_exchange_requests%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Please sign in before requesting an exchange.'; END IF;
  SELECT * INTO v_item FROM public.book_exchange_items WHERE id = p_item_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Exchange listing not found.'; END IF;
  IF v_item.owner_id = v_user_id THEN RAISE EXCEPTION 'You cannot request your own listing.'; END IF;
  IF v_item.status <> 'AVAILABLE' THEN RAISE EXCEPTION 'This listing is no longer available.'; END IF;
  IF EXISTS (SELECT 1 FROM public.book_exchange_requests WHERE item_id = p_item_id AND requester_id = v_user_id AND status IN ('PENDING','ACCEPTED')) THEN
    RAISE EXCEPTION 'You already have an active request for this listing.';
  END IF;
  INSERT INTO public.book_exchange_requests(item_id, requester_id, status, message)
    VALUES (p_item_id, v_user_id, 'PENDING', NULLIF(trim(COALESCE(p_message, '')), '')) RETURNING * INTO v_request;
  UPDATE public.book_exchange_items SET status = 'REQUESTED', updated_at = now() WHERE id = p_item_id;
  RETURN jsonb_build_object('id', v_request.id, 'item_id', v_request.item_id, 'status', v_request.status);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_own_library_profile(p_full_name text DEFAULT NULL, p_department text DEFAULT NULL, p_year text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Please sign in before updating your profile.'; END IF;
  UPDATE public.profiles
    SET full_name = COALESCE(NULLIF(trim(p_full_name), ''), full_name),
        department = COALESCE(p_department, department),
        year = COALESCE(p_year, year), updated_at = now()
    WHERE id = v_user_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Your library profile could not be found.'; END IF;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.checkout_library_book(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.return_library_book(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.request_book_exchange(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_own_library_profile(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.checkout_library_book(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.return_library_book(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_book_exchange(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_own_library_profile(text, text, text) TO authenticated;

DROP POLICY IF EXISTS exchange_requests_select_participants ON public.book_exchange_requests;
CREATE POLICY exchange_requests_select_participants ON public.book_exchange_requests FOR SELECT TO authenticated
USING (requester_id = (SELECT auth.uid()) OR EXISTS (
  SELECT 1 FROM public.book_exchange_items i WHERE i.id = item_id AND i.owner_id = (SELECT auth.uid())
) OR public.is_admin());

DROP POLICY IF EXISTS companion_connections_select_participants ON public.reading_companion_connections;
CREATE POLICY companion_connections_select_participants ON public.reading_companion_connections FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()) OR companion_id = (SELECT auth.uid()) OR public.is_admin());
DROP POLICY IF EXISTS companion_connections_insert_owner ON public.reading_companion_connections;
CREATE POLICY companion_connections_insert_owner ON public.reading_companion_connections FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS companion_connections_update_participants ON public.reading_companion_connections;
CREATE POLICY companion_connections_update_participants ON public.reading_companion_connections FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()) OR companion_id = (SELECT auth.uid()) OR public.is_admin())
WITH CHECK (user_id = (SELECT auth.uid()) OR companion_id = (SELECT auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS authors_authenticated_select ON public.authors;
CREATE POLICY authors_authenticated_select ON public.authors FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS authors_admin_insert ON public.authors;
CREATE POLICY authors_admin_insert ON public.authors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS authors_admin_update ON public.authors;
CREATE POLICY authors_admin_update ON public.authors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS authors_admin_delete ON public.authors;
CREATE POLICY authors_admin_delete ON public.authors FOR DELETE TO authenticated USING (public.is_admin());
