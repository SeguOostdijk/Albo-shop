# TODO - Páginas de Información

## Plan: Crear 4 páginas de contenido estático

### Información Recopilada:
- El proyecto es una tienda Next.js con App Router
- El footer ya tiene enlaces a las páginas necesarias:
  - `/help/faq` - Preguntas Frecuentes
  - `/policies/returns` - Políticas Cambios/Devoluciones
  - `/promotions` - Promociones
  - `/terms` - Términos y Condiciones
- Hay disponible componente Accordion de shadcn/ui
- Componente Breadcrumbs para navegación
- Estilos consistentes con Tailwind CSS

### Archivos creados:

1. ✅ **app/help/faq/page.tsx** - Página de Preguntas Frecuentes
   - ✅ app/help/faq/faq-content.tsx
   - Usa componente Accordion para las preguntas
   - Incluye preguntas comunes sobre compras, envíos, pagos, etc.

2. ✅ **app/policies/returns/page.tsx** - Página de Políticas de Cambios/Devoluciones
   - ✅ app/policies/returns/returns-content.tsx
   - Política de devoluciones
   - Política de cambios
   - Proceso de reembolso
   - Condiciones

3. ✅ **app/promotions/page.tsx** - Página de Promociones
   - ✅ app/promotions/promotions-content.tsx
   - Promociones actuales
   - Ofertas especiales
   - Código de descuento

4. ✅ **app/terms/page.tsx** - Página de Términos y Condiciones
   - ✅ app/terms/terms-content.tsx
   - Términos de uso
   - Política de privacidad
   - Condiciones de compra
   - Propiedad intelectual

### Páginas adicionales creadas (necesarias para los enlaces del footer):
5. ✅ **app/help/page.tsx** - Centro de Ayuda
   - ✅ app/help/help-content.tsx
   - Redirige a las diferentes secciones de ayuda

6. ✅ **app/contact/page.tsx** - Página de Contacto
   - ✅ app/contact/contact-content.tsx
   - Formulario de contacto
   - Información de contacto

### Estado: ✅ COMPLETADO

