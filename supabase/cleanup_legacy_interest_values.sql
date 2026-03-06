update public.contacts
set interest = null
where interest in ('design', 'product', 'partner');

update public.checkins
set interest = null
where interest in ('design', 'product', 'partner');
