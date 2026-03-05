import { CheckCircle, XCircle, Clock, Package, Truck, CreditCard } from "lucide-react"

export function ReturnsContent() {
  return (
    <div className="space-y-8">
      {/* Introducción */}
      <div className="bg-muted rounded-lg p-6">
        <p className="text-muted-foreground">
          En Club Shop queremos que estés completamente satisfecho con tu compra. 
          Por eso, brindamos opciones flexibles para cambios y devoluciones. 
          Leé atentamente nuestras políticas a continuación.
        </p>
      </div>

      {/* Políticas de Devolución */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold">Política de Devoluciones</h2>
        </div>
        
        <div className="space-y-4 text-muted-foreground">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Plazo:</strong> Tenés 10 días corridos desde la recepción del producto 
              para solicitar la devolución.
            </li>
            <li>
              <strong>Estado del producto:</strong> El producto debe estar sin uso, con todas 
              sus etiquetas originales y en el mismo packaging en que fue recibido.
            </li>
            <li>
              <strong>Motivo:</strong> Podés devolver cualquier producto por cualquier motivo. 
              Si el producto tiene defecto de fabricación, el costo del envío corre por nuestra cuenta.
            </li>
            <li>
              <strong>Exclusiones:</strong> No se aceptan devoluciones de productos íntimos, 
              ropa interior, medias, ni productos en oferta o Liquidación (excepto por defectos).
            </li>
          </ul>
        </div>
      </section>

      {/* Política de Cambios */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold">Política de Cambios</h2>
        </div>
        
        <div className="space-y-4 text-muted-foreground">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Plazo:</strong> Tenés 30 días corridos para realizar el cambio de tu producto.
            </li>
            <li>
              <strong>Mismo producto:</strong> Podés cambiar por otro talle, color o variante del 
              mismo producto (sujeto a disponibilidad).
            </li>
            <li>
              <strong>Distinto producto:</strong> Si deseás cambiar por un producto de mayor valor, 
              deberés abonar la diferencia. Si es de menor valor, te reembolsamos la diferencia.
            </li>
            <li>
              <strong>Cambio en tienda:</strong> Podés realizar el cambio presencialmente en nuestro 
              local sin costo adicional.
            </li>
          </ul>
        </div>
      </section>

      {/* Proceso de Reembolso */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold">Proceso de Reembolso</h2>
        </div>
        
        <div className="space-y-4 text-muted-foreground">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Procesamiento:</strong> Una vez recibido el producto y verificado su estado, 
              el reembolso se procesa en un plazo de 5 a 10 días hábiles.
            </li>
            <li>
              <strong>Método:</strong> El reembolso se realiza mediante el mismo medio de pago utilizado 
              en la compra original.
            </li>
            <li>
              <strong>Tiempo bancario:</strong> Dependiendo de tu entidad bancaria, el dinero puede 
              reflejarse en tu cuenta entre 5 y 15 días hábiles después del procesamiento.
            </li>
            <li>
              <strong>Comprobante:</strong> Te enviaremos un email confirmando el reembolso con los detalles.
            </li>
          </ul>
        </div>
      </section>

      {/* Cómo Solicitar Cambio/Devolución */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold">Cómo Solicitar un Cambio o Devolución</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
              Contactanos
            </h3>
            <p className="text-sm text-muted-foreground">
              Escribinos por WhatsApp o email indicando tu número de pedido y el producto 
              que deseas cambiar o devolver.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
              Prepará el Producto
            </h3>
            <p className="text-sm text-muted-foreground">
              Envuelve el producto en su packaging original, asegurate de incluir todas 
              las etiquetas y el comprobante de compra.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
              Envíanos el Producto
            </h3>
            <p className="text-sm text-muted-foreground">
              Te enviaremos una etiqueta de envío prepagada o coordinaremos la recolección 
              en tu domicilio.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">4</span>
              Recepción y Proceso
            </h3>
            <p className="text-sm text-muted-foreground">
              Una vez recibido el producto, verificamos su estado y procesamos el cambio 
              o reembolso correspondiente.
            </p>
          </div>
        </div>
      </section>

      {/* Productos Defectuosos */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold">Productos con Defecto de Fabricación</h2>
        </div>
        
        <div className="space-y-4 text-muted-foreground">
          <p>
            Si recibís un producto con defecto de fabricación, contactanos inmediatamente. 
            Te solicitaremos fotos del defecto para evaluar el caso.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>El producto será reemplazado sin costo adicional</li>
            <li>Coordinamos la recolección del producto defectuoso sin costo</li>
            <li>El reemplazo se envía una vez recibido y verificado el producto defectuoso</li>
            <li>Contás con garantía oficial del fabricante</li>
          </ul>
        </div>
      </section>

      {/* Información de Contacto */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-4">¿Necesitás ayuda?</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/542983000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Truck className="h-4 w-4 mr-2" />
            Escribinos por WhatsApp
          </a>
          <a
            href="mailto:tienda@club.com"
            className="inline-flex items-center justify-center px-4 py-2 border border-input hover:bg-accent transition-colors bg-background rounded-lg"
          >
            Envianos un email
          </a>
        </div>
      </div>
    </div>
  )
}

