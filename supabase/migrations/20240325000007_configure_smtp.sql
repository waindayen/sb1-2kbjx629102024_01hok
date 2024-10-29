-- Configuration du service SMTP pour l'envoi d'emails
alter system set auth.smtp.host = 'smtp.gmail.com';
alter system set auth.smtp.port = '587';
alter system set auth.smtp.user = 'votre-email@gmail.com';
alter system set auth.smtp.password = 'votre-mot-de-passe-app';
alter system set auth.smtp.sender_name = 'Passport Manager';
alter system set auth.smtp.admin_email = 'admin@votredomaine.com';

-- Configuration des templates d'emails
update auth.email_templates
set template = '
<h2>Confirmez votre email</h2>
<p>Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
'
where template_type = 'confirmation';

update auth.email_templates
set template = '
<h2>Réinitialisation de mot de passe</h2>
<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
<p><a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a></p>
'
where template_type = 'recovery';