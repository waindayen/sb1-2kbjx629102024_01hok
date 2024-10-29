-- Configuration des limites d'envoi d'emails
alter system set auth.rate_limit.email.points = 10;  -- Nombre d'emails autorisés
alter system set auth.rate_limit.email.period = 900; -- Période en secondes (15 minutes)

-- Configuration des limites de réinitialisation de mot de passe
alter system set auth.rate_limit.password_reset.points = 5;  -- Nombre de réinitialisations autorisées
alter system set auth.rate_limit.password_reset.period = 900; -- Période en secondes (15 minutes)

-- Configuration des limites de vérification d'email
alter system set auth.rate_limit.verify_email.points = 5;    -- Nombre de vérifications autorisées
alter system set auth.rate_limit.verify_email.period = 900;  -- Période en secondes (15 minutes)

-- Configuration des limites de création de compte
alter system set auth.rate_limit.signup.points = 5;          -- Nombre d'inscriptions autorisées
alter system set auth.rate_limit.signup.period = 900;        -- Période en secondes (15 minutes)