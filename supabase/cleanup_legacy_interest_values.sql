update public.contacts
set interest = null
where interest in ('design', 'product', 'partner');

update public.checkins
set interest = null
where interest in ('design', 'product', 'partner');

update public.contacts
set interest = 'agent'
where interest = 'loan';

update public.checkins
set interest = 'agent'
where interest = 'loan';
