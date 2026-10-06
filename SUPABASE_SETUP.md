# Activación de Supabase

1. Creá un proyecto de Supabase y ejecutá `supabase/migrations/20261005_create_coverage_management.sql` en **SQL Editor**.
2. En **Authentication > Providers**, activá Email. Creá el usuario administrador con el correo `centrokareh@gmail.com` y una contraseña segura elegida en el panel de Supabase. La contraseña no se guarda en este repositorio.
3. Copiá el UUID del usuario creado y ejecutá la última instrucción comentada de la migración para asignarle el usuario `kinesiologiakareh` y el rol `admin`.
4. En **Authentication > URL Configuration**, agregá las URLs de producción y local. El redirect de recuperación es `https://TU-DOMINIO/admin/login/`.
5. Copiá la URL del proyecto y la clave **anon** (nunca `service_role`) a `assets/js/supabase-config.js`. Es una clave pública; las políticas RLS de la migración son las que restringen el acceso.
6. En producción, configurá el proveedor SMTP propio en Supabase para que los correos de recuperación lleguen desde una dirección confiable.

El sitio estático usa la sesión gestionada por Supabase. El contenido del panel puede descargarse como cualquier HTML estático, pero los datos y las operaciones de escritura están bloqueados por RLS en el servidor para toda sesión que no sea administradora.

## Límites del hosting estático

Una cookie `HttpOnly` propia y rate limiting específico requieren un backend/edge function. Supabase maneja hashes, tokens temporales de un uso, expiración y límites del proveedor de autenticación; si se necesita cumplir literalmente con cookies `HttpOnly` de aplicación, el próximo paso es alojar `/admin` detrás de una función de Vercel/Netlify/Cloudflare, sin exponer una clave de servicio al navegador.
