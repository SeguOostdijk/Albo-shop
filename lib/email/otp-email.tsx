import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface OtpEmailProps {
  code: string
}

export function OtpEmail({ code }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu código de verificación es {code}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "40px auto", backgroundColor: "#fff", borderRadius: "8px", padding: "32px" }}>
          <Heading style={{ fontSize: "22px", color: "#1a1a1a", marginBottom: "8px" }}>
            Verificá tu email
          </Heading>
          <Text style={{ color: "#555", marginBottom: "24px" }}>
            Usá este código para confirmar tu compra por transferencia en Albo Shop:
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Text style={{ fontSize: "40px", fontWeight: "bold", letterSpacing: "12px", color: "#1a365d" }}>
              {code}
            </Text>
          </Section>
          <Text style={{ color: "#888", fontSize: "13px" }}>
            El código es válido por 10 minutos. Si no realizaste esta compra, podés ignorar este email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
