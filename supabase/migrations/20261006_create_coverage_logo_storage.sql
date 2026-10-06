-- Run once after the main coverage migration. Only administrators can upload logos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('coverage-logos', 'coverage-logos', true, 2097152, array['image/png','image/jpeg','image/webp','image/svg+xml'])
on conflict (id) do nothing;

create policy "Public read coverage logos" on storage.objects for select to anon, authenticated
using (bucket_id = 'coverage-logos');
create policy "Administrators manage coverage logos" on storage.objects for all to authenticated
using (bucket_id = 'coverage-logos' and public.is_coverage_admin())
with check (bucket_id = 'coverage-logos' and public.is_coverage_admin());
