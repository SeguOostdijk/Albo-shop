import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Img,
    Text,
    Hr,
    Row,
    Column,
} from "@react-email/components"

type OrderItem = {
    product_name: string
    quantity: number
    price: number
    color: string
    size: string
}

    type OrderConfirmationEmailProps = {
    firstName: string
    orderId: number
    items: OrderItem[]
    subtotal: number
    shippingCost: number
    total: number
    shippingMethod: string
    paymentMethod: string
}

function formatPrice(value: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value)
}

function formatShipping(method: string) {
    if (method === "pickup") return "Retiro en local"
    if (method === "express") return "Envío express"
    return "Envío estándar"
}

function formatPayment(method: string) {
    if (method === "mercadopago") return "MercadoPago"
    if (method === "transfer") return "Transferencia bancaria"
    if (method === "credit-card") return "Tarjeta de crédito"
    if (method === "debit-card") return "Tarjeta de débito"
    return method
}

export function OrderConfirmationEmail({
    firstName,
    orderId,
    items,
    subtotal,
    shippingCost,
    total,
    shippingMethod,
    paymentMethod,
    }: OrderConfirmationEmailProps) {
    return (
        <Html>
        <Head />
        <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
            <Container style={{ maxWidth: "600px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>

            {/* Header */}
            <Section style={{ backgroundColor: "#0f2f98", padding: "32px 24px", textAlign: "center" }}>
                <Img
                src="https://plkkwwumczomxgnhgeze.supabase.co/storage/v1/object/public/assets/escudo.jpeg"
                alt="Club Atlético Independiente"
                width="80"
                height="80"
                style={{ margin: "0 auto 16px", borderRadius: "8px" }}
                />
                <Text style={{ color: "#ffffff", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
                Club Atlético Independiente
                </Text>
                <Text style={{ color: "#a5b4fc", fontSize: "14px", margin: "4px 0 0" }}>
                Tienda Oficial
                </Text>
            </Section>

            {/* Body */}
            <Section style={{ padding: "32px 24px" }}>
                <Text style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b", marginBottom: "8px" }}>
                ¡Gracias por tu compra, {firstName}!
                </Text>
                <Text style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                Recibimos tu pedido <strong>#{orderId}</strong> correctamente. Te avisaremos cuando esté listo.
                </Text>

                <Hr style={{ borderColor: "#e2e8f0", marginBottom: "24px" }} />

                {/* Productos */}
                <Text style={{ fontSize: "15px", fontWeight: "bold", color: "#1e293b", marginBottom: "12px" }}>
                Productos
                </Text>

                {items.map((item, i) => (
                <Row key={i} style={{ marginBottom: "12px" }}>
                    <Column style={{ width: "70%" }}>
                    <Text style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "bold" }}>
                        {item.product_name}
                    </Text>
                    <Text style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                        {item.color} / Talle {item.size} — x{item.quantity}
                    </Text>
                    </Column>
                    <Column style={{ width: "30%", textAlign: "right" }}>
                    <Text style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "bold" }}>
                        {formatPrice(item.price * item.quantity)}
                    </Text>
                    </Column>
                </Row>
                ))}

                <Hr style={{ borderColor: "#e2e8f0", margin: "20px 0" }} />

                {/* Totales */}
                <Row style={{ marginBottom: "8px" }}>
                <Column style={{ width: "70%" }}>
                    <Text style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Subtotal</Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                    <Text style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>{formatPrice(subtotal)}</Text>
                </Column>
                </Row>

                <Row style={{ marginBottom: "8px" }}>
                <Column style={{ width: "70%" }}>
                    <Text style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Envío</Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                    <Text style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                    {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                    </Text>
                </Column>
                </Row>

                <Row style={{ marginBottom: "20px" }}>
                <Column style={{ width: "70%" }}>
                    <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Total</Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                    <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#0f2f98", margin: 0 }}>
                    {formatPrice(total)}
                    </Text>
                </Column>
                </Row>

                <Hr style={{ borderColor: "#e2e8f0", marginBottom: "20px" }} />

                {/* Info envío y pago */}
                <Row>
                <Column style={{ width: "50%", paddingRight: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px" }}>Método de envío</Text>
                    <Text style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "bold" }}>
                    {formatShipping(shippingMethod)}
                    </Text>
                </Column>
                <Column style={{ width: "50%", paddingLeft: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px" }}>Método de pago</Text>
                    <Text style={{ fontSize: "14px", color: "#1e293b", margin: 0, fontWeight: "bold" }}>
                    {formatPayment(paymentMethod)}
                    </Text>
                </Column>
                </Row>
            </Section>

            {/* Footer */}
            <Section style={{ backgroundColor: "#f8fafc", padding: "20px 24px", textAlign: "center", borderTop: "1px solid #e2e8f0" }}>
                <Text style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                Club Atlético Independiente de San Cayetano — Tienda Oficial
                </Text>
                <Text style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}>
                Si tenés alguna duda escribinos a alboshopcai@gmail.com
                </Text>
            </Section>

            </Container>
        </Body>
        </Html>
    )
}